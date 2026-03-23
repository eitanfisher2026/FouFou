// City data: Singapore
window.BKK.cityData = window.BKK.cityData || {};
window.BKK.cityData.singapore = {
  "id": "singapore",
  "name": "סינגפור",
  "nameEn": "Singapore",
  "country": "Singapore",
  "icon": "🦁",
  "secondaryIcon": "🌴",
  "theme": {
    "color": "#c0392b",
    "iconLeft": "🦁",
    "iconRight": "🌺"
  },
  "active": true,
  "distanceMultiplier": 1.2,
  "dayStartHour": 7,
  "nightStartHour": 18,
  "center": {
    "lat": 1.2867,
    "lng": 103.8139
  },
  "allCityRadius": 21700,
  "areas": [
    {
      "id": "marina-bay",
      "label": "מרכז העיר",
      "labelEn": "City Center",
      "desc": "מגדלים, גנים, אטרקציות",
      "descEn": "Towers, gardens, attractions",
      "lat": 1.2922,
      "lng": 103.8126,
      "radius": 9100,
      "size": "medium",
      "safety": "safe"
    },
    {
      "id": "chinatown-sg",
      "label": "מזרח סינגפור",
      "labelEn": "East ",
      "desc": "שדה תעופה ,מרכז משה ספדי",
      "descEn": "Airport,Moshe safdie",
      "lat": 1.367,
      "lng": 103.9547,
      "radius": 9200,
      "size": "small",
      "safety": "safe"
    },
    {
      "id": "little-india",
      "label": "צפון סינגפור",
      "labelEn": "North",
      "desc": "יערות",
      "descEn": "Forest",
      "lat": 1.4226,
      "lng": 103.8242,
      "radius": 6900,
      "size": "small",
      "safety": "safe"
    },
    {
      "id": "kampong-glam",
      "label": "מערב סינגפור",
      "labelEn": "West",
      "desc": "יערות, נמל",
      "descEn": "Forest,port",
      "lat": 1.3889,
      "lng": 103.7082,
      "radius": 7400,
      "size": "small",
      "safety": "safe"
    },
    {
      "id": "tiong-bahru",
      "label": "דרום מערב",
      "labelEn": "South West",
      "desc": "נמל",
      "descEn": "Port",
      "lat": 1.2633,
      "lng": 103.6608,
      "radius": 8300,
      "size": "small",
      "safety": "safe"
    }
  ],
  "interests": [
    {
      "group": "heritage",
      "icon": "🚤",
      "id": "canals",
      "label": "תעלות",
      "labelEn": "Canals"
    },
    {
      "group": "art",
      "icon": "🎨",
      "id": "graffiti",
      "label": "גרפיטי",
      "labelEn": "Street Art"
    },
    {
      "group": "art",
      "icon": "🖼️",
      "id": "galleries",
      "label": "גלריות",
      "labelEn": "Galleries"
    },
    {
      "group": "art",
      "icon": "🔨",
      "id": "artisans",
      "label": "מלאכה",
      "labelEn": "Crafts"
    },
    {
      "group": "art",
      "icon": "🏛️",
      "id": "architecture",
      "label": "ארכיטקטורה",
      "labelEn": "Architecture"
    },
    {
      "group": "food",
      "icon": "🍜",
      "id": "food",
      "label": "אוכל",
      "labelEn": "Food"
    },
    {
      "group": "food",
      "icon": "☕",
      "id": "cafes",
      "label": "קפה",
      "labelEn": "Coffee"
    },
    {
      "group": "food",
      "icon": "🌆",
      "id": "rooftop",
      "label": "גגות",
      "labelEn": "Rooftops"
    },
    {
      "group": "explore",
      "icon": "🌃",
      "id": "nightlife",
      "label": "לילה",
      "labelEn": "Nightlife"
    },
    {
      "group": "explore",
      "icon": "🎭",
      "id": "entertainment",
      "label": "בידור",
      "labelEn": "Entertainment"
    },
    {
      "group": "outdoors",
      "icon": "🌳",
      "id": "parks",
      "label": "פארקים",
      "labelEn": "Parks"
    },
    {
      "builtIn": true,
      "group": "heritage",
      "icon": "🛕",
      "id": "temples",
      "label": "מקדשים",
      "labelEn": "Temples",
      "locked": true
    },
    {
      "builtIn": true,
      "group": "explore",
      "icon": "data:image/webp;base64,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",
      "id": "markets",
      "label": "שווקי יום",
      "labelEn": "Markets",
      "locked": true
    }
  ],
  "interestToGooglePlaces": {
    "food": [
      "restaurant",
      "meal_takeaway"
    ],
    "cafes": [
      "cafe",
      "coffee_shop"
    ],
    "hawkers": [
      "restaurant"
    ],
    "temples": [
      "hindu_temple",
      "church",
      "mosque",
      "synagogue"
    ],
    "gardens": [
      "park",
      "botanical_garden"
    ],
    "architecture": [
      "historical_landmark"
    ],
    "graffiti": [
      "art_gallery"
    ],
    "galleries": [
      "art_gallery",
      "museum"
    ],
    "markets": [
      "market",
      "shopping_mall"
    ],
    "nightlife": [
      "bar",
      "night_club"
    ],
    "shopping": [
      "shopping_mall",
      "store"
    ],
    "rooftop": [
      "bar",
      "restaurant"
    ]
  },
  "textSearchInterests": {
    "graffiti": "street art",
    "hawkers": "hawker centre",
    "gardens": "garden"
  },
  "uncoveredInterests": [
    {
      "examples": "Thai massage, wellness centers, spa",
      "icon": "💆",
      "id": "massage_spa",
      "label": "עיסוי וספא",
      "labelEn": "Massage & Spa",
      "name": "עיסוי וספא"
    },
    {
      "examples": "Gyms, yoga studios, Muay Thai, fitness",
      "icon": "🏋️",
      "id": "fitness",
      "label": "כושר וספורט",
      "labelEn": "Fitness & Sports",
      "name": "כושר וספורט"
    },
    {
      "examples": "Boutiques, jewelry, fashion stores",
      "icon": "🛍️",
      "id": "shopping_special",
      "label": "קניות מיוחדות",
      "labelEn": "Special Shopping",
      "name": "קניות מיוחדות"
    },
    {
      "examples": "Cooking classes, meditation, workshops",
      "icon": "🎓",
      "id": "learning",
      "label": "לימוד וחוויות",
      "labelEn": "Learning & Experiences",
      "name": "לימוד וחוויות"
    },
    {
      "examples": "Clinics, pharmacies, health services",
      "icon": "🏥",
      "id": "health",
      "label": "בריאות ורפואה",
      "labelEn": "Health & Medical",
      "name": "בריאות ורפואה"
    },
    {
      "examples": "Hotels, hostels, guesthouses",
      "icon": "🏨",
      "id": "accommodation",
      "label": "אירוח",
      "labelEn": "Accommodation",
      "name": "אירוח"
    },
    {
      "examples": "Car rental, bike rental, transportation",
      "icon": "🚗",
      "id": "transport",
      "label": "תחבורה",
      "labelEn": "Transport",
      "name": "תחבורה"
    },
    {
      "examples": "Coworking, offices, business centers",
      "icon": "💼",
      "id": "business",
      "label": "עסקים",
      "labelEn": "Business",
      "name": "עסקים"
    }
  ],
  "interestTooltips": {
    "food": "מסעדות מכל העולם",
    "cafes": "בתי קפה",
    "hawkers": "מרכזי הוקרס — אוכל רחוב סינגפורי",
    "temples": "מקדשים בודהיסטיים, הינדיים, מסגדים",
    "gardens": "גנים בוטניים ופארקים",
    "architecture": "קולוניאלי, שופהאוסים, מודרני",
    "graffiti": "אומנות רחוב",
    "galleries": "גלריות ומוזיאונים",
    "markets": "שווקים ובזארים",
    "nightlife": "ברים ומועדונים",
    "shopping": "קניונים וחנויות",
    "rooftop": "ברים ומסעדות על גגות"
  },
  "systemRoutes": []
};
