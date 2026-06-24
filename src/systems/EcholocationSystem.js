/**
 * EcholocationSystem - Sistema avançado de ecolocalização
 * Responsável pela visualização e revelação do mapa através de sons
 */

export default class EcholocationSystem {
  constructor(scene) {
    this.scene = scene;
    this.echolocationWaves = [];
    this.mapRevealed = new Map();
    this.revealRadius = 300;
    this.fadeOutTime = 1000; // ms
    this.maxWaves = 5;
  }

  /**
   * Criar uma onda de ecolocalização
   * @param {number} x - Posição X
   * @param {number} y - Posição Y
   * @param {number} intensity - Intensidade do som (0-1)
   */
  createWave(x, y, intensity = 0.5) {
    if (this.echolocationWaves.length >= this.maxWaves) {
      this.echolocationWaves.shift();
    }

    const wave = {
      x,
      y,
      intensity,
      createdAt: Date.now(),
      maxRadius: this.revealRadius * (0.5 + intensity * 1.5),
      graphics: this.scene.add.circle(x, y, 0, null, 0),
    };

    // Estilo da onda baseado na intensidade
    const colors = [
      0x00d4ff, // Azul fraco
      0x00ffff, // Ciano
      0x00ff88, // Verde ciano
      0xffff00, // Amarelo
      0xff4400, // Laranja
    ];

    const colorIndex = Math.min(Math.floor(intensity * 5), colors.length - 1);
    wave.graphics.setStrokeStyle(2, colors[colorIndex], intensity);

    this.echolocationWaves.push(wave);

    // Revelar mapa em torno da onda
    this.revealMap(x, y, wave.maxRadius, intensity);

    return wave;
  }

  /**
   * Revelar o mapa em torno da onda
   */
  revealMap(x, y, radius, intensity) {
    const gridSize = 50; // Tamanho do grid para revelação
    const key = `${Math.floor(x / gridSize)}_${Math.floor(y / gridSize)}`;

    if (!this.mapRevealed.has(key)) {
      this.mapRevealed.set(key, {
        x: Math.floor(x / gridSize) * gridSize,
        y: Math.floor(y / gridSize) * gridSize,
        intensity,
        revealedAt: Date.now(),
        radius,
      });
    }
  }

  /**
   * Atualizar ondas de ecolocalização
   */
  update() {
    const now = Date.now();
    const toRemove = [];

    this.echolocationWaves.forEach((wave, index) => {
      const elapsed = now - wave.createdAt;
      const progress = elapsed / this.fadeOutTime;

      if (progress >= 1) {
        wave.graphics.destroy();
        toRemove.push(index);
      } else {
        // Animar a expansão da onda
        const currentRadius = wave.maxRadius * progress;
        wave.graphics.setRadius(currentRadius);
        wave.graphics.setAlpha(wave.intensity * (1 - progress));
      }
    });

    // Remover ondas finalizadas (em ordem reversa)
    toRemove.reverse().forEach((index) => {
      this.echolocationWaves.splice(index, 1);
    });
  }

  /**
   * Obter áreas reveladas do mapa
   */
  getRevealedAreas() {
    return Array.from(this.mapRevealed.values());
  }

  /**
   * Renderizar visualização de ecolocalização
   */
  render(graphics, playerX, playerY) {
    // Renderizar áreas reveladas
    const revealedAreas = this.getRevealedAreas();

    revealedAreas.forEach((area) => {
      const alpha = Math.max(0, 1 - (Date.now() - area.revealedAt) / 3000);
      graphics.fillStyle(0x00d4ff, alpha * 0.3);
      graphics.fillCircle(area.x, area.y, area.radius);
    });
  }

  /**
   * Limpar sistema
   */
  clear() {
    this.echolocationWaves.forEach((wave) => wave.graphics.destroy());
    this.echolocationWaves = [];
    this.mapRevealed.clear();
  }

  /**
   * Destruir sistema
   */
  destroy() {
    this.clear();
  }
}