import Phaser from 'phaser';

/**
 * PauseScene - Cena de pausa
 */
export default class PauseScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PauseScene' });
  }

  create() {
    const { width, height } = this.cameras.main;

    // Fundo semi-transparente
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7).setOrigin(0.5);

    // Título
    this.add.text(width / 2, height * 0.2, '⏸️ PAUSADO', {
      font: 'bold 48px Arial',
      fill: '#ffff00',
      align: 'center',
    }).setOrigin(0.5);

    // Menu
    const menuItems = [
      { y: height * 0.4, text: 'CONTINUAR', action: () => this.scene.resume('GameScene') || this.scene.stop() },
      { y: height * 0.55, text: 'RESTART', action: () => this.restartLevel() },
      { y: height * 0.7, text: 'MENU', action: () => this.goToMenu() },
    ];

    menuItems.forEach((item) => {
      const button = this.add.rectangle(width / 2, item.y, 200, 50, 0x444444)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

      this.add.text(width / 2, item.y, item.text, {
        font: 'bold 20px Arial',
        fill: '#ffffff',
      }).setOrigin(0.5);

      button.on('pointerover', () => {
        button.setFillStyle(0x666666);
      });

      button.on('pointerout', () => {
        button.setFillStyle(0x444444);
      });

      button.on('pointerdown', item.action);
    });

    // ESC para continuar
    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.resume('GameScene');
      this.scene.stop();
    });
  }

  restartLevel() {
    const gameScene = this.scene.get('GameScene');
    const level = gameScene.currentLevel;
    const difficulty = gameScene.difficulty;
    const playerName = gameScene.playerName;

    this.scene.stop('GameScene');
    this.scene.stop();
    this.scene.start('GameScene', { level, difficulty, playerName });
  }

  goToMenu() {
    this.scene.stop('GameScene');
    this.scene.stop();
    this.scene.start('MenuScene');
  }
}