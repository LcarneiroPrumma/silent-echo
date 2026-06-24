import Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data) {
    this.score = data.score || 0;
    this.time = data.time || 0;
  }

  create() {
    const { width, height } = this.cameras.main;

    this.add.rectangle(width / 2, height / 2, width, height, 0x0a0a14).setOrigin(0.5);

    this.add.text(width / 2, height * 0.2, '💀 GAME OVER', {
      font: 'bold 64px Arial',
      fill: '#ff4444',
      align: 'center',
      stroke: '#990000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    const seconds = Math.floor(this.time / 1000);
    const stats = `Pontos: ${this.score}\nTempo: ${seconds}s`;

    this.add.text(width / 2, height * 0.45, stats, {
      font: 'bold 24px Arial',
      fill: '#00d4ff',
      align: 'center',
      lineSpacing: 20,
    }).setOrigin(0.5);

    const menuButton = this.add.rectangle(width / 2, height * 0.75, 200, 50, 0x444444)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    this.add.text(width / 2, height * 0.75, 'MENU', {
      font: 'bold 24px Arial',
      fill: '#ffffff',
    }).setOrigin(0.5);

    menuButton.on('pointerover', () => {
      menuButton.setFillStyle(0x666666);
    });

    menuButton.on('pointerout', () => {
      menuButton.setFillStyle(0x444444);
    });

    menuButton.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }
}