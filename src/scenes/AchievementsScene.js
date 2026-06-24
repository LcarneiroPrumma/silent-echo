import Phaser from 'phaser';
import AchievementManager from '@systems/AchievementManager';

/**
 * AchievementsScene - Cena de achievements
 */
export default class AchievementsScene extends Phaser.Scene {
  constructor() {
    super({ key: 'AchievementsScene' });
  }

  create() {
    const { width, height } = this.cameras.main;

    // Fundo
    this.add.rectangle(width / 2, height / 2, width, height, 0x0f0f1e).setOrigin(0.5);

    // Título
    this.add.text(width / 2, height * 0.05, '🏆 ACHIEVEMENTS', {
      font: 'bold 40px Arial',
      fill: '#9d00ff',
      align: 'center',
    }).setOrigin(0.5);

    const achievementManager = new AchievementManager();
    const all = achievementManager.getAllAchievements();
    const progress = achievementManager.getProgress();

    // Progresso
    const progressText = `${progress.unlocked}/${progress.total} Desbloqueados (${Math.round(progress.percentage)}%)`;
    this.add.text(width / 2, height * 0.12, progressText, {
      font: 'bold 18px Arial',
      fill: '#00d4ff',
      align: 'center',
    }).setOrigin(0.5);

    // Barra de progresso
    const barBg = this.add.rectangle(width / 2, height * 0.18, 400, 20, 0x333333).setOrigin(0.5);
    const barFill = this.add.rectangle(
      width / 2 - 200,
      height * 0.18,
      (progress.percentage / 100) * 400,
      20,
      0x9d00ff
    ).setOrigin(0, 0.5);

    // Grid de achievements
    let index = 0;
    const cols = 5;
    const spacing = 100;
    const startY = height * 0.3;
    const startX = width / 2 - (cols * spacing) / 2 + 30;

    all.forEach((achievement) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = startX + col * spacing;
      const y = startY + row * spacing;

      // Fundo
      const bg = this.add.rectangle(x, y, 80, 80, achievement.locked ? 0x222222 : 0x444444)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

      // Ícone
      this.add.text(x, y - 10, achievement.icon, {
        font: 'bold 32px Arial',
        fill: achievement.locked ? '#666666' : '#ffff00',
      }).setOrigin(0.5);

      // Nome
      this.add.text(x, y + 25, achievement.name.substring(2, 10), {
        font: achievement.locked ? '10px Arial' : 'bold 10px Arial',
        fill: achievement.locked ? '#666666' : '#ffffff',
        align: 'center',
        wordWrap: { width: 70 },
      }).setOrigin(0.5);

      // Tooltip ao hover
      bg.on('pointerover', () => {
        this.showTooltip(achievement, x, y - 100, width);
      });

      bg.on('pointerout', () => {
        this.hideTooltip();
      });

      index++;
    });

    // Botão voltar
    const backButton = this.add.rectangle(width * 0.1, height * 0.95, 120, 40, 0x444444)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    this.add.text(width * 0.1, height * 0.95, '← VOLTAR', {
      font: 'bold 14px Arial',
      fill: '#ffffff',
    }).setOrigin(0.5);

    backButton.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });

    this.tooltip = null;
  }

  showTooltip(achievement, x, y, width) {
    if (this.tooltip) this.tooltip.destroy();

    const tooltipWidth = 200;
    let tooltipX = x;
    if (x + tooltipWidth / 2 > width) {
      tooltipX = width - tooltipWidth / 2 - 10;
    }

    this.tooltip = this.add.rectangle(tooltipX, y, tooltipWidth, 60, 0x000000, 0.9)
      .setOrigin(0.5)
      .setDepth(1000);

    this.add.text(tooltipX, y - 10, achievement.name, {
      font: 'bold 12px Arial',
      fill: '#ffff00',
      align: 'center',
      wordWrap: { width: 180 },
    }).setOrigin(0.5).setDepth(1001);

    this.add.text(tooltipX, y + 15, achievement.description, {
      font: '10px Arial',
      fill: '#e0e0e0',
      align: 'center',
      wordWrap: { width: 180 },
    }).setOrigin(0.5).setDepth(1001);
  }

  hideTooltip() {
    if (this.tooltip) {
      this.tooltip.destroy();
      this.tooltip = null;
    }
  }
}