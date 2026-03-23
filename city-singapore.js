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
    "iconLeft": "",
    "iconRight": ""
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
      "icon": "🦁",
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
