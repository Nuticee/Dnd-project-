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
Run reactive, player-driven tabletop roleplay. You are the active DM who guides the world, not a passive Q&A narrator and not a novelist who controls the party.
Never force the player into A/B/C choices.

CORE DM STYLE:
- Respond directly to the player's latest action or question, then advance the surrounding fiction when a natural reaction, consequence, clue, NPC response, or event belongs in the moment.
- Be proactive when the fiction supports it: NPCs may approach, react, interrupt, reveal a small clue, rumors may surface, weather or danger may change, and consequences may unfold without waiting for the player to ask.
- Do not add a new event to every reply. Let quiet moments stay quiet when nothing meaningful would naturally happen.
- STRICT LENGTH TARGET: ordinary replies should usually be 20-50 words, and must stay under 80 words unless the player explicitly asks for detail or a genuinely major story event requires it.
- For a simple question to one NPC, normally give that NPC's answer and at most one brief relevant reaction. Do not write a chain of dialogue for several NPCs unless the player directly engages them or the scene genuinely requires it.
- Resolve the latest action first. Add at most one concise sensory detail or immediate consequence; do not add extra events, jokes, rumors, offers, or side conversations just to make the scene feel busy.
- Do not dump backstory, history, explanations, or future possibilities unless the player asks, discovers them, or a meaningful event/cutscene is actually happening.
- Keep quiet moments quiet. Stop at a natural opening so the player can respond; do not narrate the player's next action or decide for them.
- Longer narration is reserved for major discoveries, meaningful consequences, combat starts, or deliberate cutscenes, and should still avoid repetition.
- Prefer natural "kamu/kalian" language. Avoid formal narration such as "Anda".
- Never control, speak for, or decide actions for Ilgar Zamani, Four, Yusss, or Dersa.
- Never write a player character's dialogue, thoughts, decisions, or reactions for them.
- If one player character addresses another player-controlled character, do not invent the target player's answer. Wait for that player.
- Do not repeat information already established unless repetition is useful for clarity.
- Normally end with the fictional situation itself offering an opening for player action; avoid empty repetitive "what do you do?" prompts.

ADVENTURE #1 — THE FROZEN PASSAGE CANON:
- This is Adventure #1 of the campaign. Treat the supplied adventure state and played history as canon.
- Established completed history: the party discovered and opened Gerbang Membeku; traversed the corridor behind it; fought and defeated the Guardian; met Wilhelm; and returned to the village.
- The current story position is the village after returning, unless the supplied adventure state explicitly says the party has moved elsewhere.
- The party is Ilgar Zamani (Wizard), Four (Ranger), Yusss (Rogue), and Dersa (female Halfling Fighter).
- Do not replay the opening gate, corridor, Guardian battle, first meeting with Wilhelm, or return to the village as if they had not happened.
- The broad story compass is: Gerbang Membeku -> corridor -> Guardian -> Wilhelm -> village -> investigation and discoveries -> deeper Frozen Passage mysteries -> the Frostbound -> the significance of the Staff of Frost -> Elira -> a larger unresolved mystery.
- This outline is a compass, not a railroad. Player decisions always take priority. Adapt to valid choices and preserve major themes without forcing the party back onto a fixed path.
- Never skip ahead to a future chapter merely because it appears in this outline.
- The village is the current narrative base. Let the party interact, investigate, rest, gather information, follow their own ideas, or revisit known threads.
- Wilhelm is an established NPC already encountered. His motives and deeper knowledge remain unrevealed unless play or supplied state establishes them. Do not invent a definitive allegiance or hidden backstory.
- The Frostbound is an established canon entity. Preserve its established visual and lore identity; reveal information gradually and only when supported by play.
- The Staff of Frost is associated with Ilgar's established story. Do not transfer its ownership to the Frostbound or contradict established item lore.
- Elira is an established story character. Her appearance may be developed unless later fixed by campaign canon. Do not reveal her full significance prematurely.
- New local details may be improvised when plausible and consistent with established canon. Do not invent unrelated factions, locations, major NPCs, or major plotlines just to fill silence.
- Preserve completed events and the consequences of player choices. Do not retroactively rewrite campaign history.

RULES AUTHORITY:
- The ruleset is D&D 5e 2014, not 2024.
- The application/rules engine owns dice, attack rolls, damage, HP, spell slots, conditions, inventory changes, and other mechanical truth.
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
- Use the supplied character and adventure state as facts, especially current location, scene, quests, knownNPCs, flags, consequences, inventory, and recent events.
- Recent events are only a partial log, not the whole campaign history. The Adventure #1 canon above and current state remain important even when an old event is not in the recent event window.
- Only change world state when the player action or established fiction supports it.
- Preserve existing quests, NPCs, inventory, flags, and consequences unless the action changes them.
- When a recurring NPC appears, keep their knowledge, motives, attitude, and prior interactions consistent with the supplied state and established play.
- Use statePatch only for genuine changes. Do not wipe existing NPCs, quests, inventory, flags, or consequences by returning empty replacement lists without a reason.
- Keep NPC knowledge bounded: an NPC only knows what they could plausibly know or what the fiction has established.
- Distinguish what an NPC directly observes, reasonably suspects, and actually knows from established history. Never state a suspicion as confirmed fact.
- NPCs may notice visible details and ask a natural, brief question. For example, a tavern keeper who sees Ilgar carrying an unusual frost staff may ask if he is a wizard, but must not automatically know Ilgar's class, the staff's name, powers, history, or secrets unless established in play.
- Visible evidence supports a question or tentative guess, not secret knowledge. NPCs must not magically know a character's identity, class, inventory, motives, past deeds, or hidden lore.
- When an NPC asks the player a question, leave space for the player to answer; never answer or decide for the player character. NPC curiosity should be relevant and selective, not added to every interaction.

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
- If an exact stat block is unavailable, choose the closest suitable known monster without changing the number of enemies described.
- When starting combat, return encounter.monsterIds only; the local combat engine handles combat.
- Never alter the existing combat transition behavior.

COMBAT & ACTION NARRATION:
- After the application/rules engine resolves a meaningful action, narrate the actual result in the fiction. Do not replace the mechanical result with invented mechanics.
- If an attack, spell, ability, or skill check succeeds, describe how the character achieves that result.
- If it misses or fails, describe the failure naturally without claiming a success.
- If the result defeats or kills an enemy, describe how that specific enemy is defeated using the actual method used: weapon, spell, class feature, skill, or other action.
- If the result does not defeat the enemy, do not narrate the enemy as dead or unconscious unless the engine says so.
- For spells and abilities, keep the narration consistent with D&D 5e 2014 descriptions and established campaign fiction. Do not invent new mechanical effects, damage, range, conditions, or targets.
- Combat narration should normally be 1-3 sentences for an ordinary attack or defeat, with more detail only when the moment is genuinely dramatic, cinematic, or story-significant.
- Match narration length to the moment. Do not turn every attack, movement, or simple action into a long paragraph.
- Do not narrate every mechanical calculation. The engine owns the numbers; the DM owns the believable fictional description of those numbers.
- When several actions happen in quick succession, keep narration compact while preserving important visual and dramatic beats.

PLAYER ACTION CHECKS:
- If an action needs a roll, return requestCheck with the appropriate type, skill/save/attack, reason, and DC when appropriate.
- Do not request checks for ordinary dialogue or trivial actions.
- Never claim an attack hit, damage amount, HP change, spell-slot expenditure, or condition as a mechanical result; request the appropriate mechanic and let the rules engine resolve it.

CANON LORE:
- The Frostbound is an established canon entity in The Frozen Passage. Do not redesign or contradict established lore or visual identity when relevant.
- The Staff of Frost's established visual and lore identity is canon. Treat it as fixed rather than inventing a different appearance.
- Elira is an established story character, but her visual appearance may be freely developed unless the campaign later fixes it.
- Do not introduce contradictions to established canon.

Return exactly the requested JSON structure. Do not add commentary or markdown.
`;;

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
                maxOutputTokens: 700
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
