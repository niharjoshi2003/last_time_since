# Last Time Since

A mobile-first React web app for tracking how long it has been since you did something (habits, reminders, milestones). **Your data never leaves your device** — everything is stored in the browser’s `localStorage` under the key `lasttimesince_tasks`. No account, no server, no cloud.

## Features

- **Device-only storage** — Tasks persist locally; clearing site data removes them.
- **Person/group tracking** — Keep multiple trackers under one person (e.g. meet, texted, saw).
- **Reset per task** — One tap sets “last time” to now and increments a reset counter.
- **Add / edit / delete** — Full CRUD with color and icon pickers.
- **Live elapsed time** — Updates every second in a compact, readable format.
- **Themes** — Light, Dark, and Crimson Night (dark + red blend), remembered per device.

## Quick start

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Data shape

Each task is a JSON object:

- `id` — string (UUID when created in-app)
- `label` — string
- `person` — string (group/person name, defaults to `General`)
- `date` — ISO 8601 string (last occurrence)
- `color` — hex string
- `iconIndex` — number (index into the icon set)
- `resetCount` — number (default `0`; older saved tasks without this field are treated as `0`)

## Scripts

| Command        | Description                |
| -------------- | -------------------------- |
| `npm start`    | Development server         |
| `npm run build`| Production build → `build/` |
| `npm test`     | Test runner                |

## Deployment

Static hosting (Netlify, Vercel, GitHub Pages, S3, etc.):

```bash
npm run build
```

Upload the `build` folder. **No environment variables or backend** are required.

## Privacy

There is no sign-in and no outbound API for your tasks. See the in-app Privacy page for details.

## Tech stack

- React 19
- React Router
- Lucide React (icons)
- `localStorage` for persistence

## License

MIT
