/**
 * Database - SQLite ile kalıcı skor yönetimi
 * 
 * Expo SQLite kullanarak high score kaydeder
 */

import * as SQLite from 'expo-sqlite';

// Veritabanı bağlantısı (singleton)
let db = null;
let initPromise = null;

/**
 * Veritabanını başlat ve tabloyu oluştur (Singleton)
 */
export const initDatabase = async () => {
    // Zaten başlatıldıysa mevcut bağlantıyı döndür
    if (db) {
        return true;
    }

    // Başlatma devam ediyorsa bekle
    if (initPromise) {
        return initPromise;
    }

    // Yeni başlatma
    initPromise = (async () => {
        try {
            db = await SQLite.openDatabaseAsync('cosmo_clash.db');

            // High scores tablosunu oluştur
            await db.execAsync(`
                CREATE TABLE IF NOT EXISTS high_scores (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    score INTEGER NOT NULL,
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP
                );
            `);

            // Settings tablosunu oluştur
            await db.execAsync(`
                CREATE TABLE IF NOT EXISTS settings (
                    key TEXT PRIMARY KEY,
                    value TEXT NOT NULL
                );
            `);

            console.log('✅ Veritabanı başarıyla başlatıldı');
            return true;
        } catch (error) {
            console.error('❌ Veritabanı başlatma hatası:', error);
            initPromise = null; // Hata durumunda tekrar denemeye izin ver
            return false;
        }
    })();

    return initPromise;
};

/**
 * En yüksek skoru getir
 */
export const getHighScore = async () => {
    try {
        if (!db) {
            await initDatabase();
        }

        const result = await db.getFirstAsync(
            'SELECT MAX(score) as highScore FROM high_scores'
        );

        return result?.highScore || 0;
    } catch (error) {
        console.error('❌ High score okuma hatası:', error);
        return 0;
    }
};

/**
 * Yeni skor kaydet (sadece rekor ise)
 */
export const saveScore = async (score) => {
    try {
        if (!db) {
            await initDatabase();
        }

        const currentHighScore = await getHighScore();

        // Sadece yeni rekor ise kaydet
        if (score > currentHighScore) {
            await db.runAsync(
                'INSERT INTO high_scores (score) VALUES (?)',
                [score]
            );
            console.log(`🏆 Yeni rekor kaydedildi: ${score}`);
            return true;
        }

        return false;
    } catch (error) {
        console.error('❌ Skor kaydetme hatası:', error);
        return false;
    }
};

/**
 * Tüm skorları getir (en yüksekten düşüğe)
 */
export const getAllScores = async (limit = 10) => {
    try {
        if (!db) {
            await initDatabase();
        }

        const results = await db.getAllAsync(
            'SELECT score, created_at FROM high_scores ORDER BY score DESC LIMIT ?',
            [limit]
        );

        return results || [];
    } catch (error) {
        console.error('❌ Skorları okuma hatası:', error);
        return [];
    }
};

/**
 * Veritabanını temizle (debug için)
 */
export const clearAllScores = async () => {
    try {
        if (!db) {
            await initDatabase();
        }

        await db.runAsync('DELETE FROM high_scores');
        console.log('🗑️ Tüm skorlar silindi');
        return true;
    } catch (error) {
        console.error('❌ Skorları silme hatası:', error);
        return false;
    }
};

/**
 * Ayar değeri getir
 */
export const getSetting = async (key) => {
    try {
        if (!db) {
            await initDatabase();
        }

        const result = await db.getFirstAsync(
            'SELECT value FROM settings WHERE key = ?',
            [key]
        );

        return result?.value || null;
    } catch (error) {
        console.error('❌ Ayar okuma hatası:', error);
        return null;
    }
};

/**
 * Ayar değeri kaydet
 */
export const saveSetting = async (key, value) => {
    try {
        if (!db) {
            await initDatabase();
        }

        await db.runAsync(
            'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
            [key, value]
        );
        console.log(`⚙️ Ayar kaydedildi: ${key} = ${value}`);
        return true;
    } catch (error) {
        console.error('❌ Ayar kaydetme hatası:', error);
        return false;
    }
};
