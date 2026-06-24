import Phaser from 'phaser';
import MenuScene from '@scenes/MenuScene';
import GameScene from '@scenes/GameScene';
import GameOverScene from '@scenes/GameOverScene';

const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,
    height: 720,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [MenuScene, GameScene, GameOverScene],
  render: {
    pixelArt: true,
    antialias: true,
  },
};

window.game = new Phaser.Game(config);

if (__DEV__) {
  console.log('%c🎮 SILENT ECHO - Development Mode', 'color: #9d00ff; font-size: 16px; font-weight: bold;');
  console.log('Version: 0.1.0');
  console.log('Engine: Phaser 3.55+');
}

window.addEventListener('beforeunload', () => {
  if (window.game) {
    window.game.destroy(true);
  }
});