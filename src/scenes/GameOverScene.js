import Phaser from 'phaser';

/**
 * GameOverScene - Cena de game over atualizada
 */
export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data) {
    this.score = data.score || 0;
    this.time = data.time || 0;
    this.level = data.level || 1;
    this.position = data.position || 999;
    this.difficulty = data.difficulty || 'normal';
    this.playerName = data.playerName || 'Jogador';
  }

  create() {
    const { width, height } = this.cameras.main;

    // Fundo
    this.add.rectangle(width / 2, height / 2, width, height, 0x0a0a14).setOrigin(0.5);

    // Título
    this.add.text(width / 2, height * 0.15, '💀 GAME OVER', {
      font: 'bold 64px Arial',
      fill: '#ff4444',
      align: 'center',
      stroke: '#990000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    // Estatísticas
    const seconds = Math.floor(this.time / 1000);
    const stats = `
Jogador: ${this.playerName}
Nível: ${this.level}
Dificuldade: ${this.difficulty.toUpperCase()}
Pontos: ${this.score}
Tempo: ${seconds}s
Posição: #${this.position}
    `;

    this.add.text(width / 2, height * 0.45, stats, {
      font: 'bold 20px Arial',
      fill: '#00d4ff',
      align: 'center',
      lineSpacing: 12,
    }).setOrigin(0.5);

    // Botões
    // Tentar novamente
    const retryButton = this.add.rectangle(width * 0.35, height * 0.8, 180, 50, 0x444444)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    this.add.text(width * 0.35, height * 0.8, 'TENTAR NOVAMENTE', {
      font: 'bold 14px Arial',
      fill: '#ffffff',
    }).setOrigin(0.5);

    retryButton.on('pointerdown', () => {
      this.scene.start('GameScene', {
        difficulty: this.difficulty,
        level: this.level,
        playerName: this.playerName,
      });
    });

    // Menu
    const menuButton = this.add.rectangle(width * 0.65, height * 0.8, 180, 50, 0x444444)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    this.add.text(width * 0.65, height * 0.8, 'MENU', {
      font: 'bold 14px Arial',
      fill: '#ffffff',
    }).setOrigin(0.5);

    menuButton.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }
}