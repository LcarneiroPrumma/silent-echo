/**
 * DifficultyManager - Sistema de dificuldade
 * Gerencia diferentes níveis de dificuldade do jogo
 */

export default class DifficultyManager {
  constructor() {
    this.currentDifficulty = 'normal'; // easy, normal, hard, nightmare
    this.difficulties = {
      easy: {
        name: 'Fácil',
        soundThreshold: 0.6, // Inimigos menos sensíveis
        enemyCount: 2,
        enemySpeed: 0.8,
        playerHealth: 150,
        scoreMultiplier: 0.5,
      },
      normal: {
        name: 'Normal',
        soundThreshold: 0.4,
        enemyCount: 3,
        enemySpeed: 1.0,
        playerHealth: 100,
        scoreMultiplier: 1.0,
      },
      hard: {
        name: 'Difícil',
        soundThreshold: 0.25,
        enemyCount: 5,
        enemySpeed: 1.3,
        playerHealth: 75,
        scoreMultiplier: 1.5,
      },
      nightmare: {
        name: 'Pesadelo',
        soundThreshold: 0.1,
        enemyCount: 8,
        enemySpeed: 1.6,
        playerHealth: 50,
        scoreMultiplier: 2.0,
      },
    };
  }

  /**
   * Definir dificuldade
   */
  setDifficulty(difficulty) {
    if (this.difficulties[difficulty]) {
      this.currentDifficulty = difficulty;
      return this.difficulties[difficulty];
    }
    console.warn(`Dificuldade não encontrada: ${difficulty}`);
    return this.difficulties.normal;
  }

  /**
   * Obter configuração atual
   */
  getCurrentSettings() {
    return this.difficulties[this.currentDifficulty];
  }

  /**
   * Obter todas as dificuldades
   */
  getAvailableDifficulties() {
    return Object.entries(this.difficulties).map(([key, value]) => ({
      id: key,
      ...value,
    }));
  }

  /**
   * Ajustar configurações para um nível específico
   */
  adjustForLevel(level) {
    const settings = this.getCurrentSettings();
    const levelMultiplier = 1 + (level - 1) * 0.1;

    return {
      ...settings,
      enemyCount: Math.floor(settings.enemyCount * levelMultiplier),
      enemySpeed: settings.enemySpeed * (1 + (level - 1) * 0.05),
      soundThreshold: Math.max(
        0.05,
        settings.soundThreshold * (1 - (level - 1) * 0.05)
      ),
    };
  }
}