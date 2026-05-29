# OmniTome

OmniTome is a premium, professional-grade, AI-driven Game Master (GM) assistant for Tabletop Role-Playing Games (TTRPGs). It focuses on prep-efficient adventure generation, using an advanced relational ecosystem to create immersive, 5-room dungeon style adventures.

## Vision
OmniTome aims to reduce GM prep time while increasing adventure quality through:
- **AI-Driven Generation:** Using a dual-model Orchestrator-Worker pattern (Llama 4 & Gemini 3).
- **Relational Ecosystems:** Generating connected rooms, NPCs with agendas, and balanced mechanics.
- **Safety Tools:** Native support for "Lines and Veils" to ensure comfortable play for everyone.
- **Print-Ready Output:** Beautifully formatted, two-column PDF exports that look like professional TTRPG sourcebooks.

## 🛠 Tech Stack
- **Frontend:** [Nuxt 3](https://nuxt.com/) (Vue.js) + [TailwindCSS](https://tailwindcss.com/)
- **Backend:** [Supabase](https://supabase.com/) (PostgreSQL + pgvector)
- **AI:** Vercel AI SDK, Groq (Llama 4), Google (Gemini 1.5/3)
- **Deployment:** [Netlify](https://www.netlify.com/)

---

## 🛠 Development Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Required for Supabase local development)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Supabase Local Environment
OmniTome relies on a local Supabase instance for the database and Edge Functions.
```bash
# Start the local Supabase stack
npm run supabase:start
```
*Note: This requires Docker to be running.*

### 4. Seed the Database
If this is your first time setting up, you'll need to ingest the Open5e data and community content:
```bash
# Ingest monster data from Open5e API
node scripts/ingest-open5e.mjs

# Seed community content (hooks, stakes)
node scripts/seed-community-content.mjs
```

### 5. Run Nuxt Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

---

## 📜 Available Scripts

### General
- `npm run dev`: Start Nuxt development server.
- `npm run build`: Build for production.
- `npm run preview`: Preview production build locally.

### Supabase
- `npm run supabase:start`: Start local Supabase services.
- `npm run supabase:stop`: Stop local Supabase services.
- `npm run supabase:status`: Show status of local Supabase services.
- `npm run supabase:db:reset`: Reset local database (applies migrations).
- `npm run supabase:migration:new <name>`: Create a new migration file.
- `npm run supabase:deploy`: Deploy Edge Functions to the linked project.
- `npm run supabase:gen:types`: Generate TypeScript types from local schema.

---

## 📁 Project Structure
- `supabase/migrations/`: SQL migration files for database schema.
- `supabase/functions/`: Deno Edge Functions for AI logic.
- `components/`: Custom UI components (StatBlocks, AdventureRenderer, etc.).
- `scripts/`: Data ingestion and seeding scripts.
- `assets/css/main.css`: Global styles including `@media print` layout.

## 📝 License
This project uses the Open5e API and complies with OGL/Creative Commons licensing for TTRPG "crunch" data.
