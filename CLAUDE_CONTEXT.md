## כלל דיבאג — אחרי 3 קומיטים כושלים

> **אם אחרי 3 ניסיונות תיקון הבעיה לא נפתרה — STOP. אל תנחש יותר.**

במקום קומיט נוסף, קלוד חייב לעשות אחד מאלה:

1. **בקש דיבאג אקטיבי** — הוסף `console.log` ממוקדים לקוד, בקש מהמשתמש לפתוח F12 ולשלוח את הפלט. בנה **debug build** עם `python3 build.py --debug` (שומר console.log).

2. **ציין מה חסר לך** — "אני צריך לראות מה מחזיר X בזמן ריצה", "אני צריך לדעת אם Y נקרא בכלל".

3. **הסבר את ההנחות שלך** — "אני מניח ש-X קורה, אם לא — הבעיה היא Y". תן למשתמש לאשש או לסתור.

**אסור:** לבצע קומיט נוסף על בסיס ניחוש בלבד אחרי 3 כישלונות.

**דוגמה אמיתית שקרתה:** תיקון googleRating לקח 8 קומיטים. אחרי הדיבאג הראשון ב-Console ראינו בשורה אחת: `[useEffect] Syncing editingLocation to newLocation` — הבעיה נפתרה מיד.

---

# FouFou — City Trail Generator · Claude Development Context

> **לקלוד — חובה לקרוא לפני כל שינוי:**
>
> 1. קרא את כל הקובץ הזה לפני שאתה עושה כל שינוי.
> 2. **עדכן את הקובץ הזה לפני כל zip** — הוסף לסעיף "שינויים מרכזיים" את מה שעשית בסשן הנוכחי.
>    הגרסה והתאריך מתעדכנים אוטומטית ע"י `build.py` — אבל תיאור השינויים חייב להיכתב ידנית.
> 3. ה-zip חייב לכלול את `CLAUDE_CONTEXT.md` המעודכן.
> 4. אל תסמוך על אינטואיציה — המידע כאן הוא הבסיס.
> 5. **אל תחיה תחומים מחוקים.** אל תוסיף hardcoded IDs לקוד. אל תזהם את Firebase.

---

## 📍 מצב נוכחי

- **גרסה:** `3.12.37` (Mar 27, 2026)
- **Live:** https://eitanfisher2026.github.io/FouFou/
- **Working dir:** `/home/claude/project/` (extract zip here)
- **Tagline:** Local picks + Google spots. Choose your vibe, follow the trail

---

## Major Changes (v3.12.30 → v3.12.31) — Session Mar 27, 2026

### 🔬 Filter Log — מנגנון סינון חדש

**מה זה:** פאנל דיבאג חדש שמראה בדיוק מה Google החזיר לכל interest, מה עבר ומה סוּנן ולמה.

**Floating badge:** 🔬 מופיע בצד שמאל למטה כשdebug mode פעיל ויש נתונים. מציג ספירת ✅❌.

**הפאנל מציג לכל interest:**
- שם ה-interest, סוג חיפוש (text/category), הtypes שנחפשו, ה-blacklist הפעיל
- ✅ **עברו:** שם, ⭐rating, primaryType, matched types (מה התאים), keyword match, פתוח/סגור, כתובת
- ❌ **סוּננו:** שם, ⭐rating, primaryType + **badge צבעוני לפי שכבת הסינון:**
  - 🔴 Blacklist — המילה שתפסה
  - 🟠 Type — Google types שלא התאימו
  - 🟡 Text — phrase שלא נמצא בשם
  - ⚫ Closed — עסק סגור לצמיתות/זמנית
  - 🟢 Distance — מרחק חרג מהmax
  - 🟣 Ratings — מספר ביקורות מתחת ל-minimum

**שינויים ב-app-logic.js:**
- `filterLogRef` + `filterLog` state + `showFilterPanel` state
- `addToFilterLog({ interestId, interestLabel, searchType, ... })` — נקראת בסוף כל חיפוש interest
- TOO FAR + TOO FEW RATINGS מתווספים ל-`debugPlaceResults` (היו רק ב-console)
- `debugEntry` מועשר: `address`, `openNow`, `rank`, `totalFromGoogle`, `matchedTypes`
- `clearDebugSessions` מנקה גם את `filterLog`

**שינויים ב-views.js:**
- Badge floating חדש (סגול, במקום הכתום הישן)
- פאנל fullscreen חדש עם legend צבעוני, שתי רשימות מופרדות (passed/filtered)

---

## Major Changes (v3.12.16 → v3.12.30) — Session Mar 26, 2026

### cities/{cityId}/general — נתוני עיר ב-Firebase

כל נתוני העיר הגלובליים עברו לגור ב-`cities/{cityId}/general` — קריאה אחת, מקור אחד.

**שדות שנשארו בקובץ JS** (נדרשים לפני Firebase — GPS validation, city bounds):
- `center`, `allCityRadius`, `distanceMultiplier`, `country`, `active`, `areas[]`

**שדות שעברו ל-Firebase `general`:**
- `icon`, `iconLeft`, `iconRight` — אייקוני עיר
- `name`, `nameEn` — שמות עיר
- `color` — צבע header
- `dayStartHour`, `nightStartHour` — שעות יום/לילה

**Firebase rules** — נוסף:
```json
"cities": { "$cityId": { "general": { ".read": true, ".write": "role >= 2" } } }
```

**טעינה** — useEffect על `selectedCityId`:
```js
database.ref(`cities/${selectedCityId}/general`).once('value').then(s => {
  // מחיל על window.BKK.cities[selectedCityId]
  // אחרי טעינה: setCityEditCounter(c => c+1) לגרום ל-header לרנדר מחדש
})
```

**שמירה** — כל שמירה: `database.ref('cities/{id}/general/{field}').set(val)` + `isUnlocked` check + toast שגיאה

**cityEditCounter** — `void cityEditCounter` בתוך ה-IIFE של ה-header גורם לו לרנדר מחדש כשמשתנה.

---

### 🐛 באג פתוח — שמירת אייקוני עיר לא עובדת

**תסמין:** משתמש מעלה אייקון → נראה ב-UI → לא נשמר ב-Firebase. אין שגיאות ב-console.

**מה ידוע:**
- הקוד מגיע לשורת השמירה (אין exception לפניה)
- אין שגיאות Firebase ב-console
- Firebase ONLINE
- הנתונים **כן** קיימים ב-Firebase מה-migration הראשוני (color, hours, name)
- רק שמירה ידנית מה-UI לא עובדת

**מה שלא נבדק עדיין:**
- האם `isUnlocked` הוא `true` ברגע ההעלאה
- האם `database.ref(...).set(val)` אכן נקרא (לא ידוע בוודאות)
- האם יש race condition עם auth loading

**דיבאג נדרש בצאט הבא:**
1. הוסף `console.log('[CITY-SAVE] isUnlocked:', isUnlocked, 'isFirebase:', isFirebaseAvailable)` לפני כל שמירת אייקון
2. בקש מהמשתמש להעלות אייקון ולשלוח את פלט ה-console
3. רק אחרי שרואים את הפלט — לתקן

**אסור** להוסיף עוד קוד ניחושי לפני שרואים את הדיבאג.

---

### One-time migrations שנוספו בסשן זה
| key | מה עושה |
|-----|---------|
| `city_icons_migrated_v1221` | מעביר cityOverrides/theme → cities/{cityId}/general/ |
| `city_icons_to_general_v1223` | מעביר cities/{cityId}/icon\|iconLeft\|iconRight → general/ |
| `city_general_migrated_v1225` | מעביר dayStartHour/nightStartHour/color → general/ |
| `city_general_completed_v1228` | ממלא name/nameEn/icon חסרים לכל 4 הערים |

---

### קבצי עיר — ניקוי
הוסרו מ-`city-singapore.js` ו-`city-telaviv.js` (ו-`city-gushdan.js` → `city-telaviv.js`):
- `interestToGooglePlaces`, `textSearchInterests`, `interestTooltips`, `secondaryIcon`

`city-gushdan.js` → `city-telaviv.js` (registry key: `telaviv`, id פנימי: `gushdan`)

---

### אייקוני תחומים — יישור קו
- `compressIcon(file, 64, 2)` — מקסימום **2KB** (לא 15KB)
- icon שמור ב-`customInterests.icon` בלבד — לא ב-`interestConfig`
- migration `icons_migrated_to_customInterests_v1217` — העביר iconOverride → customInterests

---

### תחומים — תיקונים
- **`noGoogleSearch` לא נשמר** — נוסף מפורשות ל-`updatedInterest` בעריכה
- **Validation** — תחום Google ללא types/textSearch → לא ניתן לשמור
- **Orphan cleanup** `interestConfig_orphans_cleaned_v1219` — מוחק interestConfig + interestStatus + users/interestStatus orphans
- **Patch מחיה מתים הוסר** — `interest_config_patched_v123` הוחלף ב-cleanup
- **`renderIcon(icon, size)`** — תמיד להשתמש בפונקציה זו, לא `{icon}` גולמי

---

### Interest ID format
- כל ID: `i_` + labelEn lowercase: `i_temples`, `i_street_food_day`
- labelEn חובה ביצירה — ID נגזר ממנו ולא משתנה לעולם
- migration `interest_ids_migrated_v1213` עדכן **6 מקומות** ב-Firebase: customInterests, interestConfig, interestStatus, locations\[\].interests, routes\[\].preferences/stops/debug, users/interestStatus


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
city-bangkok.js         <- Bangkok city data, areas, system routes
city-telaviv.js         <- Tel Aviv (id פנימי: 'gushdan') city data, areas
city-singapore.js       <- Singapore city data, areas
city-malaga.js          <- Malaga city data, areas

Generated (DO NOT EDIT):
  app-data.js           <- i18n + city data + config + utils (~200KB)
  app-code.js           <- Full JSX app (~938KB)
  index.html            <- Splash shell (~11KB)
```

**קבצי עיר מכילים:** `id, name, nameEn, country, icon, theme, active, distanceMultiplier, dayStartHour, nightStartHour, center, allCityRadius, areas[], systemRoutes[]`
**קבצי עיר אינם מכילים:** `interests, interestToGooglePlaces, textSearchInterests, interestTooltips, secondaryIcon` — כל אלה הוסרו.

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
# utils.js / config.js / i18n.js / city-*.js: all () +0 {} +0 [] +0

# 4. Parse check
node -e "const window={BKK:{}}; const localStorage={getItem:()=>null}; eval(require('fs').readFileSync('app-data.js','utf8')); console.log('OK')" 2>&1 | grep -v CONFIG | grep -v I18N
```

---

## Version Bump + Package — MANDATORY FOR EVERY ZIP

> ### פורמט: `X.Y.Z` — שלושה מספרים בלבד
> אסור: אותיות, סיומות. WRONG: `3.10.1b` — CORRECT: `3.10.2`
>
> **Z — Patch** (ברירת המחדל) — תיקון באג, שיפור UI קטן, refactor
> **Y — Minor** — פיצ'ר חדש, שינוי אלגוריתם, הוספת עיר, שינוי מבנה Firebase
> **X — Major** — החלטה מפורשת של אייתן בלבד
>
> ספק → תמיד patch. Major = אייתן מחליט.

```bash
# 1. Bump version
sed -i "s/VERSION = '3\.12\.22'/VERSION = '3.12.23'/" config.js

# 2. Sync version.json
python3 -c "import re; s=open('config.js').read(); v=re.search(r\"VERSION\s*=\s*'([^']+)'\", s).group(1); open('version.json','w').write('{\"version\": \"'+v+'\"}')"

# 3. Build
python3 build.py

# 4. Package — city-telaviv.js (לא city-gushdan.js)
zip github-upload-vX_Y_Z.zip \
  index.html app-data.js app-code.js \
  i18n.js config.js utils.js app-logic.js views.js dialogs.js \
  quick-add-component.js \
  city-bangkok.js city-telaviv.js city-singapore.js city-malaga.js \
  _source-template.html _app-code-template.js build.py README.md .nojekyll \
  CLAUDE_CONTEXT.md manifest.json favicon.ico version.json \
  icon-16x16.png icon-32x32.png icon-180x180.png icon-192x192.png icon-512x512.png \
  firebase-rules.json
```

---

## SECURITY — API Key Protection

> **חובה לבדוק לפני כל ZIP.**

**GOOGLE_PLACES_API_KEY:** `AIzaSyCE598tSisniM66ApqRvOyOq4svTf6pLHc`
- Restriction: HTTP referrers → `https://eitanfisher2026.github.io/*` only
- API restriction: Places API (New) only

**Firebase config** — מוגן ע"י Security Rules, לא ע"י סודיות.

---

## CRITICAL RULES — Never Break

### Syntax
- **Single quotes in JSX** = Babel error. Always use double quotes.
- **const -> let** when reassigning
- **`window.BKK.i18n.t()` does not exist** — use `t('key')` from scope, or `window.t('key')`
- **Hooks** — must be at component level. Never inside IIFE, never inside conditionals.
  - `QuickAddPlaceDialog` lives in `quick-add-component.js` — inserted before `FouFouApp`

### Firebase
- `firebaseId` (not `firebaseKey`)
- After Firebase write → **also update local React state immediately** (optimistic update)
- `sanitizeMapsUrl()` before every Firebase save of a location
- `googlePlaceId` validation: `/^(ChIJ|EiI|GhIJ)/`
- **אל תחיה מתים** — אל תכתוב hardcoded IDs לFirebase. אל תוסיף configs לתחומים שנמחקו.

### Icons
- `compressIcon(file, 64, 2)` — אייקוני תחומים (64px, מקסימום 2KB)
- `compressIcon(file, 80, 15)` — אייקון ראשי עיר (80px, מקסימום 15KB)
- `compressIcon(file, 64, 15)` — iconLeft/iconRight עיר (64px, מקסימום 15KB)
- אף פעם לא `compressImage` לאייקונים

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

---

## Firebase Structure — מבנה נוכחי נקי

```
cities/{cityId}/locations/{id}         <- favorites
cities/{cityId}/routes/{id}            <- saved routes
cities/{cityId}/reviews/{namePK}/{uid} <- ratings
cities/{cityId}/general/icon            <- אייקון ראשי עיר (emoji או data: URL)
cities/{cityId}/general/iconLeft        <- אייקון שמאל (emoji או data: URL)
cities/{cityId}/general/iconRight       <- אייקון ימין (emoji או data: URL)
cities/{cityId}/general/name            <- שם עברית
cities/{cityId}/general/nameEn          <- שם אנגלית
cities/{cityId}/general/color           <- צבע header
cities/{cityId}/general/dayStartHour    <- שעת התחלת יום
cities/{cityId}/general/nightStartHour  <- שעת התחלת לילה

customInterests/{fbKey}:
  id: "i_temples"       <- i_ prefix תמיד
  label: "מקדשים"        <- שם עברית (מקור יחיד)
  labelEn: "Temples"    <- שם אנגלית (בסיס ה-ID)
  icon: 🛕              <- emoji או data: URL (מקסימום 2KB)
  # NO labelOverride, NO iconOverride, NO scope, NO cityId

settings/interestConfig/{id}:
  types: [...]          <- הגדרות חיפוש ONLY
  textSearch: "..."
  blacklist: [...]
  bestTime, routeSlot, weight, minStops, maxStops, minGap, dedupRelated
  noGoogleSearch: true  <- תחום פנימי (ללא גוגל)
  # NO labelOverride, NO labelEnOverride, NO iconOverride

settings/interestStatus/{id}           <- default enabled/disabled
settings/cityHiddenInterests/{cityId}  <- array of interest IDs hidden for that city (מנוקה מ-IDs יתומים)
settings/cityOverrides/{cityId}        <- ריק בפועל — כל הנתונים עברו ל-cities/{cityId}/general
settings/systemParams                  <- admin system params

users/{uid}/interestStatus/{id}        <- per-user overrides (מנוקה מ-IDs יתומים)
users/{uid}/role                       <- 0=regular, 1=editor, 2=admin

helpContent/{sectionId}/{lang}
accessLog/{id}, feedback/{id}
```

**שדות שהוסרו לגמרי מ-Firebase:**
- `settings/cityOverrides/*/theme` — הועבר ל-`cities/{cityId}/general/`
- `settings/cityOverrides/*/interests` — הוסר
- `settings/interestConfig/*/labelOverride|labelEnOverride|iconOverride` — הועבר ל-customInterests
- `settings/interestStatus` orphans — מנוקה
- `users/*/interestStatus` orphans — מנוקה

---

## ארכיטקטורת תחומים — Single Source of Truth

### עיקרון
כל התחומים חיים ב-`customInterests` ב-Firebase בלבד. אין hardcoded lists בקוד.
קבצי עיר (city-*.js) **אינם מכילים** שום מידע על תחומים.

### Interest ID — פורמט
```
i_temples, i_coffee, i_street_food_day, i_night_markets
```
- תמיד `i_` + labelEn lowercase underscored
- נגזר מ-`labelEn` **בעת יצירה בלבד** — לא משתנה לעולם
- שינוי `labelEn` אחרי יצירה = שינוי תצוגה בלבד

### יצירת תחום חדש
- `labelEn` חובה (אחרת toast שגיאה + חסימה)
- ID = `i_` + labelEn → בדיקת ייחודיות
- תחום Google ללא types/textSearch → לא ניתן לשמור (ולידציה בdialog)
- `noGoogleSearch` נכתב מפורשות ב-customInterests בכל שמירה (למנוע חזרה ל"פנימי")

### Visibility Per-City
```
settings/cityHiddenInterests/{cityId} = ["i_temples", "i_coffee", ...]
```
- תחום חדש → מוסתר אוטומטית בכל הערים חוץ מהנוכחית
- adminStatus: 'hidden' → מוסתר לכולם בכל עיר
- adminStatus: 'draft' → גלוי רק ל-unlocked users

### `isInterestValid(interestId)`
```js
// noGoogleSearch → return false (never searches Google)
// privateOnly → return true (manual only, valid for tagging)
// has interestConfig.types → return true
// has interestConfig.textSearch → return true
// otherwise → return false
```

### One-time migrations (localStorage keys)
| key | מה עושה |
|-----|---------|
| `restore_culture_shopping_v125` | מחזיר culture/shopping ל-active |
| `labels_migrated_to_customInterests_v1211` | labelOverride/labelEnOverride → customInterests |
| `icons_migrated_to_customInterests_v1217` | iconOverride → customInterests.icon, מוחק מ-interestConfig |
| `interest_ids_migrated_v1213` | כל IDs → i_ prefix (עדכון ב-6 מקומות ב-Firebase) |
| `cityOverrides_interests_cleaned` | מוחק interests/uncoveredInterests מ-cityOverrides |
| `cityHidden_cleaned_v124` | מסיר IDs יתומים מ-cityHiddenInterests |
| `interestConfig_orphans_cleaned_v1219` | מוחק interestConfig + interestStatus + users/interestStatus orphans |
| `city_icons_migrated_v1221` | מעביר cityOverrides/theme → cities/{cityId}/general/ |
| `city_icons_to_general_v1223` | מעביר cities/{cityId}/icon|iconLeft|iconRight → cities/{cityId}/general/ |

---

## אייקוני עיר — מבנה נוכחי

### שלושה שדות לכל עיר
| שדה | Firebase path | JS file |
|-----|--------------|---------|
| אייקון ראשי | `cities/{cityId}/general/icon` | `city.icon` |
| אייקון שמאל | `cities/{cityId}/general/iconLeft` | `city.theme.iconLeft` |
| אייקון ימין | `cities/{cityId}/general/iconRight` | `city.theme.iconRight` |

### כללים
- data: URLs נשמרים ל-Firebase בלבד — **לא** לקבצי JS
- `exportCityFile` מנקה data: URLs לפני export
- בטעינה: `cities/{cityId}/general` נקרא מ-Firebase (single read) ומוחל על `window.BKK.cities`
- רינדור: תמיד `icon?.startsWith('data:') ? <img src={icon}> : icon` — לעולם לא `{icon}` גולמי

---

## cityRegistry — ערים נוכחיות

```js
cityRegistry = {
  bangkok: { id: 'bangkok', name: 'בנגקוק', nameEn: 'Bangkok', file: 'city-bangkok.js' },
  telaviv: { id: 'gushdan', name: 'תל אביב', nameEn: 'Tel Aviv', file: 'city-telaviv.js' },
  singapore: { id: 'singapore', name: 'סינגפור', nameEn: 'Singapore', file: 'city-singapore.js' },
  malaga: { id: 'malaga', name: 'מאלגה', nameEn: 'Malaga', file: 'city-malaga.js' },
}
```

**שים לב:** registry key של תל אביב הוא `telaviv` אבל ה-id הפנימי ב-Firebase הוא `gushdan` (cities/gushdan). שינוי ה-id ב-Firebase — לא בוצע, דורש החלטה.

---

## i18n System

```js
t('section.key')          // correct — from scope
window.BKK.i18n.t(...)   // DOES NOT EXIST
window.t(...)             // exists (global wrapper)
```

**כל toast חייב להשתמש ב-`t('key')`** — לא hardcoded טקסט, גם admin-only.
**Dynamic values:** `.replace('{count}', n)` pattern.

---

## Central State (app-logic.js)

| State | Description |
|-------|-------------|
| `customInterests` | כל התחומים — נטען ע"י real-time listener בלבד |
| `interestConfig` | הגדרות חיפוש לכל תחום |
| `interestStatus` | default enabled/disabled |
| `cityHiddenInterests` | `{ cityId: Set<id> }` |
| `route` | current route — `stops[], optimized, startPointCoords` |
| `formData` | area, interests, searchMode, maxStops, startPoint, coords, radiusMeters |
| `activeTrail` | active trail during walk |
| `customLocations` | all favorites (includes cityId, firebaseId) |
| `systemParams` | admin params — loaded from Firebase `settings/systemParams` |
| `authUser` | Firebase auth user |
| `isAdmin` / `isEditor` / `isUnlocked` | roles |

### Loading Order
- App shows after `interestConfig + interestStatus` load (Promise.all)
- `customInterests` — real-time listener (נפרד מה-Promise.all)
- `locations` + `routes` — נטענים ברקע
- `cities/{cityId}/general` — נקרא בטעינת כל עיר (single read)

---

## systemParams

```js
maxStops: 10, fetchMoreCount: 3, googleMaxWaypoints: 12,
defaultRadius: 500, toastDuration: 4000, includeDrafts: true,
dedupRadiusMeters: 50, dedupGoogleEnabled: 1, dedupCustomEnabled: 1,
trailTimeoutHours: 8, defaultInterestWeight: 3,
maxContentPasses: 3, contentReorderEnabled: true,
twoOptMaxPasses: 20,
timeScoreMatch: 2, timeScoreAnytime: 1, timeScoreConflict: 0,
timeConflictPenalty: 3,
slotEarlyThreshold: 0.4, slotLateThreshold: 0.6,
slotEndThreshold: 0.7, slotPenaltyMultiplier: 3,
slotEndPenaltyMultiplier: 4, gapPenaltyMultiplier: 2,
speechMaxSeconds: 15, speechRate: 1.0,
favoriteBaseScore: 20, favoriteBonusPerStar: 5,
favoriteLowRatingThreshold: 2.5, favoriteLowRatingPenalty: 60,
googleMinRatingCount: 20, googleLowRatingCount: 60,
```

---

## Stop Scoring

```js
const googleScore = rating x log10(ratingCount + 1)
// Favorite, no FouFou rating:      googleScore + 20
// Favorite, FouFou rating >= 2.5:  googleScore + 20 + avg*5
// Favorite, FouFou rating < 2.5:   googleScore + 20 - 60
// Google-only place:               googleScore
```

---

## Optimal Route Algorithm

**Phase 0:** smartSelectStops → buckets per interest → sort by score → pick top N
**Phase 1:** Nearest Neighbor
**Phase 2:** 2-opt improvement
**Phase 3:** Content-aware reorder (slot positioning)
**Phase 4:** Auto-reoptimize (debounce 600ms) on startPoint/fetchMore/skip

---

## Google Places API

### Two Search Modes
| Mode | API | Config |
|------|-----|--------|
| Nearby Search | `places:searchNearby` | `types: [...]` |
| Text Search | `places:searchText` | `textSearch: "..."` |

### Filtering Pipeline (7 layers)
```
Google API (20 results)
  → [L2] Blacklist words (name + Google types)
  → [L3] Relevance (text search: name must contain phrase)
  → [L4] Type validation (category: types must match)
  → [L5] Distance (radius × distanceMultiplier)
  → [L6] User blacklist (status='blacklist')
  → [L7] Dedup vs custom locations
  → ~5-12 results → smartSelectStops → optimizeStopOrder
```

### ABSOLUTE RULE: Never build a Google Maps URL manually
```js
// ALWAYS:
const url = window.BKK.getGoogleMapsUrl(place);
// NEVER: `https://www.google.com/maps/place/?q=place_id:${id}`
```

### FieldMask — cost control
Always request only necessary fields. Never add `places.photos`, `places.website` automatically.

---

## Images & Compression

```js
window.BKK.compressImage(input, maxSizeKB=120)  // photos — max 900px, 120KB
window.BKK.compressIcon(input, maxSize=64, maxKB=15)  // icons — see limits above
```

**RULE:** Always compress before Firebase save.
**RULE:** EXIF GPS — camera only (`openCamera()`), never gallery files.
**RULE:** Never save data: URLs to city JS files.

---

## Shared Functions — Always Use Existing

| Need | Function | File |
|------|----------|------|
| Google Maps URL | `window.BKK.getGoogleMapsUrl(place)` | utils.js |
| Compress image | `window.BKK.compressImage(input, maxSizeKB)` | utils.js |
| Compress icon | `window.BKK.compressIcon(input, maxSize, maxKB)` | utils.js |
| Interest color | `window.BKK.getInterestColor(id, allInterests)` | utils.js |
| GPS validation | `window.BKK.getValidatedGps(onSuccess, onError)` | utils.js |
| Sanitize URL | `sanitizeMapsUrl(loc)` | app-logic.js (local) |
| Speech-to-text | `window.BKK.startSpeechToText(options)` | utils.js |

---

## localStorage Keys

| Key | מה |
|-----|----|
| `city_explorer_city` | עיר נוכחית |
| `city_explorer_lang` | שפה |
| `city_active_states` | ערים פעילות |
| `foufou_active_trail` | מסלול פעיל |
| `foufou_visitor_id/name` | analytics |
| `foufou_fab_pos`, `foufou_right_col_width` | UI micro |
| migration flags | (ראה טבלת migrations למעלה) |

---

## Known Regressions — Must Never Return

1. **Duplicate compressImage** — one definition only in utils.js
2. **window.BKK.i18n.t()** — does not exist, use `t('key')`
3. **Hooks inside IIFE** — React error #310, put in component level
4. **Firebase key in googlePlaceId** — always validate `/^(ChIJ|EiI|GhIJ)/`
5. **Reviews not deleted with location** — always delete `reviews/{namePK}` too
6. **const on reassigned variable** — use `let`
7. **Single quotes in JSX** — always double quotes
8. **icon rendered as raw text** — always `renderIcon(icon, size)` or `icon?.startsWith('data:') ? <img> : icon`
9. **noGoogleSearch not saved to customInterests** — חייב להיכלל מפורשות ב-updatedInterest
10. **Patch שמחיה תחומים מחוקים** — הוסר. אל תוסיף hardcoded IDs ל-Firebase

---

## Firebase Write → Local State

**כל Firebase write שמשנה state מוצג חייב גם לעדכן local React state מיידית.**

```js
// CORRECT:
setCustomLocations(prev => prev.map(l => l.id === id ? { ...l, status: 'blacklist' } : l));
database.ref(...).update({ status: 'blacklist' });
```

---

## מבנה הקלטה קולית

```js
const stop = window.BKK.startSpeechToText({
  onResult: (text, isFinal) => {
    if (isFinal) setField(prev => prev + ' ' + text);  // append only
    // isFinal=false → display only, never save to state
  },
  onEnd: () => { ... }
});
```

---

## mapsUrl — Never Save Broken URLs

- `maps.app.goo.gl/*` — אסור
- `goo.gl/*` — אסור
- URL ללא `google.com/maps` — אסור
- תמיד `sanitizeMapsUrl(loc)` לפני שמירה
- Layer 1: `isBrokenMapsUrl()`, Layer 2: `sanitizeMapsUrl()`, Layer 3: `getGoogleMapsUrl()`, Layer 4: repair useEffect

---

## Debug Console Prefixes

```
[CONFIG], [UTILS], [GPS], [DYNAMIC], [SMART], [OPTIMIZE],
[FIREBASE], [AUTH], [RATING-REFRESH], [STORAGE], [EXIF],
[SYNC], [MIGRATION], [MAP], [CLEANUP]
```

