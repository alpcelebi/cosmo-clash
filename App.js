/**
 * Cosmo Clash - Ana Uygulama
 * 
 * Fizik tabanlı gezegen birleştirme oyunu
 * Expo SDK 54 / React Native
 * 
 * Reklam Entegrasyonu:
 * - Banner: Ana giriş ve Game Over ekranında
 * - Interstitial: Her 3 oyunda bir (oyun bittiğinde)
 * 
 * © 2025 - Created by Alp Eren Çelebi
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import Header from './components/Header';
import GameBoard from './components/GameBoard';
import Controls from './components/Controls';
import HowToModal from './components/HowToModal';
import SettingsModal from './components/SettingsModal';
import { LanguageProvider, useLanguage } from './game/LanguageContext';
import { initDatabase, getHighScore, saveScore } from './game/database';
import soundManager from './game/SoundManager';
import adManager from './game/AdManager';

// Oyun durumları
const GAME_STATES = {
  IDLE: 'idle',
  PLAYING: 'playing',
  GAMEOVER: 'gameover',
};

// Banner Ad Unit ID
const BANNER_AD_UNIT_ID = Platform.select({
  android: TestIds.BANNER,
  ios: TestIds.BANNER,
});

// Ana uygulama wrapper - LanguageProvider ile sarar
export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

// Uygulama içeriği
function AppContent() {
  const { t } = useLanguage();

  // State
  const [gameState, setGameState] = useState(GAME_STATES.IDLE);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [showHowTo, setShowHowTo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [controls, setControls] = useState({
    left: false,
    right: false,
    drop: false,
  });

  // GameBoard ref
  const gameBoardRef = useRef(null);

  // Uygulama başladığında veritabanını, ses ve reklamları yükle
  useEffect(() => {
    const loadData = async () => {
      try {
        await initDatabase();
        await soundManager.loadSounds();
        const savedHighScore = await getHighScore();
        setHighScore(savedHighScore);
        console.log('📊 Kayıtlı rekor yüklendi:', savedHighScore);

        // Reklamları başlat
        adManager.initialize();
      } catch (error) {
        console.error('Yükleme hatası:', error);
      }
    };
    loadData();

    // Cleanup
    return () => {
      soundManager.unloadSounds();
    };
  }, []);

  // Oyunu başlat
  const startGame = useCallback(() => {
    soundManager.playClick();
    setScore(0);
    setIsPaused(false);
    setGameState(GAME_STATES.PLAYING);
  }, []);

  // Pause/Resume toggle
  const togglePause = useCallback(() => {
    soundManager.playClick();
    setIsPaused(prev => !prev);
  }, []);

  // Skor güncelle
  const handleScoreUpdate = useCallback((points) => {
    setScore(prev => prev + points);
  }, []);

  // Oyun bitti - Skoru kaydet
  const handleGameOver = useCallback(async () => {
    setGameState(GAME_STATES.GAMEOVER);
    soundManager.playGameOver();

    // Yeni rekor mu kontrol et ve kaydet
    if (score > highScore) {
      setHighScore(score);
      await saveScore(score);
    }
  }, [score, highScore]);

  // Tekrar oyna (interstitial reklam göster)
  const handleRetry = useCallback(async () => {
    soundManager.playClick();

    // Interstitial reklam göster (her 3 oyunda bir)
    await adManager.showInterstitialIfReady();

    startGame();
  }, [startGame]);



  // Kontrol handler'ları
  const handleLeftPress = useCallback(() => {
    setControls(prev => ({ ...prev, left: true }));
  }, []);

  const handleLeftRelease = useCallback(() => {
    setControls(prev => ({ ...prev, left: false }));
  }, []);

  const handleRightPress = useCallback(() => {
    setControls(prev => ({ ...prev, right: true }));
  }, []);

  const handleRightRelease = useCallback(() => {
    setControls(prev => ({ ...prev, right: false }));
  }, []);

  const handleDropPress = useCallback(() => {
    setControls(prev => ({ ...prev, drop: true }));
  }, []);

  const handleDropRelease = useCallback(() => {
    setControls(prev => ({ ...prev, drop: false }));
  }, []);

  // Banner reklam gösterilsin mi?
  const showBanner = gameState === GAME_STATES.IDLE || gameState === GAME_STATES.GAMEOVER;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a1a" />

      {/* Header */}
      <Header
        score={score}
        highScore={highScore}
        onHowToPlay={() => setShowHowTo(true)}
        onSettings={() => setShowSettings(true)}
        isPaused={isPaused}
        isPlaying={gameState === GAME_STATES.PLAYING}
        onTogglePause={togglePause}
      />

      {/* Oyun Tahtası */}
      <View style={styles.gameBoardContainer}>
        <GameBoard
          ref={gameBoardRef}
          gameState={gameState}
          onScoreUpdate={handleScoreUpdate}
          onGameOver={handleGameOver}
          controls={controls}
          isPaused={isPaused}
          onResume={() => setIsPaused(false)}
        />
      </View>

      {/* Başla / Tekrar Oyna Butonu */}
      {(gameState === GAME_STATES.IDLE || gameState === GAME_STATES.GAMEOVER) && (
        <View style={styles.actionContainer}>
          {gameState === GAME_STATES.GAMEOVER && (
            <View style={styles.gameOverInfo}>
              <Text style={styles.finalScoreLabel}>{t('finalScore')}</Text>
              <Text style={styles.finalScoreValue}>
                {score.toLocaleString()}
              </Text>
              {score >= highScore && score > 0 && (
                <Text style={styles.newRecord}>{t('newRecord')}</Text>
              )}
            </View>
          )}

          <TouchableOpacity
            style={styles.startButton}
            onPress={gameState === GAME_STATES.IDLE ? startGame : handleRetry}
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonText}>
              {gameState === GAME_STATES.IDLE ? t('start') : t('playAgain')}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Kontroller - Sadece oyun oynanırken göster */}
      {gameState === GAME_STATES.PLAYING && (
        <Controls
          onLeftPress={handleLeftPress}
          onLeftRelease={handleLeftRelease}
          onRightPress={handleRightPress}
          onRightRelease={handleRightRelease}
          onDropPress={handleDropPress}
          onDropRelease={handleDropRelease}
        />
      )}

      {/* Banner Reklam - Menü ve Game Over'da */}
      {showBanner && (
        <View style={styles.bannerContainer}>
          <BannerAd
            unitId={BANNER_AD_UNIT_ID}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
            onAdLoaded={() => console.log('📢 Banner yüklendi')}
            onAdFailedToLoad={(error) => console.log('📢 Banner hatası:', error)}
          />
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 – Created by Alp Eren Çelebi</Text>
      </View>

      {/* Nasıl Oynanır Modal */}
      <HowToModal visible={showHowTo} onClose={() => setShowHowTo(false)} />

      {/* Ayarlar Modal */}
      <SettingsModal visible={showSettings} onClose={() => setShowSettings(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  gameBoardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  actionContainer: {
    position: 'absolute',
    bottom: '18%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  gameOverInfo: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(10, 10, 20, 0.95)',
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FF4444',
    shadowColor: '#FF4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  finalScoreLabel: {
    fontSize: 14,
    color: '#AAAAAA',
    letterSpacing: 2,
    marginBottom: 5,
  },
  finalScoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(255, 68, 68, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  newRecord: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: 'bold',
    marginTop: 8,
    textShadowColor: 'rgba(255, 215, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  startButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 50,
    paddingVertical: 16,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#2A9D8F',
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 15,
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#050514',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  bannerContainer: {
    alignItems: 'center',
    paddingVertical: 5,
  },
  footer: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.3)',
  },
});
