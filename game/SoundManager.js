/**
 * SoundManager - Oyun Ses Yönetimi
 * 
 * Ses dosyaları assets/sounds klasöründe:
 * - merge.mp3 (birleşme sesi)
 * - drop.mp3 (düşme sesi) 
 * - collision.mp3 (çarpma sesi)
 * - gameover.mp3 (oyun sonu sesi)
 * - click.mp3 (tıklama sesi)
 */

import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

class SoundManager {
    constructor() {
        this.sounds = {};
        this.isLoaded = false;
        this.isMuted = false;
        this.volume = 0.7;
        this.soundsAvailable = false;
    }

    // Sesleri yükle
    async loadSounds() {
        try {
            // Ses modunu ayarla
            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
                staysActiveInBackground: false,
                shouldDuckAndroid: true,
            });

            // Kayıtlı mute durumunu yükle
            const savedMute = await AsyncStorage.getItem('soundMuted');
            if (savedMute !== null) {
                this.isMuted = savedMute === 'true';
            }

            this.isLoaded = true;

            // Ses dosyalarını yükle
            await this.loadSoundFiles();

            console.log('🔊 Ses sistemi hazır');
        } catch (error) {
            console.log('Ses sistemi başlatılamadı:', error.message);
            this.isLoaded = true;
        }
    }

    // Ses dosyalarını yükle
    async loadSoundFiles() {
        try {
            const soundConfigs = [
                { name: 'merge', file: require('../assets/sounds/merge.mp3') },
                { name: 'drop', file: require('../assets/sounds/drop.mp3') },
                { name: 'collision', file: require('../assets/sounds/collision.mp3') },
                { name: 'gameover', file: require('../assets/sounds/gameover.mp3') },
                { name: 'click', file: require('../assets/sounds/click.mp3') },
            ];

            for (const config of soundConfigs) {
                try {
                    const { sound } = await Audio.Sound.createAsync(config.file);
                    this.sounds[config.name] = sound;
                } catch (e) {
                    console.log(`Ses yüklenemedi: ${config.name}`);
                }
            }

            this.soundsAvailable = Object.keys(this.sounds).length > 0;
            console.log('🎵 Ses dosyaları yüklendi:', Object.keys(this.sounds).length);
        } catch (e) {
            console.log('Ses dosyaları yüklenemedi:', e.message);
        }
    }

    // Ses çal
    async playSound(soundName) {
        if (this.isMuted || !this.soundsAvailable || !this.sounds[soundName]) return;

        try {
            const sound = this.sounds[soundName];
            await sound.setPositionAsync(0);
            await sound.setVolumeAsync(this.volume);
            await sound.playAsync();
        } catch (error) {
            // Ses çalma hatası sessizce geç
        }
    }

    // Birleşme sesi
    async playMerge() {
        await this.playSound('merge');
    }

    // Düşme sesi
    async playDrop() {
        await this.playSound('drop');
    }

    // Çarpma sesi
    async playCollision() {
        await this.playSound('collision');
    }

    // Game over sesi
    async playGameOver() {
        await this.playSound('gameover');
    }

    // Tıklama sesi
    async playClick() {
        await this.playSound('click');
    }

    // Sesi aç/kapat
    async toggleMute() {
        this.isMuted = !this.isMuted;
        await AsyncStorage.setItem('soundMuted', this.isMuted.toString());
        return this.isMuted;
    }

    // Mute durumu
    getMuteStatus() {
        return this.isMuted;
    }

    // Ses seviyesi ayarla
    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
    }

    // Seslerin mevcut olup olmadığı
    hasSounds() {
        return this.soundsAvailable;
    }

    // Temizle
    async unloadSounds() {
        for (const key in this.sounds) {
            if (this.sounds[key]) {
                try {
                    await this.sounds[key].unloadAsync();
                } catch (e) {
                    // Sessizce geç
                }
            }
        }
        this.sounds = {};
        this.isLoaded = false;
        this.soundsAvailable = false;
    }
}

// Singleton instance
const soundManager = new SoundManager();

export default soundManager;
