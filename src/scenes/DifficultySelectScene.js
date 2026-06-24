import Phaser from 'phaser';

/**
 * DifficultySelectScene - Seleção de dificuldade
 */
export default class DifficultySelectScene extends Phaser.Scene {
  constructor() {
    super({ key: 'DifficultySelectScene' });
  }

  init(data) {
    this.playerName = data?.playerName || 'Jogador';
  }

  create() {
    const { width, height } = this.cameras.main;

    // Fundo
    this.add.rectangle(width / 2, height / 2, width, height, 0x0f0f1e).setOrigin(0.5);

    // Título
    this.add.text(width / 2, height * 0.1, 'Selecione a Dificuldade', {
      font: 'bold 48px Arial',
      fill: '#00d4ff',
      align: 'center',
    }).setOrigin(0.5);

    // Dificuldades
    const difficulties = [
      { id: 'easy', name: 'FÁCIL', desc: 'Perfeito para aprender', color: 0x00ff00, y: height * 0.35 },
      { id: 'normal', name: 'NORMAL', desc: 'Desafio equilibrado', color: 0x00d4ff, y: height * 0.5 },
      { id: 'hard', name: 'DIFÍCIL', desc: 'Para veteranos', color: 0xffff00, y: height * 0.65 },
      { id: 'nightmare', name: 'PESADELO', desc: 'Praticamente impossível', color: 0xff0000, y: height * 0.8 },
    ];

    difficulties.forEach((diff) => {
      // Botão
      const button = this.add.rectangle(width / 2, diff.y, 300, 60, diff.color).setOrigin(0.5);
      button.setInteractive({ useHandCursor: true });

      // Texto do nome
      this.add.text(width / 2, diff.y - 15, diff.name, {
        font: 'bold 28px Arial',
        fill: '#000000',
      }).setOrigin(0.5);

      // Descrição
      this.add.text(width / 2, diff.y + 15, diff.desc, {
        font: 'italic 12px Arial',
        fill: '#000000',
      }).setOrigin(0.5);

      // Hover
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

      // Click
      button.on('pointerdown', () => {
        this.scene.start('GameScene', {
          difficulty: diff.id,
          level: 1,
          playerName: this.playerName,
        });
      });
    });

    // Botão voltar
    const backButton = this.add.rectangle(width * 0.1, height * 0.95, 100, 40, 0x444444)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    this.add.text(width * 0.1, height * 0.95, '← VOLTAR', {
      font: 'bold 12px Arial',
      fill: '#ffffff',
    }).setOrigin(0.5);

    backButton.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }
}