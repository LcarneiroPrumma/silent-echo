import Phaser from 'phaser';
import LeaderboardManager from '@systems/LeaderboardManager';
import AchievementManager from '@systems/AchievementManager';

/**
 * LeaderboardScene - Cena de leaderboard
 */
export default class LeaderboardScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LeaderboardScene' });
  }

  create() {
    const { width, height } = this.cameras.main;

    // Fundo
    this.add.rectangle(width / 2, height / 2, width, height, 0x0f0f1e).setOrigin(0.5);

    // Título
    this.add.text(width / 2, height * 0.05, '🏆 LEADERBOARD', {
      font: 'bold 40px Arial',
      fill: '#ffff00',
      align: 'center',
    }).setOrigin(0.5);

    const leaderboard = new LeaderboardManager();
    const achievements = new AchievementManager();
    const top10 = leaderboard.getLeaderboard(10);
    const stats = leaderboard.getStats();
    const achievementProgress = achievements.getProgress();

    // Estatísticas gerais
    const statsText = `
Total de Jogos: ${stats.totalGames}
Maior Pontuação: ${stats.topScore}
Pontuação Média: ${stats.averageScore}
Maior Nível: ${stats.highestLevel}
Tempo Médio: ${stats.averageTime}s
    `;

    this.add.text(width * 0.15, height * 0.15, statsText, {
      font: 'bold 14px Arial',
      fill: '#00d4ff',
      align: 'left',
      lineSpacing: 8,
    }).setOrigin(0, 0);

    // Achievements
    const achievText = `
🏅 ACHIEVEMENTS
${achievementProgress.unlocked}/${achievementProgress.total}
${Math.round(achievementProgress.percentage)}%
    `;

    this.add.text(width * 0.65, height * 0.15, achievText, {
      font: 'bold 14px Arial',
      fill: '#9d00ff',
      align: 'left',
      lineSpacing: 8,
    }).setOrigin(0, 0);

    // Ranking
    this.add.text(width / 2, height * 0.38, 'TOP 10', {
      font: 'bold 24px Arial',
      fill: '#00d4ff',
      align: 'center',
    }).setOrigin(0.5);

    let yPos = height * 0.45;
    top10.forEach((entry) => {
      const medal = entry.position === 1 ? '🥇' : entry.position === 2 ? '🥈' : entry.position === 3 ? '🥉' : `#${entry.position}`;
      const text = `${medal} ${entry.name.padEnd(20)} ${entry.score.toString().padStart(6)} pts (Nível ${entry.level})`;

      this.add.text(width / 2, yPos, text, {
        font: 'monospace 12px Arial',
        fill: '#e0e0e0',
        align: 'center',
      }).setOrigin(0.5);

      yPos += 25;
    });

    // Botão voltar
    const backButton = this.add.rectangle(width * 0.5, height * 0.95, 150, 40, 0x444444)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    this.add.text(width * 0.5, height * 0.95, '← VOLTAR', {
      font: 'bold 14px Arial',
      fill: '#ffffff',
    }).setOrigin(0.5);

    backButton.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }
}