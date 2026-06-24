/**
 * Enemy - Classe base para inimigos
 * Define comportamento comum de predadores
 */

export default class Enemy {
  constructor(scene, x, y, type = 'basic') {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.type = type;
    this.hp = 100;
    this.radius = 15;
    this.speed = 100;
    this.active = true;
    this.alertness = 0; // 0-1 (quanto mais alerta, mais rápido)
    this.lastHeardSound = 0;
    this.soundThreshold = 0.3;

    // Propriedades específicas do tipo
    this.setupType(type);

    // Criar graphics
    this.graphics = scene.add.circle(x, y, this.radius, this.color, 0.7);
    this.graphics.setStrokeStyle(2, 0xff0000, 0.8);

    // Animação de pulsação
    scene.tweens.add({
      targets: this.graphics,
      scaleX: 1.15,
      scaleY: 1.15,
      duration: 600,
      yoyo: true,
      repeat: -1,
    });
  }

  /**
   * Configurar propriedades específicas do tipo
   */
  setupType(type) {
    switch (type) {
      case 'basic':
        this.speed = 120;
        this.hp = 100;
        this.color = 0xff4444;
        this.soundThreshold = 0.4;
        this.name = 'Rastreador Básico';
        break;

      case 'swift':
        this.speed = 200;
        this.hp = 80;
        this.color = 0xff6600;
        this.soundThreshold = 0.2;
        this.name = 'Rápido Silencioso';
        break;

      case 'eerie':
        this.speed = 60;
        this.hp = 150;
        this.color = 0x9900ff;
        this.soundThreshold = 0.15;
        this.name = 'Esquisito Explorador';
        break;

      case 'boss':
        this.speed = 150;
        this.hp = 300;
        this.radius = 25;
        this.color = 0xff0000;
        this.soundThreshold = 0.1;
        this.name = 'Predador Especializado';
        break;
    }
  }

  /**
   * Atualizar comportamento do inimigo
   */
  update(playerX, playerY, soundLevel) {
    if (!this.active) return;

    // Detectar som
    if (soundLevel > this.soundThreshold) {
      this.alertness = Math.min(1, this.alertness + 0.3);
      this.lastHeardSound = Date.now();
    } else {
      this.alertness = Math.max(0, this.alertness - 0.1);
    }

    // Calcular direção para o jogador
    const dx = playerX - this.x;
    const dy = playerY - this.y;
    const distance = Math.hypot(dx, dy);

    if (distance > 0) {
      const vx = (dx / distance);
      const vy = (dy / distance);

      // Velocidade aumenta com o alerta
      const currentSpeed = this.speed * (0.5 + this.alertness * 1.5);

      // Se som muito alto, perseguir de forma mais agressiva
      if (soundLevel > 0.7 && this.alertness > 0.8) {
        this.x += vx * currentSpeed * 0.016; // Multiplicar por deltaTime
        this.y += vy * currentSpeed * 0.016;
      } else if (this.alertness > 0.5) {
        // Movimento normal quando alerta
        this.x += vx * currentSpeed * 0.01;
        this.y += vy * currentSpeed * 0.01;
      } else {
        // Movimento lento quando em repouso
        this.x += vx * (this.speed * 0.3) * 0.008;
        this.y += vy * (this.speed * 0.3) * 0.008;
      }
    }

    // Manter dentro dos limites
    const { width, height } = this.scene.cameras.main;
    this.x = Math.max(this.radius, Math.min(width - this.radius, this.x));
    this.y = Math.max(this.radius, Math.min(height - this.radius, this.y));

    // Atualizar graphics
    this.graphics.setPosition(this.x, this.y);

    // Mudar cor baseado no alerta
    const alertColor = Phaser.Display.Color.Interpolate.ColorWithColor(
      { r: 255, g: 68, b: 68 }, // Vermelho fraco
      { r: 255, g: 0, b: 0 },   // Vermelho intenso
      100,
      Math.floor(this.alertness * 100)
    );
    const hexColor = Phaser.Display.Color.RGBToString(
      alertColor.r,
      alertColor.g,
      alertColor.b
    );
  }

  /**
   * Verificar se o inimigo tocou no jogador
   */
  collidedWith(playerX, playerY, playerRadius) {
    const distance = Math.hypot(this.x - playerX, this.y - playerY);
    return distance < this.radius + playerRadius;
  }

  /**
   * Receber dano
   */
  takeDamage(amount) {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.die();
    }
  }

  /**
   * Morrer
   */
  die() {
    this.active = false;
    this.graphics.destroy();
  }

  /**
   * Destruir
   */
  destroy() {
    this.graphics.destroy();
  }
}