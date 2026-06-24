import Phaser from 'phaser';
import AudioInputSystem from '@systems/AudioInputSystem';
import EcholocationSystem from '@systems/EcholocationSystem';
import MapGenerator from '@systems/MapGenerator';
import Player from '@entities/Player';
import Enemy from '@entities/Enemy';
import SoundEffectsManager from '@systems/SoundEffectsManager';
import VisualEffectsManager from '@systems/VisualEffectsManager';
import DifficultyManager from '@systems/DifficultyManager';
import AchievementManager from '@systems/AchievementManager';
import LeaderboardManager from '@systems/LeaderboardManager';

/**
 * GameScene - Cena principal do jogo com todos os sistemas integrados
 */
export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init(data) {
    this.difficulty = data?.difficulty || 'normal';
    this.currentLevel = data?.level || 1;
    this.playerName = data?.playerName || 'Jogador';

    // Sistemas
    this.audioSystem = null;
    this.echolocationSystem = null;
    this.mapGenerator = null;
    this.soundFX = null;
    this.visualFX = null;
    this.difficultyManager = new DifficultyManager();
    this.achievementManager = new AchievementManager();
    this.leaderboardManager = new LeaderboardManager();

    // Entidades
    this.player = null;
    this.enemies = [];
    this.obstacles = [];
    this.objective = null;

    // Estado do jogo
    this.soundLevel = 0;
    this.gameTime = 0;
    this.score = 0;
    this.isGameOver = false;
    this.levelComplete = false;
    this.playerHealth = 100;
    this.waveCounter = 0;
    this.lastWaveTime = 0;
  }

  async create() {
    const { width, height } = this.cameras.main;

    // Fundo
    this.add.rectangle(width / 2, height / 2, width, height, 0x0a0a14).setOrigin(0.5);

    // Inicializar sistemas
    try {
      this.audioSystem = new AudioInputSystem(this);
      await this.audioSystem.initialize();
      console.log('✓ Sistema de áudio inicializado');
    } catch (error) {
      console.error('Erro ao inicializar áudio:', error);
    }

    this.echolocationSystem = new EcholocationSystem(this);
    this.soundFX = new SoundEffectsManager(this);
    if (this.audioSystem?.audioContext) {
      this.soundFX.initialize(this.audioSystem.audioContext);
    }
    this.visualFX = new VisualEffectsManager(this);

    // Configurar dificuldade
    const diffSettings = this.difficultyManager.setDifficulty(this.difficulty);
    const levelSettings = this.difficultyManager.adjustForLevel(this.currentLevel);
    this.playerHealth = levelSettings.playerHealth;

    // Gerar mapa
    this.mapGenerator = new MapGenerator(width, height);
    const map = this.mapGenerator.generate(this.currentLevel);

    // Renderizar obstáculos
    map.obstacles.forEach((obs) => {
      const obstacle = this.add.circle(obs.x, obs.y, obs.radius, 0x444444, 0.6);
      obstacle.setStrokeStyle(1, 0x666666, 1);
      this.obstacles.push(obstacle);
    });

    // Criar jogador
    this.player = new Player(this, width / 2, height / 2);

    // Criar inimigos
    this.enemies = [];
    const enemyTypes = ['basic', 'swift', 'eerie'];
    map.spawnPoints.slice(0, levelSettings.enemyCount).forEach((point, index) => {
      const type = enemyTypes[point.type % enemyTypes.length];
      const enemy = new Enemy(this, point.x, point.y, type);
      this.enemies.push(enemy);
    });

    // Renderizar objetivo
    this.objective = this.add.circle(map.objective.x, map.objective.y, map.objective.radius, 0xffff00, 0.3);
    this.objective.setStrokeStyle(2, 0xffff00, 1);
    this.objective.x = map.objective.x;
    this.objective.y = map.objective.y;
    this.objective.radius = map.objective.radius;

    // Criar UI
    this.createUI();

    // Input
    this.input.keyboard.on('keydown-ESC', () => {
      this.pauseGame();
    });

    console.log(`✓ GameScene criada - Nível ${this.currentLevel} - ${this.difficulty}`);
  }

  createUI() {
    const { width, height } = this.cameras.main;

    // Fundo do HUD
    const hudBg = this.add.rectangle(0, 0, width, 80, 0x000000, 0.7).setOrigin(0, 0);
    hudBg.setDepth(100);

    // Nível
    this.levelText = this.add.text(10, 10, `Nível ${this.currentLevel}/10`, {
      font: 'bold 14px Arial',
      fill: '#00d4ff',
    });
    this.levelText.setDepth(101);

    // Som
    this.soundLevelText = this.add.text(10, 30, 'Som: 0%', {
      font: 'bold 12px Arial',
      fill: '#00d4ff',
    });
    this.soundLevelText.setDepth(101);

    this.soundLevelBar = this.add.rectangle(10, 50, 200, 15, 0x333333).setOrigin(0, 0);
    this.soundLevelBar.setDepth(101);
    this.soundLevelBarFill = this.add.rectangle(10, 50, 0, 15, 0x00d4ff).setOrigin(0, 0);
    this.soundLevelBarFill.setDepth(101);

    // Saúde
    this.healthText = this.add.text(width / 2 - 100, 10, `❤️ Saúde: ${this.playerHealth}`, {
      font: 'bold 14px Arial',
      fill: '#ff4444',
    });
    this.healthText.setDepth(101);

    this.healthBar = this.add.rectangle(width / 2 - 100, 35, 150, 15, 0x333333).setOrigin(0, 0);
    this.healthBar.setDepth(101);
    this.healthBarFill = this.add.rectangle(width / 2 - 100, 35, 150, 15, 0xff4444).setOrigin(0, 0);
    this.healthBarFill.setDepth(101);

    // Pontuação
    this.scoreText = this.add.text(width - 210, 10, `Pontos: 0`, {
      font: 'bold 14px Arial',
      fill: '#00d4ff',
      align: 'right',
    });
    this.scoreText.setDepth(101);

    // Tempo
    this.timerText = this.add.text(width - 210, 30, 'Tempo: 0s', {
      font: 'bold 12px Arial',
      fill: '#00d4ff',
      align: 'right',
    });
    this.timerText.setDepth(101);

    // Inimigos restantes
    this.enemiesText = this.add.text(width - 210, 50, `Inimigos: ${this.enemies.length}`, {
      font: 'bold 12px Arial',
      fill: '#ff6600',
      align: 'right',
    });
    this.enemiesText.setDepth(101);

    // Dificuldade
    const diffColor = {
      easy: '#00ff00',
      normal: '#00d4ff',
      hard: '#ffff00',
      nightmare: '#ff0000',
    };
    this.diffText = this.add.text(width / 2, 10, this.difficultyManager.getCurrentSettings().name.toUpperCase(), {
      font: 'bold 14px Arial',
      fill: diffColor[this.difficulty],
      align: 'center',
    }).setOrigin(0.5, 0);
    this.diffText.setDepth(101);
  }

  update(time, delta) {
    if (this.isGameOver || this.levelComplete) return;

    // Atualizar tempo
    this.gameTime += delta;

    // Atualizar áudio
    if (this.audioSystem) {
      this.soundLevel = this.audioSystem.getCurrentLevel();
      this.updateSoundUI();
    }

    // Atualizar jogador
    if (this.player) {
      this.player.update();
    }

    // Verificar colisão com obstáculos
    this.checkObstacleCollision();

    // Atualizar inimigos
    this.updateEnemies(delta);

    // Atualizar ecolocalização
    this.echolocationSystem.update();

    // Criar ondas sonoras periodicamente quando som é alto
    this.updateEcholocationWaves();

    // Atualizar efeitos visuais
    this.visualFX.update(delta);

    // Atualizar HUD
    this.updateHUD();

    // Verificar colisões
    this.checkCollisions();

    // Verificar objetivo
    this.checkObjective();
  }

  updateSoundUI() {
    const soundPercent = Math.round(this.soundLevel * 100);
    this.soundLevelText.setText(`Som: ${soundPercent}%`);

    const barWidth = Math.max(0, 200 * this.soundLevel);
    this.soundLevelBarFill.setDisplaySize(barWidth, 15);

    if (this.soundLevel < 0.3) {
      this.soundLevelBarFill.setFillStyle(0x00ff00);
    } else if (this.soundLevel < 0.6) {
      this.soundLevelBarFill.setFillStyle(0xffff00);
    } else {
      this.soundLevelBarFill.setFillStyle(0xff4444);
    }
  }

  updateEcholocationWaves() {
    const now = Date.now();

    if (this.soundLevel > 0.4 && now - this.lastWaveTime > 300) {
      this.echolocationSystem.createWave(this.player.x, this.player.y, this.soundLevel);
      this.soundFX.play('echolocation');
      this.visualFX.createPulse(this.player.x, this.player.y, 30 + this.soundLevel * 40, 0x00d4ff, 400);
      this.lastWaveTime = now;
      this.waveCounter++;
      this.score += Math.round(this.soundLevel * 10);
    }
  }

  updateEnemies(delta) {
    this.enemies = this.enemies.filter((enemy) => enemy.active);
    this.enemiesText.setText(`Inimigos: ${this.enemies.length}`);

    this.enemies.forEach((enemy) => {
      enemy.update(this.player.x, this.player.y, this.soundLevel);
    });
  }

  checkObstacleCollision() {
    if (!this.player) return;

    for (const obstacle of this.obstacles) {
      const dist = Math.hypot(this.player.x - obstacle.x, this.player.y - obstacle.y);
      if (dist < this.player.radius + obstacle.radius) {
        // Reverter movimento
        const angle = Math.atan2(this.player.y - obstacle.y, this.player.x - obstacle.x);
        this.player.x = obstacle.x + Math.cos(angle) * (this.player.radius + obstacle.radius + 5);
        this.player.y = obstacle.y + Math.sin(angle) * (this.player.radius + obstacle.radius + 5);
      }
    }
  }

  updateHUD() {
    const seconds = Math.floor(this.gameTime / 1000);
    this.timerText.setText(`Tempo: ${seconds}s`);
    this.scoreText.setText(`Pontos: ${Math.round(this.score)}`);
    this.healthText.setText(`❤️ Saúde: ${Math.round(this.playerHealth)}`);

    const healthPercent = (this.playerHealth / 100) * 150;
    this.healthBarFill.setDisplaySize(Math.max(0, healthPercent), 15);
  }

  checkCollisions() {
    if (!this.player) return;

    this.enemies.forEach((enemy) => {
      if (enemy.collidedWith(this.player.x, this.player.y, this.player.radius)) {
        this.takeDamage(10);
        this.visualFX.cameraShake(8, 200);
        this.soundFX.play('damage');
      }
    });
  }

  checkObjective() {
    if (!this.player || !this.objective) return;

    const dist = Math.hypot(
      this.player.x - this.objective.x,
      this.player.y - this.objective.y
    );

    if (dist < this.player.radius + this.objective.radius) {
      this.levelComplete = true;
      this.completeLevel();
    }
  }

  takeDamage(amount) {
    this.playerHealth = Math.max(0, this.playerHealth - amount);

    if (this.playerHealth <= 0) {
      this.gameOver();
    }
  }

  completeLevel() {
    if (this.audioSystem) this.audioSystem.stop();

    this.soundFX.play('victory');
    this.visualFX.createExplosion(this.player.x, this.player.y, 0x00ff00, 30);

    // Bônus de conclusão
    const timeBonus = Math.max(0, 60000 - this.gameTime) / 100;
    const healthBonus = this.playerHealth * 10;
    const silenceBonus = (1 - this.soundLevel) * 100;

    this.score += timeBonus + healthBonus + silenceBonus;

    // Achievements
    if (this.gameTime < 30000) {
      this.achievementManager.unlock('speedrun');
    }
    if (this.playerHealth === 100) {
      this.achievementManager.unlock('no_damage');
    }
    if (this.soundLevel < 0.2) {
      this.achievementManager.unlock('silence_master');
    }
    if (this.currentLevel === 10) {
      this.achievementManager.unlock('all_levels');
    }

    // Salvar score
    const entry = this.leaderboardManager.addScore(
      this.playerName,
      Math.round(this.score),
      this.currentLevel,
      this.difficulty,
      this.gameTime
    );

    const position = this.leaderboardManager.getScorePosition(Math.round(this.score));

    // Mostrar resultado
    setTimeout(() => {
      this.scene.start('LevelCompleteScene', {
        score: Math.round(this.score),
        level: this.currentLevel,
        position,
        nextLevel: this.currentLevel < 10 ? this.currentLevel + 1 : null,
        difficulty: this.difficulty,
        playerName: this.playerName,
      });
    }, 2000);
  }

  gameOver() {
    if (this.isGameOver) return;

    this.isGameOver = true;
    console.log('💀 Game Over! Score:', Math.round(this.score));

    if (this.audioSystem) this.audioSystem.stop();

    this.soundFX.play('gameOver');
    this.visualFX.cameraShake(10, 500);

    const position = this.leaderboardManager.getScorePosition(Math.round(this.score));

    setTimeout(() => {
      this.scene.start('GameOverScene', {
        score: Math.round(this.score),
        time: this.gameTime,
        level: this.currentLevel,
        position,
        difficulty: this.difficulty,
        playerName: this.playerName,
      });
    }, 1000);
  }

  pauseGame() {
    this.scene.pause();
    this.scene.launch('PauseScene');
  }

  shutdown() {
    if (this.audioSystem) this.audioSystem.stop();
    if (this.echolocationSystem) this.echolocationSystem.destroy();
    if (this.visualFX) this.visualFX.destroy();
  }
}