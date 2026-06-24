import Phaser from 'phaser';
import AudioInputSystem from '@systems/AudioInputSystem';
import Player from '@entities/Player';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init() {
    this.audioSystem = null;
    this.player = null;
    this.enemies = [];
    this.soundLevel = 0;
    this.gameTime = 0;
    this.score = 0;
    this.isGameOver = false;
  }

  async create() {
    const { width, height } = this.cameras.main;

    this.add.rectangle(width / 2, height / 2, width, height, 0x0a0a14).setOrigin(0.5);

    try {
      this.audioSystem = new AudioInputSystem(this);
      await this.audioSystem.initialize();
      console.log('✓ Sistema de áudio inicializado');
    } catch (error) {
      console.error('Erro ao inicializar áudio:', error);
    }

    this.player = new Player(this, width / 2, height / 2);
    this.createUI();
    this.createEnemies();

    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.start('MenuScene');
    });

    console.log('✓ GameScene criada');
  }

  createUI() {
    const { width, height } = this.cameras.main;

    this.soundLevelText = this.add.text(20, 20, 'Som: 0%', {
      font: 'bold 16px Arial',
      fill: '#00d4ff',
    });

    this.soundLevelBar = this.add.rectangle(20, 50, 200, 20, 0x333333).setOrigin(0, 0);
    this.soundLevelBarFill = this.add.rectangle(20, 50, 0, 20, 0x00d4ff).setOrigin(0, 0);

    this.scoreText = this.add.text(width - 20, 20, 'Pontos: 0', {
      font: 'bold 16px Arial',
      fill: '#00d4ff',
      align: 'right',
    }).setOrigin(1, 0);

    this.timerText = this.add.text(width / 2, 20, 'Tempo: 0s', {
      font: 'bold 16px Arial',
      fill: '#00d4ff',
    }).setOrigin(0.5, 0);
  }

  createEnemies() {
    const { width, height } = this.cameras.main;

    for (let i = 0; i < 3; i++) {
      const x = Phaser.Math.Between(width * 0.2, width * 0.8);
      const y = Phaser.Math.Between(height * 0.2, height * 0.8);

      const enemy = this.add.circle(x, y, 15, 0xff4444, 0.7);
      enemy.hp = 100;
      enemy.speed = Phaser.Math.Between(100, 150);

      this.enemies.push(enemy);
    }
  }

  update(time, delta) {
    if (this.isGameOver) return;

    this.gameTime += delta;

    if (this.audioSystem) {
      this.soundLevel = this.audioSystem.getCurrentLevel();
      this.updateSoundUI();
    }

    if (this.player) {
      this.player.update();
    }

    this.updateEnemies(delta);
    this.updateHUD();
    this.checkCollisions();
  }

  updateSoundUI() {
    const soundPercent = Math.round(this.soundLevel * 100);
    this.soundLevelText.setText(`Som: ${soundPercent}%`);

    const barWidth = 200 * this.soundLevel;
    this.soundLevelBarFill.setDisplaySize(Math.max(0, barWidth), 20);

    if (this.soundLevel < 0.3) {
      this.soundLevelBarFill.setFillStyle(0x00ff00);
    } else if (this.soundLevel < 0.6) {
      this.soundLevelBarFill.setFillStyle(0xffff00);
    } else {
      this.soundLevelBarFill.setFillStyle(0xff4444);
    }
  }

  updateEnemies(delta) {
    this.enemies.forEach((enemy) => {
      if (!enemy.active) return;

      const dx = this.player.x - enemy.x;
      const dy = this.player.y - enemy.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0) {
        const vx = (dx / distance) * enemy.speed;
        const vy = (dy / distance) * enemy.speed;

        enemy.x += vx * (delta / 1000);
        enemy.y += vy * (delta / 1000);
      }

      if (this.soundLevel > 0.7) {
        enemy.speed = 250;
      } else if (this.soundLevel > 0.5) {
        enemy.speed = 200;
      } else {
        enemy.speed = 100;
      }
    });
  }

  updateHUD() {
    const seconds = Math.floor(this.gameTime / 1000);
    this.timerText.setText(`Tempo: ${seconds}s`);
    this.scoreText.setText(`Pontos: ${this.score}`);
  }

  checkCollisions() {
    if (!this.player) return;

    this.enemies.forEach((enemy) => {
      const distance = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        enemy.x,
        enemy.y
      );

      if (distance < 30) {
        this.gameOver();
      }
    });
  }

  gameOver() {
    if (this.isGameOver) return;

    this.isGameOver = true;
    console.log('💀 Game Over! Score:', this.score);

    if (this.audioSystem) {
      this.audioSystem.stop();
    }

    this.scene.start('GameOverScene', { score: this.score, time: this.gameTime });
  }
}