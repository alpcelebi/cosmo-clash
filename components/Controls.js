/**
 * Controls - Oyun kontrolleri
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLanguage } from '../game/LanguageContext';

const Controls = ({
    onLeftPress,
    onLeftRelease,
    onRightPress,
    onRightRelease,
    onDropPress,
    onDropRelease,
    disabled,
}) => {
    const { t } = useLanguage();

    return (
        <View style={styles.container}>
            {/* Sol buton */}
            <TouchableOpacity
                style={[styles.button, styles.directionButton, disabled && styles.disabled]}
                onPressIn={onLeftPress}
                onPressOut={onLeftRelease}
                disabled={disabled}
                activeOpacity={0.7}
            >
                <Text style={styles.buttonText}>◀</Text>
            </TouchableOpacity>

            {/* Düşür buton */}
            <TouchableOpacity
                style={[styles.button, styles.dropButton, disabled && styles.disabled]}
                onPressIn={onDropPress}
                onPressOut={onDropRelease}
                disabled={disabled}
                activeOpacity={0.7}
            >
                <Text style={styles.buttonText}>▼</Text>
                <Text style={styles.dropLabel}>{t('drop')}</Text>
            </TouchableOpacity>

            {/* Sağ buton */}
            <TouchableOpacity
                style={[styles.button, styles.directionButton, disabled && styles.disabled]}
                onPressIn={onRightPress}
                onPressOut={onRightRelease}
                disabled={disabled}
                activeOpacity={0.7}
            >
                <Text style={styles.buttonText}>▶</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        gap: 20,
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    },
    directionButton: {
        width: 70,
        height: 70,
        backgroundColor: '#2a2a4a',
        borderWidth: 2,
        borderColor: '#4ECDC4',
    },
    dropButton: {
        width: 90,
        height: 70,
        backgroundColor: '#4ECDC4',
    },
    buttonText: {
        fontSize: 28,
        color: 'white',
        fontWeight: 'bold',
    },
    dropLabel: {
        fontSize: 10,
        color: 'white',
        marginTop: 2,
    },
    disabled: {
        opacity: 0.4,
    },
});

export default Controls;
