# 🎮 Sprint 2 - Development Guide

## Objetivo
Implementar todas as features avançadas para criar uma experiência de jogo completa e imersiva.

---

## ✅ Features Implementadas

### 1. 🌊 Sistema Avançado de Ecolocalização
- **Arquivo**: `src/systems/EcholocationSystem.js`
- **Funcionalidades**:
  - Ondas sonoras expandindo dinamicamente
  - Revelação do mapa baseada em som
  - Sistema de grid para otimizar renderização
  - Cores que variam com a intensidade do som
  - Fade out suave das ondas

**Uso**:
```javascript
const echolocation = new EcholocationSystem(scene);
echolocation.createWave(playerX, playerY, 0.8); // intensidade 0-1
echolocation.update();
```

---

### 2. 🗺️ Geração Procedural de Mapas
- **Arquivo**: `src/systems/MapGenerator.js`
- **Funcionalidades**:
  - Geração dinâmica de obstáculos
  - Pontos de spawn de inimigos
  - Objetivo (Fonte) centralizado
  - Dificuldade progressiva por nível
  - Validação de posições para evitar overlaps

**Uso**:
```javascript
const mapGen = new MapGenerator(1280, 720);
const map = mapGen.generate(level); // level 1-10
console.log(map.obstacles, map.spawnPoints, map.objective);
```

---

### 3. 👾 IA Melhorada de Inimigos
- **Arquivo**: `src/entities/Enemy.js`
- **Tipos de Inimigos**:
  - **Basic** (Rastreador Básico): Velocidade média, audição normal
  - **Swift** (Rápido Silencioso): Rápido, muito sensível ao som
  - **Eerie** (Esquisito Explorador): Lento, mas extremamente sensível
  - **Boss** (Predador Especializado): Versátil e desafiador

**Características**:
- Sistema de alerta baseado em som
- Movimento dinâmico baseado em alerta
- Cores que indicam estado (vermelho intenso = alerta máximo)
- Diferentes sons threshold para cada tipo

**Uso**:
```javascript
const enemy = new Enemy(scene, 100, 100, 'swift');
enemy.update(playerX, playerY, soundLevel);
if (enemy.collidedWith(playerX, playerY, playerRadius)) gameOver();
```

---

### 4. 🔊 Efeitos Sonoros
- **Arquivo**: `src/systems/SoundEffectsManager.js`
- **Sons Implementados**:
  - Ecolocalização (ping agudo)
  - Inimigo detectado (tom grave)
  - Dano recebido
  - Game Over
  - Vitória
  - Alerta

**Uso**:
```javascript
const sfx = new SoundEffectsManager(scene);
sfx.initialize(audioContext);
sfx.play('echolocation');
```

---

### 5. ✨ Efeitos Visuais
- **Arquivo**: `src/systems/VisualEffectsManager.js`
- **Efeitos**:
  - Explosões de partículas
  - Pulsação brilhante
  - Ondulações concêntricas
  - Camera shake
  - Motion blur
  - Vignette (escurecimento nas bordas)

**Uso**:
```javascript
const vfx = new VisualEffectsManager(scene);
vfx.createExplosion(x, y, 0xff4444);
vfx.createPulse(x, y, 50);
vfx.cameraShake(5, 200);
vfx.update(delta);
```

---

### 6. 🎚️ Sistema de Dificuldade
- **Arquivo**: `src/systems/DifficultyManager.js`
- **Dificuldades**:
  - **Fácil**: Inimigos lentos, menos sensíveis
  - **Normal**: Equilíbrio desafiador
  - **Difícil**: Inimigos rápidos e sensíveis
  - **Pesadelo**: Impossível (praticamente)

**Configurações por Dificuldade**:
- Sound threshold (sensibilidade dos inimigos)
- Contagem de inimigos
- Velocidade dos inimigos
- Vida do jogador
- Multiplicador de pontuação

**Uso**:
```javascript
const difficulty = new DifficultyManager();
const settings = difficulty.setDifficulty('hard');
const levelSettings = difficulty.adjustForLevel(5);
```

---

### 7. 🏆 Sistema de Achievements
- **Arquivo**: `src/systems/AchievementManager.js`
- **Achievements Implementados** (10 total):
  - 🎵 Primeiro Som
  - 🤐 Mestre do Silêncio
  - ⏱️ Sobrevivente
  - ⭐ Perfeição
  - 💯 Pontuação Épica
  - 😱 Pesadelo
  - ⚡ Velocista
  - 🛡️ Intocável
  - 🏆 Lenda
  - 🏅 Colecionador

**Recursos**:
- Salvamento em localStorage
- Progresso rastreado
- Notificação ao desbloquear

**Uso**:
```javascript
const achievements = new AchievementManager();
achievements.unlock('first_sound');
const progress = achievements.getProgress();
```

---

### 8. 📊 Sistema de Leaderboard
- **Arquivo**: `src/systems/LeaderboardManager.js`
- **Funcionalidades**:
  - Ranking global de pontuações
  - Filtros por dificuldade
  - Estatísticas gerais
  - Export/Import em JSON
  - Salvamento em localStorage

**Recursos**:
- Top 10/100 scores
- Tempos mais rápidos
- Melhor nível alcançado
- Média de pontuação

**Uso**:
```javascript
const leaderboard = new LeaderboardManager();
leaderboard.addScore('Player', 1500, 5, 'hard', 45000);
const top10 = leaderboard.getLeaderboard(10);
const stats = leaderboard.getStats();
```

---

## 🚀 Como Integrar no Game

### Atualizar GameScene.js

```javascript
import EcholocationSystem from '@systems/EcholocationSystem';
import MapGenerator from '@systems/MapGenerator';
import Enemy from '@entities/Enemy';
import SoundEffectsManager from '@systems/SoundEffectsManager';
import VisualEffectsManager from '@systems/VisualEffectsManager';
import DifficultyManager from '@systems/DifficultyManager';
import AchievementManager from '@systems/AchievementManager';
import LeaderboardManager from '@systems/LeaderboardManager';

export default class GameScene extends Phaser.Scene {
  init() {
    // ... existente ...
    this.echolocationSystem = null;
    this.mapGenerator = null;
    this.soundFX = null;
    this.visualFX = null;
    this.difficultyManager = new DifficultyManager();
    this.achievementManager = new AchievementManager();
    this.leaderboardManager = new LeaderboardManager();
  }

  async create() {
    // ... existente ...
    
    // Inicializar sistemas
    this.echolocationSystem = new EcholocationSystem(this);
    this.mapGenerator = new MapGenerator(1280, 720);
    this.soundFX = new SoundEffectsManager(this);
    this.visualFX = new VisualEffectsManager(this);
    
    // Gerar mapa
    const difficulty = this.difficultyManager.setDifficulty('normal');
    const map = this.mapGenerator.generate(this.currentLevel || 1);
    
    // Renderizar obstáculos
    map.obstacles.forEach((obs) => {
      this.add.circle(obs.x, obs.y, obs.radius, 0x444444, 0.5);
    });
    
    // Criar inimigos
    this.enemies = [];
    map.spawnPoints.forEach((point) => {
      const types = ['basic', 'swift', 'eerie'];
      const enemy = new Enemy(this, point.x, point.y, types[point.type]);
      this.enemies.push(enemy);
    });
  }

  update(time, delta) {
    // ... existente ...
    
    // Atualizar ecolocalização
    this.echolocationSystem.update();
    
    // Atualizar inimigos
    this.enemies.forEach((enemy) => {
      enemy.update(this.player.x, this.player.y, this.soundLevel);
    });
    
    // Atualizar efeitos visuais
    this.visualFX.update(delta);
    
    // Criar onda sonora quando som é alto
    if (this.soundLevel > 0.5) {
      this.echolocationSystem.createWave(this.player.x, this.player.y, this.soundLevel);
      this.soundFX.play('echolocation');
      this.visualFX.createPulse(this.player.x, this.player.y, 50);
    }
  }
}
```

---

## 📝 Próximas Tasks

### Sprint 3
- [ ] Integração completa de todos os sistemas
- [ ] UI para leaderboard e achievements
- [ ] Cenas de seleção de dificuldade
- [ ] Múltiplos níveis com progressão
- [ ] Testes completos
- [ ] Otimizações de performance

---

## 🧪 Teste Local

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

---

**Status**: 🚀 Sprint 2 - Em Desenvolvimento  
**Último Update**: 2024-06-24