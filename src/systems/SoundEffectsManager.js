/**
 * SoundEffectsManager - Sistema de efeitos sonoros
 * Gerencia todos os efeitos sonoros do jogo
 */

export default class SoundEffectsManager {
  constructor(scene) {
    this.scene = scene;
    this.audioContext = null;
    this.sounds = {};
    this.isMuted = false;
  }

  /**
   * Inicializar o gerenciador de som
   */
  initialize(audioContext) {
    this.audioContext = audioContext;
    this.createSounds();
  }

  /**
   * Criar ondas sonoras sintetizadas
   */
  createSounds() {
    if (!this.audioContext) return;

    this.sounds = {
      // Som de ecolocalização (ping)
      echolocation: () => this.playTone(800, 0.1, 'sine'),

      // Som de inimigo detectado
      enemyDetected: () => this.playTone(200, 0.2, 'square'),

      // Som de dano
      damage: () => this.playTone(100, 0.3, 'sine'),

      // Som de game over
      gameOver: () => this.playTone(50, 0.5, 'sine'),

      // Som de vitória
      victory: () => {
        this.playTone(800, 0.1, 'sine');
        setTimeout(() => this.playTone(1200, 0.1, 'sine'), 100);
        setTimeout(() => this.playTone(1600, 0.2, 'sine'), 200);
      },

      // Som de alerta
      alert: () => {
        this.playTone(600, 0.15, 'sine');
        setTimeout(() => this.playTone(400, 0.15, 'sine'), 150);
      },
    };
  }

  /**
   * Tocar uma nota de tom puro
   * @param {number} frequency - Frequência em Hz
   * @param {number} duration - Duração em segundos
   * @param {string} type - Tipo de onda (sine, square, sawtooth, triangle)
   */
  playTone(frequency, duration, type = 'sine') {
    if (!this.audioContext || this.isMuted) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      // Envelope (ADSR simplificado)
      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        this.audioContext.currentTime + duration
      );

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (e) {
      console.error('Erro ao tocar som:', e);
    }
  }

  /**
   * Reproduzir efeito sonoro
   */
  play(soundName) {
    if (this.sounds[soundName]) {
      this.sounds[soundName]();
    } else {
      console.warn(`Som não encontrado: ${soundName}`);
    }
  }

  /**
   * Mutar/desmutar
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  /**
   * Destruir gerenciador
   */
  destroy() {
    this.sounds = {};
    this.audioContext = null;
  }
}