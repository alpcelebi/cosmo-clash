/**
 * Ball Component - Gelişmiş CSS + LinearGradient tabanlı Gezegen Render
 * 
 * Özellikler:
 * - Linear/Radial gradient efektleri
 * - Glow efekti (shadow ile)
 * - 3D derinlik efekti
 * - Titreme yok, ok yok
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getPlanetData, PLANET_TYPES } from '../game/constants';
import { useLanguage } from '../game/LanguageContext';

const Ball = ({ ball }) => {
    const { x, y, radius, type, isFalling } = ball;
    const planetData = getPlanetData(type);
    const { t } = useLanguage();

    if (!planetData) {
        return null;
    }

    const size = radius * 2;
    const left = x - radius;
    const top = y - radius;
    const isMeteor = type === PLANET_TYPES.METEOR;
    const isSun = type === PLANET_TYPES.SUN;
    const isEarth = type === PLANET_TYPES.EARTH;
    const isJupiter = type === PLANET_TYPES.JUPITER;
    const isMars = type === PLANET_TYPES.MARS;

    // Gezegen ismini çeviriden al
    const planetName = planetData.translationKey ? t(planetData.translationKey) : '';

    // Font boyutunu radius'a göre ayarla
    const getFontSize = () => {
        if (radius <= 30) return 8;
        if (radius <= 38) return 9;
        if (radius <= 48) return 10;
        if (radius <= 58) return 12;
        if (radius <= 75) return 14;
        if (radius <= 90) return 16;
        if (radius <= 110) return 18;
        if (radius <= 135) return 20;
        return 22;
    };

    // Kısa isim
    const getDisplayName = () => {
        if (radius <= 32) {
            return planetName.substring(0, 3);
        }
        if (radius <= 48) {
            return planetName.substring(0, 5);
        }
        return planetName;
    };

    // Gradient renkleri
    const getGradientColors = () => {
        if (isSun) {
            return ['#FFFF99', '#FFD700', '#FFA500', '#FF6B00'];
        }
        if (isEarth) {
            return ['#87CEEB', '#1E90FF', '#0066CC', '#004080'];
        }
        if (isMars) {
            return ['#FF8C69', '#CD5C5C', '#A52A2A', '#8B0000'];
        }
        if (isJupiter) {
            return ['#DEB887', '#D2691E', '#B8860B', '#8B4513'];
        }
        return [
            planetData.colorLight || planetData.color,
            planetData.color,
            planetData.colorDark || planetData.color,
            planetData.colorDark || planetData.color,
        ];
    };

    // Container boyutu (sadece gölge için küçük offset)
    const shadowOffset = 4;
    const containerSize = size + shadowOffset * 2;

    return (
        <View
            style={[
                styles.container,
                {
                    left: left - shadowOffset,
                    top: top - shadowOffset,
                    width: containerSize,
                    height: containerSize,
                },
            ]}
        >

            {/* Gölge */}
            <View
                style={[
                    styles.shadow,
                    {
                        width: size,
                        height: size,
                        borderRadius: radius,
                        top: shadowOffset + 3,
                        left: shadowOffset + 3,
                    },
                ]}
            />

            {/* Ana Küre */}
            <View
                style={[
                    styles.ballWrapper,
                    {
                        width: size,
                        height: size,
                        borderRadius: radius,
                        top: shadowOffset,
                        left: shadowOffset,
                        // Glow shadow (sadece güneş için güçlü)
                        shadowColor: isSun ? '#FFD700' : planetData.color,
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: isSun ? 0.9 : 0.3,
                        shadowRadius: isSun ? 15 : 5,
                        elevation: isSun ? 12 : 3,
                    },
                ]}
            >
                {/* Gradient Arka Plan */}
                <LinearGradient
                    colors={getGradientColors()}
                    start={{ x: 0.2, y: 0.1 }}
                    end={{ x: 0.9, y: 0.9 }}
                    style={[styles.gradient, { borderRadius: radius }]}
                />

                {/* Üst Parlama (Işık Yansıması) */}
                <View
                    style={[
                        styles.highlight,
                        {
                            width: size * 0.5,
                            height: size * 0.25,
                            borderRadius: size * 0.15,
                            top: size * 0.1,
                            left: size * 0.12,
                        },
                    ]}
                />

                {/* İkinci Parlama Noktası */}
                <View
                    style={[
                        styles.highlightDot,
                        {
                            width: size * 0.15,
                            height: size * 0.15,
                            borderRadius: size * 0.1,
                            top: size * 0.15,
                            left: size * 0.25,
                        },
                    ]}
                />

                {/* Alt Gölgeleme (3D Derinlik) */}
                <LinearGradient
                    colors={['transparent', 'transparent', 'rgba(0,0,0,0.35)']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={[styles.innerShadow, { borderRadius: radius }]}
                />

                {/* Kenar Işıması (Atmosfer) */}
                {(isEarth || type === PLANET_TYPES.VENUS || type === PLANET_TYPES.NEPTUNE) && (
                    <View
                        style={[
                            styles.atmosphere,
                            {
                                width: size,
                                height: size,
                                borderRadius: radius,
                                borderWidth: 2,
                                borderColor: 'rgba(255,255,255,0.25)',
                            },
                        ]}
                    />
                )}

                {/* Jüpiter Bantları */}
                {isJupiter && (
                    <>
                        <View style={[styles.jupiterBand, { top: size * 0.25, backgroundColor: 'rgba(139, 69, 19, 0.4)' }]} />
                        <View style={[styles.jupiterBand, { top: size * 0.45, backgroundColor: 'rgba(160, 82, 45, 0.3)' }]} />
                        <View style={[styles.jupiterBand, { top: size * 0.65, backgroundColor: 'rgba(139, 69, 19, 0.35)' }]} />
                    </>
                )}

                {/* Güneş Corona */}
                {isSun && (
                    <View
                        style={[
                            styles.corona,
                            {
                                width: size,
                                height: size,
                                borderRadius: radius,
                                borderWidth: 3,
                                borderColor: 'rgba(255, 255, 200, 0.5)',
                            },
                        ]}
                    />
                )}

                {/* Göktaşı Kraterleri */}
                {isMeteor && (
                    <>
                        <View
                            style={[
                                styles.crater,
                                {
                                    width: size * 0.22,
                                    height: size * 0.22,
                                    borderRadius: size * 0.11,
                                    top: size * 0.2,
                                    left: size * 0.2,
                                    backgroundColor: planetData.colorDark,
                                },
                            ]}
                        />
                        <View
                            style={[
                                styles.crater,
                                {
                                    width: size * 0.15,
                                    height: size * 0.15,
                                    borderRadius: size * 0.08,
                                    top: size * 0.55,
                                    left: size * 0.55,
                                    backgroundColor: planetData.colorDark,
                                },
                            ]}
                        />
                        <View
                            style={[
                                styles.crater,
                                {
                                    width: size * 0.12,
                                    height: size * 0.12,
                                    borderRadius: size * 0.06,
                                    top: size * 0.45,
                                    left: size * 0.25,
                                    backgroundColor: planetData.colorDark,
                                },
                            ]}
                        />
                    </>
                )}

                {/* Gezegen İsmi */}
                {!isFalling && !isMeteor && planetName && (
                    <Text
                        style={[
                            styles.name,
                            { fontSize: getFontSize() },
                        ]}
                        numberOfLines={1}
                    >
                        {getDisplayName()}
                    </Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        zIndex: 5,
    },
    glowOuter: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    shadow: {
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    ballWrapper: {
        position: 'absolute',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    gradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    highlight: {
        position: 'absolute',
        backgroundColor: 'rgba(255, 255, 255, 0.45)',
    },
    highlightDot: {
        position: 'absolute',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
    },
    innerShadow: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    atmosphere: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    jupiterBand: {
        position: 'absolute',
        left: '10%',
        right: '10%',
        height: 4,
        borderRadius: 2,
    },
    corona: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    crater: {
        position: 'absolute',
    },
    name: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.95)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 4,
        zIndex: 10,
    },
});

export default Ball;
