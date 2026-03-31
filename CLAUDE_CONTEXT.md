## כלל דיבאג — אחרי 3 קומיטים כושלים

> **אם אחרי 3 ניסיונות תיקון הבעיה לא נפתרה — STOP. אל תנחש יותר.**

1. **בקש דיבאג אקטיבי** — הוסף `console.log` ממוקדים, בקש F12 output.
2. **ציין מה חסר לך** — "אני צריך לראות מה מחזיר X בזמן ריצה".
3. **הסבר את ההנחות שלך** — "אני מניח ש-X קורה, אם לא — הבעיה היא Y".

**אסור:** לבצע קומיט נוסף על בסיס ניחוש בלבד אחרי 3 כישלונות.

---

# FouFou — City Trail Generator · Claude Development Context

> **לקלוד — חובה לקרוא לפני כל שינוי:**
> 1. קרא את כל הקובץ הזה לפני שאתה עושה כל שינוי.
> 2. **עדכן את הקובץ הזה לפני כל zip.**
> 3. ה-zip חייב לכלול את `CLAUDE_CONTEXT.md` המעודכן.
> 4. אל תסמוך על אינטואיציה — המידע כאן הוא הבסיס.
> 5. **אל תחיה תחומים מחוקים.** אל תוסיף hardcoded IDs. אל תזהם Firebase.

---

## 📍 מצב נוכחי

- **גרסה:** `3.14.1` (Mar 31, 2026)
- **Live:** https://eitanfisher2026.github.io/FouFou/
- **Working dir:** `/home/claude/project/` (extract zip here)
- **Tagline:** Local picks + Google spots. Choose your vibe, follow the trail

---

## ✅ Major Changes — Session Mar 31, 2026 (v3.14.0 → v3.14.1)

### 🐛 Bug Fixes
- **Startup offline toast** — if Firebase not connected after 5s, shows sticky `toast.offline`. Dismissed automatically when connection restores.
- **`noGoogleSearch` not shown on reopen** — `openInterestDialog` was missing `noGoogleSearch` field in `setNewInterest`. Fixed in `views.js`.
- **`textSearch` not cleared on save** — saving with empty textSearch kept old value. Now explicitly sets `null` to delete from Firebase. Also clears opposite field when switching modes (`text`↔`types`).
- **maxStops backfill broken in Round 2** — Round 2 used raw `interestCfg.maxStops` instead of `interestLimits` (which includes backfill overflow). Fixed.

### ♻️ Refactor — DRY: buildInterestLimits
- Extracted shared function `buildInterestLimits(selectedInterests, maxTotal)` in `app-logic.js`.
- Replaces ~60 lines of duplicated allocation logic in both `smartSelectStops` and route generation.
- Single source of truth — future changes to allocation affect both callers automatically.

### 📋 CLAUDE_CONTEXT updated
- Added **DRY — No Duplicate Logic** rule to Critical Rules.

---

## ✅ Major Changes — Session Mar 30, 2026 (v3.13.15 → v3.14.0)

### 🚀 Pre-compiled Build Pipeline — Browser Babel Removed
- **Root cause solved permanently:** Babel standalone deoptimises files >500KB in the browser, silently breaking event handlers in `views.js`/`dialogs.js`.
- **Fix:** JSX is now compiled at build time (developer machine / Claude), not in the browser.
- `compile.js` added — runs after `build.py` concatenates sources. Pipeline: JSX ~950KB → Babel transform → Terser minify → **plain JS ~637KB** shipped to browser.
- `Babel.transform()` removed from `index.html` loader. Browser just does `fetch → script inject`.
- Babel CDN script (~350KB) removed from `index.html` — faster first load.
- `mangle: false` in Terser — function names preserved (React hooks + `window.BKK.*`).
- Balance check updated: now runs on **source files**, not compiled output.

### 🧹 Dead Code Removed
- `setIsUnlocked` and `setIsCurrentUserAdmin` — two noop functions in `app-logic.js`, never called.
- Duplicate comment line in `app-logic.js` (line 7505).

---

## ✅ Major Changes — Session Mar 30, 2026 (v3.13.0 → v3.13.9)

### 🌐 Translation (MyMemory API — free, no key, 1000 req/day)
- `detectNeedsTranslation(text)` — regex: Hebrew = `\u0590-\u05FF`
- `translateText(text, targetLang)` — MyMemory API call
- **Components in quick-add-component.js (before 500KB):**
  - `TranslateButton` — manual translate button (used in ReviewTextWithTranslate)
  - `ReviewTextWithTranslate` — read-only review text with manual translate + "show original"
  - `AutoTranslateText` — auto-translates on mount if lang mismatch, shows original while loading

**Where translation appears:**
- Stop detail popup (FouFou icon popup) — description + notes: auto on-the-fly
- Favorites map bottom sheet — description + notes: auto on-the-fly
- Other users' reviews — manual button only

### 🗺️ Favorites Screen Changes
- **Snap place button removed** from action row (floating camera button still works)
- **Map button** moved to action row with text "🗺️ מפת מועדפים / Favorites Map" (i18n: `form.favoritesMap`)
- Area not selected → separate toast `form.selectAreaFirst` (not combined with interests)

### 📍 Favorites Map Bottom Sheet — Redesigned
- Header row: DOM `[FouFou icon][name][✕]` + `direction:rtl/ltr` → X always correct side
- FouFou icon opens full location dialog (edit or read-only)
- Removed: area label, added-by name, edit/details button
- Added: description + notes with AutoTranslateText, Google ⭐ + FouFou 🌟 ratings
- Yellow border on FouFou rating button
- 2 action buttons: 🧭 נווט + 🔍 פתח בגוגל/נקודה

### 📋 Stop Detail Popup (from list) — Redesigned  
- Header row: DOM `[FouFou icon][name][✕]` + `direction:rtl/ltr` → X always correct side
- FouFou icon = edit (if can edit) or details (read-only) — opens location dialog
- Ratings: ⭐ Google + 🌟 FouFou with yellow border (both in ratings row, not action bar)
- Action bar: Row 1: 🧭 נווט + 🔍 פתח בגוגל. No edit/details button (FouFou icon in header)
- Description + notes with AutoTranslateText

### 🗑️ Interest Deletion — Full Cleanup
- Shows warning with affected location count + city count before delete
- After confirm: deletes from customInterests, interestConfig, interestStatus, ALL locations' interests[] array, cityHiddenInterests, users' interestStatus
- Local React state updated optimistically

### 📐 UX Consistency Rule — ✕ Button Position
See Known Regressions #12. All dialogs updated to follow this rule.

---

## ✅ Major Changes — Session Mar 27, 2026 (v3.12.30 → v3.13.0)

### 🔴 CRITICAL: Babel 500KB Deoptimisation — Root Cause & Full Fix

`app-code.js` is ~946KB. Babel deoptimises JSX past 500KB — handlers silently fail, no error.

**Bundle map:**
```
quick-add-component.js  →  2–30KB    ✅ fully safe
app-logic.js            →  30–371KB  ✅ fully safe
views.js starts         →  371KB     ✅ safe (first 129KB)
500KB BABEL LIMIT       ←──────────────────────────────
views.js middle/end     →  500–714KB ⚠️ broken zone
dialogs.js              →  714–938KB 🔴 broken zone
```

**THE RULE — forever:**
- Never `database.ref().set/update/remove()` directly in `views.js` or `dialogs.js`
- Never `async (e) => { ... }` with >1 line past 500KB
- All Firebase writes → named function in `app-logic.js` (~115KB)
- Call sites in views/dialogs use simple one-liners: `onChange={(e) => myFunc(e.target.value)}`

**All Firebase functions now in app-logic.js (~115KB):**
```
handleCityIconUpload        saveCityGeneralField      saveSpeechRate
saveLocationLocked          saveInterestAdminStatus   saveInterestAdminStatusAsync
saveSystemParam             resetSystemParams         saveBulkUpdate
clearAccessLog              removeLocationGooglePlaceId  saveCityHiddenInterests
saveInterestCounter         removeInterestConfig      saveInterestConfig
saveCustomInterestAndConfig saveNewCustomInterest     saveNewInterestStatus
clearFeedbackList           deleteUser
```

**Console testing:**
```js
window.BKK._handleCityIconUpload   // test icon upload
window.BKK._saveCityGeneralField   // test Firebase write directly
```

---

### 🔬 Filter Log (v3.12.31-32)

Floating badge 🔬 after route generation (debug mode only). Per-interest: passed ✅ / filtered ❌ with reason + Google Maps links. `addToFilterLog()` in app-logic.js. `clearDebugSessions()` clears it.

---

### 🐛 Debug Tab (v3.12.34-39)

Settings → 🐛 דיבאג (visible only when `debugMode === true`).
`DebugTab` component in `quick-add-component.js` at ~21KB (safe zone).
Category filter, sessions list, 🚩 flagging, Claude Bridge.
`buildClaudeContext()` + `askClaude()` in app-logic.js at ~115KB.

**CRITICAL — debugModeRef initialization:**
```js
// CORRECT — reads localStorage directly, true before any useEffect fires:
const debugModeRef = useRef(localStorage.getItem('foufou_debug_mode') === 'true');
// WRONG: const debugModeRef = useRef(debugMode);  ← ref not updated before early useEffects
```

---

### 🏙️ City Icons — Save & Load Fixed (v3.12.40-47)

**Bug 1 — Save:** The `async` file handler calling `saveCityGeneralField` was itself at 533KB → broken.
Fix: extracted full logic to `handleCityIconUpload` in app-logic.js. Call site is one-liner:
```jsx
onChange={(e) => handleCityIconUpload(e.target.files?.[0], city.id, 'icon', 80)}
```

**Bug 2 — Load:** City general load was AFTER `return () => locationsRef.off(...)` in the
locations useEffect. `return` exits the function — load never ran when Firebase was available.
Fix: moved BEFORE the return:
```js
// CORRECT order inside the locations useEffect:
database.ref(`cities/${selectedCityId}/general`).once('value').then(s => { ... apply data ... });
return () => locationsRef.off('value', onValue);  // cleanup must be LAST
```

---

### 🗑️ Dead Code Removed (v3.12.42)

6 unused functions deleted: `auditAndFixUrls`, `getButtonStyle`, `handleImageUpload`,
`isStopDisabledRef`, `toggleInterest`, `validateStartPoint`

---

## 🗂️ קבצי המקור

```
config.js               <- Firebase config, mapConfig, cityRegistry, city loading
utils.js                <- Pure functions: GPS, distance, compression, speech, emoji
app-logic.js            <- React state, Firebase sync, route generation, ALL Firebase write functions
views.js                <- JSX views: wizard, route results, active trail, settings, maps
dialogs.js              <- JSX dialogs: addLocation, toast, confirm, reviews
quick-add-component.js  <- QuickAddPlaceDialog + DebugTab (standalone, before Babel limit)
i18n.js                 <- Translations he/en
city-bangkok.js / city-telaviv.js / city-singapore.js / city-malaga.js

Generated (DO NOT EDIT):
  app-data.js  (~200KB)   app-code.js  (~946KB)   index.html  (~11KB)
```

---

## Build & Verify — MANDATORY AFTER EVERY CHANGE

```bash
cd /home/claude/project

# 1. Build (concatenates sources + pre-compiles JSX → plain JS → minified)
python3 build.py

# 2. Balance check — run on SOURCE files (not compiled app-code.js)
python3 -c "
import re, sys
def strip(code):
    lines = code.split('\n'); result = []; skip = 0
    for line in lines:
        s = line.strip()
        if skip > 0:
            skip += s.count('{') + s.count('(') + s.count('[')
            skip -= s.count('}') + s.count(')') + s.count(']')
            if skip <= 0: skip = 0
            continue
        if re.match(r'\s*console\.(log|warn|info)\s*\(', s):
            o = s.count('(') + s.count('{') + s.count('[')
            c2 = s.count(')') + s.count('}') + s.count(']')
            if o > c2: skip = o - c2
            continue
        if s.startswith('//') and not s.startswith('// __INSERT') and not s.startswith('// ==='): continue
        result.append(line)
    return '\n'.join(result)
template = open('_app-code-template.js').read()
qa = open('quick-add-component.js').read()
al = strip(open('app-logic.js').read())
v = strip(open('views.js').read())
d = strip(open('dialogs.js').read())
raw = template.replace('// __INSERT_QUICK_ADD_COMPONENT__', qa).replace('// __INSERT_APP_LOGIC__', al).replace('// __INSERT_VIEWS__', v).replace('// __INSERT_DIALOGS__', d)
p=raw.count('(')-raw.count(')'); b=raw.count('{')-raw.count('}'); k=raw.count('[')-raw.count(']')
print(f'Balance: () {p:+d}  {{}} {b:+d}  [] {k:+d}')
assert p==0 and b==-3 and k==-2, 'FAIL'
print('OK')
"
# BASELINE (source): () +0  {} -3  [] -2
# Per-file: app-logic.js () -3  {} +0  [] +0
#           views.js     () +1  {} -3  [] -2
#           dialogs.js   () +0  {} +0  [] +0
#           quick-add    () +0  {} +0  [] +0
# NOTE: compiled app-code.js shows () -1 — that's Babel/Terser transform artefact, normal.

# 3. Parse check
node -e "const window={BKK:{}}; const localStorage={getItem:()=>null}; eval(require('fs').readFileSync('app-data.js','utf8')); console.log('OK')" 2>&1 | grep -v CONFIG | grep -v I18N

# 4. Babel safety — check SOURCE files (compiled output has no JSX anyway)
python3 -c "
import re
with open('app-code.js') as f: c = f.read()
jsx = len(re.findall(r'<[A-Z][A-Za-z]+[\s/>]', c))
print(f'JSX tags in compiled output: {jsx}  (must be 0)')
assert jsx == 0, 'FAIL — compile step did not run'
print('OK')
"
```

---

## Version Bump + Package — MANDATORY FOR EVERY ZIP

> **Z — Patch** (default): bug fix, small UI, refactor
> **Y — Minor**: new feature, algorithm change, new city, Firebase structure change
> **X — Major**: Eitan decides only

```bash
sed -i "s/VERSION = '3.13.0'/VERSION = '3.14.0'/" config.js
python3 build.py
zip github-upload-vX_Y_Z.zip \
  index.html app-data.js app-code.js \
  i18n.js config.js utils.js app-logic.js views.js dialogs.js \
  quick-add-component.js \
  city-bangkok.js city-telaviv.js city-singapore.js city-malaga.js \
  _source-template.html _app-code-template.js build.py compile.js README.md .nojekyll \
  CLAUDE_CONTEXT.md manifest.json favicon.ico version.json \
  icon-16x16.png icon-32x32.png icon-180x180.png icon-192x192.png icon-512x512.png \
  firebase-rules.json package.json
```

---

## SECURITY

**GOOGLE_PLACES_API_KEY:** `AIzaSyCE598tSisniM66ApqRvOyOq4svTf6pLHc`
- Restriction: `https://eitanfisher2026.github.io/*` only, Places API (New) only

---

## CRITICAL RULES — Never Break

### Build Pipeline (v3.14.0+)
- `app-code.js` shipped to browser is **pre-compiled plain JS** — no JSX, no browser Babel
- Browser Babel CDN is **removed**. Do NOT add it back.
- Balance check runs on **source files**, not compiled `app-code.js`
- If `node_modules/` is missing → run `npm install` in project dir before building

### Source Code Discipline (500KB rule still applies to source)
- No `database.ref().set/update/remove()` in `views.js`/`dialogs.js`
- No multi-line `async` handlers in `views.js`/`dialogs.js`
- All Firebase writes → named function in `app-logic.js`
- `debugModeRef = useRef(localStorage.getItem('foufou_debug_mode') === 'true')`

### DRY — No Duplicate Logic
- **Never manage the same logic in two places.** If two code paths do the same calculation, extract a shared function and call it from both.
- Example: `buildInterestLimits(interests, maxTotal)` — called from both `smartSelectStops` and route generation. A change in one must not require a change in the other.
- When fixing a bug, always ask: "is this logic duplicated anywhere else?" If yes — refactor first.

### Syntax
- Single quotes in JSX = Babel error → always double quotes
- `const` → `let` when reassigning
- `window.BKK.i18n.t()` does not exist → use `t('key')` or `window.t('key')`
- Hooks at component level only — never inside IIFE or conditionals

### Firebase
- `firebaseId` (not `firebaseKey`)
- After write → update local React state immediately (optimistic)
- `sanitizeMapsUrl()` before every location save
- `googlePlaceId` validation: `/^(ChIJ|EiI|GhIJ)/`
- Never hardcode IDs to Firebase

### Icons
- Interest icons: `compressIcon(file, 64, 2)` — 64px, max 2KB
- City main icon: `compressIcon(file, 80, 15)` — 80px, max 15KB
- City iconLeft/Right: `compressIcon(file, 64, 15)` — 64px, max 15KB
- Never save data: URLs to city JS files
- Render: `icon?.startsWith('data:') ? <img src={icon}> : icon`

---

## Architecture — Build Pipeline

```
Step 1 — python3 build.py (concatenate + strip console.logs):
  _app-code-template.js
    + quick-add-component.js  (QuickAddPlaceDialog + DebugTab)
    + app-logic.js            (state + logic + ALL Firebase writes)
    + views.js                (JSX renders)
    + dialogs.js              (JSX dialogs)
    = app-code.js  [JSX source, ~950KB]

  _source-template.html + i18n.js + city-*.js + config.js + utils.js = app-data.js

Step 2 — node compile.js (called automatically by build.py):
  app-code.js [JSX ~950KB]
    → Babel transform (JSX → plain JS, ~900KB)
    → Terser minify (mangle:false)
    = app-code.js [plain JS, ~637KB, shipped to browser]

Browser loads:
  app-code.js  → plain JS, no Babel needed, direct script inject
  NO browser-side Babel (removed in v3.14.0 — was causing 500KB deoptimisation)
```

**compile.js rules:**
- `mangle: false` — NEVER change. Mangling breaks React hooks + `window.BKK.*` references
- `drop_console: false` — keep console.log for runtime debug
- `unused: false` — don't remove functions terser thinks are unused (may be called from HTML/eval)
- Requires: `node_modules/` present (run `npm install` if missing, package.json is in the zip)

---

## Firebase Structure

```
cities/{cityId}/locations/{id}         <- favorites
cities/{cityId}/routes/{id}            <- saved routes
cities/{cityId}/reviews/{namePK}/{uid} <- ratings
cities/{cityId}/interestCounters/{id}  <- counters
cities/{cityId}/general/icon           <- emoji or data: URL
cities/{cityId}/general/iconLeft       <- emoji or data: URL
cities/{cityId}/general/iconRight      <- emoji or data: URL
cities/{cityId}/general/name           <- Hebrew name
cities/{cityId}/general/nameEn         <- English name
cities/{cityId}/general/color          <- header color
cities/{cityId}/general/dayStartHour
cities/{cityId}/general/nightStartHour

customInterests/{fbKey}: id, label, labelEn, icon (max 2KB)
settings/interestConfig/{id}: types, textSearch, blacklist, bestTime, routeSlot,
  weight, minStops, maxStops, minGap, dedupRelated, noGoogleSearch
settings/interestStatus/{id}
settings/cityHiddenInterests/{cityId}  <- array of hidden interest IDs
settings/systemParams
users/{uid}/interestStatus/{id}
users/{uid}/role  (0=regular, 1=editor, 2=admin)
helpContent/{sectionId}/{lang}
accessLog/{id}, feedback/{id}
```

---

## cityRegistry

```js
bangkok:   { id: 'bangkok',   file: 'city-bangkok.js' }
telaviv:   { id: 'gushdan',   file: 'city-telaviv.js' }   // NOTE: registry=telaviv, firebase=gushdan
singapore: { id: 'singapore', file: 'city-singapore.js' }
malaga:    { id: 'malaga',    file: 'city-malaga.js' }
```

---

## Central State

| State | Description |
|-------|-------------|
| `customInterests` | all interests — real-time listener only |
| `interestConfig` | search settings per interest |
| `cityHiddenInterests` | `{ cityId: Set<id> }` |
| `route` | current route |
| `formData` | wizard form state |
| `activeTrail` | active trail during walk |
| `customLocations` | favorites (cityId, firebaseId) |
| `systemParams` | admin params |
| `cityEditCounter` | force header re-render after city mutation |
| `debugMode` | debug on/off (localStorage: `foufou_debug_mode`) |
| `debugSessions` | debug session log |
| `filterLog` | filter log per interest |

### Loading Order
1. Promise.all: `interestConfig + interestStatus` → app shows
2. `customInterests` — real-time listener
3. `locations + routes` — background
4. `cities/{cityId}/general` — on city switch, inside locations useEffect, **before** `return () => cleanup`

---

## systemParams (defaults)

```js
maxStops:10, fetchMoreCount:3, googleMaxWaypoints:12, defaultRadius:500,
toastDuration:4000, includeDrafts:true, dedupRadiusMeters:50,
dedupGoogleEnabled:1, dedupCustomEnabled:1, trailTimeoutHours:8,
defaultInterestWeight:3, maxContentPasses:3, contentReorderEnabled:true,
twoOptMaxPasses:20, timeScoreMatch:2, timeScoreAnytime:1, timeScoreConflict:0,
timeConflictPenalty:3, slotEarlyThreshold:0.4, slotLateThreshold:0.6,
slotEndThreshold:0.7, slotPenaltyMultiplier:3, slotEndPenaltyMultiplier:4,
gapPenaltyMultiplier:2, speechMaxSeconds:15, speechRate:1.0,
favoriteBaseScore:20, favoriteBonusPerStar:5, favoriteLowRatingThreshold:2.5,
favoriteLowRatingPenalty:60, googleMinRatingCount:20, googleLowRatingCount:60
```

---

## Route Algorithm

Phase 0: smartSelectStops → buckets per interest → sort by score → top N
Phase 1: Nearest Neighbor
Phase 2: 2-opt improvement
Phase 3: Content-aware reorder (slot positioning)
Phase 4: Auto-reoptimize debounce 600ms

## Google Places API

Two modes: Nearby Search (`types:[...]`) / Text Search (`textSearch:"..."`)

Filtering: Blacklist → Relevance → Type → Distance → UserBlacklist → Dedup

**ABSOLUTE RULE:** `const url = window.BKK.getGoogleMapsUrl(place)` — never build manually.

---

## Shared Functions

| Need | Function |
|------|----------|
| Google Maps URL | `window.BKK.getGoogleMapsUrl(place)` |
| Compress image | `window.BKK.compressImage(input, maxSizeKB)` |
| Compress icon | `window.BKK.compressIcon(input, maxSize, maxKB)` |
| Interest color | `window.BKK.getInterestColor(id, allInterests)` |
| GPS | `window.BKK.getValidatedGps(onSuccess, onError)` |
| Sanitize URL | `sanitizeMapsUrl(loc)` (app-logic.js) |
| Speech | `window.BKK.startSpeechToText(options)` |
| Debug log | `addDebugLog(category, message, data)` (app-logic.js) |

---

## i18n

```js
t('section.key')         // correct
window.t('key')          // correct (global)
window.BKK.i18n.t(...)   // DOES NOT EXIST
```

---

## localStorage Keys

`city_explorer_city`, `city_explorer_lang`, `city_active_states`,
`foufou_active_trail`, `foufou_visitor_id`, `foufou_debug_mode`,
`foufou_fab_pos`, `foufou_right_col_width`, + migration flags

---

## One-Time Migrations

| Key | What |
|-----|------|
| `restore_culture_shopping_v125` | restore culture/shopping |
| `labels_migrated_to_customInterests_v1211` | labelOverride → customInterests |
| `icons_migrated_to_customInterests_v1217` | iconOverride → customInterests.icon |
| `interest_ids_migrated_v1213` | all IDs → i_ prefix |
| `cityOverrides_interests_cleaned` | remove interests from cityOverrides |
| `cityHidden_cleaned_v124` | remove orphan IDs |
| `interestConfig_orphans_cleaned_v1219` | remove orphan configs |
| `city_icons_migrated_v1221` | cityOverrides/theme → cities/{id}/general/ |
| `city_icons_to_general_v1223` | root icon fields → general/ |
| `city_general_migrated_v1225` | dayStart/nightStart/color → general/ |
| `city_general_completed_v1228` | fill missing name/icon for all cities |

---

## Known Regressions — Must Never Return

1. Duplicate compressImage — one in utils.js only
2. `window.BKK.i18n.t()` — doesn't exist
3. Hooks inside IIFE — React error #310
4. Firebase key in googlePlaceId — validate `/^(ChIJ|EiI|GhIJ)/`
5. Reviews not deleted with location
6. `const` on reassigned variable
7. Single quotes in JSX
8. Icon rendered as raw text — always `startsWith('data:') ? <img> : icon`
9. `noGoogleSearch` not saved to customInterests
10. Hardcoded IDs patched to Firebase
11. **Firebase write in views.js/dialogs.js** — always extract to app-logic.js (source discipline, browser Babel no longer the enforcer)
12. **כפתור סגירה ✕** — חייב תמיד להיות בפינה **שמאלית** עליונה בעברית RTL, ובפינה **ימנית** עליונה באנגלית LTR. חל על כל דיאלוג, פופאפ, bottom sheet, ו-modal. טכניקה: DOM order [FouFou/first-element][content][X] + `direction: isRTL ? 'rtl' : 'ltr'` על הcontainer → X תמיד בצד הנכון אוטומטית.
12. **City general load after `return () => cleanup`** — must be BEFORE
13. **`debugModeRef = useRef(debugMode)`** — must be `useRef(localStorage...)`

---

## Debug Console Prefixes

```
[CONFIG] [UTILS] [GPS] [DYNAMIC] [SMART] [OPTIMIZE]
[FIREBASE] [AUTH] [RATING-REFRESH] [STORAGE] [EXIF]
[SYNC] [MIGRATION] [MAP] [CLEANUP]
[CITY-SAVE] [CITY-ICON] [CITY-LOAD] [SETTINGS-SAVE] [DIALOG-SAVE]
```
