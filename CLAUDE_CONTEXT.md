# FouFou — City Trail Generator · Claude Context

## Live
https://eitanfisher2026.github.io/FouFou/

## Stack
React (pre-compiled JSX via Babel), Firebase Realtime DB + Analytics, Google Places API, PWA

## Version
**v3.18.0** (bumped from 3.17.x series)

---

## Source Files
| File | Role |
|------|------|
| `_app-code-template.js` | Main component shell, insert points |
| `app-logic.js` | All state, hooks, Firebase, business logic |
| `views.js` | Wizard + trail views JSX |
| `dialogs.js` | All dialogs/modals JSX |
| `quick-add-component.js` | QuickAdd + standalone components (FeedbackItemImages etc.) |
| `config.js` | VERSION, systemParams defaults |
| `utils.js` | compressImage, uploadImage, i18n helpers |
| `i18n.js` | All Hebrew + English strings |
| `city-*.js` | Per-city data |

## Build
```bash
python3 build.py          # assembles index.html + inlines CSS
node compile.js app-code.js  # JSX → minified JS
```

## Critical Rules
- `mangle: false` in compile.js — never change
- Single quotes in JSX = Babel error → always double quotes
- All Firebase writes → `app-logic.js` only
- Balance check: `() +0  {} -3  [] -2`
- Standalone components (with hooks) → `quick-add-component.js` (before FouFouApp)
- Never use `React.useState` inside `.map()` or callbacks

---

## Architecture — Wizard Flow
- **Step 1** — Select interests (grouped by category, sticky bottom buttons)
- **Step 2** — Select area / radius (sticky bottom buttons)
- **Step 3** — Results / trail

### Sticky Bottom Buttons (v3.17.77+)
Both steps use `position: sticky; bottom: 0` — no fixed px calculations:
- ⭐ 🗺️ מפת מועדפים — always visible
- 🔍 מצא מקומות / המשך — appears when condition met

### Interest Groups (v3.17.78+)
- One `<div>` per group with header **outside** the grid
- No `gridColumn: 1/-1` (iOS Safari bug avoided)
- Header style: right border accent + subtle background

---

## Dedup Logic (`saveWithDedupCheck`)
1. Interests check
2. Name dedup (exact match in local DB)
3. GooglePlaceId dedup (same place, different name) → popup
4. If `loc.googlePlaceId` + not in DB → save directly
5. No `googlePlaceId` → proximity search (Google API, all dialog types)
   - Proximity only when coords exist

## Feedback System (v3.18.0)
**Dialog** (simple form, no history):
- Category (bug/idea/general)
- Subject field
- Sender name + email fields
- Textarea (5 rows)
- Image upload (up to `sp.feedbackMaxImages`, default 3, 480KB compressed)
- Draft saved to `localStorage` until sent

**Admin Feedback List** (`showFeedbackList`):
- Shows subject, senderName, senderEmail
- `FeedbackItemImages` component for prev/next image navigation
- Mark resolved / delete

**`FeedbackItemImages`** — defined in `quick-add-component.js` (standalone, valid hooks)

**`sendSystemAlert`** — writes directly to `feedback/` path (not user-facing)

---

## Key State (app-logic.js)
- `wizardStep` 1/2/3
- `formData` — interests[], searchMode, area, radius, etc.
- `customLocations[]` — user's favorites
- `showFeedbackDialog`, `feedbackText`, `feedbackCategory`, `feedbackSubject`, `feedbackSenderName`, `feedbackSenderEmail`, `feedbackImages[]`
- `interestGroups` — group definitions from Firebase
- `dedupConfirm` — dedup popup state

## i18n Keys (new in 3.17-3.18)
- `dedup.googleMatchMulti`, `dedup.selectOrSkip`, `dedup.noneOfThese`
- `settings.feedbackSubject`, `settings.feedbackSenderName`, `settings.feedbackSenderEmail`

---

## Pending / Known Issues
- `hint_text_opened` analytics event not yet implemented
- Google Play Store (PWABuilder) not yet done
