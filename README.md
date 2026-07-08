# Last Time Since

A mobile-first React app for tracking how long it has been since you last did something. **Your data never leaves your device** — everything is stored in the browser under the `localStorage` key `lasttimesince_tasks`. No account, no server, no cloud.

## What it does

1. On first load you get five sample trackers; after that the app loads your saved tasks from `localStorage`.
2. Tasks are grouped by **person/group** (e.g. "Her", "Personal", "General") and filtered with chips.
3. Each card shows a **live elapsed time** that updates every second, plus a reset counter.
4. **Reset** sets the last-occurrence time to now and increments the counter.
5. Full add / edit / delete with color and icon pickers, three themes, and static About / Privacy / Terms pages.

## Features

- **Device-only storage** — tasks persist locally; clearing site data removes them.
- **Person/group organization** — keep multiple trackers under one person.
- **Live elapsed time** — recalculated every second in a compact, readable format.
- **Reset counter** — one tap logs "now" and tracks how many times you've reset.
- **Color and icon pickers** — 8 preset colors, 6 Lucide icons.
- **Dashboard stats** — people count, visible tasks, total resets, and most-tracked person.
- **Themes** — Light, Dark, and Crimson Night, remembered per device.
- **Accessibility touches** — `aria-live` timers, keyboard-dismissable modals, reduced-motion friendly.

## Tech stack

- React 19 (Create React App / `react-scripts` 5)
- React Router 6
- Lucide React (icons)
- `localStorage` for persistence — no backend, no external dependencies

## Data model

Each task is stored as JSON under `lasttimesince_tasks`:

| Field | Type | Notes |
| --- | --- | --- |
| `id` | string | `crypto.randomUUID()` (with fallback) |
| `person` | string | group/person name, defaults to `General` |
| `label` | string | task name |
| `date` | ISO 8601 string | last occurrence |
| `color` | hex string | one of 8 presets |
| `iconIndex` | number | index into the icon set |
| `resetCount` | number | defaults to `0` |

Theme preferences use the keys `lasttimesince_theme` and `lasttimesince_theme_mood_version`.

## Run locally

```bash
npm install
npm start
```

Open `http://localhost:3000`. No `.env` file and no backend setup are required.

| Command | Description |
| --- | --- |
| `npm start` | development server |
| `npm run build` | production build → `build/` |
| `npm test` | test runner (React Testing Library) |

## Deployment

Static hosting (Netlify, Vercel, GitHub Pages, S3, etc.):

```bash
npm run build
```

Upload the `build/` folder. No environment variables or backend required.

## Project structure

```text
src/
├── App.js                    # router + theme provider
├── pages/                    # Last_Time_since (main), About, Privacy, Terms
├── components/
│   ├── layout/               # Layout, ThemeSwitcher, AppFooter
│   └── tasks/                # TaskCard, TaskModal
├── services/dataService.js   # localStorage CRUD
├── context/ThemeContext.jsx
├── constants/taskOptions.js  # color + icon options
├── utils/formatTime.js       # elapsed-time formatting
└── styles/                   # base + theme stylesheets
```

## Privacy

There is no sign-in and no outbound API for your tasks — everything stays in the browser. See the in-app Privacy page for details.

## Note on `supabase-schema.sql`

The repo contains `supabase-schema.sql` (and some auth-related CSS) from a **planned** cloud-sync version. It is **not wired into the current app** — the shipped build is client-only and localStorage-backed. Treat that schema as a future roadmap artifact, not current architecture.

## Roadmap

- Optional encrypted export/import of tracker data
- Streak insights and trend charts
- Optional cloud sync (the Supabase schema is a starting point)

## License

MIT
