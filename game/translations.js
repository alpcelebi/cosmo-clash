/**
 * Translations - Çoklu dil desteği
 * 
 * Desteklenen diller: EN (İngilizce), TR (Türkçe)
 */

export const LANGUAGES = {
    EN: 'en',
    TR: 'tr',
};

export const translations = {
    en: {
        // Header
        appName: 'Cosmo Clash',
        score: 'SCORE',
        highScore: 'HIGH',

        // Controls
        drop: 'DROP',

        // Game Screen
        gameTitle: '🌌 COSMO CLASH 🌌',
        subtitle1: 'Merge the planets!',
        subtitle2: 'Reach the Sun!',
        deathLine: '⚠ DEATH LINE',

        // Buttons
        start: '🚀 START',
        playAgain: '🔄 PLAY AGAIN',
        resume: '▶️ RESUME',

        // Game States
        paused: '⏸️ PAUSED',
        gameOver: '💥 GAME OVER',

        // Scores
        finalScore: 'Final Score',
        newRecord: '🎉 NEW RECORD!',

        // Settings
        settings: 'Settings',
        language: 'Language',
        english: 'English',
        turkish: 'Turkish',
        close: 'Close',

        // How to Play
        howToPlay: 'How to Play',
        howToPlayText1: 'Move the planets left and right',
        howToPlayText2: 'Drop them to merge same planets',
        howToPlayText3: 'Create bigger planets to score more',
        howToPlayText4: 'Don\'t let planets cross the death line!',

        // Ads & Rewards
        secondChance: '🎬 Second Chance',
        doubleScore: '🎬 2x Score',
        watchAd: 'Watch Ad',
        adNotReady: 'Ad not ready yet',

        // Planet Names
        planet_pluto: 'Pluto',
        planet_mercury: 'Mercury',
        planet_mars: 'Mars',
        planet_venus: 'Venus',
        planet_earth: 'Earth',
        planet_neptune: 'Neptune',
        planet_uranus: 'Uranus',
        planet_saturn: 'Saturn',
        planet_jupiter: 'Jupiter',
        planet_sun: 'Sun',
        planet_meteor: 'Meteor',
    },
    tr: {
        // Header
        appName: 'Cosmo Clash',
        score: 'SKOR',
        highScore: 'REKOR',

        // Controls
        drop: 'DÜŞÜR',

        // Game Screen
        gameTitle: '🌌 COSMO CLASH 🌌',
        subtitle1: 'Gezegenleri birleştir!',
        subtitle2: 'Güneş\'e ulaş!',
        deathLine: '⚠ ÖLÜM ÇİZGİSİ',

        // Buttons
        start: '🚀 BAŞLA',
        playAgain: '🔄 TEKRAR OYNA',
        resume: '▶️ DEVAM ET',

        // Game States
        paused: '⏸️ DURAKLATILDI',
        gameOver: '💥 OYUN BİTTİ',

        // Scores
        finalScore: 'Final Skor',
        newRecord: '🎉 YENİ REKOR!',

        // Settings
        settings: 'Ayarlar',
        language: 'Dil',
        english: 'İngilizce',
        turkish: 'Türkçe',
        close: 'Kapat',

        // How to Play
        howToPlay: 'Nasıl Oynanır',
        howToPlayText1: 'Gezegenleri sola ve sağa hareket ettir',
        howToPlayText2: 'Aynı gezegenleri birleştirmek için bırak',
        howToPlayText3: 'Daha büyük gezegenler daha çok puan',
        howToPlayText4: 'Gezegenlerin ölüm çizgisini geçmesine izin verme!',

        // Ads & Rewards
        secondChance: '🎬 İkinci Şans',
        doubleScore: '🎬 2x Skor',
        watchAd: 'Reklam İzle',
        adNotReady: 'Reklam henüz hazır değil',

        // Planet Names
        planet_pluto: 'Plüton',
        planet_mercury: 'Merkür',
        planet_mars: 'Mars',
        planet_venus: 'Venüs',
        planet_earth: 'Dünya',
        planet_neptune: 'Neptün',
        planet_uranus: 'Uranüs',
        planet_saturn: 'Satürn',
        planet_jupiter: 'Jüpiter',
        planet_sun: 'Güneş',
        planet_meteor: 'Göktaşı',
    },
};

/**
 * Çeviri al
 * @param {string} lang - Dil kodu (en/tr)
 * @param {string} key - Çeviri anahtarı
 * @returns {string} - Çevrilmiş metin
 */
export const t = (lang, key) => {
    return translations[lang]?.[key] || translations.en[key] || key;
};
