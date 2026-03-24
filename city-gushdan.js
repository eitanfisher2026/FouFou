// City data: Gush Dan
window.BKK.cityData = window.BKK.cityData || {};
window.BKK.cityData.gushdan = {
  "id": "gushdan",
  "name": "גוש דן",
  "nameEn": "Gush Dan",
  "country": "Israel",
  "icon": "🏖️",
  "secondaryIcon": "☀️",
  "theme": {
    "color": "#2980b9",
    "iconLeft": "🏖️",
    "iconRight": "🌆"
  },
  "active": true,
  "distanceMultiplier": 1.2,
  "dayStartHour": 7,
  "nightStartHour": 18,
  "center": {
    "lat": 32.0802,
    "lng": 34.8871
  },
  "allCityRadius": 15000,
  "areas": [
    {
      "id": "tlv-north",
      "label": "צפון תל אביב",
      "labelEn": "North Tel Aviv",
      "desc": "הנמל, פארק הירקון, בזל",
      "descEn": "Port, Yarkon Park, Basel",
      "lat": 32.1117,
      "lng": 34.7971,
      "radius": 3000,
      "size": "large",
      "safety": "safe"
    },
    {
      "id": "tlv-center",
      "label": "מרכז תל אביב",
      "labelEn": "Central Tel Aviv",
      "desc": "רוטשילד, דיזנגוף, הבימה",
      "descEn": "Rothschild, Dizengoff, Habima",
      "lat": 32.0677,
      "lng": 34.7762,
      "radius": 2000,
      "size": "large",
      "safety": "safe"
    },
    {
      "id": "tlv-south",
      "label": "דרום ת\"א ויפו",
      "labelEn": "South TLV & Jaffa",
      "desc": "שוק הפשפשים, נמל יפו, פלורנטין",
      "descEn": "Flea market, Jaffa port, Florentin",
      "lat": 32.0523,
      "lng": 34.7621,
      "radius": 2200,
      "size": "large",
      "safety": "caution"
    },
    {
      "id": "holon",
      "label": "חולון",
      "labelEn": "Holon",
      "desc": "מוזיאון הילדים, עיצוב, פארקים",
      "descEn": "Children museum, design, parks",
      "lat": 32.0148,
      "lng": 34.7872,
      "radius": 2500,
      "size": "large",
      "safety": "safe"
    },
    {
      "id": "bat-yam",
      "label": "בת ים",
      "labelEn": "Bat Yam",
      "desc": "חוף, טיילת, אוכל",
      "descEn": "Beach, boardwalk, food",
      "lat": 32.0162,
      "lng": 34.741,
      "radius": 2200,
      "size": "medium",
      "safety": "safe"
    },
    {
      "id": "petah-tikva",
      "label": "פתח תקווה",
      "labelEn": "Petah Tikva",
      "desc": "מסעדות, פארקים, קניונים",
      "descEn": "Restaurants, parks, malls",
      "lat": 32.0994,
      "lng": 34.8885,
      "radius": 4100,
      "size": "large",
      "safety": "safe"
    },
    {
      "id": "herzliya",
      "label": "הרצליה",
      "labelEn": "Herzliya",
      "desc": "מרינה, חופים, הייטק",
      "descEn": "Marina, beaches, hi-tech",
      "lat": 32.1646,
      "lng": 34.8325,
      "radius": 3700,
      "size": "large",
      "safety": "safe"
    },
    {
      "id": "ramat-gan",
      "label": "רמת גן וגבעתיים",
      "labelEn": "Ramat Gan & Givatayim",
      "desc": "הבורסה, ספארי, פארקים",
      "lat": 32.0558,
      "lng": 34.8129,
      "radius": 2500,
      "size": "large",
      "safety": "safe"
    },
    {
      "id": "bnei-brak",
      "label": "בני ברק",
      "labelEn": "Bnei Brak",
      "desc": "שווקים, אוכל, תרבות חרדית",
      "descEn": "Markets, food, ultra-orthodox culture",
      "lat": 32.0837,
      "lng": 34.8332,
      "radius": 1100,
      "size": "medium",
      "safety": "safe"
    }
  ],
  "interests":     [
        {
            "id": "food"
        },
        {
            "id": "cafes"
        },
        {
            "id": "beaches"
        },
        {
            "id": "graffiti"
        },
        {
            "id": "galleries"
        },
        {
            "id": "architecture"
        },
        {
            "id": "markets"
        },
        {
            "id": "nightlife"
        },
        {
            "id": "parks"
        },
        {
            "id": "shopping"
        },
        {
            "id": "culture"
        },
        {
            "id": "history"
        },
        {
            "id": "fitness"
        },
        {
            "id": "wellness"
        },
        {
            "id": "coworking"
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
    "beaches": [
      "beach"
    ],
    "graffiti": [
      "art_gallery"
    ],
    "galleries": [
      "art_gallery",
      "museum"
    ],
    "architecture": [
      "historical_landmark"
    ],
    "markets": [
      "market",
      "shopping_mall"
    ],
    "nightlife": [
      "bar",
      "night_club"
    ],
    "parks": [
      "park"
    ],
    "shopping": [
      "shopping_mall",
      "store"
    ],
    "culture": [
      "performing_arts_theater",
      "cultural_center",
      "museum"
    ],
    "history": [
      "historical_landmark",
      "museum"
    ]
  },
  "textSearchInterests": {
    "graffiti": "street art",
    "architecture": "bauhaus building",
    "beaches": "beach"
  },
  "interestTooltips": {
    "food": "מסעדות ואוכל רחוב",
    "cafes": "בתי קפה",
    "beaches": "חופים וטיילות",
    "graffiti": "אומנות רחוב וגרפיטי",
    "galleries": "גלריות ומוזיאונים",
    "architecture": "מבני באוהאוס ואדריכלות",
    "markets": "שווקים ובזארים",
    "nightlife": "ברים ומועדונים",
    "parks": "פארקים וגנים",
    "shopping": "קניונים וחנויות",
    "culture": "תיאטרון, מוזיקה, מופעים",
    "history": "אתרים היסטוריים ומוזיאונים"
  },
  "systemRoutes": []
};
