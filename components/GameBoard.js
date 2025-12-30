/**
 * GameBoard - Ana oyun alanı
 * 
 * Zorluk artırıldı:
 * - Çoklu çarpışma iterasyonu
 * - Göktaşları rastgele X pozisyonunda
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Ball from './Ball';
import {
    PHYSICS,
    GAME_SETTINGS,
    getPlanetData,
    getRandomSpawnType,
    canMerge,
    getMergedType,
    PLANET_TYPES,
} from '../game/constants';
import { useLanguage } from '../game/LanguageContext';
import soundManager from '../game/SoundManager';



const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GAME_WIDTH = Math.min(SCREEN_WIDTH - 20, 360);
const GAME_HEIGHT = GAME_WIDTH * 1.4;

const GameBoard = ({ gameState, onScoreUpdate, onGameOver, controls, isPaused, onResume }) => {
    const [balls, setBalls] = useState([]);
    const { t } = useLanguage();
    // Refs
    const ballsRef = useRef([]);
    const gameLoopRef = useRef(null);
    const lastSpawnRef = useRef(0);
    const spawnCountRef = useRef(0);
    const controlsRef = useRef(controls);
    const gameOverRef = useRef(false);
    const onScoreUpdateRef = useRef(onScoreUpdate);
    const onGameOverRef = useRef(onGameOver);
    const currentGameStateRef = useRef(gameState);
    const isPausedRef = useRef(isPaused);

    // Callbacks'i ref'lere kaydet
    useEffect(() => {
        onScoreUpdateRef.current = onScoreUpdate;
    }, [onScoreUpdate]);

    useEffect(() => {
        onGameOverRef.current = onGameOver;
    }, [onGameOver]);

    useEffect(() => {
        controlsRef.current = controls;
    }, [controls]);

    // Pause durumunu ref'e kaydet
    useEffect(() => {
        isPausedRef.current = isPaused;
    }, [isPaused]);

    // GameState değişikliğini takip et
    useEffect(() => {
        const prevState = currentGameStateRef.current;
        currentGameStateRef.current = gameState;

        if (gameState === 'playing' && prevState !== 'playing') {
            ballsRef.current = [];
            setBalls([]);
            lastSpawnRef.current = 0;
            spawnCountRef.current = 0;
            gameOverRef.current = false;
            startGameLoop();
        } else if (gameState !== 'playing') {
            stopGameLoop();
        }
    }, [gameState]);

    const stopGameLoop = () => {
        if (gameLoopRef.current) {
            cancelAnimationFrame(gameLoopRef.current);
            gameLoopRef.current = null;
        }
    };

    const startGameLoop = () => {
        stopGameLoop();

        const gameLoop = () => {
            if (gameOverRef.current || currentGameStateRef.current !== 'playing') {
                return;
            }

            // Pause durumunda döngüyü atla ama devam et
            if (isPausedRef.current) {
                gameLoopRef.current = requestAnimationFrame(gameLoop);
                return;
            }

            const now = Date.now();
            let currentBalls = [...ballsRef.current];

            // =====================
            // FİZİK GÜNCELLEME
            // =====================

            for (let i = 0; i < currentBalls.length; i++) {
                const ball = currentBalls[i];

                if (ball.isFalling) {
                    if (controlsRef.current?.left) ball.x -= 5;
                    if (controlsRef.current?.right) ball.x += 5;
                    ball.vy = controlsRef.current?.drop ? 10 : 3.5;
                } else {
                    // YERLEŞME KONTROLÜ
                    const isSettled = ball.landedAt && (now - ball.landedAt) > (PHYSICS.SETTLE_TIME || 250);

                    ball.vy += PHYSICS.GRAVITY;
                    ball.vy = Math.min(ball.vy, PHYSICS.MAX_VELOCITY);

                    if (isSettled) {
                        // Yerleşmiş top: tamamen durdur
                        ball.vx = 0;
                        ball.vy = 0;
                    } else {
                        // Henüz yerleşmemiş: normal sürtünme
                        ball.vx *= PHYSICS.FRICTION;
                    }
                }

                ball.x += ball.vx;
                ball.y += ball.vy;

                // Duvarlar
                if (ball.x - ball.radius < 0) {
                    ball.x = ball.radius;
                    ball.vx = Math.abs(ball.vx) * PHYSICS.BOUNCE;
                }
                if (ball.x + ball.radius > GAME_WIDTH) {
                    ball.x = GAME_WIDTH - ball.radius;
                    ball.vx = -Math.abs(ball.vx) * PHYSICS.BOUNCE;
                }

                // Zemin
                if (ball.y + ball.radius > GAME_HEIGHT) {
                    ball.y = GAME_HEIGHT - ball.radius;
                    if (Math.abs(ball.vy) > 0.5) {
                        ball.vy = -ball.vy * PHYSICS.BOUNCE;
                        // Zemine çarptığında hafif yatay hareket (Suika benzeri)
                        ball.vx += (Math.random() - 0.5) * 2;
                    } else {
                        ball.vy = 0;
                    }
                    if (ball.isFalling) {
                        ball.isFalling = false;
                        ball.landedAt = now;  // Zemine indiği anı kaydet
                    }
                    // Zemine değmiyorsa ama landedAt yoksa (diğer topa çarptı)
                    if (!ball.landedAt) {
                        ball.landedAt = now;
                    }
                }

                // Tavan
                if (ball.y - ball.radius < 0) {
                    ball.y = ball.radius;
                    if (ball.vy < 0) ball.vy = 0;
                }
            }

            // =====================
            // TOP-TOP ÇARPIŞMASI (Yüksek İterasyon)
            // =====================

            const iterations = 6; // Daha stabil yapı için artırıldı

            for (let iter = 0; iter < iterations; iter++) {
                for (let i = 0; i < currentBalls.length; i++) {
                    for (let j = i + 1; j < currentBalls.length; j++) {
                        const ball1 = currentBalls[i];
                        const ball2 = currentBalls[j];

                        const dx = ball2.x - ball1.x;
                        const dy = ball2.y - ball1.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        const minDist = ball1.radius + ball2.radius;

                        if (dist < minDist && dist > 0) {
                            const nx = dx / dist;
                            const ny = dy / dist;
                            const overlap = minDist - dist;

                            const totalMass = ball1.radius + ball2.radius;
                            const ratio1 = ball2.radius / totalMass;
                            const ratio2 = ball1.radius / totalMass;

                            // Pozisyon düzeltme - daha agresif
                            ball1.x -= nx * overlap * ratio1 * 0.6;
                            ball1.y -= ny * overlap * ratio1 * 0.6;
                            ball2.x += nx * overlap * ratio2 * 0.6;
                            ball2.y += ny * overlap * ratio2 * 0.6;

                            // Sadece ilk iterasyonda hız transferi yap
                            if (iter === 0) {
                                const dvx = ball1.vx - ball2.vx;
                                const dvy = ball1.vy - ball2.vy;
                                const dvn = dvx * nx + dvy * ny;

                                if (dvn > 0) {
                                    // Suika benzeri güçlü impuls transferi
                                    const impulse = dvn * (0.5 + PHYSICS.BOUNCE);
                                    ball1.vx -= impulse * nx * 0.8;
                                    ball1.vy -= impulse * ny * 0.8;
                                    ball2.vx += impulse * nx * 0.8;
                                    ball2.vy += impulse * ny * 0.8;

                                    // Çarpışmada hafif rastgele hareket (kaotik fizik)
                                    ball1.vx += (Math.random() - 0.5) * 1.5;
                                    ball2.vx += (Math.random() - 0.5) * 1.5;
                                }

                                // TEMAS FRENİ: Daha az fren (Suika benzeri kayma)
                                const contactFriction = PHYSICS.CONTACT_FRICTION || 0.7;
                                ball1.vx *= (1 - contactFriction * 0.3);
                                ball2.vx *= (1 - contactFriction * 0.3);

                                // Düşen top başka topa çarptığında landedAt ayarla
                                if (ball1.isFalling) {
                                    ball1.isFalling = false;
                                    ball1.landedAt = now;
                                }
                                if (ball2.isFalling) {
                                    ball2.isFalling = false;
                                    ball2.landedAt = now;
                                }
                                // Eğer landedAt yoksa ayarla
                                if (!ball1.landedAt) ball1.landedAt = now;
                                if (!ball2.landedAt) ball2.landedAt = now;
                            }
                        }
                    }
                }
            }

            // Sınır kontrolü
            for (const ball of currentBalls) {
                ball.x = Math.max(ball.radius, Math.min(GAME_WIDTH - ball.radius, ball.x));
                ball.y = Math.max(ball.radius, Math.min(GAME_HEIGHT - ball.radius, ball.y));
            }

            // =====================
            // BİRLEŞME KONTROLÜ
            // =====================

            let mergeHappened = false;

            outerLoop:
            for (let i = 0; i < currentBalls.length; i++) {
                const b1 = currentBalls[i];
                if (!b1 || b1.isFalling) continue;

                for (let j = i + 1; j < currentBalls.length; j++) {
                    const b2 = currentBalls[j];
                    if (!b2 || b2.isFalling) continue;
                    if (!canMerge(b1.type, b2.type)) continue;

                    const dx = b2.x - b1.x;
                    const dy = b2.y - b1.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const minDist = b1.radius + b2.radius;

                    if (dist < minDist + 5) {
                        const newType = getMergedType(b1.type);
                        const newData = getPlanetData(newType);
                        if (!newData) continue;

                        let newX = (b1.x + b2.x) / 2;
                        let newY = (b1.y + b2.y) / 2;

                        newX = Math.max(newData.radius, Math.min(GAME_WIDTH - newData.radius, newX));
                        newY = Math.max(newData.radius, Math.min(GAME_HEIGHT - newData.radius, newY));

                        const newBall = {
                            id: Date.now() + Math.random(),
                            type: newType,
                            x: newX,
                            y: newY,
                            vx: 0,
                            vy: 1,
                            radius: newData.radius,
                            isFalling: false,
                        };

                        const newArray = [];
                        for (let k = 0; k < currentBalls.length; k++) {
                            if (k !== i && k !== j) {
                                // BİRLEŞME ETKİSİ: Diğer topları da uyandır (havada asılı kalmasınlar)
                                const ball = currentBalls[k];
                                ball.landedAt = null; // Yerleşme durumunu sıfırla
                                newArray.push(ball);
                            }
                        }
                        newArray.push(newBall);

                        currentBalls = newArray;
                        mergeHappened = true;

                        // Birleşme sesi çal
                        soundManager.playMerge();

                        const points = newData.points;
                        setTimeout(() => {
                            if (onScoreUpdateRef.current) {
                                onScoreUpdateRef.current(points, newType);
                            }
                        }, 0);

                        break outerLoop;
                    }
                }
            }

            // =====================
            // GAME OVER KONTROLÜ
            // =====================

            for (const ball of currentBalls) {
                if (!ball.isFalling && ball.y - ball.radius < GAME_SETTINGS.DEATH_LINE_Y) {
                    gameOverRef.current = true;
                    ballsRef.current = currentBalls;
                    setBalls([...currentBalls]);
                    setTimeout(() => {
                        if (onGameOverRef.current) {
                            onGameOverRef.current();
                        }
                    }, 0);
                    return;
                }
            }

            // =====================
            // YENİ TOP SPAWN
            // =====================

            const hasFalling = currentBalls.some(b => b.isFalling);
            if (!hasFalling && (now - lastSpawnRef.current > GAME_SETTINGS.SPAWN_DELAY || currentBalls.length === 0)) {
                spawnCountRef.current += 1;

                // Her METEOR_INTERVAL'da bir göktaşı spawn et
                const isMeteor = GAME_SETTINGS.METEOR_INTERVAL > 0 &&
                    spawnCountRef.current % GAME_SETTINGS.METEOR_INTERVAL === 0;

                const type = isMeteor ? PLANET_TYPES.METEOR : getRandomSpawnType();
                const planetData = getPlanetData(type);

                if (planetData) {
                    // Göktaşı rastgele X pozisyonunda, gezegenler ortada
                    let spawnX;
                    if (isMeteor) {
                        // Rastgele X pozisyonu (kenarlardan uzak)
                        const margin = planetData.radius + 20;
                        spawnX = margin + Math.random() * (GAME_WIDTH - 2 * margin);
                    } else {
                        spawnX = GAME_WIDTH / 2;
                    }

                    const newBall = {
                        id: Date.now() + Math.random(),
                        type,
                        x: spawnX,
                        y: GAME_SETTINGS.SPAWN_Y,
                        vx: 0,
                        vy: 0,
                        radius: planetData.radius,
                        isFalling: true,
                    };
                    currentBalls.push(newBall);
                    lastSpawnRef.current = now;
                }
            }

            // State güncelle
            ballsRef.current = currentBalls;
            setBalls([...currentBalls]);

            gameLoopRef.current = requestAnimationFrame(gameLoop);
        };

        gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    // Cleanup
    useEffect(() => {
        return () => {
            stopGameLoop();
        };
    }, []);

    return (
        <View style={styles.container}>
            <View style={[styles.gameArea, { width: GAME_WIDTH, height: GAME_HEIGHT }]}>
                {/* Ölüm çizgisi */}
                <View style={[styles.deathLine, { top: GAME_SETTINGS.DEATH_LINE_Y }]}>
                    <Text style={styles.deathLineText}>{t('deathLine')}</Text>
                </View>

                {/* Toplar */}
                {balls.map(ball => (
                    <Ball key={ball.id} ball={ball} />
                ))}

                {/* Giriş Ekranı - Şık Tasarım */}
                {gameState === 'idle' && (
                    <View style={styles.overlay}>
                        {/* Dekoratif yıldızlar */}
                        <Text style={styles.stars}>✦ ✧ ★ ✧ ✦</Text>

                        {/* Ana başlık */}
                        <Text style={styles.gameTitle}>{t('gameTitle')}</Text>

                        {/* Gezegen sırası - Küçükten büyüğe */}
                        <View style={styles.planetRow}>
                            <Text style={styles.planetEmoji}>🪨</Text>
                            <Text style={styles.planetEmoji}>🌑</Text>
                            <Text style={styles.planetEmoji}>🔴</Text>
                            <Text style={styles.planetEmoji}>🟠</Text>
                            <Text style={styles.planetEmoji}>🌍</Text>
                        </View>
                        <View style={styles.planetRow}>
                            <Text style={styles.planetEmoji}>🔵</Text>
                            <Text style={styles.planetEmoji}>💎</Text>
                            <Text style={styles.planetEmoji}>🪐</Text>
                            <Text style={styles.planetEmoji}>🟤</Text>
                            <Text style={styles.planetEmoji}>☀️</Text>
                        </View>

                        {/* Alt başlık */}
                        <Text style={styles.subtitle}>{t('subtitle1')}</Text>
                        <Text style={styles.subtitle2}>{t('subtitle2')}</Text>


                    </View>
                )}

                {gameState === 'gameover' && (
                    <View style={styles.overlay}>
                        <Text style={styles.gameOverText}>{t('gameOver')}</Text>
                    </View>
                )}

                {/* Pause Overlay */}
                {isPaused && gameState === 'playing' && (
                    <View style={styles.pauseOverlay}>
                        <Text style={styles.pauseTitle}>{t('paused')}</Text>
                        <TouchableOpacity style={styles.resumeButton} onPress={onResume}>
                            <Text style={styles.resumeButtonText}>{t('resume')}</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    gameArea: {
        backgroundColor: '#0a0a1a',
        borderRadius: 15,
        borderWidth: 3,
        borderColor: '#2a2a4a',
        position: 'relative',
    },
    deathLine: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: '#FF4444',
        zIndex: 10,
    },
    deathLineText: {
        position: 'absolute',
        top: 4,
        alignSelf: 'center',
        fontSize: 10,
        color: '#FF4444',
        fontWeight: 'bold',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        zIndex: 50,
        overflow: 'hidden',
        backgroundColor: 'rgba(5, 5, 20, 0.95)',
    },
    stars: {
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.4)',
        marginBottom: 15,
        letterSpacing: 8,
    },
    gameTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFD700',
        textAlign: 'center',
        marginBottom: 25,
        textShadowColor: 'rgba(255, 215, 0, 0.6)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 20,
    },
    planetRow: {
        flexDirection: 'row',
        marginVertical: 8,
        gap: 10,
    },
    planetEmoji: {
        fontSize: 28,
    },
    subtitle: {
        fontSize: 16,
        color: '#4ECDC4',
        fontWeight: '600',
        marginTop: 25,
    },
    subtitle2: {
        fontSize: 14,
        color: '#888888',
        marginTop: 5,
    },
    startHint: {
        marginTop: 35,
        paddingHorizontal: 30,
        paddingVertical: 12,
        backgroundColor: 'rgba(78, 205, 196, 0.15)',
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#4ECDC4',
    },
    startHintText: {
        fontSize: 16,
        color: '#4ECDC4',
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    gameOverText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FF4444',
    },
    pauseOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        borderRadius: 12,
        zIndex: 100,
    },
    pauseTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFD700',
        marginBottom: 30,
        textShadowColor: 'rgba(255, 215, 0, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 15,
    },
    resumeButton: {
        backgroundColor: '#4ECDC4',
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 30,
        borderWidth: 3,
        borderColor: '#2A9D8F',
    },
    resumeButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#050514',
        letterSpacing: 1,
    },
});

export default GameBoard;
