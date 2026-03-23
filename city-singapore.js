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
    "lat": 1.3521,
    "lng": 103.8198
  },
  "allCityRadius": 15000,
  "areas": [
    {
      "id": "marina-bay",
      "label": "מרכז העיר",
      "labelEn": "City Center",
      "desc": "מגדלים, גנים, אטרקציות",
      "descEn": "Towers, gardens, attractions",
      "lat": 1.2922,
      "lng": 103.8126,
      "radius": 8800,
      "size": "medium",
      "safety": "safe"
    },
    {
      "id": "chinatown-sg",
      "label": "מזרח סינגפור",
      "labelEn": "East Cost",
      "desc": "שדה תעופה ,מרכז קניות בעל ארכיטקטורה",
      "descEn": "Airport",
      "lat": 1.3642,
      "lng": 103.9499,
      "radius": 10000,
      "size": "small",
      "safety": "safe"
    },
    {
      "id": "little-india",
      "label": "צפון סינגפור",
      "labelEn": "North",
      "desc": "יערות",
      "descEn": "Colorful, spices, Hindu temples",
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
      "descEn": "Arab Quarter, street art, hipsters",
      "lat": 1.3828,
      "lng": 103.7116,
      "radius": 7400,
      "size": "small",
      "safety": "safe"
    },
    {
      "id": "tiong-bahru",
      "label": "דרום מערב",
      "labelEn": "South West",
      "desc": "שכונת מגורים",
      "descEn": "Coffee, graffiti, art deco",
      "lat": 1.2716,
      "lng": 103.6656,
      "radius": 8300,
      "size": "small",
      "safety": "safe"
    }
  ],
  "interests": [
    {
      "id": "temples",
      "label": "מקדשים",
      "labelEn": "Temples",
      "icon": "🛕",
      "group": "heritage"
    },
    {
      "id": "canals",
      "label": "תעלות",
      "labelEn": "Canals",
      "icon": "🚤",
      "group": "heritage"
    },
    {
      "id": "graffiti",
      "label": "גרפיטי",
      "labelEn": "Street Art",
      "icon": "🎨",
      "group": "art"
    },
    {
      "id": "galleries",
      "label": "גלריות",
      "labelEn": "Galleries",
      "icon": "🖼️",
      "group": "art"
    },
    {
      "id": "artisans",
      "label": "מלאכה",
      "labelEn": "Crafts",
      "icon": "🔨",
      "group": "art"
    },
    {
      "id": "architecture",
      "label": "ארכיטקטורה",
      "labelEn": "Architecture",
      "icon": "🏛️",
      "group": "art"
    },
    {
      "id": "food",
      "label": "אוכל",
      "labelEn": "Food",
      "icon": "🍜",
      "group": "food"
    },
    {
      "id": "cafes",
      "label": "קפה",
      "labelEn": "Coffee",
      "icon": "☕",
      "group": "food"
    },
    {
      "id": "rooftop",
      "label": "גגות",
      "labelEn": "Rooftops",
      "icon": "🌆",
      "group": "food"
    },
    {
      "id": "markets",
      "label": "שווקים",
      "labelEn": "Markets",
      "icon": "🏪",
      "group": "explore"
    },
    {
      "id": "nightlife",
      "label": "לילה",
      "labelEn": "Nightlife",
      "icon": "🌃",
      "group": "explore"
    },
    {
      "id": "entertainment",
      "label": "בידור",
      "labelEn": "Entertainment",
      "icon": "🎭",
      "group": "explore"
    },
    {
      "id": "parks",
      "label": "פארקים",
      "labelEn": "Parks",
      "icon": "🌳",
      "group": "outdoors"
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
      "id": "massage_spa",
      "icon": "💆",
      "label": "עיסוי וספא",
      "labelEn": "Massage & Spa",
      "name": "עיסוי וספא",
      "examples": "Thai massage, wellness centers, spa"
    },
    {
      "id": "fitness",
      "icon": "🏋️",
      "label": "כושר וספורט",
      "labelEn": "Fitness & Sports",
      "name": "כושר וספורט",
      "examples": "Gyms, yoga studios, Muay Thai, fitness"
    },
    {
      "id": "shopping_special",
      "icon": "🛍️",
      "label": "קניות מיוחדות",
      "labelEn": "Special Shopping",
      "name": "קניות מיוחדות",
      "examples": "Boutiques, jewelry, fashion stores"
    },
    {
      "id": "learning",
      "icon": "🎓",
      "label": "לימוד וחוויות",
      "labelEn": "Learning & Experiences",
      "name": "לימוד וחוויות",
      "examples": "Cooking classes, meditation, workshops"
    },
    {
      "id": "health",
      "icon": "🏥",
      "label": "בריאות ורפואה",
      "labelEn": "Health & Medical",
      "name": "בריאות ורפואה",
      "examples": "Clinics, pharmacies, health services"
    },
    {
      "id": "accommodation",
      "icon": "🏨",
      "label": "אירוח",
      "labelEn": "Accommodation",
      "name": "אירוח",
      "examples": "Hotels, hostels, guesthouses"
    },
    {
      "id": "transport",
      "icon": "🚗",
      "label": "תחבורה",
      "labelEn": "Transport",
      "name": "תחבורה",
      "examples": "Car rental, bike rental, transportation"
    },
    {
      "id": "business",
      "icon": "💼",
      "label": "עסקים",
      "labelEn": "Business",
      "name": "עסקים",
      "examples": "Coworking, offices, business centers"
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
