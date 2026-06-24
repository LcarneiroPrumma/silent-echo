/**
 * VisualEffectsManager - Sistema de efeitos visuais
 * Gerencia partículas, ondas, e outros efeitos visuais
 */

export default class VisualEffectsManager {
  constructor(scene) {
    this.scene = scene;
    this.particles = [];
    this.effects = [];
  }

  /**
   * Criar explosão de partículas
   */
  createExplosion(x, y, color = 0xff4444, particleCount = 20) {
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const velocity = {
        x: Math.cos(angle) * Phaser.Math.Between(100, 300),
        y: Math.sin(angle) * Phaser.Math.Between(100, 300),
      };

      const particle = this.scene.add.circle(x, y, 3, color, 1);

      this.particles.push({
        graphics: particle,
        x,
        y,
        vx: velocity.x,
        vy: velocity.y,
        lifetime: 1000, // ms
        maxLifetime: 1000,
        color,
      });
    }
  }

  /**
   * Criar efeito de brilho pulsante
   */
  createPulse(x, y, radius = 50, color = 0x00d4ff, duration = 500) {
    const circle = this.scene.add.circle(x, y, 0, null, 0);
    circle.setStrokeStyle(2, color, 0.8);

    this.scene.tweens.add({
      targets: circle,
      radius,
      alpha: 0,
      duration,
      onComplete: () => circle.destroy(),
    });
  }

  /**
   * Criar efeito de ondulação
   */
  createWave(x, y, color = 0x9d00ff, maxRadius = 200, duration = 800) {
    const waves = [];

    for (let i = 0; i < 3; i++) {
      const circle = this.scene.add.circle(x, y, 0, null, 0);
      circle.setStrokeStyle(2, color, 0.6);

      this.scene.tweens.add({
        targets: circle,
        radius: maxRadius,
        alpha: 0,
        duration: duration + i * 100,
        delay: i * 50,
        onComplete: () => circle.destroy(),
      });

      waves.push(circle);
    }
  }

  /**
   * Criar efeito de "camera shake"
   */
  cameraShake(intensity = 5, duration = 200) {
    const originalX = this.scene.cameras.main.scrollX;
    const originalY = this.scene.cameras.main.scrollY;

    const shakeIntensity = intensity;
    let elapsed = 0;

    const shakeInterval = setInterval(() => {
      if (elapsed >= duration) {
        clearInterval(shakeInterval);
        this.scene.cameras.main.setScroll(originalX, originalY);
        return;
      }

      const offsetX = (Math.random() - 0.5) * shakeIntensity * 2;
      const offsetY = (Math.random() - 0.5) * shakeIntensity * 2;

      this.scene.cameras.main.setScroll(originalX + offsetX, originalY + offsetY);
      elapsed += 16;
    }, 16);
  }

  /**
   * Criar efeito de borrão direcional
   */
  createMotionBlur(x, y, directionX, directionY, color = 0x00d4ff) {
    const trailLength = 5;

    for (let i = 0; i < trailLength; i++) {
      const offsetX = directionX * (i * 10);
      const offsetY = directionY * (i * 10);

      const particle = this.scene.add.circle(x + offsetX, y + offsetY, 3, color, 0.3 - i * 0.05);

      this.scene.tweens.add({
        targets: particle,
        alpha: 0,
        duration: 300 + i * 50,
        onComplete: () => particle.destroy(),
      });
    }
  }

  /**
   * Criar vignette (escurecimento nas bordas)
   */
  createVignette(opacity = 0.5) {
    const { width, height } = this.scene.cameras.main;

    const vignette = this.scene.make.graphics(
      {
        x: 0,
        y: 0,
        add: false,
      },
      false
    );

    // Criar gradiente de vignette (pseudo)
    vignette.fillStyle(0x000000, opacity);
    vignette.fillRect(0, 0, width, height);

    // Criar efeito de "donut"
    vignette.clear();
    for (let i = 0; i < Math.max(width, height); i += 20) {
      const alpha = (i / Math.max(width, height)) * opacity;
      vignette.fillStyle(0x000000, alpha);
      vignette.fillCircle(width / 2, height / 2, i);
    }

    return vignette;
  }

  /**
   * Atualizar partículas
   */
  update(delta) {
    const toRemove = [];

    this.particles.forEach((particle, index) => {
      particle.lifetime -= delta;

      if (particle.lifetime <= 0) {
        particle.graphics.destroy();
        toRemove.push(index);
      } else {
        // Atualizar posição
        particle.x += particle.vx * (delta / 1000);
        particle.y += particle.vy * (delta / 1000);

        particle.graphics.setPosition(particle.x, particle.y);

        // Fade out
        const alpha = particle.lifetime / particle.maxLifetime;
        particle.graphics.setAlpha(alpha * 0.8);

        // Gravidade
        particle.vy += 150 * (delta / 1000);
      }
    });

    // Remover partículas finalizadas
    toRemove.reverse().forEach((index) => {
      this.particles.splice(index, 1);
    });
  }

  /**
   * Limpar todos os efeitos
   */
  clear() {
    this.particles.forEach((p) => p.graphics.destroy());
    this.particles = [];
    this.effects = [];
  }

  /**
   * Destruir
   */
  destroy() {
    this.clear();
  }
}