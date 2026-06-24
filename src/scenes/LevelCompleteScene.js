import Phaser from 'phaser';

/**
 * LevelCompleteScene - Tela de conclusão de nível
 */
export default class LevelCompleteScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LevelCompleteScene' });
  }

  init(data) {
    this.score = data.score || 0;
    this.level = data.level || 1;
    this.position = data.position || 999;
    this.nextLevel = data.nextLevel;
    this.difficulty = data.difficulty || 'normal';
    this.playerName = data.playerName || 'Jogador';
  }

  create() {
    const { width, height } = this.cameras.main;

    // Fundo
    this.add.rectangle(width / 2, height / 2, width, height, 0x0a0a14).setOrigin(0.5);

    // Título
    this.add.text(width / 2, height * 0.15, '✨ NÍVEL COMPLETO', {
      font: 'bold 48px Arial',
      fill: '#00ff00',
      align: 'center',
      stroke: '#00aa00',
      strokeThickness: 3,
    }).setOrigin(0.5);

    // Estatísticas
    const stats = `
Nível: ${this.level}/10
Pontos: ${this.score}
Posição no Ranking: #${this.position}
Dificuldade: ${this.difficulty.toUpperCase()}
Jogador: ${this.playerName}
    `;

    this.add.text(width / 2, height * 0.45, stats, {
      font: 'bold 20px Arial',
      fill: '#00d4ff',
      align: 'center',
      lineSpacing: 15,
    }).setOrigin(0.5);

    // Botões
    if (this.nextLevel) {
      // Próximo nível
      const nextButton = this.add.rectangle(width * 0.35, height * 0.8, 180, 50, 0x00ff00)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

      this.add.text(width * 0.35, height * 0.8, 'PRÓXIMO NÍVEL', {
        font: 'bold 16px Arial',
        fill: '#000000',
      }).setOrigin(0.5);

      nextButton.on('pointerdown', () => {
        this.scene.start('GameScene', {
          difficulty: this.difficulty,
          level: this.nextLevel,
          playerName: this.playerName,
        });
      });
    } else {
      // Jogo completado
      this.add.text(width / 2, height * 0.7, '🏆 JOGO COMPLETADO! 🏆', {
        font: 'bold 32px Arial',
        fill: '#ffff00',
        align: 'center',
      }).setOrigin(0.5);
    }

    // Voltar ao menu
    const menuButton = this.add.rectangle(width * 0.65, height * 0.8, 180, 50, 0x444444)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    this.add.text(width * 0.65, height * 0.8, 'MENU PRINCIPAL', {
      font: 'bold 16px Arial',
      fill: '#ffffff',
    }).setOrigin(0.5);

    menuButton.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }
}