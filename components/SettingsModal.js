/**
 * SettingsModal - Ayarlar ekranı
 */

import React from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { useLanguage } from '../game/LanguageContext';

const SettingsModal = ({ visible, onClose }) => {
    const { language, changeLanguage, t, LANGUAGES } = useLanguage();

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Başlık */}
                    <Text style={styles.title}>⚙️ {t('settings')}</Text>

                    {/* Dil Seçimi */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>🌍 {t('language')}</Text>

                        <View style={styles.languageOptions}>
                            {/* İngilizce */}
                            <TouchableOpacity
                                style={[
                                    styles.languageButton,
                                    language === LANGUAGES.EN && styles.languageButtonActive
                                ]}
                                onPress={() => changeLanguage(LANGUAGES.EN)}
                            >
                                <Text style={styles.flagEmoji}>🇬🇧</Text>
                                <Text style={[
                                    styles.languageText,
                                    language === LANGUAGES.EN && styles.languageTextActive
                                ]}>
                                    {t('english')}
                                </Text>
                            </TouchableOpacity>

                            {/* Türkçe */}
                            <TouchableOpacity
                                style={[
                                    styles.languageButton,
                                    language === LANGUAGES.TR && styles.languageButtonActive
                                ]}
                                onPress={() => changeLanguage(LANGUAGES.TR)}
                            >
                                <Text style={styles.flagEmoji}>🇹🇷</Text>
                                <Text style={[
                                    styles.languageText,
                                    language === LANGUAGES.TR && styles.languageTextActive
                                ]}>
                                    {t('turkish')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Kapat Butonu */}
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>{t('close')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: '#1a1a2e',
        borderRadius: 20,
        padding: 25,
        width: '85%',
        maxWidth: 350,
        borderWidth: 2,
        borderColor: '#4ECDC4',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFD700',
        textAlign: 'center',
        marginBottom: 25,
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 16,
        color: '#FFFFFF',
        marginBottom: 15,
        fontWeight: '600',
    },
    languageOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    languageButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 2,
        borderColor: 'transparent',
        gap: 8,
    },
    languageButtonActive: {
        backgroundColor: 'rgba(78, 205, 196, 0.2)',
        borderColor: '#4ECDC4',
    },
    flagEmoji: {
        fontSize: 24,
    },
    languageText: {
        fontSize: 14,
        color: '#AAAAAA',
        fontWeight: '500',
    },
    languageTextActive: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    closeButton: {
        backgroundColor: '#4ECDC4',
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#050514',
    },
});

export default SettingsModal;
