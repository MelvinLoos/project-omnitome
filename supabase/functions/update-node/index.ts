import { generateObject, generateText } from "npm:ai";
import { createGoogleGenerativeAI } from "npm:@ai-sdk/google";
import { createGroq } from "npm:@ai-sdk/groq";

const google = createGoogleGenerativeAI({
  apiKey: Deno.env.get("GOOGLE_GENERATIVE_AI_API_KEY") || "",
});

const groq = createGroq({
  apiKey: Deno.env.get("GROQ_API_KEY") || "",
});

import { z } from "npm:zod";

Deno.serve(async (req) => {
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
    const { type, node, adventureContext } = await req.json();

    const systemPrompt = `You are a creative TTRPG writer. 
    Regenerate this ${type} to be more interesting while keeping it consistent with the overall adventure: "${adventureContext.title}".
    Theme: ${adventureContext.theme}
    Current context: ${JSON.stringify(node)}
    Respect all safety tools.`;

    let schema;
    if (type === "room") {
      schema = z.object({
        name: z.string(),
        description_summary: z.string(),
        monsters: z.array(z.string()),
        loot: z.array(z.string()),
      });
    } else {
      schema = z.object({
        name: z.string(),
        role: z.string(),
        agenda: z.string(),
        tags: z.array(z.string()),
      });
    }

    // 1. Structure Pass (Llama 4 Maverick)
    const { object: newNode } = await generateObject({
      model: groq("openai/gpt-oss-120b"),
      schema,
      system: systemPrompt,
      prompt: `Regenerate the ${type} structure.`,
    });

    // 2. Prose Pass (Gemini 3 Flash) - Only for rooms
    if (type === "room") {
      const { text } = await generateText({
        model: google("gemini-3-flash-preview"),
        system: `You are a vivid fantasy writer. Expand the room description into immersive read-aloud text. 
        Focus on sensory details. Consistency title: ${adventureContext.title}`,
        prompt: `Expand this room: ${(newNode as any).name} - ${(newNode as any).description_summary}`,
      });
      (newNode as any).read_aloud = text;
    }

    return new Response(JSON.stringify(newNode), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});
