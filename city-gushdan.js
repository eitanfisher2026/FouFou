// City data: Gush Dan (Tel Aviv Metropolitan)
window.BKK.cityData = window.BKK.cityData || {};
window.BKK.cityData.gushdan = {

    id: 'gushdan',
    name: 'גוש דן',
    nameEn: 'Gush Dan',
    country: 'Israel',
    icon: '🏖️',
    secondaryIcon: '☀️',
    active: false,
    distanceMultiplier: 1.2,
    center: { lat: 32.0853, lng: 34.7818 },
    allCityRadius: 15000,

    areas: [
      { id: 'tlv-north', label: 'צפון תל אביב', labelEn: 'North Tel Aviv', desc: 'הנמל, פארק הירקון, בזל', descEn: 'Port, Yarkon Park, Basel', lat: 32.1033, lng: 34.7750, radius: 2000, size: 'large', safety: 'safe' },
      { id: 'tlv-center', label: 'מרכז תל אביב', labelEn: 'Central Tel Aviv', desc: 'רוטשילד, דיזנגוף, הבימה', descEn: 'Rothschild, Dizengoff, Habima', lat: 32.0731, lng: 34.7746, radius: 2000, size: 'large', safety: 'safe' },
      { id: 'tlv-south', label: 'דרום ת"א ויפו', labelEn: 'South TLV & Jaffa', desc: 'שוק הפשפשים, נמל יפו, פלורנטין', descEn: 'Flea market, Jaffa port, Florentin', lat: 32.0515, lng: 34.7561, radius: 2500, size: 'large', safety: 'caution' },
      { id: 'holon', label: 'חולון', labelEn: 'Holon', desc: 'מוזיאון הילדים, עיצוב, פארקים', descEn: 'Children museum, design, parks', lat: 32.0114, lng: 34.7748, radius: 2500, size: 'large', safety: 'safe' },
      { id: 'bat-yam', label: 'בת ים', labelEn: 'Bat Yam', desc: 'חוף, טיילת, אוכל', descEn: 'Beach, boardwalk, food', lat: 32.0236, lng: 34.7515, radius: 1800, size: 'medium', safety: 'safe' },
      { id: 'petah-tikva', label: 'פתח תקווה', labelEn: 'Petah Tikva', desc: 'מסעדות, פארקים, קניונים', descEn: 'Restaurants, parks, malls', lat: 32.0841, lng: 34.8878, radius: 2500, size: 'large', safety: 'safe' },
      { id: 'herzliya', label: 'הרצליה', labelEn: 'Herzliya', desc: 'מרינה, חופים, הייטק', descEn: 'Marina, beaches, hi-tech', lat: 32.1629, lng: 34.7987, radius: 2500, size: 'large', safety: 'safe' },
      { id: 'ramat-gan', label: 'רמת גן וגבעתיים', labelEn: 'Ramat Gan & Givatayim', desc: 'הבורסה, ספארי, פארקים', lat: 32.0804, lng: 34.8135, radius: 2500, size: 'large', safety: 'safe' },
      { id: 'bnei-brak', label: 'בני ברק', labelEn: 'Bnei Brak', desc: 'שווקים, אוכל, תרבות חרדית', descEn: 'Markets, food, ultra-orthodox culture', lat: 32.0834, lng: 34.8338, radius: 1500, size: 'medium', safety: 'safe' }
    ],

    interests: [
      { id: 'food', label: 'אוכל', labelEn: 'Food', icon: '🍽️' },
      { id: 'cafes', label: 'קפה', labelEn: 'Coffee', icon: '☕' },
      { id: 'beaches', label: 'חופים', labelEn: 'Beaches', icon: '🏖️' },
      { id: 'graffiti', label: 'גרפיטי', labelEn: 'Street Art', icon: '🎨' },
      { id: 'galleries', label: 'גלריות', labelEn: 'Galleries', icon: '🖼️' },
      { id: 'architecture', label: 'באוהאוס', labelEn: 'Bauhaus', icon: '🏛️' },
      { id: 'markets', label: 'שווקים', labelEn: 'Markets', icon: '🏪' },
      { id: 'nightlife', label: 'לילה', labelEn: 'Nightlife', icon: '🌃' },
      { id: 'parks', label: 'פארקים', labelEn: 'Parks', icon: '🌳' },
      { id: 'shopping', label: 'קניות', labelEn: 'Shopping', icon: '🛍️' },
      { id: 'culture', label: 'תרבות', labelEn: 'Culture', icon: '🎭' },
      { id: 'history', label: 'היסטוריה', labelEn: 'History', icon: '🏚️' }
    ],

    interestToGooglePlaces: {
      food: ['restaurant', 'meal_takeaway'], cafes: ['cafe', 'coffee_shop'], beaches: ['beach'],
      graffiti: ['art_gallery'], galleries: ['art_gallery', 'museum'], architecture: ['historical_landmark'],
      markets: ['market', 'shopping_mall'], nightlife: ['bar', 'night_club'], parks: ['park'],
      shopping: ['shopping_mall', 'store'], culture: ['performing_arts_theater', 'cultural_center', 'museum'],
      history: ['historical_landmark', 'museum']
    },

    textSearchInterests: { graffiti: 'street art', architecture: 'bauhaus building', beaches: 'beach' },

    uncoveredInterests: [
      { id: 'fitness', icon: '🏋️', label: 'כושר וספורט', labelEn: 'Fitness & Sports', name: 'כושר וספורט', examples: 'Gyms, yoga, pilates, cycling' },
      { id: 'wellness', icon: '💆', label: 'ספא ורווחה', labelEn: 'Spa & Wellness', name: 'ספא ורווחה', examples: 'Spa, massage, wellness' },
      { id: 'coworking', icon: '💻', label: 'עבודה', labelEn: 'Coworking', name: 'חללי עבודה', examples: 'Coworking, cafes with wifi' }
    ],

    interestTooltips: {
      food: 'מסעדות ואוכל רחוב', cafes: 'בתי קפה', beaches: 'חופים וטיילות',
      graffiti: 'אומנות רחוב וגרפיטי', galleries: 'גלריות ומוזיאונים', architecture: 'מבני באוהאוס ואדריכלות',
      markets: 'שווקים ובזארים', nightlife: 'ברים ומועדונים', parks: 'פארקים וגנים',
      shopping: 'קניונים וחנויות', culture: 'תיאטרון, מוזיקה, מופעים', history: 'אתרים היסטוריים ומוזיאונים'
    }
};
