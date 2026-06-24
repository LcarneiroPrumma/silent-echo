/**
 * LeaderboardManager - Sistema de leaderboard
 * Gerencia pontuações e rankings globais
 */

export default class LeaderboardManager {
  constructor() {
    this.scores = [];
    this.maxScores = 100;
    this.loadScores();
  }

  /**
   * Adicionar pontuação
   */
  addScore(playerName, score, level, difficulty, time) {
    const entry = {
      id: Date.now(),
      name: playerName || 'Anônimo',
      score,
      level,
      difficulty,
      time,
      timestamp: Date.now(),
    };

    this.scores.push(entry);
    this.scores.sort((a, b) => b.score - a.score);

    // Manter apenas os top scores
    if (this.scores.length > this.maxScores) {
      this.scores = this.scores.slice(0, this.maxScores);
    }

    this.saveScores();
    return entry;
  }

  /**
   * Obter ranking completo
   */
  getLeaderboard(limit = 10) {
    return this.scores.slice(0, limit).map((score, index) => ({
      ...score,
      position: index + 1,
    }));
  }

  /**
   * Obter posição de uma pontuação
   */
  getScorePosition(score) {
    const position = this.scores.findIndex((s) => s.score <= score);
    return position === -1 ? this.scores.length + 1 : position + 1;
  }

  /**
   * Obter stats gerais
   */
  getStats() {
    if (this.scores.length === 0) {
      return {
        topScore: 0,
        averageScore: 0,
        totalGames: 0,
      };
    }

    const totalScore = this.scores.reduce((sum, s) => sum + s.score, 0);

    return {
      topScore: this.scores[0].score,
      averageScore: Math.round(totalScore / this.scores.length),
      totalGames: this.scores.length,
      highestLevel: Math.max(...this.scores.map((s) => s.level)),
      averageTime: Math.round(
        this.scores.reduce((sum, s) => sum + s.time, 0) / this.scores.length / 1000
      ),
    };
  }

  /**
   * Filtrar por dificuldade
   */
  getScoresByDifficulty(difficulty) {
    return this.scores
      .filter((s) => s.difficulty === difficulty)
      .slice(0, 10)
      .map((score, index) => ({
        ...score,
        position: index + 1,
      }));
  }

  /**
   * Obter melhores tempos
   */
  getFastestTimes(limit = 10) {
    return this.scores
      .sort((a, b) => a.time - b.time)
      .slice(0, limit)
      .map((score, index) => ({
        ...score,
        position: index + 1,
      }));
  }

  /**
   * Exportar leaderboard como JSON
   */
  exportLeaderboard() {
    return JSON.stringify(this.scores, null, 2);
  }

  /**
   * Importar leaderboard
   */
  importLeaderboard(jsonData) {
    try {
      const imported = JSON.parse(jsonData);
      this.scores = imported;
      this.scores.sort((a, b) => b.score - a.score);
      this.saveScores();
      return true;
    } catch (e) {
      console.error('Erro ao importar leaderboard:', e);
      return false;
    }
  }

  /**
   * Salvar scores em localStorage
   */
  saveScores() {
    try {
      localStorage.setItem('silent_echo_leaderboard', JSON.stringify(this.scores));
    } catch (e) {
      console.error('Erro ao salvar leaderboard:', e);
    }
  }

  /**
   * Carregar scores do localStorage
   */
  loadScores() {
    try {
      const saved = localStorage.getItem('silent_echo_leaderboard');
      if (saved) {
        this.scores = JSON.parse(saved);
      }
    } catch (e) {
      console.error('Erro ao carregar leaderboard:', e);
    }
  }

  /**
   * Limpar leaderboard
   */
  clear() {
    this.scores = [];
    localStorage.removeItem('silent_echo_leaderboard');
  }
}