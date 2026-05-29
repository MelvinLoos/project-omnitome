// Dynamic imports are handled within the Deno.serve handler to avoid resolution errors on startup

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const body = await req.json();

    // Health check logic
    if (body.healthCheck) {
      const groqKey = Deno.env.get("GROQ_API_KEY");
      const googleKey = Deno.env.get("GOOGLE_GENERATIVE_AI_API_KEY");
      
      const status = {
        groq: !!groqKey && groqKey.trim().length > 0,
        google: !!googleKey && googleKey.trim().length > 0,
        healthy: false
      };
      status.healthy = status.groq && status.google;

      return new Response(JSON.stringify(status), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    const { dials, hook, safety } = body;

    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
    const { generateObject, generateText } = await import("npm:ai");
    const { createGroq } = await import("npm:@ai-sdk/groq");
    const { createGoogleGenerativeAI } = await import("npm:@ai-sdk/google");
    const { z } = await import("npm:zod");

    // Zod schema for the adventure structure
    const AdventureSchema = z.object({
      title: z.string(),
      hook: z.string(),
      rooms: z.array(z.object({
        id: z.string(),
        name: z.string(),
        description_summary: z.string(),
        connections: z.array(z.string()),
        monsters: z.array(z.string()), // monster slugs
        loot: z.array(z.string()),
        traps: z.array(z.string()),
        skill_checks: z.array(z.object({
          skill: z.string(),
          dc: z.number(),
          description: z.string(),
        })),
        suggested_actions: z.array(z.string()),
      })),
      npcs: z.array(z.object({
        id: z.string(),
        name: z.string(),
        role: z.string(),
        type: z.enum(["basic", "major"]),
        motivation: z.string(),
        secret_or_quirk: z.string(),
        // Detailed fields (must be nullable for Structured Outputs compatibility)
        family: z.string().nullable(),
        occupation: z.string().nullable(),
        recreation: z.string().nullable(),
        dreams: z.string().nullable(),
        unique_look: z.string().nullable(),
        talents: z.string().nullable(),
        flaws: z.string().nullable(),
        physical_presence: z.string().nullable(),
        tags: z.array(z.string()),
        dialogue_samples: z.array(z.string()),
      })),
    });

    const groq = createGroq({
      apiKey: Deno.env.get("GROQ_API_KEY")?.trim() || "",
    });

    const google = createGoogleGenerativeAI({
      apiKey: Deno.env.get("GOOGLE_GENERATIVE_AI_API_KEY")?.trim() || "",
    });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );


    // 1. Orchestrator Pass (GPT-OSS on Groq)
    console.log("Running Orchestrator Pass...");
    const { object: adventureStructure } = await generateObject({
      model: groq("openai/gpt-oss-120b"),

      schema: AdventureSchema,
      system: `You are a master TTRPG adventure designer creating a professional-grade module.
      Create a 5-room dungeon based on these dials: Tone ${dials.tone}, Theme ${dials.theme}, Players ${dials.players}.
      Adventure Hook: ${hook}
      
      INSTRUCTIONS:
      - monsters: Use standard SRD monster slugs (e.g., 'goblin', 'orc', 'ghoul', 'skeleton', 'mimic', 'gelatinous-cube').
      - skill_checks: Include only when there is a significant obstacle or secret (e.g., "Athletics DC 15 to climb the crumbling wall"). If none, provide an empty array [].
      - suggested_actions: Advice for the GM on what PCs might try or how to handle common approaches. If none, provide an empty array [].
      - npcs: Differentiate between "basic" and "major" NPCs. 
        - BASIC: 3-Bullet Method (Name, Motivation, Secret/Quirk). For all MAJOR fields (family, occupation, recreation, dreams, unique_look, talents, flaws, physical_presence), return null.
        - MAJOR: Villains, key allies. Use FORD Method (Family, Occupation, Recreation, Dreams) + Unique Look, Talents, Flaws, and Physical Presence.
      - dialogue_samples: 2-3 flavorful quotes for NPCs that capture their personality. If none, provide an empty array [].
      - logical flow: Ensure rooms are interconnected and the plot makes sense.
      
      SAFETY RULES: 
      - Absolutely avoid: ${safety.lines.join(", ")}
      - Fade to black/exclude detail for: ${safety.veils.join(", ")}`,
      prompt: `Generate the complete high-level adventure structure, including mechanics, skill checks, and NPC dialogue where appropriate for the story.`,
    });

    // 2. Worker Pass (Gemini 3 flash)
    console.log("Running Worker Pass...");
    for (const room of adventureStructure.rooms) {
      const { text } = await generateText({
        model: google("gemini-3-flash-preview"),
        system: `You are a vivid fantasy writer. Expand the room description into immersive read-aloud text. 
        Focus on sensory details. Use markdown for emphasis (e.g. *italics*, **bold**).
        Use tags like [Moist], [Echoing], [Ancient].
        Respect safety tool constraints: No ${safety.lines.join(", ")}. Fade to black for ${safety.veils.join(", ")}.`,
        prompt: `Expand this room: ${room.name} - ${room.description_summary}`,
      });
      (room as any).read_aloud = text;
    }

    // 3. Hydration Logic
    console.log("Hydrating monsters...");
    for (const room of adventureStructure.rooms) {
      if (room.monsters && room.monsters.length > 0) {
        const { data: monsterStats } = await supabase
          .from("monsters")
          .select("*")
          .in("slug", room.monsters);
        
        if (monsterStats && monsterStats.length > 0) {
          (room as any).monster_details = monsterStats;
        } else {
          // Fallback: If no monsters found by slug, clear list to avoid "made up" half-empty data
          console.log(`No monsters found for slugs: ${room.monsters.join(", ")}`);
          (room as any).monster_details = [];
        }
      }
    }

    return new Response(JSON.stringify(adventureStructure), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,

      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});
