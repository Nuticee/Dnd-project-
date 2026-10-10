// Supabase Edge Function: ai-dm
// Server-side AI DM adapter. Keep GEMINI_API_KEY in Supabase secrets.
// D&D 5e 2014 rules foundation; Gemini narrates and requests checks,
// while the client/rules engine remains authoritative for dice and HP.

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json"
};

const SYSTEM = `
You are the Dungeon Master for a D&D 5e 2014 campaign called The Frozen Passage.
Run reactive, player-driven tabletop roleplay. The DM is a facilitator, not a novelist.
Never force the player into A/B/C choices.

CORE DM STYLE:
- Respond directly to the player's latest action or question.
- Normal conversation and exploration should be concise: usually 1-3 short paragraphs.
- Do not dump backstory, history, explanations, or future possibilities unless the player asks,
  discovers them, or a meaningful event/cutscene is actually happening.
- For a simple NPC question, answer that question and stop. Leave room for the player to speak again.
- Use longer narration only for significant events, discoveries, dramatic consequences, combat starts,
  or deliberate cutscenes.
- Prefer natural "kamu/kalian" language. Avoid formal narration such as "Anda".
- Never control, speak for, or decide actions for player-controlled characters.
- If one player character addresses another player-controlled character, do not invent the target
  player's answer. Give the target player room to respond.
- Do not repeat information already established unless repetition is useful for clarity.

RULES AUTHORITY:
- The ruleset is D&D 5e 2014, not 2024.
- The application/rules engine owns dice, attack rolls, damage, HP, spell slots,
  conditions, inventory changes, and other mechanical truth.
- Never invent a die result or change HP directly.
- Do not request a roll merely because an action is being described.
- If an action is obvious, safe, or has no meaningful uncertainty, resolve it without a check.
- Request a check only when the outcome is meaningfully uncertain and failure could matter.
- Choose the appropriate ability/skill/save and a sensible DC based on the established situation.
- After a roll result is supplied by the application, continue from that actual result.
- Never secretly turn a failed roll into a success.
- If no roll is needed, requestCheck must be null.
- Do not create arbitrary numerical bonuses.

WORLD AND STATE:
- Use the supplied character and adventure state as facts.
- Only change world state when the player action or established fiction supports it.
- Preserve existing quests, NPCs, inventory, flags, and consequences unless the action changes them.

MONSTER / ENCOUNTER CONSISTENCY:
- The narrative determines both enemy identity and enemy count.
- If the DM describes 1 guard, return 1 appropriate guard monster ID.
- If the DM describes 2 guards, return 2 guard monster IDs.
- Do not replace a named or clearly described enemy with a generic Goblin.
- Use only monster IDs known to the application when possible.
- Match common narrative terms to the closest appropriate known stat block:
  guard/guardian -> guard, goblin -> goblin, kobold -> kobold,
  wolf/white wolf -> wolf or dire_wolf as appropriate, skeleton -> skeleton,
  zombie -> zombie, ghoul -> ghoul, hobgoblin -> hobgoblin,
  giant spider/spider -> giant_spider, yeti -> yeti, ice creature/mephit -> ice_mephit,
  ogre -> ogre, orc -> orc, bugbear -> bugbear, bandit -> bandit, cultist -> cultist,
  giant rat -> giant_rat, brown bear -> brown_bear.
- If an exact stat block is unavailable, choose the closest suitable known monster without changing
  the number of enemies described.
- When starting combat, return encounter.monsterIds only; the local combat engine handles combat.
- Never alter the existing combat transition behavior.

PLAYER ACTION CHECKS:
- If an action needs a roll, return requestCheck with the appropriate type, skill/save/attack,
  reason, and DC when appropriate.
- Do not request checks for ordinary dialogue or trivial actions.
- Never claim an attack hit, damage amount, HP change, spell-slot expenditure, or condition as a
  mechanical result; request the appropriate mechanic and let the rules engine resolve it.

CANON LORE:
- The Frostbound is an established canon entity in The Frozen Passage. Do not redesign or contradict
  established lore or visual identity when it becomes relevant.
- The established Staff of Frost inhabitant is canon. Treat its established visual/lore identity
  as fixed rather than inventing a different appearance.
- Elira is an established story character, but her visual appearance may be freely developed by the DM
  unless the campaign later fixes it.
- Do not introduce contradictions to established canon.

Return exactly the requested JSON structure. Do not add commentary or markdown.
`;

const OUTPUT_SCHEMA = {
  type: "OBJECT",
  properties: {
    narration: { type: "STRING" },
    statePatch: {
      type: "OBJECT",
      properties: {
        scene: { type: "STRING", nullable: true },
        location: { type: "STRING", nullable: true },
        description: { type: "STRING", nullable: true },
        weather: { type: "STRING", nullable: true },
        timeOfDay: { type: "STRING", nullable: true },
        flags: { type: "OBJECT", properties: {} },
        quests: { type: "ARRAY", items: { type: "OBJECT" } },
        knownNPCs: { type: "ARRAY", items: { type: "OBJECT" } },
        inventory: { type: "ARRAY", items: { type: "OBJECT" } },
        consequences: { type: "ARRAY", items: { type: "OBJECT" } }
      },
      required: [
        "scene",
        "location",
        "description",
        "weather",
        "timeOfDay",
        "flags",
        "quests",
        "knownNPCs",
        "inventory",
        "consequences"
      ]
    },
    requestCheck: {
      type: "OBJECT",
      nullable: true,
      properties: {
        type: { type: "STRING", enum: ["skill", "save", "attack"] },
        abilityOrSkill: { type: "STRING" },
        dc: { type: "NUMBER", nullable: true },
        reason: { type: "STRING" }
      },
      required: ["type", "abilityOrSkill", "dc", "reason"]
    },
    encounter: {
      type: "OBJECT",
      nullable: true,
      properties: {
        monsterIds: { type: "ARRAY", items: { type: "STRING" } },
        reason: { type: "STRING" }
      },
      required: ["monsterIds", "reason"]
    }
  },
  required: ["narration", "statePatch", "requestCheck", "encounter"]
};


// ------------------------------------------------------------
// CLOUD SAVE — shared campaign state across devices
// The browser never receives a database secret.
// ------------------------------------------------------------
const SHARED_SESSION_ID = "frozen-passage-shared-v1";

function getSupabaseServerKey() {
  try {
    const raw = Deno.env.get("SUPABASE_SECRET_KEYS");
    if (raw) {
      const keys = JSON.parse(raw);
      if (keys?.default) return keys.default;
    }
  } catch {}
  return Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
}

async function dbRequest(path, options = {}) {
  const base = Deno.env.get("SUPABASE_URL");
  const key = getSupabaseServerKey();
  if (!base || !key) throw new Error("Supabase server database key is unavailable.");

  const response = await fetch(base + "/rest/v1/" + path, {
    ...options,
    headers: {
      "apikey": key,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  const raw = await response.text();
  if (!response.ok) throw new Error("Supabase DB request failed: " + raw.slice(0, 1000));

  return raw ? JSON.parse(raw) : null;
}

async function loadCloudState() {
  const rows = await dbRequest(
    "game_sessions?id=eq." + encodeURIComponent(SHARED_SESSION_ID) +
    "&select=id,campaign_id,state,updated_at&limit=1"
  );
  const row = Array.isArray(rows) ? rows[0] : null;
  return row
    ? { state: row.state, updatedAt: row.updated_at }
    : { state: null, updatedAt: null };
}

async function saveCloudState(state, clientUpdatedAt) {
  const existing = await loadCloudState();

  if (
    existing.updatedAt &&
    clientUpdatedAt &&
    new Date(existing.updatedAt).getTime() > new Date(clientUpdatedAt).getTime()
  ) {
    return {
      state: existing.state,
      updatedAt: existing.updatedAt,
      conflict: true
    };
  }

  const updatedAt = clientUpdatedAt || new Date().toISOString();
  const rows = await dbRequest("game_sessions?on_conflict=id", {
    method: "POST",
    headers: {
      "Prefer": "resolution=merge-duplicates,return=representation"
    },
    body: JSON.stringify({
      id: SHARED_SESSION_ID,
      campaign_id: "the-frozen-passage",
      state,
      updated_at: updatedAt
    })
  });

  const row = Array.isArray(rows) ? rows[0] : rows;
  return {
    state: row?.state ?? state,
    updatedAt: row?.updated_at ?? updatedAt,
    conflict: false
  };
}

function json(body, status=200) {
  return new Response(JSON.stringify(body), { status, headers: cors });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { status: 200, headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let payload;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }

  if (payload?.mode === "load") {
    if (payload.sessionId !== SHARED_SESSION_ID) return json({ error: "Unknown session." }, 403);
    try {
      const cloud = await loadCloudState();
      return json({ ok: true, ...cloud });
    } catch (error) {
      return json({ error: error instanceof Error ? error.message : "Cloud load failed." }, 500);
    }
  }

  if (payload?.mode === "save") {
    if (payload.sessionId !== SHARED_SESSION_ID) return json({ error: "Unknown session." }, 403);
    if (!payload.state || typeof payload.state !== "object") {
      return json({ error: "state is required." }, 400);
    }
    try {
      const cloud = await saveCloudState(payload.state, payload.clientUpdatedAt || null);
      return json({ ok: true, ...cloud });
    } catch (error) {
      return json({ error: error instanceof Error ? error.message : "Cloud save failed." }, 500);
    }
  }

  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) return json({ error: "GEMINI_API_KEY is not configured in Supabase secrets." }, 503);

  // On-demand scene illustration. Called only when the combat location/scene changes.
  if (payload?.mode === "sceneVisual") {
    const allowedLocations = new Set(["forest","cave","dungeon","village","ruins","mountain"]);
    const location = allowedLocations.has(payload.location) ? payload.location : "forest";
    const scene = String(payload.scene || "").slice(0, 180);
    const description = String(payload.description || payload.storyText || "").slice(0, 700);
    const locationStyle = {
      forest: "dense ancient fantasy forest, natural woodland floor and trees",
      cave: "natural rocky cavern, irregular stone walls, stalactites, believable cave floor",
      dungeon: "ancient stone dungeon interior, worn masonry and atmospheric torchlight",
      village: "medieval fantasy village street, believable timber-and-stone buildings and earth paths",
      ruins: "overgrown ancient fantasy ruins, broken masonry and weathered stone",
      mountain: "rugged snowy mountain pass, rock outcrops and wind-swept snow"
    }[location];
    const imagePrompt = "Create one immersive D&D fantasy tactical battlemap background image, top-down/isometric tabletop game camera, readable open central ground for character tokens, rich hand-painted realistic fantasy illustration, natural textures and coherent lighting. Environment: " + locationStyle + ". Scene: " + scene + ". Additional story context: " + description + ". No characters, no monsters, no tokens, no grid, no text, no UI, no geometric icon art. Wide landscape composition, detailed but uncluttered center.";
    try {
      const visualResponse = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent", {
        method: "POST",
        headers: { "x-goog-api-key": apiKey, "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: imagePrompt }] }],
          generationConfig: { responseModalities: ["TEXT", "IMAGE"], imageConfig: { aspectRatio: "4:3" } }
        })
      });
      const visualRaw = await visualResponse.text();
      if (!visualResponse.ok) {
        console.error("DM scene image API error", visualResponse.status, visualRaw.slice(0, 1200));
        return json({ error: "Image generation failed.", detail: "Gemini Image API HTTP " + visualResponse.status + ": " + visualRaw.slice(0, 700) }, 502);
      }
      let visualData;
      try { visualData = JSON.parse(visualRaw); }
      catch {
        console.error("DM scene image API returned invalid JSON", visualRaw.slice(0, 1000));
        return json({ error: "Invalid image API response." }, 502);
      }
      const parts = visualData?.candidates?.[0]?.content?.parts || [];
      const imagePart = parts.find(part => part?.inlineData?.data || part?.inline_data?.data);
      const imageData = imagePart?.inlineData || imagePart?.inline_data;
      if (!imageData?.data) { console.error("DM scene image API returned no inline image", JSON.stringify(visualData).slice(0, 1200)); return json({ error: "No image returned by generator.", detail: "Gemini returned no inline image data; inspect function logs." }, 502); }
      return json({ imageDataUrl: "data:" + (imageData.mimeType || imageData.mime_type || "image/png") + ";base64," + imageData.data });
    } catch (error) {
      return json({ error: "Scene visual generation failed.", detail: error instanceof Error ? error.message : "Unknown image error." }, 502);
    }
  }

  if (!payload?.playerAction || typeof payload.playerAction !== "string") {
    return json({ error: "playerAction is required." }, 400);
  }

  const model = Deno.env.get("GEMINI_MODEL") || "gemini-3.6-flash";

  // Keep the DM context compact. Sending the entire event log on every turn
  // can consume the model's token budget quickly.
  const adventure = payload.adventure && typeof payload.adventure === "object"
    ? {
        ...payload.adventure,
        events: Array.isArray(payload.adventure.events)
          ? payload.adventure.events.slice(-12)
          : [],
        consequences: Array.isArray(payload.adventure.consequences)
          ? payload.adventure.consequences.slice(-12)
          : []
      }
    : payload.adventure;

  const prompt = JSON.stringify({
    ruleset: payload.ruleset,
    character: payload.character,
    adventure,
    playerAction: payload.playerAction
  });

  try {
    const models = [model, "gemini-3.5-flash-lite"].filter((value, index, list) => list.indexOf(value) === index);
    let response = null;
    let raw = "";
    let lastStatus = 502;
    let lastDetail = "";

    for (let modelIndex = 0; modelIndex < models.length; modelIndex++) {
      const candidateModel = models[modelIndex];

      // One short retry for transient backend overload on the primary model.
      for (let attempt = 0; attempt < (modelIndex === 0 ? 2 : 1); attempt++) {
        if (attempt > 0) await new Promise(resolve => setTimeout(resolve, 800));

        response = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/" +
          encodeURIComponent(candidateModel) +
          ":generateContent",
          {
            method: "POST",
            headers: {
              "x-goog-api-key": apiKey,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              system_instruction: {
                parts: [{ text: SYSTEM }]
              },
              contents: [
                {
                  role: "user",
                  parts: [{ text: prompt }]
                }
              ],
              generationConfig: {
                responseMimeType: "application/json",
                responseSchema: OUTPUT_SCHEMA,
                maxOutputTokens: 900
              }
            })
          }
        );

        raw = await response.text();
        lastStatus = response.status;

        if (response.ok) break;

        lastDetail = raw.slice(0, 1500);
        try {
          const parsed = JSON.parse(raw);
          const message = parsed?.error?.message || parsed?.message || "";
          if (message) lastDetail = String(message).slice(0, 1500);
        } catch {}

        // Retry/fallback only for transient demand/rate-limit failures.
        if (response.status !== 429 && response.status !== 503) break;
      }

      if (response?.ok) break;
    }

    if (!response?.ok) {
      const detail =
        lastStatus === 429
          ? "Gemini sedang mencapai rate limit. Backend sudah mencoba model cadangan."
          : lastStatus === 503
            ? "Gemini sedang mengalami demand tinggi. Backend sudah mencoba ulang dan model cadangan."
            : (lastDetail || "Gemini request failed.");

      return json({ error: "Gemini request failed.", detail }, lastStatus === 429 ? 429 : 502);
    }

    const data = JSON.parse(raw);
    const text = data?.candidates?.[0]?.content?.parts
      ?.map(part => part?.text || "")
      .join("")
      .trim();

    if (!text) {
      const finishReason = data?.candidates?.[0]?.finishReason || "unknown";
      return json({
        error: "Gemini returned no usable DM response.",
        detail: "finishReason=" + finishReason
      }, 502);
    }

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      return json({
        error: "Gemini DM returned invalid JSON.",
        detail: "The Gemini response did not match the DM JSON structure."
      }, 502);
    }

    const rawCheck = result.requestCheck;
    const validCheck =
      rawCheck &&
      typeof rawCheck === "object" &&
      rawCheck.abilityOrSkill &&
      Number.isFinite(Number(rawCheck.dc))
        ? {
            ...rawCheck,
            dc: Number(rawCheck.dc)
          }
        : null;

    return json({
      narration: String(result.narration || "The world waits..."),
      statePatch: result.statePatch && typeof result.statePatch === "object" ? result.statePatch : {},
      requestCheck: validCheck,
      encounter: result.encounter ?? null
    });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Gemini DM error." }, 500);
  }
});
