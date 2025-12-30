/**
 * HowToModal - Nasıl oynanır modal'ı
 */

import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import { PLANETS } from '../game/constants';

const HowToModal = ({ visible, onClose }) => {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <Text style={styles.title}>🎮 Nasıl Oynanır?</Text>

                    <ScrollView style={styles.content}>
                        <Text style={styles.section}>🎯 Amaç</Text>
                        <Text style={styles.text}>
                            Aynı türden gezegenleri birleştirerek daha büyük gezegenler oluştur ve yüksek skor yap!
                        </Text>

                        <Text style={styles.section}>🕹️ Kontroller</Text>
                        <Text style={styles.text}>
                            • ◀ / ▶ : Küreyi sola/sağa hareket ettir{'\n'}
                            • ▼ DÜŞÜR : Hızlı düşür
                        </Text>

                        <Text style={styles.section}>⚠️ Dikkat</Text>
                        <Text style={styles.text}>
                            Küreler ölüm çizgisini geçerse oyun biter!
                        </Text>

                        <Text style={styles.section}>🌍 Gezegenler</Text>
                        <View style={styles.planetList}>
                            {PLANETS.slice(0, 6).map((planet, index) => (
                                <View key={index} style={styles.planetRow}>
                                    <View style={[styles.planetDot, { backgroundColor: planet.color }]} />
                                    <Text style={styles.planetName}>{planet.name}</Text>
                                    <Text style={styles.planetPoints}>+{planet.points}</Text>
                                </View>
                            ))}
                        </View>
                    </ScrollView>

                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeText}>ANLADIM</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        width: '85%',
        maxHeight: '80%',
        backgroundColor: '#1a1a2e',
        borderRadius: 20,
        padding: 20,
        borderWidth: 2,
        borderColor: '#4ECDC4',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFD700',
        textAlign: 'center',
        marginBottom: 15,
    },
    content: {
        maxHeight: 350,
    },
    section: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4ECDC4',
        marginTop: 15,
        marginBottom: 8,
    },
    text: {
        fontSize: 14,
        color: '#CCCCCC',
        lineHeight: 22,
    },
    planetList: {
        marginTop: 10,
    },
    planetRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
    },
    planetDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginRight: 10,
    },
    planetName: {
        flex: 1,
        fontSize: 14,
        color: '#FFFFFF',
    },
    planetPoints: {
        fontSize: 12,
        color: '#4ECDC4',
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#4ECDC4',
        paddingVertical: 12,
        borderRadius: 10,
    },
    closeText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0a0a1a',
    },
});

export default HowToModal;
