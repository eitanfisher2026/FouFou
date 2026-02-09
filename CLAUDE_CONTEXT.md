# Bangkok Explorer - Claude Development Context

## Version: 2.9.0 (Feb 9, 2026)
## Live: https://eitanfisher2026.github.io/bangkok-explorer/

## Architecture

Single-page React app (in-browser Babel, no build tools). Files are split for development and combined by `build.py` into `index.html`.

### File Structure & Build
```
_source-template.html  ← HTML shell with Firebase init, CSS, render
config.js              ← Interest definitions, help content, area configs
utils.js               ← Pure functions: distance, sorting, dedup, scoring
app-logic.js           ← React state, Firebase sync, route generation, all handlers
views.js               ← JSX views: form, route results, search, saved routes, myPlaces, myInterests, settings
dialogs.js             ← JSX dialogs: location edit, interest edit, route edit, access log, help, confirm, password, image modal
build.py               ← Concatenates files → index.html
```

**Build**: `python3 build.py` → produces `index.html` (~7600 lines)
**Deploy**: Copy `index.html` + static files to GitHub Pages

### Key Design Patterns
- **RTL Hebrew UI** with `dir="rtl"` throughout
- **Firebase Realtime Database** for shared data (locations, interests, configs)
- **localStorage fallback** when Firebase unavailable
- **Admin system**: Password-based unlock (`isUnlocked` state), controls edit/delete of locked items
- **Interest system**: Built-in interests (from config.js) + custom interests (user-created, stored in Firebase)
- **Route generation**: Google Places API (New) with text search and nearby search

## State Management (app-logic.js)

### Core State
| State | Purpose |
|-------|---------|
| `route` | Current generated route object |
| `formData` | Form inputs (area, interests, hours, etc.) |
| `currentView` | Active view: 'form', 'route', 'search', 'saved', 'myPlaces', 'myInterests', 'settings' |
| `customLocations` | User's saved places (Firebase-synced) |
| `customInterests` | User-created interests (Firebase-synced) |
| `interestStatus` | Enable/disable per interest (Firebase-synced) |
| `interestConfig` | Search config overrides per interest (Firebase-synced) |
| `savedRoutes` | Saved route objects (localStorage, stripped of base64 images) |
| `isUnlocked` | Admin mode active |
| `isRefreshing` | Manual refresh in progress |
| `isDataLoaded` | All initial Firebase/localStorage data loaded (controls loading spinner) |
| `isCurrentUserAdmin` | Current device is in admin users list |

### Dialog State
| State | Dialog |
|-------|--------|
| `showAddLocationDialog` / `showEditLocationDialog` + `editingLocation` | Location create/edit dialog |
| `showAddInterestDialog` + `editingCustomInterest` + `newInterest` | Interest create/edit dialog (unified) |
| `showRouteDialog` + `editingRoute` + `routeDialogMode` | Route view/edit dialog |
| `showAccessLog` | Access log dialog (admin) |
| `showHelp` + `helpContext` | Help dialog |
| `showConfirmDialog` + `confirmConfig` | Confirmation dialog |
| `showPasswordDialog` | Admin password dialog |
| `showImageModal` + `modalImage` | Image enlargement modal |
| `showImportDialog` + `importedData` | Data import confirmation dialog (shows counts, calls handleImportMerge) |
| `showFeedbackDialog` + `feedbackText` + `feedbackCategory` | User feedback submission dialog |
| `showFeedbackList` + `feedbackList` | Admin feedback viewer dialog |

### Key Functions
| Function | Purpose |
|----------|---------|
| `generateRoute()` | Main route generation from form inputs |
| `fetchDynamicStops()` | Google Places API calls per interest |
| `quickSaveRoute()` | Save route (strips base64 images) → opens route dialog |
| `loadSavedRoute()` | Load saved route → route results view |
| `updateRoute()` | Update route metadata (name, notes, status) |
| `deleteRoute()` | Delete saved route |
| `saveRoutesToStorage()` | Safe localStorage save with image stripping |
| `handleEditLocation()` | Open location edit dialog |
| `addGooglePlaceToCustom()` | Add Google place to custom locations |
| `skipPlacePermanently()` | Blacklist a place |
| `toggleLocationStatus()` | Toggle location active/blacklist |
| `toggleInterestStatus()` | Toggle interest enabled/disabled |
| `fetchGooglePlaceInfo()` | Get Google place details for a location |
| `showHelpFor(context)` | Open help dialog with specific content |
| `showConfirm(msg, cb)` | Show confirmation dialog |
| `showToast(msg, type)` | Show toast notification |
| `submitFeedback()` | Submit user feedback to Firebase |
| `toggleFeedbackResolved()` | Toggle feedback resolved status (admin) |
| `deleteFeedback()` | Delete a feedback item (admin) |

## Data Objects

### Location Object
```js
{
  id, firebaseId, name, description, notes,
  address, area, interests: [], // array of interest IDs
  lat, lng, rating, ratingCount,
  uploadedImage, // base64 (not saved to localStorage routes)
  status: 'active' | 'blacklist',
  inProgress: bool, // work in progress flag
  locked: bool, // admin-only edit protection
  custom: true // flag for user-created places
}
```

### Interest Object (Built-in from config.js)
```js
{
  id: 'temples', label: 'מקדשים', icon: '🛕',
  searchMode: 'types' | 'text',
  types: 'buddhist_temple,hindu_temple', // for types mode
  textSearch: 'street art Bangkok', // for text mode
  blacklistWords: ['hotel', 'restaurant'],
  uncovered: bool // not shown by default
}
```

### Custom Interest (Firebase)
```js
{
  id: 'custom_1234', label: 'שם', icon: '📍' | 'data:image/...', // emoji or uploaded image
  inProgress: bool, locked: bool
}
```

### Route Object
```js
{
  id, name, defaultName, notes,
  areaName, interestsText, circular: bool,
  startPoint, startPointCoords: { lat, lng, address },
  stops: [...], preferences: {...}, stats: {...},
  savedAt, inProgress: bool, locked: bool
}
```

## Views Layout (views.js)

1. **Form View** (`currentView === 'form'`): Area selector, interest checkboxes, duration, route type, start point, generate button
2. **Route View** (`currentView === 'route'`): Stop list with map links, skip/blacklist buttons, save button, share
3. **Search View** (`currentView === 'search'`): Google Places text search, add to custom locations
4. **Saved Routes** (`currentView === 'saved'`): List sorted by area/name, click=load route, ✏️=edit dialog
5. **My Places** (`currentView === 'myPlaces'`): Active + blacklisted locations, grouped by interest/area
6. **My Interests** (`currentView === 'myInterests'`): Active + inactive interests with ✏️ edit
7. **Settings** (`currentView === 'settings'`): Admin panel, debug toggle, data management

## Dialogs (dialogs.js)

### Location Dialog (Add/Edit unified)
- Name, address, description, notes, area, interests, coordinates
- Image upload with preview + enlarge
- "פתח בגוגל" + "מידע מגוגל" buttons (Google Maps + place info)
- Status toggles: בעבודה, נעול (admin only)
- Skip/Restore toggle: "דלג לצמיתות" ↔ "החזר כמקום פעיל" (auto-enables בעבודה on restore)
- Delete button
- Lock protection: yellow banner when locked + not admin

### Interest Dialog (Add/Edit unified)
- Header: "הוסף תחום עניין" (add) / icon + name (edit)
- Badge: "🏗️ מערכת" (built-in, blue) or "👤 אישי" (custom, purple)
- Name + Icon fields (icon supports emoji or file upload)
- Search config: mode (types/text), types field, text query, blacklist words
- Status toggles: בעבודה, נעול (admin only)
- Enable/Disable toggle button
- Delete: custom interests always; system interests admin-only with different warning messages
- Lock protection for non-admin

### Route Dialog (Add/Edit)
- Header: "הוסף מסלול שמור" (new) / "ערוך מסלול שמור" (edit)
- Info area: area, interests (icons+labels), circular/linear, start point
- Editable: name, notes
- Stops list (numbered with ratings)
- Share buttons: "שתף מסלול" (summary) + "שתף נקודות עניין" (detailed with addresses/links)
- Status toggles: בעבודה, נעול
- Delete button
- Footer: עדכן + פתח מסלול + סגור (or locked message)

## Google Places API Integration

### API Key
In `config.js` as `window.BKK.GOOGLE_API_KEY`

### Search Modes
1. **Types search** (Nearby Search): `searchNearby` with `includedTypes`
2. **Text search**: `searchText` with `textQuery`

### Field Masks
`places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.types,places.primaryType,places.primaryTypeDisplayName,places.currentOpeningHours`

### Filtering Pipeline
1. Google returns max 20 results
2. Filter: blacklist words + irrelevant types
3. Filter: duplicates (exact name match with custom locations)
4. Score: `rating × log(ratingCount + 1)`
5. Take top N per interest

## Firebase Structure
```
/customLocations/{id}  ← location objects
/customInterests/{id}  ← custom interest objects
/settings/interestConfig/{id}  ← search config per interest
/settings/interestStatus/{id}  ← enabled/disabled per interest
/settings/adminPasswords  ← admin password list
/accessLog/{id}  ← visitor access logs
/feedback/{id}   ← user feedback (category, text, userId, timestamp, currentView, resolved)
```

## Important Implementation Notes

### localStorage Quota
Route objects can contain base64 images in stops. `saveRoutesToStorage()` strips `uploadedImage` from all stops before saving. All route saves must go through this function.

### Route Save Flow
1. User clicks 💾 → `quickSaveRoute()` runs
2. Auto-generates name from area + interests + sequential number
3. Saves stripped route to localStorage
4. Opens route dialog in "add" mode for editing name/notes

### Route Load Flow
1. User clicks route row in saved list → `loadSavedRoute()`
2. Sets route state, restores form data, start point coords, route type
3. Navigates to route results view (`currentView = 'route'`)

### Interest Types
- **Built-in**: Defined in config.js, name/icon read-only, search config editable
- **Uncovered**: Built-in but hidden by default, must be explicitly enabled
- **Custom**: User-created, fully editable, `id` starts with `custom_`

### Lock Protection Pattern
All three entity types (location, interest, route) support:
- `inProgress: bool` — work-in-progress badge (🛠️)
- `locked: bool` — admin-only protection (🔒)
- When locked + not admin: yellow banner, save/delete disabled, view-only mode

### Admin System
- Password-based: stored in Firebase `/settings/adminPasswords`
- `isUnlocked` state = admin mode active
- Controls: lock field visibility, locked item editing, system interest deletion, access log

## Packaging & Deployment

When the user asks to prepare zip files for delivery, always produce **two** zip files:

| Zip File | Contents | Purpose |
|----------|----------|---------|
| `claude-dev.zip` | All source files **+ `CLAUDE_CONTEXT.md`** | For uploading to the next Claude chat session |
| `github-upload.zip` | All source files **without `CLAUDE_CONTEXT.md`** | For pushing to GitHub Pages repo |

**Source files** (both zips): `index.html`, `config.js`, `utils.js`, `app-logic.js`, `views.js`, `dialogs.js`, `_source-template.html`, `build.py`, `README.md`, `.nojekyll`

⚠️ `CLAUDE_CONTEXT.md` must **never** be in `github-upload.zip` and must **always** be in `claude-dev.zip`.

After creating the zips, verify each file in the generated zips is byte-identical to the source.

## Code Quality Notes (v2.9.0)

### v2.9.0 Changes — Radius Search Mode
- **New search mode**: Toggle between "area" (existing) and "radius" (new) in the form view
- **formData new fields**: `searchMode` ('area'/'radius'), `radiusMeters` (100-2000, default 500), `radiusSource` ('gps'/'myplace'), `radiusPlaceId`, `currentLat`, `currentLng`
- **Radius source toggle**: Within radius mode, choose between 📍 GPS (geolocation) or 🏠 מקום שלי (pick from custom locations with search)
- **My Place picker**: Text search input filters customLocations by name, clicking selects and sets currentLat/currentLng from location coords
- **Distance-based sorting**: In radius mode, results sorted by distance from center (closest first), with rating as tiebreaker. In area mode, original rating-based sort preserved.
- **calcDistance(lat1, lng1, lat2, lng2)**: New Haversine helper used throughout for distance calculations
- **distFromCenter**: Each stop gets distance in meters from center, displayed as green badge
- **fetchGooglePlaces**: Now accepts optional `radiusOverride` param `{lat, lng, radius}` for direct center/radius search
- **detectAreaFromCoords(lat, lng)**: New helper - returns areaId of closest matching area, or null if outside all
- **Area filtering**: In radius mode, places outside all known areas are filtered out
- **Area + distance badges**: Each stop shows blue area badge + green distance badge in radius mode results
- **getStopsForInterests**: In radius mode, filters custom locations by distance using calcDistance
- **generateRoute**: Dual validation — area mode requires area+interests, radius mode requires GPS+interests
- **Route naming**: Shows source name, e.g. "500מ' מ-Wat Pho" or "500מ' מ-מיקום נוכחי"
- **Settings**: New "רדיוס ברירת מחדל" slider in settings page
- **placeSearchQuery state**: New state for filtering custom locations in my-place picker
- **Backward compat**: Existing saved preferences auto-get searchMode='area', radiusMeters=500, radiusSource='gps'
- Removed: old save dialog (replaced by quickSaveRoute), location detail modal, stop info dialog triggers, debug panel UI
- All bracket/paren balanced (verified by build)
- No dead state variables
- No orphan dialogs
- Backup/temp files cleaned up

### v2.8.4 Changes
- **Tab colors**: Each tab now has a unique color: 🗺️ orange, 💾 blue, 📍 teal, 🏷️ purple, 🔓 slate
- **Internal button consistency**: "הוסף מקום" buttons changed to teal to match places tab; search focus ring changed to teal
- **Smooth transitions**: Added `view-fade-in` CSS animation (0.2s ease-out) on all view sections to prevent jarring jumps when switching tabs. Tabs also scroll to top on click.
- **Removed duplicate access log**: Removed redundant access log button/section at bottom of settings (already accessible from admin panel)
- **Feedback indicator**: Red dot with white border on settings lock icon when new feedback/entries (admin only)
- **Lock icon**: Already dynamic (🔓 when unlocked/no password, 🔒 when locked) — confirmed working

### v2.8.3 Changes
- **Feedback system**: Floating 💬 button (bottom-left, subtle white circle) → dialog with category (באג/רעיון/כללי) + free text → saves to Firebase `/feedback/{id}` with userId, currentView, timestamp
- **Feedback admin viewer**: Admin-only 💬 button in settings → scrollable list with resolve ✅ / delete 🗑️ per item + clear all
- **New feedback indicator**: Red dot on settings tab when there are unread feedback items (admin only), similar to access log indicator
- **Settings tab indicator**: Shows red dot for both new feedback AND new access log entries

### v2.8.2 Changes
- **Import dialog**: Added missing import confirmation dialog (was silently broken - `showImportDialog` set but no dialog rendered, `handleImportMerge` defined but never called)
- **Import fields**: Location import now preserves `locked`, `rating`, `ratingCount`, `fromGoogle`, `address` fields. Interest import preserves `inProgress`, `locked`
- **Import validation**: Relaxed to accept files with any of `customInterests`, `customLocations`, or `savedRoutes` (was requiring both interests AND locations)
- **Export version**: Now uses `window.BKK.VERSION` instead of hardcoded `'2.6'`
- **Loading spinner**: Added full-screen loading overlay with spinner while Firebase data loads (`isDataLoaded` state + `markLoaded()` tracker + 5s safety timeout)
- **Admin password security**: Passwords now hashed with SHA-256 before storage. `hashPassword()` utility in utils.js. Password dialog uses `type="password"`. Backward compatible with plaintext passwords (auto-upgrades on login). Admin section hidden from non-admins.
- **Admin panel**: Only visible to `isCurrentUserAdmin`. Password input changed from plaintext display to "set new password" field.
- **Interests not saved between sessions**: Fixed race condition where auto-cleanup useEffect cleared saved interests before Firebase data loaded. Now gated on `isDataLoaded`.
- **Copyright**: Enlarged header copyright (8px→12px, 50%→80% opacity) and added footer with copyright + version at bottom of every page.
