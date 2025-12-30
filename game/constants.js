/**
 * Cosmo Clash - Oyun Sabitleri
 * SDK 54 Expo / React Native
 * 
 * GÜNCELLEME: CSS tabanlı gezegenler, 1/7 küçültülmüş boyutlar
 */

// Gezegen türleri (0-9, küçükten büyüğe gerçek boyutlara göre)
// -1 = göktaşı/meteor
export const PLANET_TYPES = {
    METEOR: -1,
    PLUTO: 0,      // 2,377 km - Cüce gezegen, en küçük
    MERCURY: 1,    // 4,879 km
    MARS: 2,       // 6,779 km
    VENUS: 3,      // 12,104 km
    EARTH: 4,      // 12,742 km
    NEPTUNE: 5,    // 49,528 km
    URANUS: 6,     // 51,118 km
    SATURN: 7,     // 116,460 km
    JUPITER: 8,    // 139,820 km - En büyük gezegen
    SUN: 9,        // 1,392,700 km - Yıldız
};

// Gezegen verileri - %5 daha küçültülmüş boyutlar
// Önceki: 26, 32, 40, 49, 52, 68, 75, 97, 123, 147
// Yeni (%5 küçük): 25, 30, 38, 47, 49, 65, 71, 92, 117, 140
export const PLANETS = [
    {
        type: 0, radius: 25, points: 10, translationKey: 'planet_pluto',
        color: '#C4A484', colorLight: '#DEC4A4', colorDark: '#8B7355',
        hasRings: false, hasSpots: false
    },
    {
        type: 1, radius: 30, points: 20, translationKey: 'planet_mercury',
        color: '#9370DB', colorLight: '#B8A9C9', colorDark: '#6B5B7A',
        hasRings: false, hasSpots: true, spotColor: '#4B3D5E'
    },
    {
        type: 2, radius: 38, points: 40, translationKey: 'planet_mars',
        color: '#CD5C5C', colorLight: '#E88080', colorDark: '#8B3A3A',
        hasRings: false, hasSpots: true, spotColor: '#8B4513'
    },
    {
        type: 3, radius: 47, points: 80, translationKey: 'planet_venus',
        color: '#DAA520', colorLight: '#FFD700', colorDark: '#B8860B',
        hasRings: false, hasSpots: false
    },
    {
        type: 4, radius: 49, points: 160, translationKey: 'planet_earth',
        color: '#1E90FF', colorLight: '#87CEEB', colorDark: '#0047AB',
        hasRings: false, hasSpots: true, spotColor: '#228B22', hasOceans: true
    },
    {
        type: 5, radius: 65, points: 320, translationKey: 'planet_neptune',
        color: '#191970', colorLight: '#4169E1', colorDark: '#0F0F3D',
        hasRings: false, hasSpots: true, spotColor: '#00008B'
    },
    {
        type: 6, radius: 71, points: 640, translationKey: 'planet_uranus',
        color: '#48D1CC', colorLight: '#7FFFD4', colorDark: '#20B2AA',
        hasRings: false, hasSpots: false
    },
    {
        type: 7, radius: 92, points: 1280, translationKey: 'planet_saturn',
        color: '#F4A460', colorLight: '#FFDAB9', colorDark: '#CD853F',
        hasRings: false, hasSpots: false
    },
    {
        type: 8, radius: 117, points: 2560, translationKey: 'planet_jupiter',
        color: '#D2691E', colorLight: '#F4A460', colorDark: '#8B4513',
        hasRings: false, hasSpots: true, spotColor: '#CD5C5C', hasBands: true
    },
    {
        type: 9, radius: 140, points: 5120, translationKey: 'planet_sun',
        color: '#FFD700', colorLight: '#FFFF00', colorDark: '#FFA500',
        hasRings: false, hasSpots: false, isGlowing: true
    },
];

// Göktaşı verisi - %5 küçük (21 -> 20)
export const METEOR = {
    type: -1,
    radius: 20,
    points: 0,
    translationKey: 'planet_meteor',
    color: '#8B4513',
    colorLight: '#A0522D',
    colorDark: '#5C3317',
    hasRings: false,
    hasSpots: true,
    spotColor: '#3D2314',
};

// Fizik sabitleri - Stabil fizik
export const PHYSICS = {
    GRAVITY: 0.4,
    FRICTION: 0.6,
    BOUNCE: 0.25,
    MAX_VELOCITY: 12,
    COLLISION_ITERATIONS: 3,
    CONTACT_FRICTION: 0.4,
    SETTLE_TIME: 250,             // 200 → 250 (çok az gecikme)
};

// Oyun ayarları
export const GAME_SETTINGS = {
    SPAWN_TYPES: [0, 1, 2, 3],
    DEATH_LINE_Y: 80,
    SPAWN_Y: 50,
    SPAWN_DELAY: 800,
    METEOR_INTERVAL: 12,        // 4 → 12 (3 kat daha az göktaşı)
};

// Gezegen verisi getir
export const getPlanetData = (type) => {
    if (type === -1) return METEOR;
    if (type >= 0 && type < PLANETS.length) {
        return PLANETS[type];
    }
    return null;
};

// Rastgele spawn tipi
export const getRandomSpawnType = () => {
    const types = GAME_SETTINGS.SPAWN_TYPES;
    return types[Math.floor(Math.random() * types.length)];
};

// Birleşebilir mi?
export const canMerge = (type1, type2) => {
    if (type1 === -1 || type2 === -1) return false;
    if (type1 === 9 || type2 === 9) return false;
    return type1 === type2;
};

// Birleşme sonucu tip 
export const getMergedType = (type) => {
    if (type >= 9 || type < 0) return type;
    return type + 1;
};
