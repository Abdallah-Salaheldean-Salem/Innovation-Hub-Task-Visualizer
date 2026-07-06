# ClickUp Clone - Vercel & Supabase Edition

This project is tailored for deployment on **Vercel** with a **Supabase** backend. 

## Vercel Deployment Setup

1. **Routing (`vercel.json`)**: Configured Vercel to route any `/api/*` endpoints to Serverless Functions, and `/*` to the static Vite frontend.
2. **Serverless APIs (`/api/`)**: Converted the Gemini AI backend integration from Express into a Vercel-compatible Serverless Function at `api/reports/generate.ts`.
3. **Build Command**: The `vercel.json` configures Vercel to automatically build the static bundle using `npm run build`.

## Supabase Integration

1. **Client Setup (`src/lib/supabase.ts`)**: Initialized the secure Supabase client dynamically injecting environment variables.
2. **Data Sync Engine (`src/lib/supabase-sync.ts`)**: Implemented the asynchronous syncing engine that pushes/pulls Workspace state to the Supabase Postgres instance seamlessly.
3. **App Integration (`src/App.tsx`)**: Upgraded the core React component lifecycle to fetch records automatically on load and continuously mirror offline local mutations into Supabase (if configured). 
4. **Environment Config (`.env.example`)**: Defined `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as placeholders.
