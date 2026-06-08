# GoalPath

GoalPath is a modern Next.js app built with the App Router, TypeScript, and Tailwind CSS. It provides a premium wellness and goal-tracking experience with pages for Today, Goals, Progress, Coach, and Me.

## Features

- `app/today/page.tsx` — daily dashboard with progress cards, goals, and motivation.
- `app/goals/page.tsx` — goals overview and goal creation flow.
- `app/progress/page.tsx` — analytics, heatmap, achievements, and AI insights.
- `app/coach/page.tsx` — personal coaching chat interface.
- `app/me/page.tsx` — profile, achievements, growth journey, preferences, and account settings.
- Reusable component architecture and mock service layer for future API integration.
- Responsive mobile-first design with a premium SaaS look.

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Lucide React icons

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## Production Build

```bash
npm run build
npm run start
```

## Project Structure

- `app/` — page routes and main app structure.
- `components/` — reusable UI components, including `components/me/` for the Me screen.
- `lib/` — shared types and service logic.
- `public/` — static assets if needed.

## Available Routes

- `/` — landing / home
- `/today` — daily summary dashboard
- `/goals` — goal management
- `/goals/add` — add new goal flow
- `/progress` — progress analytics
- `/coach` — coach chat experience
- `/me` — user profile and settings

## Notes

- Business logic is kept out of UI components and organized in `lib/` services.
- The app uses mock data for now, with a structure ready for future real API integration.
- Styling tokens and global styles are defined in `app/globals.css`.
- Bottom navigation is available on mobile screens across main pages.

## License

This repository is provided as-is for development and prototyping.

