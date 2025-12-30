/**
 * Header - Skor gösterimi
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLanguage } from '../game/LanguageContext';

const Header = ({ score, highScore, onHowToPlay, onSettings, isPaused, isPlaying, onTogglePause }) => {
    const { t } = useLanguage();

    return (
        <View style={styles.container}>
            {/* Sol: Skorlar */}
            <View style={styles.scoresRow}>
                <View style={styles.scoreItem}>
                    <Text style={styles.scoreLabel}>{t('score')}</Text>
                    <Text style={styles.scoreValue}>{score}</Text>
                </View>
                <Text style={styles.separator}>|</Text>
                <View style={styles.scoreItem}>
                    <Text style={styles.scoreLabel}>{t('highScore')}</Text>
                    <Text style={styles.highScoreValue}>{highScore}</Text>
                </View>
            </View>

            {/* Sağ: Butonlar */}
            <View style={styles.buttonsRow}>
                {isPlaying && (
                    <TouchableOpacity style={styles.iconButton} onPress={onTogglePause}>
                        <Text style={styles.iconText}>{isPaused ? '▶️' : '⏸️'}</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.iconButton} onPress={onSettings}>
                    <Text style={styles.iconText}>⚙️</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={onHowToPlay}>
                    <Text style={styles.iconText}>❓</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    scoresRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    scoreItem: {
        alignItems: 'center',
        minWidth: 50,
    },
    scoreLabel: {
        fontSize: 10,
        color: '#888888',
        fontWeight: '600',
    },
    scoreValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    highScoreValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFD700',
    },
    separator: {
        fontSize: 20,
        color: '#444444',
        marginHorizontal: 10,
    },
    buttonsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    iconButton: {
        padding: 6,
        borderRadius: 6,
    },
    iconText: {
        fontSize: 20,
    },
});

export default Header;
