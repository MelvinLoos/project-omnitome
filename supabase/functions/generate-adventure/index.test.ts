import { z } from "npm:zod";
import { assertEquals } from "https://deno.land/std@0.208.0/testing/asserts.ts";

// Updated schema to match the fix for Structured Outputs (no .optional())
const AdventureSchema = z.object({
  title: z.string(),
  hook: z.string(),
  rooms: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description_summary: z.string(),
    transition: z.string().nullable().describe("Text describing the movement or narrative link from the PREVIOUS room to this one. MUST be null for the first room."),
    connections: z.array(z.string()),
    npcs: z.array(z.string()).describe("IDs of NPCs present in this room."),
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
    story_tie: z.string().describe("How this NPC is connected to the main plot or the specific adventure hook."),
    secret_or_quirk: z.string(),
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

Deno.test("AdventureSchema validation - no optional fields to support structured outputs", () => {
  const roomShape = (AdventureSchema.shape.rooms as any).element.shape;
  const npcShape = (AdventureSchema.shape.npcs as any).element.shape;

  // Verify room mechanics are NOT optional
  assertEquals(roomShape.skill_checks.isOptional(), false, "skill_checks should be required");
  assertEquals(roomShape.suggested_actions.isOptional(), false, "suggested_actions should be required");
  
  // Verify NPC mechanics are NOT optional (CRITICAL for Structured Outputs)
  for (const [key, value] of Object.entries(npcShape)) {
    assertEquals((value as any).isOptional(), false, `NPC field '${key}' should be required (even if nullable)`);
  }
});

Deno.test("AdventureSchema validation - valid sample data (Basic NPC)", () => {
  const validData = {
    title: "The Ghostly Keep",
    hook: "A plea for help from a nearby village.",
    rooms: [],
    npcs: [
      {
        id: "n1",
        name: "Old Man",
        role: "Villager",
        type: "basic",
        motivation: "Save the town",
        story_tie: "He knows the secret entrance.",
        secret_or_quirk: "Afraid of heights",
        family: null,
        occupation: null,
        recreation: null,
        dreams: null,
        unique_look: null,
        talents: null,
        flaws: null,
        physical_presence: null,
        tags: ["helpful"],
        dialogue_samples: ["Help us!"]
      }
    ]
  };

  const result = AdventureSchema.safeParse(validData);
  assertEquals(result.success, true);
});
