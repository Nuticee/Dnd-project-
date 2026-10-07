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

Return ONLY valid JSON:
{
  "narration": "DM narration to show the player",
  "statePatch": {
    "scene": "optional new scene title",
    "location": "optional new location",
    "description": "optional scene description",
    "weather": "optional weather",
    "timeOfDay": "optional time of day",
    "flags": {},
    "quests": [],
    "knownNPCs": [],
    "inventory": [],
    "consequences": []
  },
  "requestCheck": null | {
    "type": "skill" | "save" | "attack",
    "abilityOrSkill": "Perception",
    "dc": 13,
    "reason": "why the roll is needed"
  },
  "encounter": null | {
    "monsterIds": ["goblin"],
    "reason": "why combat starts"
  }
}
`;

function json(body, status=200) {
  return new Response(JSON.stringify(body), { status, headers: cors });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { status: 200, headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) return json({ error: "OPENAI_API_KEY is not configured in Supabase secrets." }, 503);

  let payload;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }

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
        max_output_tokens: 900
      })
    });

    const raw = await response.text();
    if (!response.ok) return json({ error: "OpenAI request failed.", detail: raw.slice(0, 1000) }, 502);

    const data = JSON.parse(raw);
    const text = data.output_text || "";
    let result;
    try {
      result = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) return json({ error: "AI DM returned invalid JSON." }, 502);
      result = JSON.parse(match[0]);
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
