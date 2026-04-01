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

- **גרסה:** `3.15.0` (Apr 01, 2026)
- **Live:** https://eitanfisher2026.github.io/FouFou/
- **Working dir:** `/home/claude/project/` (extract zip here)
- **Tagline:** Local picks + Google spots. Choose your vibe, follow the trail

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
  app-data.js  (~200KB)   app-code.js  (~984KB)   index.html  (~11KB)
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

# 3. Babel safety — check compiled output has no JSX
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
sed -i "s/VERSION = '3.15.0'/VERSION = '3.15.1'/" config.js
sed -i 's/"version": "3.15.0"/"version": "3.15.1"/' version.json
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

### Build Pipeline
- `app-code.js` shipped to browser is **pre-compiled plain JS** — no JSX, no browser Babel
- Browser Babel CDN is **removed**. Do NOT add it back.
- Balance check runs on **source files**, not compiled `app-code.js`
- If `node_modules/` is missing → run `npm install` in project dir before building
- `compile.js`: `mangle: false` — NEVER change. Mangling breaks React hooks + `window.BKK.*`

### Source Code Discipline (500KB rule — source files)
- No `database.ref().set/update/remove()` in `views.js`/`dialogs.js`
- No multi-line `async` handlers in `views.js`/`dialogs.js`
- All Firebase writes → named function in `app-logic.js`
- `debugModeRef = useRef(localStorage.getItem('foufou_debug_mode') === 'true')` ← not `useRef(debugMode)`

### DRY — No Duplicate Logic
- Never manage the same logic in two places. Extract shared functions.
- Example: `buildInterestLimits(interests, maxTotal)` — called from both `smartSelectStops` and route generation.
- When fixing a bug, always ask: "is this logic duplicated anywhere else?"

### Scope — CRITICAL (learned the hard way)
- **Variables declared with `const`/`let` inside `if/else` blocks are block-scoped** — not accessible outside.
- In `fetchGooglePlaces`: `textSearchBodyStr`, `nearbySearchBodyStr`, `_maxRC` are declared **outside** the `if (textSearchQuery)` / `else` block so both paths and subsequent `addToFilterLog` can access them.
- Pattern: declare `let x = null` before the if/else, assign inside.
- `typeof x !== 'undefined'` does NOT work as a workaround for out-of-scope `const` — never use it.

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
    = app-code.js  [JSX source, ~984KB]

  _source-template.html + i18n.js + city-*.js + config.js + utils.js = app-data.js

Step 2 — node compile.js (called automatically by build.py):
  app-code.js [JSX ~984KB]
    → Babel transform (JSX → plain JS)
    → Terser minify (mangle:false)
    = app-code.js [plain JS, ~657KB, shipped to browser]

Browser loads:
  app-code.js  → plain JS, no Babel needed, direct script inject
```

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
settings/interestGroups/{id}: { labelHe, labelEn, order }
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
| `interestGroups` | `{ groupId: { labelHe, labelEn, order } }` |
| `cityHiddenInterests` | `{ cityId: Set<id> }` |
| `route` | current route |
| `formData` | wizard form state |
| `activeTrail` | active trail during walk |
| `customLocations` | favorites (cityId, firebaseId) |
| `systemParams` | admin params (synced to `window.BKK.systemParams`) |
| `filterLog` | filter log per interest (debug mode only) |
| `debugMode` | debug on/off (localStorage: `foufou_debug_mode`) |

### Loading Order
1. Promise.all: `interestConfig + interestStatus` → app shows
2. `customInterests` — real-time listener
3. `locations + routes` — background
4. `cities/{cityId}/general` — on city switch, inside locations useEffect, **before** `return () => cleanup`

---

## systemParams (defaults in app-logic.js)

```js
maxStops: 10, fetchMoreCount: 3, googleMaxWaypoints: 12, defaultRadius: 500,
toastDuration: 4000, includeDrafts: true, dedupRadiusMeters: 50,
dedupGoogleEnabled: 1, dedupCustomEnabled: 1, trailTimeoutHours: 8,
defaultInterestWeight: 3, maxContentPasses: 3, contentReorderEnabled: true,
twoOptMaxPasses: 20, timeScoreMatch: 2, timeScoreAnytime: 1, timeScoreConflict: 0,
timeConflictPenalty: 3, slotEarlyThreshold: 0.4, slotLateThreshold: 0.6,
slotEndThreshold: 0.7, slotPenaltyMultiplier: 3, slotEndPenaltyMultiplier: 4,
gapPenaltyMultiplier: 2, speechMaxSeconds: 15, speechRate: 1.0,
favoriteBaseScore: 20, favoriteBonusPerStar: 5, favoriteLowRatingThreshold: 2.5,
favoriteLowRatingPenalty: 60, googleMinRatingCount: 20, googleLowRatingCount: 60,
googleLocationMode: 'restriction',         // 'restriction' | 'bias'
filteredBusinessStatuses: ['CLOSED_PERMANENTLY', 'CLOSED_TEMPORARILY'],
filterClosedNow: false,
googleMaxResultCount: -1,                  // -1 = don't send (Google decides), positive = send
googleNearbyRankPreference: 'POPULARITY',  // 'POPULARITY' | 'DISTANCE'
googleTextRankPreference: 'RELEVANCE',     // 'RELEVANCE' | 'DISTANCE'
```

---

## Google Places API

### Two search modes
- **Nearby Search** (`places:searchNearby`): uses `includedTypes`, supports `locationRestriction.circle` ✅
- **Text Search** (`places:searchText`): uses `textQuery`, supports:
  - `locationRestriction.rectangle` ✅ (circle NOT supported → HTTP 400)
  - `locationBias.circle` ✅
  - Circle → rectangle conversion: `deltaLat = radius / 111320`, `deltaLng = radius / (111320 * cos(lat * π/180))`

### rankPreference values (different per API!)
- Nearby Search: `POPULARITY` | `DISTANCE`
- Text Search: `RELEVANCE` | `DISTANCE`

### Scope of body variables in fetchGooglePlaces
```js
// CORRECT — declared OUTSIDE if/else so addToFilterLog can access them:
let textSearchBodyStr = null;
let nearbySearchBodyStr = null;
const _maxRC = window.BKK.systemParams?.googleMaxResultCount ?? -1;

if (textSearchQuery) {
  textSearchBodyStr = JSON.stringify(textSearchBody, null, 2);  // assign, not declare
  ...
} else {
  nearbySearchBodyStr = JSON.stringify(nearbySearchBody, null, 2);  // assign, not declare
  ...
}
// addToFilterLog can now use both vars ✅
```

### Filter Log (`addToFilterLog`)
Called for every interest search — success, zero results, error, internal/skipped.
`requestDetails` includes: `mode`, `query`, `types`, `center`, `radius`, `locationMode`, `rawBody` (JSON string of full request body), `googleMapsUrl`.
Debug balloon (bottom-left) shows always when debugMode=true. Orange ⚠️ when any entry has 0 passed AND 0 filtered (Google returned nothing).

---

## Route Algorithm

```
Phase 0: smartSelectStops → buckets per interest → sort by score → top N
Phase 1: Nearest Neighbor (start from startPointCoords or area center)
Phase 2: 2-opt improvement (max twoOptMaxPasses)
Phase 3: Content-aware reorder (slot positioning)
Phase 4: Auto-reoptimize debounce 600ms on disabledStops change
```

### buildInterestLimits(selectedInterests, maxTotal)
Shared function in app-logic.js. Called from both `smartSelectStops` AND route generation. Returns `{ limits, cfg, totalWeight }`.

### Round 3 backfill
After Round 1+2 fill per-interest limits, Round 3 fills remaining slots from ANY interest ignoring per-interest caps (uses full `result.allPlaces` pool).

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
| Filter log | `addToFilterLog({interestId, interestLabel, searchType, ...})` (app-logic.js) |

---

## Firebase Write Functions (all in app-logic.js ~115KB)

```
handleCityIconUpload        saveCityGeneralField      saveSpeechRate
saveLocationLocked          saveInterestAdminStatus   saveInterestAdminStatusAsync
saveSystemParam             resetSystemParams         saveBulkUpdate
clearAccessLog              removeLocationGooglePlaceId  saveCityHiddenInterests
saveInterestCounter         removeInterestConfig      saveInterestConfig
saveInterestGroup           deleteInterestGroup
saveCustomInterestAndConfig saveNewCustomInterest     saveNewInterestStatus
clearFeedbackList           deleteUser                saveNewInterest
```

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
`foufou_fab_pos`, `foufou_right_col_width`,
`foufou_preferences`, `foufou_route_type`, `foufou_time_filter`,
`foufou_debug_sessions`, `foufou_debug_flagged` + migration flags

---

## One-Time Migrations (localStorage flags)

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
5. `const` on reassigned variable
6. Single quotes in JSX
7. Icon rendered as raw text — always `startsWith('data:') ? <img> : icon`
8. **Firebase write in views.js/dialogs.js** — always extract to app-logic.js
9. **City general load after `return () => cleanup`** — must be BEFORE
10. **`debugModeRef = useRef(debugMode)`** — must be `useRef(localStorage...)`
11. **✕ button position** — always top-left in RTL, top-right in LTR. DOM order `[icon][content][✕]` + `direction: isRTL ? 'rtl' : 'ltr'` on container.
12. **Block-scoped vars used across if/else** — `textSearchBodyStr`, `nearbySearchBodyStr`, `_maxRC` must be declared with `let`/`const` OUTSIDE the `if (textSearchQuery)` block.
13. **`locationRestriction.circle` in Text Search** — NOT supported by Google API → HTTP 400. Use `rectangle` for restriction mode, `locationBias.circle` for bias mode.

---

## Debug Console Prefixes

```
[CONFIG] [UTILS] [GPS] [DYNAMIC] [SMART] [OPTIMIZE]
[FIREBASE] [AUTH] [RATING-REFRESH] [STORAGE] [EXIF]
[SYNC] [MIGRATION] [MAP] [CLEANUP]
[CITY-SAVE] [CITY-ICON] [CITY-LOAD] [SETTINGS-SAVE] [DIALOG-SAVE]
```
