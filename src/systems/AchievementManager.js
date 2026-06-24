/**
 * AchievementManager - Sistema de achievements
 * Rastreia e gerencia conquistas do jogador
 */

export default class AchievementManager {
  constructor() {
    this.achievements = this.createAchievements();
    this.unlockedAchievements = [];
    this.loadProgress();
  }

  /**
   * Criar lista de achievements
   */
  createAchievements() {
    return {
      // Básicos
      first_sound: {
        id: 'first_sound',
        name: '🎵 Primeiro Som',
        description: 'Emita sua primeira onda sonora',
        icon: '🔊',
        locked: true,
      },

      silence_master: {
        id: 'silence_master',
        name: '🤐 Mestre do Silêncio',
        description: 'Sobreviva 1 minuto com som < 20%',
        icon: '🔇',
        locked: true,
      },

      survivor_1min: {
        id: 'survivor_1min',
        name: '⏱️ Sobrevivente',
        description: 'Sobreviva 1 minuto completo',
        icon: '🏃',
        locked: true,
      },

      perfect_level: {
        id: 'perfect_level',
        name: '⭐ Perfeição',
        description: 'Complete um nível com 100% de sucesso',
        icon: '✨',
        locked: true,
      },

      score_1000: {
        id: 'score_1000',
        name: '💯 Pontuação Épica',
        description: 'Alcance 1000 pontos',
        icon: '🎯',
        locked: true,
      },

      // Dificuldade
      nightmare_clear: {
        id: 'nightmare_clear',
        name: '😱 Pesadelo',
        description: 'Complete um nível em dificuldade Pesadelo',
        icon: '👹',
        locked: true,
      },

      // Velocidade
      speedrun: {
        id: 'speedrun',
        name: '⚡ Velocista',
        description: 'Complete um nível em menos de 30 segundos',
        icon: '💨',
        locked: true,
      },

      // Inimigos
      no_damage: {
        id: 'no_damage',
        name: '🛡️ Intocável',
        description: 'Complete um nível sem ser tocado',
        icon: '🧿',
        locked: true,
      },

      // Progressão
      all_levels: {
        id: 'all_levels',
        name: '🏆 Lenda',
        description: 'Complete todos os 10 níveis',
        icon: '👑',
        locked: true,
      },

      collector: {
        id: 'collector',
        name: '🏅 Colecionador',
        description: 'Desbloqueie 5 achievements',
        icon: '📦',
        locked: true,
      },
    };
  }

  /**
   * Desbloquear achievement
   */
  unlock(achievementId) {
    if (this.achievements[achievementId] && !this.achievements[achievementId].locked) {
      console.warn(`Achievement já desbloqueado: ${achievementId}`);
      return false;
    }

    if (this.achievements[achievementId]) {
      this.achievements[achievementId].locked = false;
      this.achievements[achievementId].unlockedAt = Date.now();
      this.unlockedAchievements.push(achievementId);

      console.log(`🏆 Achievement desbloqueado: ${this.achievements[achievementId].name}`);
      this.saveProgress();
      return true;
    }

    return false;
  }

  /**
   * Verificar se achievement está desbloqueado
   */
  isUnlocked(achievementId) {
    return (
      this.achievements[achievementId] &&
      !this.achievements[achievementId].locked
    );
  }

  /**
   * Obter todos os achievements
   */
  getAllAchievements() {
    return Object.values(this.achievements);
  }

  /**
   * Obter progresso
   */
  getProgress() {
    const total = Object.keys(this.achievements).length;
    const unlocked = this.unlockedAchievements.length;
    return { unlocked, total, percentage: (unlocked / total) * 100 };
  }

  /**
   * Salvar progresso em localStorage
   */
  saveProgress() {
    const progress = {
      unlockedAchievements: this.unlockedAchievements,
      achievements: this.achievements,
      timestamp: Date.now(),
    };

    try {
      localStorage.setItem('silent_echo_achievements', JSON.stringify(progress));
    } catch (e) {
      console.error('Erro ao salvar achievements:', e);
    }
  }

  /**
   * Carregar progresso do localStorage
   */
  loadProgress() {
    try {
      const saved = localStorage.getItem('silent_echo_achievements');
      if (saved) {
        const progress = JSON.parse(saved);
        this.unlockedAchievements = progress.unlockedAchievements || [];
        this.achievements = progress.achievements || this.achievements;
      }
    } catch (e) {
      console.error('Erro ao carregar achievements:', e);
    }
  }

  /**
   * Limpar progresso
   */
  resetProgress() {
    this.achievements = this.createAchievements();
    this.unlockedAchievements = [];
    localStorage.removeItem('silent_echo_achievements');
  }
}