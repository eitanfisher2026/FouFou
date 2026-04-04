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

- **גרסה:** `3.17.9` (Apr 04, 2026)
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
# Replace X.Y.Z with current version:
sed -i "s/VERSION = 'OLD'/VERSION = 'NEW'/" config.js
sed -i 's/"version": "OLD"/"version": "NEW"/' version.json
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
| `interestDialogReadOnly` | true when interest dialog opened in view-only mode (regular user) |
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
14. **`window.BKK.i18n?.lang?.()`** — `lang` is NOT a function. Always use `window.BKK.i18n?.currentLang` instead.
15. **`radiusPlaceName` used for "My location" display** — when `radiusSource === 'gps'`, always use `t('wizard.myLocation')` at render/build time, never the stored string (which was saved in the previous language).
16. **Map tile URL consistency** — ALL maps MUST use `window.BKK.getTileUrl()`. NEVER hardcode tile URLs directly.
17. **Interest grid — `gridColumn:'1/-1'` FORBIDDEN inside grid:** Separator divs with `gridColumn:'1/-1'` inside CSS Grid cause Samsung/Android touch events to misfire (blink/no-select). Wizard step 1 interest grid MUST be a flat grid with NO spanning elements. Also: always use functional updater `setFormData(prev => {...})` for toggles — stale closure causes double-fire on Samsung/Pixel (see Stale Closure section).

---

## שינויים מרכזיים — סשן Apr 04, 2026 (v3.17.0→3.17.1) — הכנה לGoogle Play + About dialog

### קבצים חדשים
- **`sw.js`** — Service Worker עם network-first strategy. חובה ל-TWA (Google Play). build.py מעדכן `CACHE_NAME` אוטומטית בכל גרסה.
- **`privacy.html`** — Privacy Policy מלא, נדרש לGoogle Play ולApple.

### שינויים ב-index.html / _source-template.html
- `apple-mobile-web-app-title`: "BKK Explorer" → **"FouFou"**
- הוסף רישום Service Worker לפני `</body>`

### manifest.json — שדות שנוספו לחנות
`id`, `scope`, `lang`, `categories: ["travel","navigation"]`

### About Dialog (app-logic.js + views.js + dialogs.js)
- State חדש: `aboutContent {he,en}`, `showAbout`, `aboutEditing`, `aboutLocalText`
- `aboutContent` נטען מ-`settings/aboutContent` בFirebase
- `saveAboutContent(text)` — שומר + מתרגם אוטומטית לשפה השנייה
- כפתור ℹ️ **אודות** בהמבורגר — גלוי לכולם
- דיאלוג About: טקסט, עריכה לאדמין, תרגום אוטומטי, קישור לאתר, גרסה+refresh לאדמין בלבד
- **חשוב:** useState אסור בתוך IIFE — כל state חייב להיות ב-app-logic.js

### Footer — נוקה
- גרסה + refresh → גלויים לאדמין בלבד
- Share URL: `https://eitanfisher2026.github.io/FouFou/` (לא github.com, לא window.location)
- `navigator.share` עובד גם על iPhone (iOS 12.1+)

### i18n — נוספו מפתחות
`about.title`, `about.edit`, `about.cancel`, `about.saveTranslate`, `about.placeholder`, `about.noContent` — בעברית ואנגלית

### build.py — sw.js version update
build.py מעדכן `CACHE_NAME = 'foufou-vX.Y.Z'` בכל build אוטומטית.

### כלל חדש — גרסה!
**חובה לבמוף גרסה לפני build + zip.** לא אחרי. לא לשכוח. הסדר:
1. `sed -i "s/VERSION = 'OLD'/VERSION = 'NEW'/" config.js`
2. `sed -i 's/"version": "OLD"/"version": "NEW"/' version.json`
3. `python3 build.py`
4. `zip ...`

---

## שינויים מרכזיים — סשן Apr 04, 2026 (v3.16.25) — אופטימיזציה ותיקוני אבטחה

### 1. loadReviewAverages — קריאה אחת במקום N (app-logic.js)
**לפני:** לולאת `for` עם `await database.ref(...).once()` לכל מקום — N קריאות sequential.
**אחרי:** קריאה אחת ל-`cities/${cityId}/reviews` וסינון בצד לקוח.
```js
// WRONG — N sequential Firebase reads
for (const name of placeNames) {
  const snap = await database.ref(`cities/${cityId}/reviews/${placeKey}`).once('value');
}
// CORRECT — single read, client-side filter
const snap = await database.ref(`cities/${cityId}/reviews`).once('value');
const allReviews = snap.val() || {};
```

### 2. settings listener cleanup (app-logic.js)
הוספת `return () => settingsRef.off('value')` ל-useEffect. ה-listener נפתח עם `[]` ולכן רץ פעם אחת, אבל ללא cleanup עלול לדלוף אם בעתיד ה-component ימחזר.
```js
const settingsRef = database.ref('settings');
settingsRef.on('value', handler);
return () => settingsRef.off('value'); // ← הוספה
```

### 3. saveNewInterest — batch write (app-logic.js)
**לפני:** 4+ כתיבות נפרדות לפיירבייס.
**אחרי:** `database.ref().update(batch)` אחד.

### 4. helpAudio — batch write (app-logic.js)
`database.ref().update({ helpAudio/key, helpAudioDuration/key })` במקום 2 `.set()`.

### 5. refreshAllGoogleRatings — chunks במקום sequential (app-logic.js)
**לפני:** לולאת for עם 200ms delay — 200 מקומות = ~40 שניות.
**אחרי:** `Promise.all` על chunks של 5, 300ms בין chunks — ~5× מהיר יותר.
```js
const CHUNK_SIZE = 5;
for (let i = 0; i < candidates.length; i += CHUNK_SIZE) {
  await Promise.all(chunk.map(async (loc) => { ... }));
  await new Promise(r => setTimeout(r, 300)); // between chunks
}
```

### 6. fetchAccessStats — הועבר מ-views.js ל-app-logic.js
קריאה ישירה ל-`db.ref('accessStats')` ב-views.js הוחלפה בפונקציה `fetchAccessStats(onResult)` ב-app-logic.js.
כלל: **כל קריאה לפיירבייס — רק ב-app-logic.js.**

### 7. Single quotes ב-JSX תוקנו (views.js)
`title='...'` → `title="..."` — מניעת פוטנציאל Babel error.

### 8. radiusPlaceName — תצוגת GPS (views.js)
כשה-radiusSource הוא `'gps'`, מוצג `t('wizard.myLocation')` במקום ה-string השמור (שעשוי להיות בשפה הישנה).

### 9. setFormData — functional updater בכל מקום (views.js)
4 מקומות שהשתמשו ב-`setFormData({...formData,...})` הוחלפו ב-`setFormData(prev => ({...prev,...}))`.
**כלל:** כל `setFormData` שתלוי ב-state קודם חייב functional updater — מונע stale closure על Samsung/Pixel.

### 10. console.warn/log inline — תוקנו (app-logic.js)
3 `console.warn/log` ב-inline context שלא נתפסו ע"י ה-stripper הועברו לשורות נפרדות כדי שיסוננו ב-build.

---

## 🏗️ עקרונות פיתוח — חשובים לאיתן

### אחידות (Consistency)
- כל כתיבה ל-Firebase → app-logic.js בלבד. אין יוצאות דופן.
- כל `setFormData` שמשתמש ב-state קודם → functional updater `prev => ({...prev,...})`.
- כל `L.tileLayer()` → `window.BKK.getTileUrl()`.
- כל `t('key')` → דרך i18n, לא hardcoded strings.

### שימוש חוזר (DRY)
- לפני שכותבים לוגיקה חדשה — בדוק אם קיימת פונקציה ב-app-logic.js.
- `buildInterestLimits` — משותף ל-smartSelectStops ולגנרציית route.
- `sanitizeMapsUrl` — לפני כל שמירת location.
- `saveBulkUpdate(batch)` — לכל multi-path Firebase write.

### זמן הכי קצר לעלייה (Fast Startup)
- App מוצגת אחרי `interests + config + status` בלבד (לא מחכה ל-locations/routes).
- Leaflet נטען lazy — רק כשפותחים מפה, עם 2s delay.
- Firebase נטען non-blocking דרך `window.__firebaseReady`.
- Splash SVG inline ב-HTML — מוצג תוך <100ms.
- **אל תוסיף קריאות Firebase ל-startup flow** — הכל ב-background.

### אופטימיזציה Firebase
- **Batch ראשון:** כמה שיותר שינויים — batch אחד עם `database.ref().update({})`.
- **Listener cleanup:** כל `ref.on('value', ...)` חייב `return () => ref.off()`.
- **קריאות מינימליות:** אחת ל-parent node, סינון client-side — לא N קריאות ל-children.
- **Optimistic updates:** עדכן state מיד, שלח Firebase ברקע.
- **7-day cache:** googleRatingUpdated — לא מרענן אם עודכן לאחרונה.

### אופטימיזציה Google Places API
- **FieldMask מדויק:** רק שדות נחוצים — לא photos, website, וכו'.
- **Place Details ($0.005) לפני Text Search ($0.032)** — כשיש googlePlaceId.
- **Promise.all על כל הinterests** — parallel, לא sequential.
- **googleCacheRef** — שמור תוצאות עודפות בין "הצג עוד" לגנרציה הבאה.
- **Chunks×5** ב-refreshAllGoogleRatings — parallel עם 300ms בין chunks.
- **לא לבקש photos** — עולה הרבה יותר ב-billing.

### אבטחה
- **Google Places API Key:** מוגבל ל-`https://eitanfisher2026.github.io/*` בלבד.
- **Firebase Rules:** כל כתיבה דורשת `auth != null`. Settings/interestConfig דורשים role≥2.
- **googlePlaceId validation:** `/^(ChIJ|EiI|GhIJ)/` לפני כל שמירה — מונע זיהום עם Firebase keys.
- **`sanitizeMapsUrl()`** לפני כל שמירת location.
- **אל תוסיף API keys ל-source** — הם בclient side ומוגנים ע"י domain restriction.

---

## שינויים מרכזיים — סשן Apr 03, 2026 (v3.10–v3.16.23)

### 1. Interest grid — באג עיקרי שנפתר (v3.16.7)
**Root cause:** `useEffect` של ניקוי interests רץ בכל פעם ש-`interestConfig` התעדכן מ-Firebase. כשמשתמש לחץ על תחום, `setFormData` נקרא, ואז Firebase החזיר snapshot → `setInterestConfig` → `useEffect` → `isInterestValid()` החזיר false (כי config לא מלא עדיין) → התחום נמחק. נראה כ-"blink".

**למה לאדמין עבד:** ל-admin יש hint button נוסף בכותרת (`renderStepHeader`) — לחיצה שנייה של Samsung נחתה עליו במקום על התחום.

**הפתרון:** הסרת `useEffect` הניקוי לחלוטין. אם משתמש החליף עיר → `switchCity` מנקה interests מ-formData ו-localStorage. אין צורך בניקוי ברקע.

```js
// app-logic.js — switchCity clears saved interests:
try { ['day','night','all'].forEach(m => localStorage.removeItem(`foufou_interests_${m}`)); } catch(e) {}
```

### 2. allInterestOptions — מיון אחיד (v3.16.15)
`allInterestOptions` ממוין פעם אחת ב-`useMemo` לפי group order ואז אלפביתי. כל הצרכנים (wizard, dialogs, settings, filter panel, quick-add) מקבלים סדר אחיד אוטומטית — אין לוגיקת מיון נפרדת בשום קובץ.

```js
// app-logic.js — sort in useMemo:
return mapped.sort((a, b) => {
  const ga = groupOrderMap[a.group || ''] ?? 99;
  const gb = groupOrderMap[b.group || ''] ?? 99;
  if (ga !== gb) return ga - gb;
  return la.localeCompare(lb, sortLocale);
});
```

### 3. הרשאות — כלל מרכזי
**רק אדמין נכנס להגדרות** — הבדיקה נעשית בשער הכניסה. **אין** בדיקות `isAdmin`/`isUnlocked` בתוך מסכי ההגדרות עצמם.

**יוצא דופן:** ברשימת תחומים תחת המבורגר (לא הגדרות):
- משתמש רגיל: כפתור 👁️ לצפייה בלבד
- Editor/Admin: כפתור ✏️ עריכה + כפתור "הוסף תחום"

### 4. Settings interests tab — מבנה
שני בלוקים נפרדים עם `{settingsTab === 'interests' && ...}`:
1. **List** (`renderInterestSettingsRow`) — רשימת כל התחומים עם ניהול
2. **Groups** (`📂 קיבוץ תחומים`) — אחרי הרשימה

**חשוב:** אל תעטוף את שניהם ב-IIFE אחת. כל בלוק עצמאי.

### 5. שינויים נוספים בסשן
- **Filter button:** "סינון" → "סינון/חיפוש" (i18n.js)
- **Filter panel icons:** קטנו מ-22px ל-16px
- **Place search outside area:** בחירת מקום מחוץ לאזור פתוח → מנקה `mapFavArea` לכל העיר
- **Bottom margin wizard step 1:** `calc(72px + env(safe-area-inset-bottom, 0px))` כשיש תחומים נבחרים

### 6. Known Regression #17 — עדכון
`gridColumn:'1/-1'` בתוך CSS Grid **אסור** בgrid התחומים של wizard step 1 — גורם לmisfire של touch events על Samsung/Android.

גם: תמיד להשתמש ב-functional updater לכל `setFormData` שתלוי בstate קודם (ראה סעיף Stale Closure).

---

## Debug Console Prefixes

```
[CONFIG] [UTILS] [GPS] [DYNAMIC] [SMART] [OPTIMIZE]
[FIREBASE] [AUTH] [RATING-REFRESH] [STORAGE] [EXIF]
[SYNC] [MIGRATION] [MAP] [CLEANUP]
[CITY-SAVE] [CITY-ICON] [CITY-LOAD] [SETTINGS-SAVE] [DIALOG-SAVE]
```

---

## Map Tile Architecture

**כלל ברזל:** כל קריאה ל-`L.tileLayer()` חייבת להשתמש ב-`window.BKK.getTileUrl()`.

```js
// ✅ CORRECT — always this pattern:
L.tileLayer(window.BKK.getTileUrl(), { attribution: '© OpenStreetMap contributors', maxZoom: 18 }).addTo(map);

// ❌ WRONG — never hardcode:
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', ...) // shows Thai/Hebrew
```

`getTileUrl()` מוגדר ב-`config.js` → מחזיר Carto Voyager (English labels).
7 מפות באפליקציה — כולן חייבות לקרוא `getTileUrl()`: areas/radius/stops/favorites/settings-fullscreen + 2 mini-maps ב-views.js.

---

## Stale Closure Bug — Critical Pattern

**Discovered in v3.15.21** — caused interest grid to blink and not select on Samsung S25 Ultra and Google Pixel.

**The bug:** Using `setFormData({...formData, interests: newInterests})` inside an `onClick` creates a stale closure. On high-performance Android devices, the browser fires the click event **twice** before React re-renders. Both firings read the same stale `formData` from the closure, causing the state to be set and then immediately overwritten.

**The fix — always use functional updater when new state depends on previous state:**
```js
// ❌ WRONG — stale closure, breaks on Samsung/Pixel double-fire
onClick={() => {
  const newInterests = isSelected
    ? formData.interests.filter(id => id !== option.id)
    : [...formData.interests, option.id];
  setFormData({...formData, interests: newInterests});
}}

// ✅ CORRECT — functional updater, always gets latest state
onClick={() => {
  setFormData(prev => {
    const alreadySelected = prev.interests.includes(option.id);
    const newInterests = alreadySelected
      ? prev.interests.filter(id => id !== option.id)
      : [...prev.interests, option.id];
    return {...prev, interests: newInterests};
  });
}}
```

**Rule:** Any `setFormData` call whose new value depends on the current value MUST use the functional updater form `setFormData(prev => {...})`. This applies to ALL toggles, array push/filter, and counter increments anywhere in the app.
