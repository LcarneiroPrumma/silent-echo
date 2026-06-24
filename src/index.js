import Phaser from 'phaser';
import GameScene from '@scenes/GameScene';
import MenuScene from '@scenes/MenuScene';
import GameOverScene from '@scenes/GameOverScene';
import DifficultySelectScene from '@scenes/DifficultySelectScene';
import LevelCompleteScene from '@scenes/LevelCompleteScene';
import PauseScene from '@scenes/PauseScene';
import LeaderboardScene from '@scenes/LeaderboardScene';
import AchievementsScene from '@scenes/AchievementsScene';

const config = {
  type: Phaser.AUTO,

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,
    height: 720,
    min: {
      width: 640,
      height: 360,
    },
    max: {
      width: 1920,
      height: 1080,
    },
  },

  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },

  scene: [
    MenuScene,
    DifficultySelectScene,
    GameScene,
    GameOverScene,
    LevelCompleteScene,
    PauseScene,
    LeaderboardScene,
    AchievementsScene,
  ],

  render: {
    pixelArt: true,
    antialias: true,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },

  audio: {
    disableWebAudio: false,
  },
};

window.game = new Phaser.Game(config);

if (__DEV__) {
  console.log('%c🎮 SILENT ECHO - Desenvolvimento', 'color: #9d00ff; font-size: 16px; font-weight: bold;');
  console.log('Versão: 0.2.0');
  console.log('Engine: Phaser 3.55+');
  console.log('Cenas: 8');
  console.log('Sistemas: 8+');
}

window.addEventListener('beforeunload', () => {
  if (window.game) {
    window.game.destroy(true);
  }
});