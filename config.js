// ============================================================================
// Bangkok Explorer - Configuration & Constants
// Copyright © 2026 Eitan Fisher. All Rights Reserved.
// ============================================================================

window.BKK = window.BKK || {};

// App Version
window.BKK.VERSION = '2.1.0';

// Firebase Configuration
window.BKK.firebaseConfig = {
  apiKey: "AIzaSyCAH_2fk_plk6Dg5dlCCfaRWKL3Nmc6V6g",
  authDomain: "bangkok-explorer.firebaseapp.com",
  databaseURL: "https://bangkok-explorer-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bangkok-explorer",
  storageBucket: "bangkok-explorer.firebasestorage.app",
  messagingSenderId: "139083217994",
  appId: "1:139083217994:web:48fc6a45028c91d177bab3",
  measurementId: "G-QVGD0RKEHP"
};

// Google Places API Configuration
window.BKK.GOOGLE_PLACES_API_KEY = 'AIzaSyD0F0TYKuWXVqibhj-sH-DaElDtLL8hMwM';
window.BKK.GOOGLE_PLACES_API_URL = 'https://places.googleapis.com/v1/places:searchNearby';

// Interest Options (base categories)
window.BKK.interestOptions = [
  { id: 'temples', label: 'מקדשים', icon: '🛕' },
  { id: 'food', label: 'אוכל', icon: '🍜' },
  { id: 'graffiti', label: 'גרפיטי', icon: '🎨' },
  { id: 'artisans', label: 'מלאכה', icon: '🔨' },
  { id: 'galleries', label: 'גלריות', icon: '🖼️' },
  { id: 'architecture', label: 'ארכיטקטורה', icon: '🏛️' },
  { id: 'canals', label: 'תעלות', icon: '🚤' },
  { id: 'cafes', label: 'קפה', icon: '☕' },
  { id: 'markets', label: 'שווקים', icon: '🏪' },
  { id: 'nightlife', label: 'לילה', icon: '🌃' },
  { id: 'parks', label: 'פארקים', icon: '🌳' },
  { id: 'rooftop', label: 'גגות', icon: '🌆' },
  { id: 'entertainment', label: 'בידור', icon: '🎭' },
  { id: 'other', label: 'אחר', icon: '📍' }
];

// Map interests to Google Places API categories
window.BKK.interestToGooglePlaces = {
  temples: ['hindu_temple', 'church', 'mosque', 'synagogue'],
  food: ['restaurant', 'meal_takeaway'],
  graffiti: ['art_gallery'],
  artisans: ['store', 'art_gallery'],
  galleries: ['art_gallery', 'museum'],
  architecture: ['historical_landmark'],
  canals: ['boat_tour_agency', 'marina'],
  cafes: ['cafe', 'coffee_shop'],
  markets: ['market', 'shopping_mall'],
  nightlife: ['bar', 'night_club'],
  parks: ['park', 'national_park'],
  rooftop: ['bar', 'restaurant'],
  entertainment: ['movie_theater', 'amusement_park', 'performing_arts_theater'],
  other: ['tourist_attraction']
};

// Interests NOT covered by the system
window.BKK.uncoveredInterests = [
  { icon: '💆', name: 'עיסוי וספא', examples: 'Thai massage, wellness centers, spa' },
  { icon: '🏋️', name: 'כושר וספורט', examples: 'Gyms, yoga studios, Muay Thai, fitness' },
  { icon: '🛍️', name: 'קניות מיוחדות', examples: 'Boutiques, jewelry, fashion stores' },
  { icon: '🎓', name: 'לימוד וחוויות', examples: 'Cooking classes, meditation, workshops' },
  { icon: '🏥', name: 'בריאות ורפואה', examples: 'Clinics, pharmacies, health services' },
  { icon: '🏨', name: 'אירוח', examples: 'Hotels, hostels, guesthouses' },
  { icon: '🚗', name: 'תחבורה', examples: 'Car rental, bike rental, transportation' },
  { icon: '💼', name: 'עסקים', examples: 'Coworking, offices, business centers' }
];

// Tooltip content for each interest
window.BKK.interestTooltips = {
  temples: 'מקדשים בודהיסטיים והינדיים',
  food: 'מסעדות ואוכל רחוב',
  graffiti: 'אומנות רחוב וגרפיטי',
  artisans: 'בתי מלאכה ואומנים',
  galleries: 'גלריות ומוזיאונים',
  architecture: 'בניינים היסטוריים',
  canals: 'שייטים בתעלות ובנהר',
  cafes: 'בתי קפה',
  markets: 'שווקים ובזארים',
  nightlife: 'ברים ומועדוני לילה',
  parks: 'גנים ופארקים',
  rooftop: 'ברים ומסעדות על גגות',
  entertainment: 'קולנוע, תיאטרון, מופעים',
  other: 'מקומות נוספים'
};

// Area options
window.BKK.areaOptions = [
  { id: 'sukhumvit', label: 'סוקומווית', labelEn: 'Sukhumvit', icon: '🏙️' },
  { id: 'old-town', label: 'העיר העתיקה', labelEn: 'Old Town', icon: '🏰' },
  { id: 'chinatown', label: 'צ\'יינה טאון', labelEn: 'Chinatown', icon: '🏮' },
  { id: 'thonglor', label: 'תונגלור', labelEn: 'Thonglor', icon: '☕' },
  { id: 'ari', label: 'ארי', labelEn: 'Ari', icon: '🎨' },
  { id: 'riverside', label: 'ריברסייד', labelEn: 'Riverside', icon: '🌊' }
];

// Area coordinates (center points + radius)
window.BKK.areaCoordinates = {
  'sukhumvit': { lat: 13.7370, lng: 100.5610, radius: 2500 },
  'old-town': { lat: 13.7500, lng: 100.4914, radius: 2000 },
  'chinatown': { lat: 13.7408, lng: 100.5050, radius: 1500 },
  'thonglor': { lat: 13.7320, lng: 100.5830, radius: 2000 },
  'ari': { lat: 13.7790, lng: 100.5410, radius: 2000 },
  'riverside': { lat: 13.7270, lng: 100.4965, radius: 2000 }
};

// Help content for all views
window.BKK.helpContent = {
  main: {
    title: 'תכנון מסלול',
    content: `**מה זה Bangkok Explorer?**
אפליקציה לתכנון מסלולי טיול בבנגקוק. בחר תחומי עניין ואזור, והמערכת תבנה לך מסלול מותאם.

**איך להתחיל:**
• בחר **איזור** - האזור בבנגקוק שמעניין אותך
• בחר **תחומי עניין** - לחץ על האייקונים (מקדשים, אוכל, קניות...)
• לחץ **"מצא נקודות עניין"** - הכמות מוצגת בסוגריים (ניתן לשנות בהגדרות)

**סוגי מסלול:**
• 🔄 **מעגלי** - מסלול שחוזר לנקודת ההתחלה
• ➡️ **ליניארי** - מסלול בקו ישר מנקודה לנקודה

**טיפ:**
לטיול גמיש בלי סדר מוגדר - בחר לאן ללכת בעצמך מתוך הרשימה, או השתמש ב"הצג נקודות על המפה".`
  },
  placesListing: {
    title: 'רשימת המקומות',
    content: `**איך נבחרו המקומות?**
1. קודם - המקומות שהוספת בעצמך
2. אחר כך - מקומות מ-Google לפי דירוג גבוה

**כמות המקומות לכל תחום:**
מחושבת לפי: סה"כ מקומות (מההגדרות) חלקי מספר תחומי העניין שבחרת.

**כפתורים בכל מקום:**
• ✕ **אפור** - דלג זמנית (הופך ל-⏸️ צהוב כשמושהה)
• ⏸️ **צהוב** - החזר למסלול (לחיצה מבטלת השהיה)
• 🚫 **אדום** - דלג לצמיתות (לא יופיע יותר)
• ✅ **ירוק** - בטל דילוג קבוע
• + **סגול** - הוסף לרשימה שלי
• ✏️ **כחול** - ערוך (רק למקומות שלי)

**כפתורים למטה:**
• 💾 **סגול** - שמור מסלול (שם + הערות)
• 🗺️ **ירוק** - פתח את המסלול ב-Google Maps

**"+ עוד" ליד כל תחום:**
מוסיף מקומות נוספים מאותו סוג.

**לחיצה על שם המקום** פותחת אותו ב-Google Maps.`
  },
  route: {
    title: 'תוצאות המסלול',
    content: `**לוגיקת המקומות:**
המערכת מביאה קודם את המקומות שלך (מותאמים אישית), ואחר כך משלימה עם מקומות מ-Google לפי דירוג גבוה.

**כפתורים בכל מקום:**
• 🗺️ **מפה** - פתיחה ב-Google Maps
• ✏️ **עריכה** - עריכת פרטי המקום
• 🚫 **דילוג** - הסרה זמנית מהמסלול הנוכחי
• 🔙 **החזרה** - החזרת מקום שדולג
• לחיצה על השם - פרטים מלאים

**כפתורים כלליים:**
• **"פתח ב-Google Maps"** - פתיחת המסלול המחושב במפות
• **"מצא עוד"** - הוספת מקומות נוספים לתחום מסוים
• **"שמור מסלול"** - שמירה לשימוש עתידי
• **"מסלול חדש"** - התחלה מחדש

**סימונים:**
• ⭐ - מקום מותאם אישית (שלך)
• 🛠️ - מקום בתהליך עדכון
• ⚠️ - חסרות קואורדינטות
• 🚫 - מקום שדולג (זמנית במסלול זה)`
  },
  myContent: {
    title: 'התוכן שלי',
    content: `**מה יש כאן:**
ניהול המקומות ותחומי העניין שהוספת בעצמך.

**מקומות מותאמים אישית:**
• לחץ **"+ הוסף מקום"** להוספת מקום חדש
• לחץ על מקום קיים לצפייה בפרטים
• ✏️ לעריכה, 🗑️ למחיקה

**תחומי עניין:**
• לחץ **"+ הוסף תחום"** ליצירת קטגוריה חדשה
• בחר אייקון ושם
• תחומים מותאמים יופיעו בבחירת תחומי עניין

**סטטוס מקום:**
• ✅ **פעיל** - יופיע במסלולים
• 🚫 **רשימה שחורה** - לא יופיע לעולם

**טיפ:** מקומות שלך מקבלים עדיפות על פני מקומות מ-Google!`
  },
  saved: {
    title: 'מסלולים שמורים',
    content: `**מה יש כאן:**
כל המסלולים ששמרת לשימוש עתידי.

**שמירת מסלול:**
• לחץ "💾 שמור מסלול" במסך המסלול
• תן שם ייחודי (חובה)
• הוסף הערות אם רוצה

**פעולות:**
• לחץ על מסלול לטעינה מחדש
• 🗑️ למחיקת מסלול

**טיפ:**
מסלולים נכללים בייצוא/ייבוא בהגדרות!`
  },
  settings: {
    title: 'הגדרות',
    content: `**הגדרות המערכת:**

**מקור נתונים:**
• **דינמי** - נתונים משותפים (Firebase) - מומלץ
• **סטטי** - נתונים מקומיים בלבד (לפיתוח)

**ייבוא/ייצוא:**
• **ייצוא** - שומר את כל המקומות והתחומים שלך לקובץ JSON
• **ייבוא** - מוסיף מקומות ותחומים מקובץ

**איך עובד הייבוא:**
• כפילויות (לפי שם) ידולגו אוטומטית
• תחומים חסרים ייווצרו אוטומטית
• שום דבר לא יימחק - רק הוספה

**Admin (למנהלים):**
• צפייה בלוג כניסות
• ניהול מכשירים מורשים`
  },
  addLocation: {
    title: 'הוספת/עריכת מקום',
    content: `**שדות חובה:**
• **שם** - שם המקום
• **תחום עניין** - לפחות אחד

**שדות נוספים:**
• **איזור** - לסינון לפי אזור בבנגקוק
• **תמונה** - העלאה מהמכשיר או קישור
• **כתובת** - טקסט חופשי
• **קישור Maps** - העתק מ-Google Maps
• **הערות** - מידע נוסף לעצמך

**מה זה קואורדינטות?**
מיקום מדויק על המפה (קו רוחב + קו אורך).
בלי קואורדינטות - המקום לא יופיע במסלול ב-Google Maps!

**איך להשיג קואורדינטות:**
• 🔤 **שם** - חיפוש אוטומטי לפי שם המקום
• 🏠 **כתובת** - חיפוש לפי הכתובת שהזנת
• 🔗 **קישור** - חילוץ מקישור Google Maps
• 📍 **מיקום** - GPS - המיקום הנוכחי שלך
• 🗺️ **בדוק** - פתיחה במפה לאימות

**טיפ לקישור Maps:**
1. פתח Google Maps ומצא את המקום
2. לחץ על המקום ואז "שתף"
3. העתק את הקישור והדבק בשדה "קישור Maps"
4. לחץ 🔗 לחילוץ הקואורדינטות

**כפתורים:**
• **הוסף/עדכן** - שומר ונשאר פתוח
• **סגור** - שומר וסוגר
• **X** - סוגר בלי לשמור`
  },
  addInterest: {
    title: 'הוספת תחום עניין',
    content: `**מה זה תחום עניין מותאם?**
תת-תחום חדש שאתה יוצר, מבוסס על תחום קיים במערכת.

**שדות:**
• **שם התחום** - השם שיוצג (לדוגמה: "בתי קולנוע")
• **אייקון** - אימוג'י שייצג את התחום
• **תחום בסיס** - התחום הקיים שאליו יתווסף התחום החדש כתת-תחום

**איך זה עובד?**
ב"מצא מקומות", כשתבחר את התחום החדש, המערכת תחפש בגוגל מקומות מתחום הבסיס שכוללים את התחום החדש.

**דוגמה:**
תחום חדש: "בתי קולנוע" 🎬
תחום בסיס: "בידור" 🎭
→ המערכת תחפש מקומות בידור שהם בתי קולנוע

**כפתורים:**
• **הוסף** - שומר ונשאר פתוח להוספה נוספת
• **סגור** - שומר וסוגר
• **X** - סוגר בלי לשמור`
  }
};

console.log('[CONFIG] Loaded successfully');
