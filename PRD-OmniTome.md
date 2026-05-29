# Project Requirements Document: OmniTome

## 1. Executive Summary & Vision

- **Product Vision:** A premium, professional-grade, AI-driven Game Master (GM) assistant for Tabletop Role-Playing Games (TTRPGs).
    
- **Phase 1 Deliverable:** A prep-focused adventure generator starting with an advanced 5-Room Dungeon relational ecosystem.
    
- **Phase 2 Deliverable:** A fully searchable RAG (Retrieval-Augmented Generation) lore database.
    
- **Phase 3 Deliverable:** A live, real-time GM dashboard for at-the-table generation and tracking.
    

## 2. Technical Stack & Architecture Requirements

- **Frontend Framework:** Vue.js via Nuxt 3 with SSR enabled.
    
- **Backend & Database:** Supabase running PostgreSQL with `pgvector` for RAG, utilizing Edge Functions for API logic.
    
- **Hosting Environment:** Netlify via the Nuxt Nitro engine.
    
- **AI Orchestration:** Vercel AI SDK (TypeScript) using a dual-model Orchestrator-Worker pattern.
    
- **AI Models:** Llama 4 Maverick (via Groq) for logic routing and Gemini 3 flash for narrative text generation.
    
- **Schema Validation:** Zod for strict JSON schema enforcement on LLM outputs.
    
- **Styling & UI:** TailwindCSS, themed to mimic premium WotC/Paizo TTRPG books with parchment backgrounds, serif headers, and crisp stat blocks.
    
- **Data Sources:** Open5e API and Data Dumps to ensure 100% legal OGL/CC "crunch".
    

## 3. Core Functional Requirements (UI/UX)

- **Session Zero Wizard:** A multi-step form to define game Dials such as Tone, Theme, Adventure Length, and Amount of Players.
    
- **Adventure Hook Randomizer:** A text input for the core idea featuring a "Randomize" button that pulls from highly upvoted `community_content` tables.
    
- **Stakes Definition:** A dropdown defining what happens if the players do nothing, establishing a ticking clock for the adventure.
    
- **Granular Regeneration:** A UI button next to every node (room, NPC, loot) allowing the GM to pass just that specific node back to the LLM for adjustments.
    
- **PDF Export Functionality:** Use `@media print` CSS to hide UI buttons and format the output into a printable, two-column booklet.
    
- **Rendering Components:** Custom Vue components required include `AdventureRenderer`, `ReadAloudBox`, and `StatBlock`.
    

## 4. AI & Game Design Constraints (Strict Rules)

- **Safety Tools Enforcement:** The UI must include a Safety Tools checklist for Lines and Veils. The AI must absolutely avoid generating content marked as Lines (hard limits). The AI must "fade to black" and exclude graphic details for content marked as Veils (soft limits).
    
- **Relational Generation:** Generated adventure data must be a relational graph where rooms connect to other rooms. NPCs must have agendas and movement triggers that allow them to roam the ecosystem.
    
- **Nuanced NPCs:** NPCs must be generated with cultural, socioeconomic, and environmental tags to ensure three-dimensional characters and avoid flat fantasy stereotypes.
    
- **Hardcoded Mechanics:** The LLM is never allowed to invent mathematical stat blocks. It must query the database for existing, balanced Open5e mechanics.
    
- **Narrative Tone:** The AI must write read-aloud text with vivid, multisensory details that "show, don't tell," mimicking professional adventure writers.
    

## 5. Database Schema Requirements

- **The "Crunch" Table (`monsters`):** Must include fields for `id` (UUID), `slug`, `name`, `cr`, `type`, `alignment`, and `raw_stats` (JSONB containing complex nested data).
    
- **The "Fluff" Table (`community_content`):** Must include fields for `id` (UUID), `category` (Enum), `content` (Text), and `upvotes` (Integer). The AI Randomizer must only pull from content with a score greater than 10.
    

## 6. Project Milestones

- **Milestone 1 (Data Seeding):** Setup Supabase tables and write a Node script to ingest Open5e JSON dumps into `raw_stats` JSONB columns, alongside the `community_content` setup.
    
- **Milestone 2 (Nuxt Setup & Wizard):** Initialize Nuxt 3 on Netlify and build the "Session Zero" input components.
    
- **Milestone 3 (AI Engine):** Configure Vercel AI SDK and Supabase Edge Functions for the dual-model pipeline, writing prompt logic to handle schemas, safety tools, and database hydration.
    
- **Milestone 4 (Canvas & PDF):** Build the Tailwind CSS rendering components and implement the print stylesheet.
    
- **Milestone 5 (Granular Editing):** Implement the per-node regeneration logic.