## כלל דיבאג — אחרי 3 קומיטים כושלים

> **אם אחרי 3 ניסיונות תיקון הבעיה לא נפתרה — STOP. אל תנחש יותר.**

במקום קומיט נוסף, קלוד חייב לעשות אחד מאלה:

1. **בקש דיבאג אקטיבי** — הוסף `console.log` ממוקדים לקוד, בקש מהמשתמש לפתוח F12 ולשלוח את הפלט. בנה **debug build** עם `python3 build.py --debug` (שומר console.log).

2. **ציין מה חסר לך** — "אני צריך לראות מה מחזיר X בזמן ריצה", "אני צריך לדעת אם Y נקרא בכלל".

3. **הסבר את ההנחות שלך** — "אני מניח ש-X קורה, אם לא — הבעיה היא Y". תן למשתמש לאשש או לסתור.

**אסור:** לבצע קומיט נוסף על בסיס ניחוש בלבד אחרי 3 כישלונות.

**דוגמה אמיתית שקרתה:** תיקון googleRating לקח 8 קומיטים. אחרי הדיבאג הראשון ב-Console ראינו בשורה אחת: `[useEffect] Syncing editingLocation to newLocation` — הבעיה נפתרה מיד. 8 קומיטים היו יכולים להיות 1.

---

# FouFou — City Trail Generator · Claude Development Context

> **לקלוד — חובה לקרוא לפני כל שינוי:**
>
> 1. קרא את כל הקובץ הזה לפני שאתה עושה כל שינוי.
> 2. **עדכן את הקובץ הזה לפני כל zip** — הוסף לסעיף "שינויים מרכזיים" את מה שעשית בסשן הנוכחי.
>    הגרסה והתאריך מתעדכנים אוטומטית ע"י `build.py` — אבל תיאור השינויים חייב להיכתב ידנית.
> 3. ה-zip חייב לכלול את `CLAUDE_CONTEXT.md` המעודכן.
> 4. אל תסמוך על אינטואיציה — המידע כאן הוא הבסיס.

---

## 📍 מצב נוכחי

- **גרסה:** `3.11.31` (Mar 23, 2026)
- **Live:** https://eitanfisher2026.github.io/FouFou/
- **Working dir:** `/home/claude/project/` (extract zip here)
- **Tagline:** Local picks + Google spots. Choose your vibe, follow the trail

---

## 🗂️ קבצי המקור

```
config.js               <- Firebase config, mapConfig, cityRegistry, city loading, visitor tracking
utils.js                <- Pure functions: GPS, distance, colors, image compression, emoji engine, EXIF, speech
app-logic.js            <- React state, Firebase sync, route generation (smart select + optimize), all handlers
views.js                <- JSX views: wizard, route results, active trail, settings, maps
dialogs.js              <- JSX dialogs: addLocation, toast, confirm, reviews, QuickCapture
quick-add-component.js  <- QuickAddPlaceDialog — standalone React component (hooks outside IIFE)
i18n.js                 <- Translations he/en — sections: general, nav, wizard, route, places,
                           trail, toast, settings, sysParams, dedup, import, reviews, auth, map
city-bangkok.js         <- Bangkok city data, interests, areas, system routes

Generated (DO NOT EDIT):
  app-data.js           <- i18n + city data + config + utils (~200KB)
  app-code.js           <- Full JSX app (~838KB)
  index.html            <- Splash shell (~11KB)
```

---

## Build & Verify — MANDATORY AFTER EVERY CHANGE

```bash
cd /home/claude/project

# 1. Build
python3 build.py

# 2. Balance check — MUST match baseline exactly
python3 -c "
with open('app-code.js') as f: c = f.read()
p=c.count('(')-c.count(')'); b=c.count('{')-c.count('}'); k=c.count('[')-c.count(']')
print(f'Balance: () {p:+d}  {{}} {b:+d}  [] {k:+d}')
assert p==0 and b==-3 and k==-2, 'FAIL'
print('OK')
"
# BASELINE: () +0  {} -3  [] -2

# 3. Per-file expected values:
# app-logic.js:           () -3  {} +0  [] +0
# views.js:               () +1  {} -3  [] -2
# dialogs.js:             () +0  {} +0  [] +0
# quick-add-component.js: () +0  {} +0  [] +0
# utils.js / config.js / i18n.js / city-bangkok.js: all () +0 {} +0 [] +0

# 4. Parse check
node -e "const window={BKK:{}}; const localStorage={getItem:()=>null}; eval(require('fs').readFileSync('app-data.js','utf8')); console.log('OK')" 2>&1 | grep -v CONFIG | grep -v I18N
```

---

## Version Bump + Package — MANDATORY FOR EVERY ZIP

> **VERSIONING RULES — read before every zip:**
>
> ### פורמט: `X.Y.Z` — שלושה מספרים בלבד
> אסור: אותיות, סיומות, suffixes.
> WRONG: `3.10.1b`, `3.10.1-fix` — CORRECT: `3.10.2`
>
> ### מה מבדיל X / Y / Z?
>
> **Z — Patch** (ברירת המחדל — הרוב המוחלט של הזיפים)
> - תיקון באג, שיפור UI קטן, הוספת i18n keys
> - refactor ללא שינוי התנהגות, תיקון טקסטים/צבעים/סדר שדות
> - **אם יש ספק — תמיד patch**
> - דוגמה: `3.10.1` → `3.10.2`
>
> **Y — Minor** (פיצ'ר חדש שלם / שינוי התנהגות שמשתמש רגיל שם לב אליו)
> - פיצ'ר חדש שמשתמש (לא רק admin) שם לב אליו
> - שינוי אלגוריתם מרכזי (scoring, routing, dedup)
> - הוספת עיר חדשה לקובץ המקור (city-*.js)
> - שינוי מבנה Firebase שדורש migration
> - patch מתאפס: `3.10.5` → `3.11.0`
>
> **X — Major** (שינוי ארכיטקטורה שבוצע בפועל — נדיר מאוד)
> - שינוי build pipeline — קבצי source חדשים / הסרת קיימים
> - החלפת ספרייה מרכזית (React, Firebase, Leaflet)
> - שינוי מבנה Firebase שדורש שכתוב של חלקים גדולים
> - אייתן מחליט עליו במפורש — **קלוד לא מחליט לבד על major**
> - Y ו-Z מתאפסים: `3.10.5` → `4.0.0`
>
> ### כלל הזהב
> ספק בין patch לminor → **patch**
> ספק בין minor לmajor → **minor**
> Major = החלטה מפורשת של אייתן בלבד
>
> ### לפני כל zip — checkלוסט
> - האם CLAUDE_CONTEXT.md מעודכן? (פונקציות, regressions, אלגוריתמים, i18n)
> - שם הzip תואם גרסה: `github-upload-v3_10_2.zip`

## Version Bump + Package — פקודות

```bash
# 1. Bump version in config.js  (e.g. 3.10.1 -> 3.10.2)
sed -i "s/VERSION = '3\.10\.1'/VERSION = '3.10.2'/" config.js

# 2. Sync version.json
python3 -c "import re; s=open('config.js').read(); v=re.search(r\"VERSION\s*=\s*'([^']+)'\", s).group(1); open('version.json','w').write('{\"version\": \"'+v+'\"}')"

# 3. Build
python3 build.py

# 4. Package
zip github-upload-v3_10_2.zip \
  index.html app-data.js app-code.js \
  i18n.js config.js utils.js app-logic.js views.js dialogs.js \
  quick-add-component.js \
  city-bangkok.js city-gushdan.js city-singapore.js city-malaga.js \
  _source-template.html _app-code-template.js build.py README.md .nojekyll \
  CLAUDE_CONTEXT.md manifest.json favicon.ico version.json \
  icon-16x16.png icon-32x32.png icon-180x180.png icon-192x192.png icon-512x512.png \
  firebase-rules.json
```

---

## SECURITY — API Key Protection

> **This rule must be checked before every ZIP.**

FouFou is a static site on GitHub Pages — all source code is public. API keys in `config.js` are always visible to anyone. The ONLY protection is restricting the key in Google Cloud Console.

**GOOGLE_PLACES_API_KEY:**
- Current key: `AIzaSyCE598tSisniM66ApqRvOyOq4svTf6pLHc`
- Restriction: HTTP referrers → `https://eitanfisher2026.github.io/*` only
- API restriction: Places API (New) only
- If a new key is ever created: immediately set the same restrictions before putting it in config.js

**Before every ZIP — verify:**
1. The key in `config.js` matches the restricted key in Google Cloud Console
2. The key is NOT a new unrestricted key
3. If you created a new key during the session: confirm restrictions were set

**Firebase config** (also in config.js) — lower risk:
- Firebase is protected by Security Rules, not by key secrecy
- No financial risk from exposed Firebase config as long as Security Rules are correct
- Do NOT change Firebase config without understanding the Security Rules impact

**Billing alert:**
The project owner should have a Google Cloud billing alert set at $10 to catch any unexpected API usage.

---

## CRITICAL RULES — Never Break

### Syntax
- **Single quotes in JSX** = Babel error. Always use double quotes.
- **const -> let** when reassigning (e.g. `locationToAdd = sanitizeMapsUrl(...)`)
- **`window.BKK.i18n.t()` does not exist** — use `t('key')` from scope, or `window.t('key')`
- **Hooks** — must be at component level. Never inside IIFE, never inside conditionals.
  - That is why `QuickAddPlaceDialog` lives in `quick-add-component.js`
  - Inserted into template BEFORE `const FouFouApp` via `// __INSERT_QUICK_ADD_COMPONENT__`

### Emoji in code
- **Raw emoji directly** — like any other character: `📸`, `🎤`, `💾`
- **NOT** `\uD83D\uDCF8` — no escape sequences, no `String.fromCodePoint`
- Writing files with `create_file` (not `cat <<`) guarantees correct UTF-8

### Firebase
- `firebaseId` (not `firebaseKey`) is the key after push
- After saving to Firebase — **also update** `setCustomLocations` local state (don't wait for sync)
- `sanitizeMapsUrl()` before every Firebase save
- `googlePlaceId` validation: `/^(ChIJ|EiI|GhIJ)/`

---

## Architecture

### Build Pipeline
```
_app-code-template.js
  + quick-add-component.js  -> // __INSERT_QUICK_ADD_COMPONENT__
  + app-logic.js            -> // __INSERT_APP_LOGIC__
  + views.js                -> // __INSERT_VIEWS__
  + dialogs.js              -> // __INSERT_DIALOGS__
  = app-code.js

_source-template.html
  + i18n.js + city-*.js + config.js + utils.js
  = app-data.js
```

### `build.py` — injection order matters
```python
quick_add_component = read_file('quick-add-component.js')
app_code = code_template
app_code = app_code.replace('// __INSERT_QUICK_ADD_COMPONENT__', quick_add_component)
app_code = app_code.replace('// __INSERT_APP_LOGIC__', app_logic)
app_code = app_code.replace('// __INSERT_VIEWS__', views)
app_code = app_code.replace('// __INSERT_DIALOGS__', dialogs)
```

---

## i18n System — Hebrew and English

### Correct usage
```js
// Inside component: get t from scope (passed as prop or built from window.BKK.i18n)
t('section.key')          // correct
window.BKK.i18n.t(...)   // DOES NOT EXIST — never use
window.t(...)             // exists (global wrapper)
```

### Available sections
`general, nav, wizard, route, places, trail, toast, settings, sysParams, dedup, import, reviews, auth, map, help`

### RTL/LTR
- Hebrew (`he`) -> `dir="rtl"`, `text-align: right`
- English (`en`) -> `dir="ltr"`, `text-align: left`
- In every dialog/view: use `isRtl = lang === 'he'` for layout decisions
- **Rule:** never hard-code direction — always derive from `lang`

### Adding new keys
Add to both languages simultaneously. A missing key in `en` -> silent empty string bug.

---

## Central State (app-logic.js)

| State | Description |
|-------|-------------|
| `route` | current route — `stops[]`, `optimized`, `startPointCoords` |
| `formData` | area, interests, searchMode, maxStops, startPoint, currentLat/Lng, radiusMeters |
| `routeType` | `'circular'` / `'linear'` |
| `routeChoiceMade` | `null` / `'manual'` |
| `activeTrail` | active trail during walk |
| `skippedTrailStops` | Set of skipped stop indices |
| `customLocations` | all favorites (includes cityId, firebaseId) |
| `systemParams` | admin params — loaded from Firebase `settings/systemParams` |
| `showQuickAddDialog` | `true` when QuickAddPlaceDialog is open |
| `quickAddPlace` | the google place passed to QuickAddPlaceDialog |
| `authUser` | Firebase auth user |
| `isAdmin` / `isEditor` | role >= 2 / >= 1 |
| `isUnlocked` | admin or editor |
| `pendingLocations` | offline save queue -> localStorage |
| `reviewAverages` | `{ [namePK]: { avg, count } }` — FouFou ratings cache |

---

## systemParams — All Parameters

Defined in `window.BKK._defaultSystemParams` in `app-logic.js`.
Loaded from Firebase `settings/systemParams` on startup.
Tunable via admin UI under Settings -> sysParams.

```js
// App
maxStops: 10, fetchMoreCount: 3, googleMaxWaypoints: 12,
defaultRadius: 500, toastDuration: 4000, includeDrafts: true,

// Dedup
dedupRadiusMeters: 50, dedupGoogleEnabled: 1, dedupCustomEnabled: 1,

// Trail
trailTimeoutHours: 8, defaultInterestWeight: 3,
maxContentPasses: 3, contentReorderEnabled: true,
maxContentGeoIncrease: 0.05, twoOptMaxPasses: 20,

// Time scoring
timeScoreMatch: 2, timeScoreAnytime: 1, timeScoreConflict: 0,
timeConflictPenalty: 3,

// Slot positioning
slotEarlyThreshold: 0.4, slotLateThreshold: 0.6,
slotEndThreshold: 0.7, slotPenaltyMultiplier: 3,
slotEndPenaltyMultiplier: 4, gapPenaltyMultiplier: 2,

// Speech
speechMaxSeconds: 15, speechRate: 1.0,

// Favorite scoring
favoriteBaseScore: 20,
favoriteBonusPerStar: 5,
favoriteLowRatingThreshold: 2.5,
favoriteLowRatingPenalty: 60,
```

---

## Stop Scoring (stopScore) — Full Logic

### Principle
**Favorites always get priority over Google — unless they received a poor user rating.**

### Formula
```js
const googleScore = rating x log10(ratingCount + 1)
// Example: 4.5 stars, 1000 reviews:  4.5 x log10(1001) ~= 13.5
// Example: 4.9 stars, 10 reviews:    4.9 x log10(11)   ~=  4.9 (weak)

// Favorite, no FouFou rating:      googleScore + 20        (base priority)
// Favorite, FouFou rating >= 2.5:  googleScore + 20 + avg*5 (bonus per star)
// Favorite, FouFou rating < 2.5:   googleScore + 20 - 60    (may lose to Google)
// Google-only place:               googleScore
// Place without Google (graffiti): googleScore=0 -> score=20 only
```

### Why log10?
The difference between 10 reviews and 100 matters a lot. Between 10,000 and 100,000 — almost not. Log normalizes this.

### reviewAverages cache
```js
// key: name.replace(/[.#$/[\]]/g, '_')  <- namePK
// value: { avg: 4.2, count: 3 }
// source: Firebase cities/{cityId}/reviews/{namePK}/{uid}
// NEVER fetch from Firebase inside stopScore — use cache only
```

---

## Optimal Route Algorithm — Step by Step

### Phase 0: smartSelectStops — smart selection
```
allStops (custom + google) ->
  buckets[interestId][] ->
  sort each bucket by stopScore + timeScore ->
  pick top N from each bucket ->
  category ordering: attractions -> breaks -> meals -> experiences
```

### Phase 1: Nearest Neighbor (O(n squared))
```
start: startCoords if available, otherwise:
  linear  -> stop furthest from centroid (acts as natural endpoint)
  circular -> stop nearest to centroid (acts as center hub)
greedy: always pick the closest unvisited stop
```

### Phase 2: 2-opt improvement (O(n squared) x maxPasses)
```
For every edge pair (i,j): check if reversing segment [i+1..j] shortens route
Threshold: 1m (avoids floating point noise)
maxPasses: systemParams.twoOptMaxPasses (default: 20)
n<=15 -> very fast in practice
```

### Phase 3: Content-aware reorder
```
slotConfig (from defaultSlotConfig, merged with interestConfig from Firebase):
  cafes     -> bookend (start/end of route)
  food/rest -> middle
  markets   -> early
  nightlife -> end
  rooftop   -> end

penalty system: stop in wrong slot -> score penalty
```

### Phase 4: Auto-reoptimize triggers
```
scheduleReoptimize() <- debounce 600ms
triggered by: startPointCoords change, fetchMore, skip/unskip
skipSmartSelect: true -> only reorders, does not re-select
```

### RULE: User manual order takes priority
```js
// If user manually reordered + startPoint changed -> toast "order kept", no recalculation
userManualOrderRef.current = true  // marks that user changed order
```

---

## Google Places API — Optimal Usage

### FieldMask — Critical Rule for Cost Savings
**Always request only necessary fields.** Each extra field costs money.
```js
// For search:
'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.types,places.primaryType,places.currentOpeningHours'

// For place details only (Place Details GET):
'X-Goog-FieldMask': 'rating,userRatingCount'
// <- This is Basic Data = $0.005 per call

// For minimal text search:
'X-Goog-FieldMask': 'places.id,places.rating,places.userRatingCount,places.location'
```

### Two Search Types
| Mode | API | When |
|------|-----|------|
| Nearby Search | `places:searchNearby` | interestConfig has `types` |
| Text Search | `places:searchText` | interestConfig has `textSearch` (graffiti, street art) |

### Rating Refresh Optimization
```
If googlePlaceId exists -> Place Details GET (Basic) = $0.005
If no googlePlaceId    -> Text Search = $0.032 -> save the found placeId for next time
Skip: googleRatingUpdated within last 7 days
```

### "Unsupported types" error (400)
```js
// System handles automatically: retry each type separately
// NEVER remove a type from config — let the retry mechanism work
```

### Google Maps URLs — Policy: ONE function, used everywhere

**ABSOLUTE RULE: Never build a Google Maps URL manually. Always use `window.BKK.getGoogleMapsUrl(place)`.**

This function handles all edge cases: broken/legacy URLs, invalid Place IDs, coord-only places, mobile deep links. Building URLs manually elsewhere *will* break on Android/iOS.

```js
// CORRECT — everywhere in the codebase:
const url = window.BKK.getGoogleMapsUrl(place);
if (url && url !== '#') window.open(url, '_blank');

// CORRECT — for <a> links:
<a href={window.BKK.getGoogleMapsUrl(stop)} target="_blank">Google Maps</a>

// WRONG — never do this:
`https://www.google.com/maps/place/?q=place_id:${place.googlePlaceId}`  // broken on Android
`https://maps.google.com/?q=${lat},${lng}`                              // no place context
`place.mapsUrl`                                                          // may be broken/stale
```

Priority chain inside `getGoogleMapsUrl`:
1. Stored `mapsUrl` — only if valid (not `goo.gl`, not `maps.app`, not legacy `place_id:` format)
2. `googlePlaceId` → `?api=1&query=name&query_place_id=ChIJ...` (works in both browser and app)
3. `name + coords` → `?api=1&query=name lat,lng`
4. `address` → `?api=1&query=address`
5. `coords only` → `?api=1&query=lat,lng`
6. Nothing → `'#'`

**Context matters for displaying the button:**
- Route results stop name: always a link (`<a href={getGoogleMapsUrl(stop)}>`)
- Active trail stop click: check first if it's a coord-only favorite (show FouFou card instead)
- Stop detail modal: show "נווט" if `mapsUrl !== '#'` (includes coord-only); show "גוגל" button only if `googlePlaceId` is valid (real Google place)
- Favorites list: small 🔗 icon link
- Map popup (Leaflet): HTML string, same `getGoogleMapsUrl` call

```

---

## Images & Compression — Critical Rules

### KNOWN REGRESSION: Never duplicate compressImage

There is **one and only one** definition of `window.BKK.compressImage` in `utils.js`.
If you find another — that is a regression. Delete the duplicate immediately.

### Correct definition
```js
window.BKK.compressImage = (input, maxSizeKB = 120) => {
  // accepts File object OR dataUrl string
  // max dimension: 900px
  // quality loop: 0.82 -> 0.72 -> ... -> 0.2 until under 120KB
  // ALWAYS call before saving to Firebase
}
```

### Image save flow
```
File/dataUrl ->
  compressImage(input, 120) ->   ALWAYS compress before Firebase
  uploadImage() ->               tries Firebase Storage URL
  fallback: base64 in Firebase   if Storage not available
```

### RULE: Never save large image to Firebase
```js
// WRONG:
database.ref(...).set({ uploadedImage: rawFile })

// CORRECT:
const compressed = await window.BKK.compressImage(file);
database.ref(...).set({ uploadedImage: compressed })
```

### EXIF GPS — camera only, NEVER gallery

```js
// CORRECT: camera capture only
const result = await window.BKK.openCamera();
const gps = await window.BKK.extractGpsFromImage(result.file); // OK

// WRONG: gallery file input — GPS is always stripped by Android/iOS
input.onChange = async (e) => {
  const file = e.target.files[0];
  const gps = await window.BKK.extractGpsFromImage(file); // NEVER DO THIS — always returns null/0,0
}
```

Android and iOS remove GPS data from images when they are saved to the device gallery.
EXIF GPS extraction only works reliably from a **fresh camera capture** (`openCamera()`).
Gallery uploads: compress image only, ignore any GPS.

### Icon compression — `compressIcon` (different from photos)
```js
window.BKK.compressIcon(input, maxSize = 64, maxKB = 15)
// maxSize: max dimension in pixels (64 for interest icons, 80 for city icon)
// maxKB: hard limit on output size — quality loop enforced
// Uses quality loop [0.85, 0.7, 0.55, 0.4, 0.25] then canvas shrink if needed
// Outputs WebP (or PNG fallback)
// DO NOT use compressImage for icons
```

**RULE: ALL icon uploads (interest, city main, city side icons) MUST go through `compressIcon`.**
Never save a raw File or uncompressed data URL as an icon to Firebase or city files.

**RULE: Never save data: URLs to city JS files.**
`exportCityFile` strips all `data:` from `city.icon`, `theme.iconLeft`, `theme.iconRight` before export.
Theme icons with data URLs are stored in `settings/cityOverrides/{cityId}/theme` in Firebase instead.
City files contain only emoji or empty strings for icon fields.

---

## Firebase Structure

```
cities/{cityId}/locations/{id}         <- favorites
cities/{cityId}/routes/{id}            <- saved routes
cities/{cityId}/reviews/{namePK}/{uid} <- ratings (deleted with location!)
cities/{cityId}/interestCounters/      <- auto-naming counters (per-city!)
customInterests/{id}                   <- custom interests (all global)
settings/interestConfig/{id}           <- search config + routeSlot + overrides
settings/interestStatus/{id}           <- default enabled/disabled
settings/cityHiddenInterests/{cityId}  <- array of interest IDs hidden for that city
settings/systemParams                  <- admin system params
settings/cityOverrides/{cityId}/       <- day/nightStartHour overrides per city
users/{uid}/interestStatus/{id}        <- per-user overrides
users/{uid}/role                       <- 0=regular, 1=editor, 2=admin
helpContent/{sectionId}/{lang}         <- hint/documentation
accessLog/{id}, feedback/{id}
```

### Critical Firebase Rules
```js
// 1. push -> returns ref with .key -> save as firebaseId
const ref = await database.ref('cities/...').push(data);
const saved = { ...data, firebaseId: ref.key };

// 2. Deleting location -> also delete reviews
database.ref(`cities/${cityId}/locations/${firebaseId}`).remove();
database.ref(`cities/${cityId}/reviews/${namePK}`).remove();  // REQUIRED

// 3. After save -> update state immediately (don't wait for sync)
setCustomLocations(prev => [...prev, saved]);

// 4. Batch updates — multiple fields in one object
database.ref().update({ 'path/a': val1, 'path/b': val2 });  // better than separate updates
```

---

## QuickAddPlaceDialog

Opened when user taps `+Favorite` on a Google place (in active trail or results list).

**Flow:**
1. `addGooglePlaceToCustom(place)` -> builds `locationToAdd` -> `setQuickAddPlace(locationToAdd)` + `setShowQuickAddDialog(true)`
2. `QuickAddPlaceDialog` shown -> user fills name/image/description/notes/interests/rating
3. Save pressed -> `saveQuickAddPlace(enriched, rating)`:
   - **Compresses image** before saving (120KB max)
   - Saves to Firebase `cities/{cityId}/locations`
   - **Immediately** updates `setCustomLocations(prev => [...prev, saved])` — without waiting for sync
   - Saves rating to `cities/{cityId}/reviews/{namePK}/{uid}` if provided
   - Toast success

**Props:**
```js
{ place, allInterestOptions, interestStatus, selectedCityId,
  isUnlocked, tLabel, t, onSave, onCancel }
```

---

## Auto-Reoptimize Flow

```
scheduleReoptimize()   <- triggers: startPointCoords change, fetchMore, skip/unskip
    debounce 600ms
runSmartPlan({ skipSmartSelect: true })
    never cuts stops, just reorders
optimizeStopOrder(selected, autoStart, isCircular)
    nearest neighbor + 2-opt + content-aware + slot positioning
setRoute(newRoute)
```

`userManualOrderRef` — if user reordered manually and startPoint changed: toast "order kept", no recalculation.

---

## Debug and Error System

### Debug log
```js
addDebugLog(category, message, data?)
// categories: 'API', 'ADD', 'MIGRATION', 'OPTIMIZE', 'RATING-REFRESH', 'GPS'
// stored in state debugLog[] — visible to admins only
```

### Console prefix conventions
```
[CONFIG]         <- config.js operations
[UTILS]          <- utils.js operations
[GPS]            <- geolocation
[DYNAMIC]        <- Google Places API calls
[SMART]          <- smart select algorithm
[OPTIMIZE]       <- route optimization
[FIREBASE]       <- database operations
[AUTH]           <- authentication
[RATING-REFRESH] <- batch rating updates
[STORAGE]        <- image upload
[EXIF]           <- GPS from photo
[SYNC]           <- offline -> online pending sync
[MIGRATION]      <- one-time data migrations
[MAP]            <- Leaflet map
[CLEANUP]        <- Firebase cleanup utilities
```

### Error handling patterns
```js
// Firebase operation — always try/catch + fallback
try {
  await database.ref(...).set(data);
  setCustomLocations(prev => [...prev, saved]);  // optimistic update
} catch (error) {
  saveToPending(data);        // offline queue
  showToast(t('toast.savedWillSync'), 'warning', 'sticky');
}

// Google API error -> visible toast, not silent
try {
  const resp = await fetch(GOOGLE_PLACES_API_URL, ...);
  if (!resp.ok) {
    const err = await resp.text();
    console.error('[DYNAMIC] Google error:', resp.status, err);
    showToast(t('toast.googleError'), 'error');
    return [];
  }
} catch(e) {
  console.error('[DYNAMIC]', e.message);
  return [];
}
```

### Pending queue (offline support)
```js
// Auto-saved to localStorage when changed
// Synced when isFirebaseAvailable becomes true
// NEVER remove this mechanism — users on spotty wifi depend on it
```

---

## Colors and Design — Single Source of Truth

### Rule: Never hard-code colors in views/dialogs
Every color used in more than one place must be defined in `config.js` (mapConfig) or as a CSS class.

| Element | Value |
|---------|-------|
| Header dialogs | `bg-gradient-to-r from-purple-500 to-pink-500` |
| Save button gradient | `linear-gradient(to right, #a855f7, #ec4899)` |
| Add to favorites pill | color `#059669`, bg `#f0fdf4` |
| Skip button | color `#ea580c`, bg `#fff7ed` |
| Info (hint) button | color `#374151`, border `#d1d5db` |
| Map button | `#6d28d9` purple |
| Yalla button | `#15803d` green |
| Stop colors palette | `window.BKK.stopColorPalette[index % 16]` |

### Map visual config
Everything defined in `window.BKK.mapConfig` in `config.js`:
- `mapConfig.route` — route lines (3-layer: glow + base + flow animation)
- `mapConfig.marker` — stop circles
- `mapConfig.area` — area overlays on map
- `mapConfig.radiusSearch` — radius search circle
- NEVER change map colors in views.js — only in config.js

---

## localStorage — Policy and Keys

### POLICY: Minimum Necessary, Fast-Access Only

> **Rule: localStorage stores ONLY data needed before Firebase loads, or that must stay local by design.**
>
> On every page load, Firebase takes ~200-500ms to respond. localStorage provides instant state so the user sees a consistent UI immediately (correct city, language, active trail) without waiting.
>
> **DO NOT add new localStorage keys for:**
> - Data that already lives in Firebase (locations, routes, interest status)
> - Large objects that can be reloaded from Firebase (>50KB)
> - Data that must be consistent across devices → use Firebase instead
>
> **OK to add localStorage keys for:**
> - UI micro-state (position, width, toggle) — low stakes, device-specific
> - Data needed at startup BEFORE Firebase responds (city, language)
> - Analytics throttle timers (must be local by design)
> - One-time migration/cleanup flags
> - Offline fallbacks that are also synced to Firebase (like `city_interests_overrides`)

### All Keys

| Key | Category | Why localStorage (not Firebase) |
|-----|----------|---------------------------------|
| `city_explorer_city` | startup | Needed to load correct city before Firebase |
| `city_explorer_lang` | startup | Needed to render correct language before Firebase |
| `city_active_states` | startup | Which cities are active — needed at render time |
| `city_interests_overrides` | startup+sync | Fast local copy; synced FROM Firebase on load, TO Firebase on save |
| `custom_cities` | startup | Cities created via UI not yet in zip — needed before Firebase |
| `foufou_preferences` | startup | Wizard defaults (area, hours) — shown before Firebase |
| `foufou_route_type` | startup | circular/linear — shown before Firebase |
| `foufou_time_filter` | startup | Time filter — shown before Firebase |
| `foufou_active_trail` | session | Active trail during walk — large, needed offline, instant restore |
| `foufou_visitor_id/name` | analytics | Anonymous analytics ID — intentionally NOT in Firebase |
| `foufou_last_log_time` | analytics | Throttle for hourly analytics log — must be local |
| `foufou_last_seen_feedback` | badge | Feedback badge timestamp |
| `locations_migrated_v2` | migration | One-time migration flag |
| `cleanup_inprogress_done` | migration | One-time cleanup flag |
| `foufou_fab_pos` | UI micro | FAB button position — device-specific |
| `foufou_right_col_width` | UI micro | Desktop split width — device-specific |
| `foufou_tts_voice` | UI micro | TTS voice preference — device-specific |
| `foufou_hint_*` | UI micro | Whether a hint section is expanded |
| `foufou_interests_*` | UI micro | Interests per mode (circular/linear) — session UX |
| `foufou_debug_*` | admin | Debug mode/categories/sessions — admin-only, local is fine |

### city_interests_overrides — Special Sync Pattern
The only key that syncs bidirectionally:
- **Write:** saved to localStorage AND `settings/cityOverrides/{cityId}/interests` in Firebase
- **Read on startup:** localStorage provides instant load; Firebase overwrites with canonical version
- **Result:** cross-device consistency (phone gets same interests as desktop)

---

## Performance — Optimization Rules

### Fast initial load
1. `app-data.js` loads first (i18n + city data + config + utils) — critical for render
2. `app-code.js` loads after — React app
3. City files loaded **dynamically** when selected (not all upfront)
4. Firebase starts after render — no blocking

### Performance rules
```js
// React.memo on heavy components
// useCallback on handlers passed as props
// useMemo on heavy calculations (stopScore if called frequently)
// useRef for runSmartPlan (prevents stale closure)
// NEVER calculate stopScore in renderer — only in smartSelectStops
// NEVER send Google API call from useEffect without debounce
```

### FieldMask = cost savings
**Never** add fields to FieldMask without a reason. Every field costs money.
```
places.photos      <- expensive — never request automatically
places.website     <- not used
places.priceLevel  <- only if displaying it
```

---

## כלל Toasts — אחידות

> **כל toast חייב להשתמש ב-`t('key')` בלבד — לא hardcoded טקסט.**

- `showToast(t('key') || 'fallback', 'type')` — תמיד עם translation key
- toast שמציג הודעות auth/security — להשתמש ב-`t('auth.signInRequired')`
- **אסור:** `showToast(\`🔒 ${hardcoded_text}\`, ...)`
- טקסט toast מוגדר ב-`i18n.js` גם בעברית וגם באנגלית

---

## אחידות UI — עיקרון מרכזי

> **Eitan מקפיד מאוד על אחידות בכל המערכת. כל שינוי צריך לבדוק שהוא אחיד בכל המקומות.**

כלל: כל פיצ'ר שקיים במסך אחד — אמור לעבוד **בדיוק אותו דבר** בכל המסכים. לפני כל שינוי — לרוץ על כל המסכים הרלוונטיים ולוודא אחידות.

דוגמאות שכבר נגרמו מהיעדר אחידות: הקלטה קולית הכפילה טקסט רק בקומפוננט אחד; כפתורים נראו שונה בין מסכים; תחומים לא נשמרו אחיד.

---

## הקלטה קולית (`window.BKK.startSpeechToText`) — כלל שימוש

> **זו הפונקציה היחידה לכל ההקלטות.** לא לכתוב הקלטה ישירה ב-SpeechRecognition במקומות חדשים.

### חתימה
```js
const stop = window.BKK.startSpeechToText({
  maxDuration: (window.BKK.systemParams?.speechMaxSeconds || 15) * 1000,
  onResult: (text, isFinal) => { ... },  // isFinal=true: טקסט סופי; isFinal=false: interim בלבד
  onEnd: () => { ... },
  onError: (error) => { ... }
});
// stop() = עצור הקלטה
```

### חוקי `onResult`
- `isFinal=false` (interim) → **תצוגה חיה בלבד** — לא לשמור ב-state
- `isFinal=true` (final) → **צרף** (`prev + ' ' + text`) ל-state
- **לעולם לא לשים** `setField(text)` ישירות (replace) — תמיד append כשisFinal
- **לעולם לא להתעלם מ-isFinal** — זו הסיבה לכפילות

### טווחי זמן
- כל הקלטה = 15 שניות (`speechMaxSeconds` ב-systemParams)
- יוצא דופן: hint dictation (כתיבת עזרה) = ללא הגבלה, מצב continuous מיוחד ב-app-logic.js

### מיקומים קיימים (חייבים להישאר אחידים)
| מיקום | שדות | קובץ |
|-------|------|------|
| QuickCapture / QuickAdd | description, notes, rating | quick-add-component.js → startRec() |
| עריכת מקום מועדף | description, notes | dialogs.js |
| כתיבת hint (admin) | hint text | app-logic.js → startHintDictation() (מיוחד — continuous) |

---

## mapsUrl — Critical Rule: Never Save Broken URLs

> **This bug has appeared twice. The fix is permanent — do not regress it.**

### Broken URL types (NEVER save these to Firebase)
- `maps.app.goo.gl/*` — short/redirect URL, CORS-blocked, breaks on mobile
- `goo.gl/*` — short URL, same problem
- Any URL that does NOT contain `google.com/maps`
- `google.com/maps/...?query_place_id=XYZ` where XYZ does NOT start with `ChIJ`, `EiI`, or `GhIJ`

### The three protection layers (all must stay in sync)

**Layer 1: `isBrokenMapsUrl(url)` in `app-logic.js`**
Shared helper used by `sanitizeMapsUrl`. Detects all broken types above.

**Layer 2: `sanitizeMapsUrl(loc)` in `app-logic.js`**
Called before EVERY Firebase write of a location. If `isBrokenMapsUrl` → clears mapsUrl and rebuilds via `getGoogleMapsUrl`.

**Layer 3: `getGoogleMapsUrl(place)` in `utils.js`**
Has its own `isBrokenUrl` check. If stored `mapsUrl` is broken → ignores it and builds from `googlePlaceId` / `name+coords` / `coords`.

**Layer 4: Repair useEffect in `app-logic.js`**
Runs on load. Finds broken URLs in existing Firebase data and queues them for repair.
- coord-only places with broken URL → cleared to ''
- places with name/placeId → rebuilt from canonical fields

### What NOT to do
- Do NOT save `loc.mapsUrl` to Firebase directly — always call `sanitizeMapsUrl(loc)` first
- Do NOT return `place.mapsUrl` in `getGoogleMapsUrl` without checking `isBrokenUrl`
- Do NOT skip repair for places just because they are "coord-only" — they may still have a broken URL stored

### Places with no URL (coord-only favorites like graffiti/food stalls)
These are valid. `getGoogleMapsUrl` returns `?q=lat,lng` for them. Never "fix" them by adding a search URL.

### build.py validation
`build.py` runs `test_maps_url_sanitize()` on every build. If it fails, the zip is not created.

---

## Firebase Write → Local State — Critical Rule

> **This pattern causes silent UI bugs. Check it before every Firebase write.**

### The Problem
Firebase listeners (`on('value', ...)`) are async — they may take 100-500ms to reflect a write back to local state. If a user sees no immediate change after an action, they assume it failed.

### The Rule
**Every Firebase write that modifies displayed state MUST also update local React state immediately.**

```js
// WRONG — user sees no change until Firebase listener fires
database.ref(`cities/${cityId}/locations/${id}`).update({ status: 'blacklist' });

// CORRECT — optimistic update + Firebase write
setCustomLocations(prev => prev.map(l => l.id === id ? { ...l, status: 'blacklist' } : l));
database.ref(`cities/${cityId}/locations/${id}`).update({ status: 'blacklist' })
  .catch(() => {
    // Revert on error if needed
    setCustomLocations(prev => prev.map(l => l.id === id ? { ...l, status: oldStatus } : l));
  });
```

### State → Firebase mapping
| State | Firebase path | Pattern |
|-------|-------------|---------|
| `customLocations` | `cities/{cityId}/locations/{id}` | update field → setCustomLocations map |
| `savedRoutes` | `cities/{cityId}/routes/{id}` | update field → setSavedRoutes map |
| `interestCounters` | `cities/{cityId}/interestCounters/{id}` | set value → setInterestCounters spread |
| `interestConfig` | `settings/interestConfig/{id}` | set config → setInterestConfig spread |
| `customInterests` | `customInterests/{id}` | update → setCustomInterests map |
| `interestStatus` | `users/{uid}/interestStatus/{id}` | ✅ already updates setInterestStatus first |

### Already fixed (don't regress)
- `toggleLocationStatus` — now updates `setCustomLocations` before Firebase write
- `updateRoute` — now updates `setSavedRoutes` before Firebase write
- `interestCounters` (admin UI + `incrementCounters`) — now updates `setInterestCounters`
- Custom interest edit — now updates `setCustomInterests` + `setInterestConfig`
- Built-in interest config edit — now updates `setInterestConfig`

---

## Coherence Principles — "Written By One Developer"

### Shared functions — always use existing ones

| Need | Function | File |
|------|----------|------|
| Distance between points | `calcDistance(lat1, lng1, lat2, lng2)` | app-logic.js (local) |
| GPS area validation | `window.BKK.checkLocationInArea(lat, lng, areaId)` | utils.js |
| GPS + city validation | `window.BKK.getValidatedGps(onSuccess, onError)` | utils.js |
| Areas for coordinates | `window.BKK.getAreasForCoordinates(lat, lng)` | utils.js |
| Closest area | `window.BKK.getClosestArea(lat, lng)` | utils.js |
| Areas from location | `window.BKK.getLocationAreas(loc)` | utils.js |
| Google Maps URL | `window.BKK.getGoogleMapsUrl(place)` | utils.js |
| Google Maps directions | `window.BKK.buildGoogleMapsUrls(stops, origin, circ, max)` | utils.js |
| Compress image | `window.BKK.compressImage(input, maxSizeKB)` | utils.js |
| Compress icon | `window.BKK.compressIcon(input, maxSize)` | utils.js |
| Upload image | `window.BKK.uploadImage(file, cityId, locationId)` | utils.js |
| Interest color | `window.BKK.getInterestColor(id, allInterests)` | utils.js |
| Emoji suggestions | `window.BKK.suggestEmojis(description)` | utils.js |
| Stop label | `window.BKK.stopLabel(index)` | config.js |
| GPS from EXIF | `window.BKK.extractGpsFromImage(file)` | utils.js |
| Speech-to-text | `window.BKK.startSpeechToText(options)` | utils.js |
| Reverse geocode | `window.BKK.reverseGeocode(lat, lng)` | utils.js |
| Sanitize URL | `sanitizeMapsUrl(loc)` | app-logic.js (local) |

### Before writing a new function — check first
Before writing any new function, check if something similar exists in the table above.
Duplicate functions = future regressions.

---

## Known Regressions — Must Never Return

### 1. Duplicate compressImage
**What happened:** Two definitions of `window.BKK.compressImage` — one in utils.js, one in dialogs.js.
**Symptom:** Images not compressed, saved over 1MB to Firebase.
**Fix:** One definition only in utils.js. All calls via `window.BKK.compressImage`.
**If you see two definitions -> delete the duplicate immediately.**

### 2. window.BKK.i18n.t() does not exist
**What happened:** Using `window.BKK.i18n.t('key')` which does not exist.
**Symptom:** `TypeError: window.BKK.i18n.t is not a function` in console.
**Fix:** `t('key')` from scope, or `window.t('key')` if global needed.

### 3. Hooks inside IIFE
**What happened:** QuickAddPlaceDialog written inside the main IIFE of app-code.js.
**Symptom:** "Invalid hook call" — hooks must be at component level.
**Fix:** `quick-add-component.js` — separate file, inserted before FouFouApp.
**NEVER return a component with hooks into the IIFE.**

### 4. Firebase key in query_place_id
**What happened:** `googlePlaceId` containing a Firebase key (not a Google Place ID) entered mapsUrl.
**Symptom:** Broken Google links with query_place_id=-MxGt...
**Fix:** `sanitizeMapsUrl(loc)` before every save. Validation: `/^(ChIJ|EiI|GhIJ)/`.

### 5. Reviews not deleted with location
**What happened:** Deleting a favorite did not delete its ratings.
**Symptom:** Ratings of deleted places remain in Firebase, pollute reviewAverages.
**Fix:** `deleteCustomLocation` -> also deletes `reviews/{namePK}`.

### 6. const on reassigned variable
**What happened:** `const locationToAdd = ...` then `locationToAdd = sanitizeMapsUrl(...)`.
**Symptom:** `TypeError: Assignment to constant variable`.
**Fix:** `let locationToAdd = ...`

### 7. Single quotes in JSX attributes
**What happened:** `<div className='foo'>` instead of `<div className="foo">`.
**Symptom:** Babel parse error — everything breaks.
**Fix:** Always double quotes in JSX attributes.

---

## Google Places — Finding and Filtering Places by Interest

### The Quality Problem
Google Places returns results ranked by **promotion and popularity**, not by relevance to our interest.
A search for "cafes" returns hotels with cafes, restaurant chains, and 7-Eleven stores.
FouFou applies 5 filter layers to ensure only genuinely relevant, quality results reach the user.

---

### Layer 0: Interest Validity Check (before any API call)
```js
isInterestValid(interestId)
// Returns false if the interest has no search config -> no API call made
// An interest is valid if it has: types[] OR textSearch string OR is privateOnly
// privateOnly (manual interests) -> ALWAYS valid, never calls Google at all
```

### Layer 1: API Search Type Selection
Each interest uses one of two search modes, configured in `interestConfig`:

| Mode | API Endpoint | Config field | Example interest |
|------|-------------|--------------|-----------------|
| Category Search | `places:searchNearby` | `types: ['cafe', 'coffee_shop']` | cafes, temples, parks |
| Text Search | `places:searchText` | `textSearch: 'street art'` | graffiti, artisans |

**Why two modes?**
- Category search is precise but limited to Google's ~100 supported types
- Text search handles concepts Google has no type for (street art, graffiti, canals)
- Text search has a stricter relevance filter (see Layer 3)

**Config source priority:**
```
1. Firebase: settings/interestConfig/{id}   <- admin can override
2. Default config hardcoded in app-logic.js <- fallback (~line 2427)
3. city's interestToGooglePlaces            <- legacy fallback
```

**Default config (hardcoded in app-logic.js):**
```js
temples:   { types: ['hindu_temple','buddhist_temple','church','mosque'], blacklist: ['hotel','restaurant','school'] },
food:      { types: ['restaurant','meal_takeaway'],     blacklist: ['bar','pub','club','hotel','hostel'] },
graffiti:  { textSearch: 'street art',                   blacklist: ['tattoo','ink','piercing','salon'] },
cafes:     { types: ['cafe','coffee_shop'],             blacklist: ['cannabis','weed','kratom','hookah'] },
markets:   { types: ['market','shopping_mall'],         blacklist: ['hotel','supermarket','7-eleven','convenience','tesco','big c'] },
parks:     { types: ['park','national_park'],           blacklist: ['hotel','parking','car park','garage'] },
nightlife: { types: ['bar','night_club'],               blacklist: ['restaurant','hotel','hostel','cafe'] },
artisans:  { types: ['store','art_gallery'],            blacklist: ['cannabis','weed','kratom','massage','7-eleven'] },
```

**RULE: Never remove blacklist words from defaultConfig.**
If Firebase has an empty blacklist for an interest, the system keeps the default blacklist:
```js
// Deep merge in app-logic.js:
if ((!val.blacklist || val.blacklist.length === 0) && defaultConfig[key]?.blacklist?.length > 0) {
  merged[key].blacklist = defaultConfig[key].blacklist;  // always keep default
}
```

---

### Layer 2: Blacklist Word Filter (in fetchGooglePlaces)
Applied to every Google result before any other processing.

```js
// Checks BOTH the place name AND Google's type list
const matchedWord = blacklistWords.find(word =>
  placeName.includes(word) ||
  placeTypes.some(type => type.includes(word))  // e.g. type "convenience_store" matches "convenience"
);
if (matchedWord) -> FILTERED OUT, logged as "BLACKLIST"
```

**Why check types too?**
A hotel named "Cafe de Paris" passes a name-only check for cafes.
But Google types it as `['lodging', 'hotel']` — the word "hotel" matches the cafe blacklist.

**Blacklist words are collected from ALL valid interests in the current search:**
```js
const blacklistWords = validInterests.flatMap(interest =>
  interestConfig[interest]?.blacklist || []
).map(w => w.toLowerCase());
const uniqueBlacklist = [...new Set(blacklistWords)];
```

---

### Layer 3: Relevance Filter (Text Search only)
For textSearch interests, the place **name must contain the exact search phrase**.

```js
// textSearchPhrase = e.g. "street art"
if (isTextSearch && !placeName.includes(textSearchPhrase)) -> FILTERED OUT
```

**Why:** Text Search API returns anything vaguely related to the query.
"street art Bangkok Chinatown" returns tattoo studios, art supply stores, galleries.
Only places with the phrase literally in the name pass.

**Tradeoff:** Strict by design. A place named "Mural Gallery" won't pass a "street art" search.
If too strict for a city, the admin can switch the interest to category search with appropriate types.

---

### Layer 4: Type Validation (Category Search only)
The place must have at least one of the requested Google types.

```js
const hasValidType = placeTypesFromGoogle.some(type => placeTypes.includes(type));
if (!hasValidType) -> FILTERED OUT, logged as "TYPE MISMATCH"
```

**Why:** Google Nearby Search with `includedTypes` is not always precise.
It returns loosely-related places. This enforces strict type matching.

**The "Unsupported types" retry:**
If Google returns 400 for a multi-type request, the system retries each type separately.
Results are merged and deduped. This handles Google's unpredictable type support across regions.

---

### Layer 5: Distance Filter
Removes places returned by Google that are physically too far from the search center.

```js
const maxDistance = searchRadius * distMultiplier;
// distMultiplier: per-area config -> city default -> 1.2
// Example: 500m radius * 1.2 = 600m max
// Radius mode: hard filter at exact radiusMeters (no multiplier)
```

**Why:** Google's `locationRestriction` is not exact for type searches.
Places 800m away can appear in a 500m search. The 1.2 multiplier adds a small tolerance.
In radius mode the user drew the boundary — we respect it exactly.

---

### Layer 6: User Blacklist ("Skip Forever")
After fetching, Google results are filtered against the user's personal skip-forever list.

```js
// filterBlacklist() — called in runSmartPlan Step C, after Google fetch
const blacklistedNames = customLocations
  .filter(loc => loc.status === 'blacklist' && loc.cityId === selectedCityId)
  .map(loc => loc.name.toLowerCase().trim());

return places.filter(place => !blacklistedNames.includes(place.name.toLowerCase().trim()));
```

**The status lifecycle:**
```
active -> (user marks "skip forever") -> blacklist -> (toggle) -> review -> (toggle) -> active
```

**Where status='blacklist' is enforced across the entire system:**
- `filterBlacklist()` — removes from Google results in route generation
- Custom stops collection in `runSmartPlan` — `if (loc.status === 'blacklist') return false`
- `refreshAllGoogleRatings` — skips blacklisted locations
- Favorites list display — shown only in a separate "blacklisted" section (admin only)
- `fetchMore` — blacklisted places never appear in fetch-more results

**RULE: Never show status='blacklist' locations to regular users.**
The user explicitly asked to never see this place again. Honor it everywhere, every time.

---

### Layer 7: Dedup Against Custom Locations
Prevents showing a Google result when we already have it as a saved favorite.
**The favorite version replaces the Google version in the candidate pool — but winning in the final route still depends on stopScore.**

```js
// filterDuplicatesOfCustom()
const customNames = customLocations
  .filter(loc => loc.status !== 'blacklist' && loc.cityId === selectedCityId)
  .map(loc => loc.name.toLowerCase().trim());

// Google result with same name as a favorite -> removed from Google results pool
// The custom version enters via the custom stops path instead
// Whether it appears in the route depends on stopScore (see Stop Scoring section)
```

**Important: this is NOT "favorites always win".**
The favorite enters the pool, but stopScore determines its rank against other places:
- Favorite with no FouFou rating: googleScore + 20 (baseline priority — usually wins)
- Favorite with good FouFou rating (>= 2.5 avg): googleScore + 20 + avg*5 (wins clearly)
- Favorite with poor FouFou rating (< 2.5 avg): googleScore + 20 - 60 (may lose to a strong Google place)

Example: a favorite with 1-star FouFou rating vs a Google place with 4.8 stars and 2000 reviews:
  Favorite score: 0 + 20 - 60 = -40
  Google score:   4.8 * log10(2001) ~= 16.2
  -> Google place wins, favorite is deprioritized. This is intentional.

---

### Complete Filtering Pipeline
```
Google API returns up to 20 results
    |
    v  [Layer 2] Blacklist words (name + Google types)
    |
    v  [Layer 3] Relevance (text search only: name must contain exact phrase)
    |
    v  [Layer 4] Type validation (category search only: types must match)
    |
    v  [Layer 5] Distance (radius x distanceMultiplier)
    |
    v  [Layer 6] User blacklist (status='blacklist' in customLocations)
    |
    v  [Layer 7] Dedup vs custom locations (same name already in favorites)
    |
    v  ~5-12 quality results per interest
    |
    v  smartSelectStops: rank by stopScore, pick top N per bucket
    |
    v  optimizeStopOrder: nearest neighbor + 2-opt + slot ordering
    |
    v  Route displayed to user
```

---

### Debug: Seeing Every Filtering Decision
The system logs every result with its fate. In DevTools console:
```
[API] cafes - 20 from Google, 8 kept:
  1. KEPT        Cafe 9 — 4.5 (340) [cafe]
  2. BLACKLIST   Hotel Cafe — 3.8 (120) | name or type contains "hotel"
  3. TYPE MISMATCH  The Lobby — 4.2 (89) | google types [lodging,hotel] don't match [cafe]
  4. NO MATCH    Art Studio — 4.1 (45) | name doesn't contain "street art"
[API] FINAL 6 places for cafes
```

In-app debug viewer (admin only): Settings -> Debug -> API tab shows the same in a UI panel.

---

### Adding or Modifying Interest Search Config
Changes go to Firebase: `settings/interestConfig/{interestId}`

Full config schema:
```js
{
  types: ['cafe', 'coffee_shop'],    // Google place types for Nearby Search
  textSearch: 'street art',           // OR: text query for Text Search (use one, not both)
  blacklist: ['cannabis', 'hotel'],  // words to exclude from name OR Google types
  routeSlot: 'bookend',              // slot in route (any/early/middle/bookend/end/late)
  minGap: 2,                          // min stops between same-interest stops in route
  bestTime: 'morning',               // time preference (morning/afternoon/evening/night/anytime)
  dedupRelated: ['restaurants'],     // related interest IDs for proximity dedup check
  privateOnly: false                  // true = skip Google entirely, show favorites only
}
```

**RULE: Test blacklist changes in debug mode first.**
A too-broad blacklist word silently removes valid results.
Example: adding "bar" to cafes blacklist eliminates "Bar Italia Cafe".
Always check the debug console after a config change.

---

## How to Identify and Report a Bug

### Get full console output
```
1. Open DevTools (F12) -> Console
2. Refresh the page
3. Reproduce the bug
4. Copy the full console output (including stack trace)
```

### What to look for
```
[DYNAMIC] Google error: 400  <- Google API config issue
[FIREBASE] Error: ...        <- Firebase permissions/structure
TypeError: ... is not a function  <- regression — function moved/deleted
Invalid hook call             <- hook inside IIFE
Assignment to constant        <- const instead of let
```

### Bug report template for new chat
```
Version: 3.9.x
Error: [short description]
Console output:
[paste here]
What I did before:
[action that triggered the bug]
```

---

## Major Changes This Session (v3.10.27 → v3.11.12)

### ארכיטקטורת תחומים — שינוי מרכזי

#### מה השתנה
**לפני:** תחומים היו מחולקים ל-3 סוגים:
1. `city.interests` — built-in עם חיפוש גוגל
2. `city.uncoveredInterests` — built-in ללא חיפוש גוגל
3. `customInterests` (Firebase) — עם `scope: global/local` ו-`cityId`

**אחרי:** תחום הוא תחום. סוג אחד בלבד:
- `uncoveredInterests` בוטל — מוזג לתוך `interests` עם `noGoogleSearch: true`
- `scope: local/global` בוטל — הכל גלובלי
- `cityId` על תחום בוטל — visibility מנוהל דרך `cityHiddenInterests`

#### מנגנון Visibility Per-City
```
settings/cityHiddenInterests/{cityId} = ["interest_id_1", "interest_id_2", ...]
```
- **Admin** קובע אילו תחומים חשופים/מוסתרים לכל עיר
- **User** רואה רק תחומים שה-admin לא הסתיר לעיר שלו
- **Default:** כל תחום חשוף בכל הערים
- תחום חדש שנוסף → **מוסתר אוטומטית** בכל הערים חוץ מהנוכחית

#### היררכיית Visibility
```
adminStatus: 'hidden'    → מוסתר לכולם בכל עיר (global)
adminStatus: 'draft'     → גלוי רק ל-unlocked users
cityHiddenInterests      → מוסתר לעיר ספציפית (admin per-city)
interestStatus[id]=false → כבוי למשתמש ספציפי
```

#### `noGoogleSearch: true`
תחומים שמיועדים לתיוג ידני בלבד (ללא חיפוש גוגל).
- `isInterestValid()` מחזיר `false` → ⚠️ מוצג אם תחום לא מוגדר כ-`noGoogleSearch` ואין לו `types`/`textSearch`
- לא מופיעים ב-fetchMore/Google search
- מופיעים ברשימת תחומים רגיל, ניתן לתייג מועדפים איתם

#### `isInterestValid(interestId)` — לוגיקה עדכנית
```js
// noGoogleSearch → return false (never searches Google)
// privateOnly → return true (manual only, valid for tagging)
// has interestConfig.types (array or string!) → return true
// has interestConfig.textSearch → return true
// has city's interestToGooglePlaces → return true
// otherwise → return false (⚠️ shown in UI)
// IMPORTANT: types can be string "shopping_mall" or array ["shopping_mall"] — both handled
```

#### ניהול תחומים בהגדרות — טאב "תחומים"
- רשימה מלאה של **כל** התחומים (מכל הערים + customInterests), מחולקת:
  - ✅ חשופים לעיר הנוכחית
  - 🙈 מוסתרים מעיר הנוכחית
- כפתורי ערים לצד כל תחום (🌍 אם כולן, אחרת אייקוני ערים) — לחיצה = toggle visibility
- עריכת תחום מתוך הרשימה (✏️)
- הוספת תחום חדש (+ הוסף תחום)

#### Export/Import
`cityHiddenInterests` נכלל בייצוא ויובא בחזרה.

---

### שינויים טכניים נוספים

**`authUserRef`** — הוספת ref שעוקב אחרי `authUser` בזמן אמת. מונע popup לוגין שגוי כשFirebase מרענן token (authUser היה `null` לשנייה).

**`showDedupDropdown`** — state ברמת component לדיאלוג תחומים קשורים (dedupRelated). נלמד מהבאג: `React.useState` בתוך IIFE = React error #310.

**browser autofill** — שדות email/password בדיאלוג התחברות קיבלו `autocomplete="username"` ו-`autocomplete="current-password"` — מונע autofill של שמות מקומות.

**`city icon upload`** — אייקון עיר בהגדרות תומך כעת בהעלאת קובץ תמונה (כמו אייקון תחום) + compressIcon(80px).

**Singapore** — עיר סינגפור עודכנה עם 5 אזורים (marina-bay, east, north, west, south-west).

---

### Known Regression — Never Return
**hooks inside IIFE** (React error #310):
`React.useState` בתוך `(() => { ... })()` בתוך JSX = crash מיידי.
**הפתרון הנכון:** state ברמת component (`app-logic.js`), או שימוש ב-`<details>/<summary>` HTML לtoggle ללא state.

---

## Major Changes This Session (v3.9.97 -> v3.9.98)

### v3.9.98 — City switch: stale data isolation fixes

**Problem 1: cityCustomLocations showed favorites from previous city**
- `cityCustomLocations` useMemo was returning `customLocations` as-is, trusting Firebase listener alone to filter per city.
- When switching cities, the old city's locations stayed in state until the new Firebase subscription responded (~100-500ms), causing wrong count in hamburger and wrong entries in favorites list.
- **Fix:** `switchCity()` now calls `setCustomLocations([])` immediately on city switch, before `setSelectedCityId`. Firebase listener for new city will repopulate.
- **Fix:** `cityCustomLocations` useMemo now actively filters: `customLocations.filter(loc => (loc.cityId || 'bangkok') === selectedCityId)`. This is a permanent safety net — even if a future code path forgets to clear, wrong-city locations can never surface.

**Problem 2: interestMap not updating reliably on city switch**
- `interestMap` useMemo had dependency `[cityCustomInterests, allInterestOptions.length]` — using `.length` means if two cities have the same number of interests, the map would NOT recompute, serving stale interest labels/icons from the previous city.
- **Fix:** Dependency changed to `[allInterestOptions]` — recomputes whenever the array reference changes (which happens on every city switch via `window.BKK.selectCity` + re-read of `window.BKK.interestOptions`).

**Root cause of "ללא תחום 224" section in Singapore favorites view:**
- Bangkok locations (with interest IDs like `temples`, `parks`, `canals`) were leaking into Singapore's view because `cityCustomLocations` wasn't filtering. Their interest IDs didn't exist in Singapore's `interestMap`, so they fell into `ungrouped` → displayed as "ללא תחום". Fixed by the two changes above.

**Note — interestOptions re-read on city switch:**
- `interestOptions` and `uncoveredInterests` are plain `const` reads from `window.BKK.*` (line ~3248). They are NOT in a useMemo/useEffect.
- They re-read correctly because React re-renders when `selectedCityId` state changes, and at that point `window.BKK.selectCity()` has already been called, so `window.BKK.interestOptions` already holds the new city's interests. This is correct behavior — no change needed.

## Major Changes This Session (v3.9.14 -> v3.9.16)

### v3.9.26 — Image lost when dedup dialog appears in QuickCapture
**Bug:** Gallery image not saved when dedup dialog appeared after capture.
**Root cause:** `handleDedupConfirm` action 'addNew' called `addCustomLocation(closeAfter)` without overrideData — fell back to stale `newLocation` which had no image.
**Fix:** `setDedupConfirm` now includes `overrideData` field. `handleDedupConfirm` addNew branch uses `dedupConfirm.overrideData` when available.
**RULE:** Any path that calls `addCustomLocation` after a dedup check must carry `overrideData` through — never assume `newLocation` is current.

### v3.9.25 — Dedup dialog hidden + capture interests logic
- `dialogs.js`: dedup confirm dialog zIndex raised from 10200 → 10400 (was hidden behind QuickCapture at 10300)
- `views.js`: capture interest priority logic (both FAB and active trail button):
  1. `lastCaptureInterestsRef` — user's manual selection this session (highest priority)
  2. `activeTrail.interests` — current trail interests (if in trail)
  3. `formData.interests` — wizard selections (fallback)
  Empty on session start only when none of the above exist
- `app-logic.js`: `startActiveTrail` resets `lastCaptureInterestsRef` → next capture after new trail starts fresh from trail interests

### v3.9.24 — QuickCapture: auto-name not generated + counter duplicate fix
**Bug 1:** Opening capture dialog second time with pre-selected interest (from lastCaptureInterestsRef) — no name generated because handleInterestToggle never fires.
**Fix 1:** Added `useEffect` in QuickAddPlaceDialog (captureMode) — runs on mount, calls `onAutoName` if interests pre-selected and name is empty.

**Bug 2:** Toggle interest off → back on → generates same name number that was just used (counter not updated).
**Fix 2:** `incrementCounters` in addCustomLocation now also calls `setInterestCounters(prev => {...prev, ...updates})` immediately, not waiting for Firebase listener. Next `generateLocationName` call uses correct counter.

### v3.9.23 — QuickCapture image not saved — root cause fixed
**Bug:** image uploaded from gallery (or camera) in QuickCapture was not saved to the location.
**Root cause:** `setNewLocation(enriched)` is async — React batches the update. `saveWithDedupCheck` was called immediately after, reading stale `newLocation` without the image.
**Fix:** 
- `saveWithDedupCheck(closeAfter, closeQuickCapture, overrideData)` — added optional 3rd param
- All internal `addCustomLocation` calls now pass `overrideData` through
- `onSave` in dialogs.js builds `finalLocation` object directly and passes it as `overrideData` — never touches stale state
- **RULE:** Never call `setNewLocation(x)` then immediately read `newLocation` in the next line — always use `overrideData` pattern or `useRef`

### v3.9.22 — Console cleanup + Firebase index
- `build.py`: `strip_for_production` now also removes `console.info` (was only log/warn)
- `config.js`, `i18n.js`: removed startup console calls — `[CONFIG] Loaded` and `[I18N] Loaded` no longer appear in production console
- `firebase-rules.json`: added `.indexOn: ["timestamp"]` to `/feedback` — fixes Firebase performance warning
- app-code.js: reduced from 838KB → 831KB (stripped console.info calls from RATING-REFRESH etc.)

### v3.9.21 — Capture dialog: session interests + editable name
- `app-logic.js`: added `lastCaptureInterestsRef` (useRef, session-only, not persisted)
  - Starts empty → first capture has no pre-selected interests
  - After each capture: ref updated with selected interests
  - Next capture in same session: same interests pre-selected
- `quick-add-component.js`: captureMode name field is now an editable input (was read-only display)
  - Auto-filled by generateLocationName when interest selected, but user can edit
  - Green border in captureMode, hint text shown when no interest selected yet
- `dialogs.js`: onAutoName passes full interests list to ref; onSave also updates ref
- `views.js`: all three capture entry points (FAB, active trail button, route results button) now use lastCaptureInterestsRef instead of formData.interests

### v3.9.20 — EXIF GPS removed from gallery upload
- `dialogs.js`: gallery file input no longer attempts EXIF GPS extraction (Android/iOS strip GPS from gallery images)
- `quick-add-component.js`: added protective comment on gallery input — EXIF only valid from openCamera()
- CLAUDE_CONTEXT: added EXIF GPS rule to Images section

### v3.9.19 — QuickCapture merged into QuickAddPlaceDialog
- `quick-add-component.js`: unified dialog for both modes via `captureMode` prop
  - `captureMode=false` (default): purple header, pill interests, name field — for adding Google places
  - `captureMode=true`: green header, grid interests, GPS indicator, auto-name, photo required — for FAB capture
  - Both modes: gallery + camera, description + notes + mic, star rating
- `dialogs.js`: removed old QuickCapture dialog (~200 lines), replaced with `<QuickAddPlaceDialog captureMode={true} />`
- EXIF GPS from camera photo bubbles up via `place._onGpsFromExif` callback
- Gallery kept in both modes — coordinates come from device GPS (captured when FAB opened), not from photo

### v3.9.17 — Double confirmation on reload fixed
- `applyUpdate()`: replaced `window.location.reload(true)` with `window.location.replace(pathname + '?_r=timestamp')`
  - `reload(true)` triggers browser-native "Changes may not be saved" confirm on Android Chrome (due to form inputs on page)
  - Navigation via `replace()` bypasses browser confirm entirely — one less dialog
- Footer "🔄 רענן" button: removed `showConfirm()` wrapper — applyUpdate() called directly (browser was showing TWO confirms)
- RULE: Never use `window.location.reload(true)` — deprecated, behaves same as `reload()` in modern browsers
- RULE: Never change the URL during applyUpdate (no `?_r=...`) — breaks Firebase `signInWithRedirect` pending state
- RULE: Always call `window.removeEventListener('beforeunload', window.__beforeUnloadHandler)` BEFORE any navigation in applyUpdate — the handler causes Android Chrome to partially tear down the JS context (including Firebase auth) while showing the native "Leave site?" dialog, resulting in user appearing logged out after reload

### v3.9.16 — Active Trail UX fixes
- FAB (floating 📸 button) now visible during active trail mode — was hidden by `!activeTrail` condition
- Active trail stop rows: added `flexWrap: 'wrap'` — button moves to next line when stop name is long
- Add-to-favorites button label: `+מועדף` -> `⭐+ שמור` (Hebrew) / `⭐+ Save` (English) — reflects both saving and rating

### v3.9.15 — Documentation and context
- CLAUDE_CONTEXT.md: added versioning rules block (no letters in version, bump every zip, check context before packaging)
- CLAUDE_CONTEXT.md: added full Google Places filtering section (7 layers)
- CLAUDE_CONTEXT.md: fixed Layer 7 — favorites do NOT always win, stopScore formula determines priority
- build.py: fixed missing `import os` that prevented builds

## Major Changes (v3.8.83 -> v3.9.14)

### i18n & UX
- Toast system: pushed to params, stats toast in correct order
- `sysParams` section renamed from `systemParams`
- 30+ new i18n keys
- `ratePlace` shortened to `'דרג'`

### Active Trail
- Star buttons replaced with pill buttons: `+Favorite` / `Rate` / `4.3 (100)`
- Skipped stops — only name grayed out, rest of row active (can still rate/add)
- Info button (hint) — fixed key from `hint_trail` to `activeTrail`

### QuickAddPlaceDialog
- New dialog for adding a Google place to favorites
- Separate component in `quick-add-component.js` (hooks must be outside IIFE)
- Inserted before `FouFouApp` via `// __INSERT_QUICK_ADD_COMPONENT__` in template
- Immediately updates local state after Firebase save
- **Images compressed to 120KB before saving** (regression fixed)

### Favorite Scoring
- Weighted score instead of binary custom/google
- 4 parameters in sysParams: `favoriteBaseScore`, `favoriteBonusPerStar`, `favoriteLowRatingThreshold`, `favoriteLowRatingPenalty`

### Images
- Duplicate `compressImage` deleted — one definition with quality loop, 120KB max, 900px
- Accepts both File and dataUrl

### Rating deletion
- `deleteCustomLocation` -> also deletes `reviews/{namePK}` in Firebase

### Mic in notes
- Added microphone button to notes field in addLocation dialog

---

*Last updated: 17/03/2026 — v3.9.14*
