/**
 * MapGenerator - Geração procedural de mapas
 * Cria mapas únicos e desafiadores para cada nível
 */

export default class MapGenerator {
  constructor(width = 1280, height = 720, seed = Math.random()) {
    this.width = width;
    this.height = height;
    this.seed = seed;
    this.obstacles = [];
    this.spawnPoints = [];
    this.objective = null;
  }

  /**
   * Gerar mapa para um nível específico
   * @param {number} level - Nível (1-10)
   */
  generate(level = 1) {
    this.obstacles = [];
    this.spawnPoints = [];

    // Aumentar dificuldade com o nível
    const difficulty = Math.min(level / 10, 1);
    const obstacleCount = Math.floor(5 + level * 3);
    const spawnPointCount = 2 + Math.floor(level / 2);

    // Gerar obstáculos
    for (let i = 0; i < obstacleCount; i++) {
      this.generateObstacle(difficulty);
    }

    // Gerar pontos de spawn para inimigos
    for (let i = 0; i < spawnPointCount; i++) {
      this.generateSpawnPoint();
    }

    // Gerar objetivo (Fonte)
    this.generateObjective();

    return {
      obstacles: this.obstacles,
      spawnPoints: this.spawnPoints,
      objective: this.objective,
      difficulty,
    };
  }

  /**
   * Gerar um obstáculo aleatório
   */
  generateObstacle(difficulty) {
    let x, y, valid = false;

    // Garantir que o obstáculo não sobrelape com outros
    while (!valid) {
      x = Math.random() * (this.width - 100) + 50;
      y = Math.random() * (this.height - 100) + 50;

      valid = this.isPositionValid(x, y, 60);
    }

    const size = 30 + Math.random() * (40 + difficulty * 40);

    this.obstacles.push({
      x,
      y,
      radius: size,
      type: this.getRandomObstacleType(),
      passable: Math.random() > 0.7,
    });
  }

  /**
   * Gerar ponto de spawn para inimigos
   */
  generateSpawnPoint() {
    let x, y, valid = false;

    while (!valid) {
      x = Math.random() * (this.width - 100) + 50;
      y = Math.random() * (this.height - 100) + 50;

      valid = this.isPositionValid(x, y, 150);
    }

    this.spawnPoints.push({
      x,
      y,
      type: Math.floor(Math.random() * 3), // Tipo de inimigo (0-2)
    });
  }

  /**
   * Gerar objetivo (Fonte no centro)
   */
  generateObjective() {
    // Objetivo perto do centro
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const offset = 100;

    this.objective = {
      x: centerX + (Math.random() - 0.5) * offset,
      y: centerY + (Math.random() - 0.5) * offset,
      radius: 30,
      type: 'source', // A Fonte
    };
  }

  /**
   * Verificar se uma posição é válida
   */
  isPositionValid(x, y, minDistance) {
    // Verificar distância das bordas
    if (
      x < minDistance ||
      x > this.width - minDistance ||
      y < minDistance ||
      y > this.height - minDistance
    ) {
      return false;
    }

    // Verificar distância de outros obstáculos
    for (const obstacle of this.obstacles) {
      const dist = Math.hypot(x - obstacle.x, y - obstacle.y);
      if (dist < minDistance + obstacle.radius) {
        return false;
      }
    }

    // Verificar distância do objetivo
    if (this.objective) {
      const dist = Math.hypot(x - this.objective.x, y - this.objective.y);
      if (dist < minDistance + this.objective.radius) {
        return false;
      }
    }

    return true;
  }

  /**
   * Obter tipo aleatório de obstáculo
   */
  getRandomObstacleType() {
    const types = ['wall', 'rock', 'debris'];
    return types[Math.floor(Math.random() * types.length)];
  }

  /**
   * Verificar colisão com obstáculos
   */
  checkCollision(x, y, radius) {
    for (const obstacle of this.obstacles) {
      if (!obstacle.passable) {
        const dist = Math.hypot(x - obstacle.x, y - obstacle.y);
        if (dist < radius + obstacle.radius) {
          return true;
        }
      }
    }
    return false;
  }
}