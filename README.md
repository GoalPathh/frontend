# GoalPath

GoalPath is a modern Next.js (App Router) + TypeScript + Tailwind CSS app providing a premium goal-tracking experience with pages for **Today**, **Goals**, **Progress**, **Coach**, and **Me**.

## Features

- `app/today/page.tsx` — daily dashboard with progress cards, goals, and motivation.
- `app/goals/page.tsx` — goals overview and goal creation flow.
- `app/progress/page.tsx` — analytics, heatmap, achievements, and AI insights. Refetches automatically on `window.focus` and surfaces a manual retry button + error banner when the backend is offline.
- `app/coach/page.tsx` — personal coaching chat interface. Handles the **LLM-triggered multi-step Goal Wizard** (duration → habits → schedule → AI milestones → review) with both *bubble-style* and *dock-style* variants. The active style is exposed in `wizard-dock.tsx` / `wizard-bubbles.tsx`.
- `app/me/page.tsx` — profile, achievements, growth journey, preferences, account settings, and **Google OAuth sign-in**.
- Reusable component architecture and async service layer talking to the real backend.
- Responsive mobile-first design with a premium SaaS look.

## Tech Stack

| Layer | Library |
|---|---|
| Frontend | Next.js 15 (App Router) + React 18 |
| Styling | Tailwind CSS + Lucide React icons |
| State | Local hooks only, no global store |
| AI | Calls backend `/coach/...` + `/milestones/...`, no client-side LLM |
| Auth | Supabase JWT in `localStorage`, automatic refresh |
| Type-safety | TypeScript strict mode |

## Getting Started

```bash
npm install
cp .env.example .env   # fill in NEXT_PUBLIC_API_URL + Supabase client values
npm run dev
```

Open `http://localhost:3000` in your browser.

The dev server uses Turbopack (`next dev`). The first hit to each route compiles on-demand and can take 10–30 seconds the first time.

`.env.example` keys:

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

The first tells the SPA where to reach the backend. The latter two are read by Google OAuth callback handler to obtain user info.

## Production Build

```bash
npm run build
npm run start
```

Pages are statically pre-rendered by default.

## Project Structure

- `app/` — page routes (App Router) and main app structure.
- `components/` — reusable UI components, including `components/auth/` and `components/me/`.
- `lib/` — shared types, async services (`apiRequest`, `progressService`, `milestoneService`, `authService`).
- `public/` — static assets if needed.

## Available Routes

| Path | Purpose |
|---|---|
| `/` | Landing / home |
| `/login` `/register` | Email + Google OAuth sign-in |
| `/auth/callback` | Google OAuth callback — extracts hash fragments and stores tokens |
| `/today` | Daily summary dashboard |
| `/goals` | Goal management (real API) |
| `/goals/add` | Add new goal flow |
| `/progress` | Progress analytics (real API + auto-refetch on focus) |
| `/coach` | Coach chat + multi-step Goal Wizard |
| `/me` | User profile and settings |

## AI Features

The frontend itself does **not** call any LLM directly. It sends user text to `POST /coach/sessions/:id/messages`, and the backend:

1. Looks at the message content.
2. Decides whether to trigger the `start_goal_wizard` tool, the `createGoal` tool, or just continue a normal chat reply.
3. Replies with natural-language text + (optionally) a `[wizard_started]<json>` tag fragment that the frontend parses and renders as a `WizardIntentBubble`.
4. When the user finishes the wizard (or types "batal"), `[goal_finalized]<json>` or `[wizard_skip]` is sent back for persistence.

This means that swapping the LLM provider does **not** require any frontend change — flip `LLM_DRIVER` in `backend/.env` between `raw` and `vercel` and you're done. See the **`backend/README.md`** for the full provider matrix.

## License

This repository is provided as-is for development and prototyping.
