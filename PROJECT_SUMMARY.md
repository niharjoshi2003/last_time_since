# Last Time Since — Project Summary

A short overview of what this app does and how it’s built, so you can explain it to anyone.

---

## What It Is

**Last Time Since** is a **personal “time since” tracker** built as a single-page web app. You add things you did (or want to track) with a **date and time**, and the app shows **how long it’s been since then** — updating every second.

Examples of what people might track:
- “Last time I texted her”
- “Last time I saw her”
- “Last time I smoked / drank”
- “Last time I exercised”
- Anything else you want to remember “how long since …”

So in one sentence: **you log events with a timestamp, and the app shows live “X days / hours / minutes since then” for each one.**

---

## Main Features

1. **Add tasks** — Click “Add task”, enter:
   - A short label (e.g. “i texted her”)
   - Date & time when it last happened
   - Optional: pick a **color** and an **icon** (message, eye, cigarette, wine, heart, skull)

2. **Live countdown / elapsed time** — For each task, the app shows **time elapsed since that date/time** (e.g. “2d 5h 12m since then”) and **updates every second**.

3. **Edit & delete** — Each card has edit (pencil) and delete (trash) buttons so you can change the label, date, color, or icon, or remove a task.

4. **Hybrid Data Storage** — **Guest mode** uses **localStorage** (works immediately, no signup). **Optional cloud sync** via Supabase for cross-device access (requires free account).

5. **Authentication** — Optional signup/login to sync tasks across devices. Guest mode works without any account.

6. **Default examples** — If you’ve never saved anything, the app starts with a few sample tasks (e.g. “i texted her”, “i saw her”, “i smoked joint”) so you can see how it works right away.

7. **Seamless Migration** — When you sign up, your localStorage tasks automatically migrate to the cloud.

---

## Tech Stack & Setup

- **React** (Create React App) — Single-page app with components and state.
- **React 19** — Current React version.
- **Lucide React** — Icons (skull, heart, wine, calendar, pencil, trash, etc.).
- **Supabase** — PostgreSQL database + authentication (optional, for cloud sync).
- **Hybrid Storage** — localStorage for guest mode, Supabase for authenticated users.
- **Styling** — Custom CSS in `App.css`: dark theme, gradient blobs, grain overlay, neon-style footer, card gradients based on task color.

**To run it:**
- `npm install` then `npm start` — runs the dev server (usually at http://localhost:3000).
- `npm run build` — builds a production bundle you can host anywhere (e.g. static hosting).

---

## Project Structure (Simplified)

| Part | What it does |
|------|------------------|
| `src/App.js` | Root component; just renders the main page. |
| `src/pages/Last_Time_since.jsx` | Main screen: tasks, add/edit modal, timers, cards, auth integration. |
| `src/pages/App.css` | All styles: layout, cards, modal, blobs, neon, responsive tweaks. |
| `src/config/supabase.js` | Supabase client configuration. |
| `src/services/dataService.js` | Data abstraction layer: routes to Supabase or localStorage. |
| `src/hooks/useAuth.js` | Authentication hook: signup, signin, signout. |
| `src/components/AuthModal.jsx` | Sign up / sign in modal component. |
| `src/components/UserBadge.jsx` | User badge / guest mode indicator. |
| `supabase-schema.sql` | Database schema for Supabase (run in SQL Editor). |
| `localStorage` key `lasttimesince_tasks` | Where tasks are stored in guest mode. |

So the “brain” of the app is **one main component** (`Last_Time_since.jsx`) that handles:
- State (tasks, modal open/closed, form fields)
- A 1-second interval to recompute elapsed time for each task
- Add / edit / delete and persisting to `localStorage`

---

## In One Paragraph (For Pitches or Demos)

*“Last Time Since is a React web app that lets you track ‘the last time I did X’ with a date and time. You add custom items (with optional colors and icons), and the app shows a live ‘time since’ for each one, updating every second. All data is stored only in your browser (localStorage), so it’s private and works without a backend. It’s built with React 19 and Lucide icons, and styled with a dark, slightly neon look.”*

---

You can copy any section from this file (or the one-paragraph version) to explain the project in docs, README, or to someone in person.
