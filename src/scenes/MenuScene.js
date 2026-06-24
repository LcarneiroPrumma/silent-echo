import Phaser from 'phaser';

/**
 * MenuScene - Menu principal atualizado com novas opções
 */
export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const { width, height } = this.cameras.main;

    // Fundo com gradiente
    this.add.rectangle(width / 2, height / 2, width, height, 0x0f0f1e).setOrigin(0.5);

    // Título
    this.add.text(width / 2, height * 0.1, '🔇 SILENT ECHO', {
      font: 'bold 72px Arial',
      fill: '#00d4ff',
      align: 'center',
      stroke: '#9d00ff',
      strokeThickness: 4,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: '#000000',
        blur: 10,
        fill: true,
      },
    }).setOrigin(0.5);

    // Subtítulo
    this.add.text(width / 2, height * 0.2, 'Terror Acústico Reverso', {
      font: 'italic 24px Arial',
      fill: '#e0e0e0',
      align: 'center',
    }).setOrigin(0.5);

    // Descrição
    const description = `Você é uma entidade cega em completa escuridão.
Seu único sentido é a ecolocalização.
Cada som que você emite revela o mapa...
Mas também alerta os predadores que caçam pelo som.

O silêncio absoluto na sua sala é sua única proteção.`;

    this.add.text(width / 2, height * 0.35, description, {
      font: '14px Arial',
      fill: '#a0a0a0',
      align: 'center',
      wordWrap: { width: width * 0.8 },
      lineSpacing: 8,
    }).setOrigin(0.5);

    // Menu de opções
    const menuItems = [
      { y: height * 0.6, text: '▶️ JOGAR', color: 0x00ff00, action: () => this.goToDifficulty() },
      { y: height * 0.7, text: '🏆 LEADERBOARD', color: 0xffff00, action: () => this.scene.start('LeaderboardScene') },
      { y: height * 0.8, text: '🎖️ ACHIEVEMENTS', color: 0x9d00ff, action: () => this.scene.start('AchievementsScene') },
    ];

    menuItems.forEach((item) => {
      const button = this.add.rectangle(width / 2, item.y, 250, 50, item.color)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

      this.add.text(width / 2, item.y, item.text, {
        font: 'bold 24px Arial',
        fill: '#000000',
      }).setOrigin(0.5);

      button.on('pointerover', () => {
        this.tweens.add({
          targets: button,
          scaleX: 1.1,
          scaleY: 1.1,
          duration: 200,
        });
      });

      button.on('pointerout', () => {
        this.tweens.add({
          targets: button,
          scaleX: 1,
          scaleY: 1,
          duration: 200,
        });
      });

      button.on('pointerdown', item.action);
    });

    // Créditos
    this.add.text(width * 0.5, height * 0.95, '© 2024 LcarneiroPrumma', {
      font: '12px Arial',
      fill: '#666666',
      align: 'center',
    }).setOrigin(0.5);

    console.log('✓ MenuScene carregada');
  }

  goToDifficulty() {
    // Pedir nome do jogador
    const playerName = prompt('Digite seu nome:', 'Jogador');
    if (playerName) {
      this.scene.start('DifficultySelectScene', { playerName });
    }
  }
}