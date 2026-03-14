# Layout Fix & UX Overhaul — Summary of Changes

## Critical layout bug fixed

**Problem:** The "LAST TIME SINCE" hero and skull icon appeared *below* the folder/category list on mobile (and in the right column on desktop), breaking visual hierarchy.

**Solution:** The main content is now wrapped in a single flow where the **hero is the first thing** after the nav. Render order from top to bottom:

1. Top navigation bar (Layout)
2. **Hero / branding** (skull + "LAST TIME SINCE" + tagline)
3. Folder section: "Hide folders" toggle (mobile) + folder list (with "+ New" in header)
4. "+ ADD TASK" button (in flow on desktop; on mobile this is hidden and only the sticky CTA shows)
5. Task cards (or empty state)

---

## File-by-file summary

### `src/pages/Last_Time_since.jsx`

**Why changed:** Fix component order and add mobile sticky CTA.

- **Hero moved to top:** Wrapped the skull, title ("LAST TIME SINCE"), divider, and tagline in a new `<header className="hero-section">` and placed it as the **first** child of a new wrapper `main-content-wrap`, so it always appears above the folder section and content.
- **New wrapper:** All main content (hero, folder section, task area) is inside `main-content-wrap` for consistent padding and max-width.
- **Folder section unchanged in behavior:** The folder toggle and `FolderList` (with "+ New") stay in `main-layout-with-folders` but now come **after** the hero.
- **Add task in flow:** The in-flow "Add task" button is in `content-wrapper` with class `actions-bar-inline` so it can be hidden on mobile (see CSS).
- **Sticky bottom CTA:** New block `sticky-add-task` with a single "Add task" button, fixed to the bottom on mobile so users can add a task without scrolling. Includes `aria-label="Add task"`.
- **Accessibility:** Folder toggle now has `aria-expanded` and `aria-label`; inline `style` removed in favor of class for the toggle text.

### `src/styles/base.css`

**Why changed:** Support new layout, spacing, mobile sticky bar, and z-index order.

- **`.main-content-wrap`:** New wrapper with top/side padding (`24px 16px 32px`), `max-width: 1400px`, centered, `z-index: 1` so content sits above decorative layers.
- **`.hero-section`:** New block for the branding area: centered, compact skull (smaller size), smaller title via clamp, bottom margin and border for separation from the folder section.
- **`.sticky-add-task`:** New block; `display: none` by default. On viewports ≤640px it is shown (in the 640px media query) as a fixed bottom bar with safe-area padding, backdrop, border-top, and z-index 900 so it sits above content but below modals and toast.
- **`.sticky-add-task-btn`:** Full-width, min-height 48px for touch.
- **`.actions-bar-inline`:** In the 640px media query, `display: none` so only the sticky "Add task" is visible on mobile (no duplicate button).
- **Skull / header:** `.skull-container` margin and `.title`/`.divider` sizes adjusted so the hero is compact and does not dominate the screen.
- **Cards:** `.card` padding set to 24px (already at least 16px in breakpoints), min-height 280px.
- **Folder items:** `.folder-item` given `min-height: 44px` and `padding: 10px 12px` for uniform height and tap targets.
- **Z-index:** `.modal-backdrop` raised from 100 to **1200** so modals appear above the sticky nav (1100). Toast remains 2000; sticky CTA 900.
- **Toast on mobile:** In 640px media, `.toast` `bottom: 80px` so it appears above the sticky bar.
- **Mobile spacing:** In 640px media: `main-content-wrap` gets `padding-bottom: 100px` so the last card is not covered by the sticky bar; `hero-section` margins tightened; folder toggle margin adjusted.

### `src/styles/theme-dark.css`

**Why changed:** The sticky bar and hero use theme-dependent backgrounds/borders.

- **`.sticky-add-task`:** Dark background, border-top and box-shadow so the bar matches the dark theme.
- **`.hero-section`:** Border color for separation in dark theme.

### `src/styles/theme-light.css`

**Why changed:** The sticky bar and hero need light-theme styling.

- **`.sticky-add-task`:** Light background and border so the bar fits the light theme.
- **`.hero-section`:** Border color for separation in light theme.

### `src/styles/theme-ultra-love.css`

**Why changed:** Sticky bar and hero need to match the ultra-love (neon/dark) theme.

- **`.sticky-add-task`:** Dark background with accent border and shadow.
- **`.hero-section`:** Border color for separation.

---

## Layout and UX outcomes

- **Visual hierarchy:** Logo/brand is the first thing after the nav; then folder section; then add task and cards.
- **Spacing:** Top padding and section separation via `main-content-wrap` and `hero-section` border; no content starting at the screen edge.
- **Mobile:** Single scrollable column; sticky "Add task" at bottom; nav remains sticky at top; hero kept compact.
- **No overlapping/clipping:** Modals and toast use higher z-index (1200, 2000); sticky bar at 900; no new `overflow: hidden` that would clip content.
- **Touch and a11y:** Folder items and sticky button meet min tap size; folder toggle and sticky button have ARIA labels/expanded state.

---

## Z-index stack (after audit)

| Layer           | Z-index | Notes                          |
|----------------|---------|---------------------------------|
| Toast          | 2000    | Above everything                |
| Modal backdrop| 1200    | Above nav and sticky CTA        |
| Site nav       | 1100    | Sticky top                      |
| Mobile menu   | 1050    | Below nav                       |
| User badge     | 1000    | Top-right                       |
| Sticky Add task| 900    | Above main content, below modals|
| Main content   | 1       | Above fixed decorative layers   |
