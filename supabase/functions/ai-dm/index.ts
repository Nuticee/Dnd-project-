// Supabase Edge Function: ai-dm
// Server-side AI DM adapter. Keep OPENAI_API_KEY in Supabase secrets.
// D&D 5e 2014 rules foundation; the model narrates and requests checks,
// while the client/rules engine remains authoritative for dice and HP.

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json"
};

const SYSTEM = `
You are the Dungeon Master for a D&D 5e 2014 campaign called The Frozen Passage.
Run freeform tabletop roleplay. Never force the player into A/B/C choices.
Describe the world, NPCs, atmosphere, discoveries, consequences, and encounters.
Use the supplied character and adventure state as facts.

Rules authority:
- The ruleset is D&D 5e 2014, not 2024.
- The application/rules engine owns dice, attack rolls, damage, HP, spell slots,
  conditions, inventory changes, and other mechanical truth.
- Never invent a die result or change HP directly.
- If an uncertain action needs a roll, return requestCheck with the appropriate
  skill/save/attack, a reason, and a DC when appropriate.
- If no roll is needed, requestCheck must be null.
- Do not create arbitrary numerical bonuses.
- Only change world state when the player action or established fiction supports it.
- Preserve existing quests, NPCs, inventory, flags, and consequences unless the action changes them.
- When starting combat, return encounter.monsterIds using only monster IDs already known to the application when possible.
- Never claim an attack hit, damage amount, HP change, spell-slot expenditure, or condition as a mechanical result; request a check/attack and let the rules engine resolve it.
- Return exactly the requested JSON structure. Do not add commentary or markdown.
`;

const OUTPUT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    narration: { type: "string" },
    statePatch: {
      type: "object",
      additionalProperties: false,
      properties: {
        scene: { type: ["string", "null"] },
        location: { type: ["string", "null"] },
        description: { type: ["string", "null"] },
        weather: { type: ["string", "null"] },
        timeOfDay: { type: ["string", "null"] },
        flags: { type: "object", "additionalProperties": true },
        quests: { type: "array", "items": {} },
        knownNPCs: { type: "array", "items": {} },
        inventory: { type: "array", "items": {} },
        consequences: { type: "array", "items": {} }
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
      anyOf: [
        { type: "null" },
        {
          type: "object",
          additionalProperties: false,
          properties: {
            type: { type: "string", enum: ["skill", "save", "attack"] },
            abilityOrSkill: { type: "string" },
            dc: { type: ["number", "null"] },
            reason: { type: "string" }
          },
          required: ["type", "abilityOrSkill", "dc", "reason"]
        }
      ]
    },
    encounter: {
      anyOf: [
        { type: "null" },
        {
          type: "object",
          additionalProperties: false,
          properties: {
            monsterIds: { type: "array", items: { type: "string" } },
            reason: { type: "string" }
          },
          required: ["monsterIds", "reason"]
        }
      ]
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

  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) return json({ error: "OPENAI_API_KEY is not configured in Supabase secrets." }, 503);

  if (!payload?.playerAction || typeof payload.playerAction !== "string") {
    return json({ error: "playerAction is required." }, 400);
  }

  const model = Deno.env.get("OPENAI_MODEL") || "gpt-6-luna";
  const input = [
    { role: "system", content: SYSTEM },
    {
      role: "user",
      content: JSON.stringify({
        ruleset: payload.ruleset,
        character: payload.character,
        adventure: payload.adventure,
        playerAction: payload.playerAction
      })
    }
  ];

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        input,
        max_output_tokens: 1200,
        text: {
          format: {
            type: "json_object"
          }
        }
      })
    });

    const raw = await response.text();
    if (!response.ok) {
      return json({ error: "OpenAI request failed.", detail: raw.slice(0, 1500) }, 502);
    }

    const data = JSON.parse(raw);
    const text = data.output_text || "";

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      return json({
        error: "AI DM returned invalid JSON.",
        detail: "The Responses API did not return JSON matching the DM schema."
      }, 502);
    }

    return json({
      narration: String(result.narration || "The world waits..."),
      statePatch: result.statePatch && typeof result.statePatch === "object" ? result.statePatch : {},
      requestCheck: result.requestCheck ?? null,
      encounter: result.encounter ?? null
    });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "AI DM error." }, 500);
  }
});
