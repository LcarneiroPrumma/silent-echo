import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const { width, height } = this.cameras.main;

    this.add.rectangle(width / 2, height / 2, width, height, 0x0f0f1e).setOrigin(0.5);

    this.add.text(width / 2, height * 0.15, '🔇 SILENT ECHO', {
      font: 'bold 64px Arial',
      fill: '#00d4ff',
      align: 'center',
      stroke: '#9d00ff',
      strokeThickness: 4,
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.25, 'Terror Acústico Reverso', {
      font: 'italic 24px Arial',
      fill: '#e0e0e0',
      align: 'center',
    }).setOrigin(0.5);

    const description = `Você é uma entidade cega em completa escuridão.
Seu único sentido é a ecolocalização.
Cada som que você emite revela o mapa...
Mas também alerta os predadores que caçam pelo som.

O silêncio absoluto na sua sala é sua única proteção.`;

    this.add.text(width / 2, height * 0.45, description, {
      font: '16px Arial',
      fill: '#a0a0a0',
      align: 'center',
      wordWrap: { width: width * 0.8 },
      lineSpacing: 10,
    }).setOrigin(0.5);

    const playButton = this.add.rectangle(width / 2, height * 0.75, 200, 50, 0x9d00ff)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    this.add.text(width / 2, height * 0.75, 'JOGAR', {
      font: 'bold 24px Arial',
      fill: '#ffffff',
    }).setOrigin(0.5);

    playButton.on('pointerover', () => {
      playButton.setFillStyle(0x00d4ff);
      this.tweens.add({
        targets: playButton,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 200,
      });
    });

    playButton.on('pointerout', () => {
      playButton.setFillStyle(0x9d00ff);
      this.tweens.add({
        targets: playButton,
        scaleX: 1,
        scaleY: 1,
        duration: 200,
      });
    });

    playButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    this.add.text(width * 0.85, height * 0.95, '© 2024 LcarneiroPrumma', {
      font: '12px Arial',
      fill: '#666666',
    }).setOrigin(0.5);

    console.log('✓ MenuScene carregada');
  }
}