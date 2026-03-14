# Summary of Changes – Last Time Since

## Features Added

### 1. Reset button per task
- **TaskCard** (`src/components/tasks/TaskCard.jsx`): Each task card has a **Reset** button (primary CTA with accent color). Clicking it resets that task’s timestamp to the current date/time.
- **dataService** (`src/services/dataService.js`): New `resetTask(id)` updates the task’s `date` to now and persists to localStorage or Supabase. New `resetTaskLocal(id, now)` handles localStorage (and is used for guest mode).
- **Last_Time_since.jsx**: `handleReset(task)` calls `dataService.resetTask`, updates `tasks` state so the timer immediately shows “Just now” (or 0s), and triggers the toast.
- **Toast** (`src/components/Toast.jsx`): New component shows “Reset to now ✓” for ~2.5s after a reset (role="status", aria-live="polite" for accessibility).

### 2. Change count / frequency tracker
- **Data model**: Tasks now have `resetCount` (number) and `resetHistory` (array of ISO timestamps, last 20 kept).
- **dataService**: `fromSupabaseTask` / `toSupabaseTask` and localStorage load/save include `reset_count` and `reset_history`. **Supabase**: If you use Supabase, add to your `tasks` table: `reset_count` (integer, default 0), `reset_history` (jsonb, default '[]').
- **TaskCard**: Shows a “Reset N time(s)” badge when `resetCount > 0`. Badge `title` shows “Last reset: …” using the most recent entry in `resetHistory` (optional history hint).
- **formatTime.js**: `formatTimeAgo(ms)` returns “Just now” when `ms < 60s` for better UX right after reset.

## Design & responsiveness

- **Card hierarchy**: Task name → elapsed time (large) → reset count badge → Reset button. Card uses `--card-accent` for consistent accent color.
- **Responsive grid**: 1 column on mobile (320px+), 2 columns from 600px, 3 columns from 1024px. No horizontal scrolling (html/body and containers use overflow-x: hidden).
- **Touch targets**: Primary actions (Reset, Add task, modal close, card edit/delete) use min 44×44px and adequate padding.
- **Focus**: `:focus-visible` styles on buttons (outline or box-shadow) so keyboard users get a clear focus indicator.
- **ARIA**: Icon-only buttons have `aria-label` (Edit task, Delete task, Reset “…”, Close modal). Toast uses `role="status"` and `aria-live="polite"`.

## New / updated files

| File | Change |
|------|--------|
| `src/services/dataService.js` | `resetCount`/`resetHistory` in model; `normalizeTask`; `resetTask`/`resetTaskLocal`; Supabase mapping for reset fields. |
| `src/components/tasks/TaskCard.jsx` | Reset button, reset badge, `formatTimeAgo`, `onReset`, ARIA labels, optional “last reset” tooltip. |
| `src/components/Toast.jsx` | **New** – snackbar for “Reset to now ✓”. |
| `src/pages/Last_Time_since.jsx` | `handleReset`, toast state, `onReset` passed to TaskCard, empty state when no tasks. |
| `src/utils/formatTime.js` | `formatTimeAgo(ms)` with “Just now” for &lt; 60s. |
| `src/styles/base.css` | Card meta (reset badge + Reset button), empty-state, toast, 44px targets, focus-visible, grid breakpoints, typo fix (0.5escription). |
| `src/components/tasks/TaskModal.jsx` | Modal close button: `aria-label="Close modal"`. |
| `src/components/folders/FolderModal.jsx` | Modal close button: `aria-label="Close modal"`. |

## Empty state

When there are no tasks (or no tasks in the current folder), the app shows a short message, an icon, and an “Add task” button instead of an empty grid.

## Supabase migration (optional)

If you use Supabase, run something like:

```sql
ALTER TABLE tasks
  ADD COLUMN IF NOT EXISTS reset_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS reset_history jsonb DEFAULT '[]';
```

If these columns are missing, reset will still work in guest mode (localStorage); for logged-in users the reset API will error until the columns exist.
