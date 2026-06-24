export default class Player {
  constructor(scene, x, y) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.speed = 200;
    this.hp = 100;
    this.radius = 20;

    this.graphics = scene.add.circle(x, y, this.radius, 0x00d4ff, 0.8);
    this.graphics.setStrokeStyle(2, 0x9d00ff, 1);

    scene.tweens.add({
      targets: this.graphics,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    console.log('✓ Player criado em', x, y);
  }

  update() {
    const keys = this.scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    let vx = 0;
    let vy = 0;

    if (keys.up.isDown) vy -= this.speed;
    if (keys.down.isDown) vy += this.speed;
    if (keys.left.isDown) vx -= this.speed;
    if (keys.right.isDown) vx += this.speed;

    if (vx !== 0 && vy !== 0) {
      vx *= 0.707;
      vy *= 0.707;
    }

    if (vx !== 0 || vy !== 0) {
      const dt = this.scene.sys.game.loop.deltaHistory[0] / 1000 || 0.016;
      this.x += vx * dt;
      this.y += vy * dt;

      const { width, height } = this.scene.cameras.main;
      this.x = Phaser.Math.Clamp(this.x, this.radius, width - this.radius);
      this.y = Phaser.Math.Clamp(this.y, this.radius, height - this.radius);

      this.graphics.setPosition(this.x, this.y);
    }
  }

  takeDamage(amount) {
    this.hp -= amount;
  }

  destroy() {
    this.graphics.destroy();
  }
}