# D&D AI DM — V1

Prototype D&D 5e 2014 tabletop-style AI Dungeon Master.

## Current architecture

- Freeform player action — no forced A/B/C choices.
- Real player party is separate from the character-creation database.
- D&D 5e 2014 / SRD 5.1 character database foundation.
- Adventure state + history.
- Rules engine owns dice and mechanical truth.
- AI DM owns narration, world reaction, and requests checks.
- Supabase Edge Function at `supabase/functions/ai-dm/index.ts`.
- OpenAI API key stays server-side in Supabase secrets.

## AI DM setup

The Edge Function uses the OpenAI Responses API. OpenAI recommends the Responses API for new integrations. 

1. Create/deploy the Supabase Edge Function:
   `supabase/functions/ai-dm/index.ts`
2. Add Supabase secret:
   `OPENAI_API_KEY`
3. Optional secret:
   `OPENAI_MODEL`
   Default: `gpt-6-luna`
4. Point the web app's AI DM endpoint at:
   `https://YOUR_PROJECT_REF.supabase.co/functions/v1/ai-dm`

The browser must never contain the OpenAI API key.

## Important

The AI DM does not own dice, HP, damage, spell slots, or other mechanical truth. It can request a check/attack and narrate the consequence; the rules engine must resolve the mechanics.

## Local fallback

If the AI endpoint is unavailable, the Adventure UI keeps the player's action in the local history instead of crashing.

## Deploy

GitHub Pages deploys the web UI from `main`.
