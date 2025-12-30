/**
 * LanguageContext - Dil yönetimi için React Context
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import { LANGUAGES, t } from './translations';
import { getSetting, saveSetting } from './database';

// Context oluştur
const LanguageContext = createContext();

// Provider bileşeni
export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(LANGUAGES.EN);
    const [isLoaded, setIsLoaded] = useState(false);

    // Uygulama başladığında kayıtlı dili yükle
    useEffect(() => {
        const loadLanguage = async () => {
            try {
                const savedLanguage = await getSetting('language');
                if (savedLanguage && (savedLanguage === LANGUAGES.EN || savedLanguage === LANGUAGES.TR)) {
                    setLanguage(savedLanguage);
                }
            } catch (error) {
                console.error('Dil yükleme hatası:', error);
            } finally {
                setIsLoaded(true);
            }
        };
        loadLanguage();
    }, []);

    // Dili değiştir ve kaydet
    const changeLanguage = async (newLanguage) => {
        setLanguage(newLanguage);
        await saveSetting('language', newLanguage);
    };

    // Çeviri fonksiyonu
    const translate = (key) => t(language, key);

    return (
        <LanguageContext.Provider value={{
            language,
            changeLanguage,
            t: translate,
            isLoaded,
            LANGUAGES
        }}>
            {children}
        </LanguageContext.Provider>
    );
};

// Hook
export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export default LanguageContext;
