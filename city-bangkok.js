// City data: Bangkok
window.BKK.cityData = window.BKK.cityData || {};
window.BKK.cityData.bangkok = {

    id: 'bangkok',
    name: 'בנגקוק',
    nameEn: 'Bangkok',
    country: 'Thailand',
    icon: '🛺',
    secondaryIcon: '🍜',
    active: true,
    distanceMultiplier: 1.2,
    center: { lat: 13.7563, lng: 100.5018 },
    allCityRadius: 15000,

    areas: [
      { id: 'sukhumvit', label: 'סוקומווית', labelEn: 'Sukhumvit', desc: 'חיי לילה, מסעדות, קניונים', descEn: 'Nightlife, restaurants, malls', lat: 13.7370, lng: 100.5610, radius: 2500, size: 'large', safety: 'safe' },
      { id: 'old-town', label: 'העיר העתיקה', labelEn: 'Old Town', desc: 'מקדשים, ארמון המלך, היסטוריה', descEn: 'Temples, Grand Palace, history', lat: 13.7500, lng: 100.4914, radius: 2000, size: 'medium', safety: 'safe' },
      { id: 'chinatown', label: 'צ\'יינה טאון', labelEn: 'Chinatown', desc: 'אוכל רחוב, שווקים, מקדשים סיניים', descEn: 'Street food, markets, Chinese temples', lat: 13.7408, lng: 100.5050, radius: 1500, size: 'medium', safety: 'caution' },
      { id: 'thonglor', label: 'תונגלור', labelEn: 'Thonglor', desc: 'קפה, גלריות, בוטיקים', descEn: 'Coffee, galleries, boutiques', lat: 13.7320, lng: 100.5830, radius: 2000, size: 'medium', safety: 'safe' },
      { id: 'ari', label: 'ארי', labelEn: 'Ari', desc: 'שכונתי, קפה, אמנות רחוב', descEn: 'Local, coffee, street art', lat: 13.7790, lng: 100.5410, radius: 2000, size: 'medium', safety: 'safe' },
      { id: 'riverside', label: 'ריברסייד', labelEn: 'Riverside', desc: 'נהר, מקדשים, שווקי לילה', descEn: 'River, temples, night markets', lat: 13.7270, lng: 100.4965, radius: 2000, size: 'medium', safety: 'safe' },
      { id: 'siam', label: 'סיאם', labelEn: 'Siam / Pratunam', desc: 'קניות, קניונים, מרכז העיר', descEn: 'Shopping, malls, city center', lat: 13.7460, lng: 100.5340, radius: 1500, size: 'medium', safety: 'safe' },
      { id: 'chatuchak', label: 'צ\'אטוצ\'אק', labelEn: 'Chatuchak', desc: 'שוק ענק, פארקים, אמנות', descEn: 'Huge market, parks, art', lat: 13.7999, lng: 100.5500, radius: 1500, size: 'medium', safety: 'safe' },
      { id: 'silom', label: 'סילום', labelEn: 'Silom / Sathorn', desc: 'עסקים, מקדשים, חיי לילה', descEn: 'Business, temples, nightlife', lat: 13.7262, lng: 100.5235, radius: 1800, size: 'medium', safety: 'safe' },
      { id: 'ratchada', label: 'ראצ\'אדה', labelEn: 'Ratchada', desc: 'שווקי לילה, אוכל, בידור', descEn: 'Night markets, food, entertainment', lat: 13.7650, lng: 100.5730, radius: 1500, size: 'medium', safety: 'safe' },
      { id: 'onnut', label: 'און נאט', labelEn: 'On Nut', desc: 'מקומי, אוכל זול, שווקים', descEn: 'Local, cheap food, markets', lat: 13.7060, lng: 100.6010, radius: 1800, size: 'medium', safety: 'safe' },
      { id: 'bangrak', label: 'באנג ראק', labelEn: 'Bang Rak', desc: 'אמנות, גלריות, אוכל', descEn: 'Art, galleries, food', lat: 13.7280, lng: 100.5130, radius: 1000, size: 'small', safety: 'safe' }
    ],

    interests: [
      { id: 'temples', label: 'מקדשים', labelEn: 'Temples', icon: '🛕' },
      { id: 'food', label: 'אוכל', labelEn: 'Food', icon: '🍜' },
      { id: 'graffiti', label: 'גרפיטי', labelEn: 'Street Art', icon: '🎨' },
      { id: 'artisans', label: 'מלאכה', labelEn: 'Crafts', icon: '🔨' },
      { id: 'galleries', label: 'גלריות', labelEn: 'Galleries', icon: '🖼️' },
      { id: 'architecture', label: 'ארכיטקטורה', labelEn: 'Architecture', icon: '🏛️' },
      { id: 'canals', label: 'תעלות', labelEn: 'Canals', icon: '🚤' },
      { id: 'cafes', label: 'קפה', labelEn: 'Coffee', icon: '☕' },
      { id: 'markets', label: 'שווקים', labelEn: 'Markets', icon: '🏪' },
      { id: 'nightlife', label: 'לילה', labelEn: 'Nightlife', icon: '🌃' },
      { id: 'parks', label: 'פארקים', labelEn: 'Parks', icon: '🌳' },
      { id: 'rooftop', label: 'גגות', labelEn: 'Rooftops', icon: '🌆' },
      { id: 'entertainment', label: 'בידור', labelEn: 'Entertainment', icon: '🎭' }
    ],

    interestToGooglePlaces: {
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
      entertainment: ['movie_theater', 'amusement_park', 'performing_arts_theater']
    },

    textSearchInterests: { graffiti: 'street art' },

    uncoveredInterests: [
      { id: 'massage_spa', icon: '💆', label: 'עיסוי וספא', labelEn: 'Massage & Spa', name: 'עיסוי וספא', examples: 'Thai massage, wellness centers, spa' },
      { id: 'fitness', icon: '🏋️', label: 'כושר וספורט', labelEn: 'Fitness & Sports', name: 'כושר וספורט', examples: 'Gyms, yoga studios, Muay Thai, fitness' },
      { id: 'shopping_special', icon: '🛍️', label: 'קניות מיוחדות', labelEn: 'Special Shopping', name: 'קניות מיוחדות', examples: 'Boutiques, jewelry, fashion stores' },
      { id: 'learning', icon: '🎓', label: 'לימוד וחוויות', labelEn: 'Learning & Experiences', name: 'לימוד וחוויות', examples: 'Cooking classes, meditation, workshops' },
      { id: 'health', icon: '🏥', label: 'בריאות ורפואה', labelEn: 'Health & Medical', name: 'בריאות ורפואה', examples: 'Clinics, pharmacies, health services' },
      { id: 'accommodation', icon: '🏨', label: 'אירוח', labelEn: 'Accommodation', name: 'אירוח', examples: 'Hotels, hostels, guesthouses' },
      { id: 'transport', icon: '🚗', label: 'תחבורה', labelEn: 'Transport', name: 'תחבורה', examples: 'Car rental, bike rental, transportation' },
      { id: 'business', icon: '💼', label: 'עסקים', labelEn: 'Business', name: 'עסקים', examples: 'Coworking, offices, business centers' }
    ],

    interestTooltips: {
      temples: 'מקדשים בודהיסטיים והינדיים', food: 'מסעדות ואוכל רחוב', graffiti: 'אומנות רחוב וגרפיטי',
      artisans: 'בתי מלאכה ואומנים', galleries: 'גלריות ומוזיאונים', architecture: 'בניינים היסטוריים',
      canals: 'שייטים בתעלות ובנהר', cafes: 'בתי קפה', markets: 'שווקים ובזארים',
      nightlife: 'ברים ומועדוני לילה', parks: 'גנים ופארקים', rooftop: 'ברים ומסעדות על גגות',
      entertainment: 'קולנוע, תיאטרון, מופעים'
    }
};
