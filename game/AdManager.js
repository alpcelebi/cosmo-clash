/**
 * AdManager - Reklam Yönetimi
 * 
 * Google AdMob entegrasyonu
 * - Banner reklamlar
 * - Interstitial (geçiş) reklamlar
 * - Rewarded (ödüllü) reklamlar
 * 
 * TEST ID'leri kullanılıyor - Yayınlamadan önce gerçek ID'lerle değiştirin!
 */

import {
  InterstitialAd,
  RewardedAd,
  AdEventType,
  RewardedAdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

// ============================================
// REKLAM ID'LERİ
// ============================================

// TEST ID'leri (Geliştirme için)
const AD_UNIT_IDS = {
  // Banner
  BANNER_ANDROID: TestIds.BANNER,
  BANNER_IOS: TestIds.BANNER,
  
  // Interstitial
  INTERSTITIAL_ANDROID: TestIds.INTERSTITIAL,
  INTERSTITIAL_IOS: TestIds.INTERSTITIAL,
  
  // Rewarded
  REWARDED_ANDROID: TestIds.REWARDED,
  REWARDED_IOS: TestIds.REWARDED,
};

// GERÇEK ID'ler (Yayınlamadan önce bunları kullanın)
// const AD_UNIT_IDS = {
//   BANNER_ANDROID: 'ca-app-pub-XXXX/YYYY',
//   BANNER_IOS: 'ca-app-pub-XXXX/YYYY',
//   INTERSTITIAL_ANDROID: 'ca-app-pub-XXXX/YYYY',
//   INTERSTITIAL_IOS: 'ca-app-pub-XXXX/YYYY',
//   REWARDED_ANDROID: 'ca-app-pub-XXXX/YYYY',
//   REWARDED_IOS: 'ca-app-pub-XXXX/YYYY',
// };

import { Platform } from 'react-native';

// Platform'a göre ID seç
const getAdUnitId = (type) => {
  const isAndroid = Platform.OS === 'android';
  switch (type) {
    case 'banner':
      return isAndroid ? AD_UNIT_IDS.BANNER_ANDROID : AD_UNIT_IDS.BANNER_IOS;
    case 'interstitial':
      return isAndroid ? AD_UNIT_IDS.INTERSTITIAL_ANDROID : AD_UNIT_IDS.INTERSTITIAL_IOS;
    case 'rewarded':
      return isAndroid ? AD_UNIT_IDS.REWARDED_ANDROID : AD_UNIT_IDS.REWARDED_IOS;
    default:
      return null;
  }
};

// ============================================
// REKLAM YÖNETİCİSİ
// ============================================

class AdManager {
  constructor() {
    this.interstitialAd = null;
    this.rewardedAd = null;
    this.isInterstitialLoaded = false;
    this.isRewardedLoaded = false;
    this.gameCount = 0;
    this.interstitialInterval = 3; // Her 3 oyunda bir interstitial
  }

  // ============================================
  // INTERSTITIAL REKLAM
  // ============================================

  /**
   * Interstitial reklamı yükle
   */
  loadInterstitial() {
    const adUnitId = getAdUnitId('interstitial');
    this.interstitialAd = InterstitialAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });

    // Event listener'lar
    const unsubscribeLoaded = this.interstitialAd.addAdEventListener(
      AdEventType.LOADED,
      () => {
        this.isInterstitialLoaded = true;
        console.log('📺 Interstitial reklam yüklendi');
      }
    );

    const unsubscribeClosed = this.interstitialAd.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        this.isInterstitialLoaded = false;
        console.log('📺 Interstitial reklam kapatıldı');
        // Yeni reklam yükle
        this.loadInterstitial();
      }
    );

    const unsubscribeError = this.interstitialAd.addAdEventListener(
      AdEventType.ERROR,
      (error) => {
        this.isInterstitialLoaded = false;
        console.log('📺 Interstitial reklam hatası:', error);
      }
    );

    // Reklamı yükle
    this.interstitialAd.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeError();
    };
  }

  /**
   * Interstitial reklamı göster (her 3 oyunda bir)
   * @returns {Promise<boolean>} Reklam gösterildi mi?
   */
  async showInterstitialIfReady() {
    this.gameCount++;
    
    // Her 3 oyunda bir göster
    if (this.gameCount % this.interstitialInterval !== 0) {
      console.log(`📺 Interstitial: ${this.gameCount}/${this.interstitialInterval} oyun`);
      return false;
    }

    if (this.isInterstitialLoaded && this.interstitialAd) {
      try {
        await this.interstitialAd.show();
        console.log('📺 Interstitial reklam gösterildi');
        return true;
      } catch (error) {
        console.log('📺 Interstitial gösterme hatası:', error);
        return false;
      }
    } else {
      console.log('📺 Interstitial hazır değil, yükleniyor...');
      this.loadInterstitial();
      return false;
    }
  }

  // ============================================
  // REWARDED REKLAM
  // ============================================

  /**
   * Rewarded reklamı yükle
   */
  loadRewarded() {
    const adUnitId = getAdUnitId('rewarded');
    this.rewardedAd = RewardedAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });

    // Event listener'lar
    const unsubscribeLoaded = this.rewardedAd.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        this.isRewardedLoaded = true;
        console.log('🎁 Rewarded reklam yüklendi');
      }
    );

    const unsubscribeEarned = this.rewardedAd.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        console.log('🎁 Ödül kazanıldı:', reward);
      }
    );

    const unsubscribeClosed = this.rewardedAd.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        this.isRewardedLoaded = false;
        console.log('🎁 Rewarded reklam kapatıldı');
        // Yeni reklam yükle
        this.loadRewarded();
      }
    );

    const unsubscribeError = this.rewardedAd.addAdEventListener(
      AdEventType.ERROR,
      (error) => {
        this.isRewardedLoaded = false;
        console.log('🎁 Rewarded reklam hatası:', error);
      }
    );

    // Reklamı yükle
    this.rewardedAd.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeClosed();
      unsubscribeError();
    };
  }

  /**
   * Rewarded reklamı göster
   * @param {Function} onRewarded - Ödül kazanıldığında çağrılacak fonksiyon
   * @returns {Promise<boolean>} Reklam gösterildi mi?
   */
  async showRewarded(onRewarded) {
    if (this.isRewardedLoaded && this.rewardedAd) {
      // Ödül event'ini dinle
      const unsubscribe = this.rewardedAd.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        (reward) => {
          console.log('🎁 Ödül:', reward);
          if (onRewarded) {
            onRewarded(reward);
          }
          unsubscribe();
        }
      );

      try {
        await this.rewardedAd.show();
        console.log('🎁 Rewarded reklam gösterildi');
        return true;
      } catch (error) {
        console.log('🎁 Rewarded gösterme hatası:', error);
        unsubscribe();
        return false;
      }
    } else {
      console.log('🎁 Rewarded hazır değil, yükleniyor...');
      this.loadRewarded();
      return false;
    }
  }

  /**
   * Rewarded reklam hazır mı?
   */
  isRewardedReady() {
    return this.isRewardedLoaded;
  }

  // ============================================
  // BAŞLATMA
  // ============================================

  /**
   * Tüm reklamları başlat ve yükle
   */
  initialize() {
    console.log('📢 AdManager başlatılıyor...');
    this.loadInterstitial();
    this.loadRewarded();
  }

  /**
   * Oyun sayacını sıfırla
   */
  resetGameCount() {
    this.gameCount = 0;
  }
}

// Singleton instance
const adManager = new AdManager();
export default adManager;

// Banner için export
export { getAdUnitId };

