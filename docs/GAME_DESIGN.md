# 🎮 SILENT ECHO - Game Design Document

## 1. Visão Geral

**Título**: SILENT ECHO - Terror Acústico Reverso

**Plataforma**: Web (Navegador moderno com Web Audio API)

**Gênero**: Horror Psicológico / Puzzle / Survival

**Conceito Central**: Um jogo onde o silêncio é poder, e cada som que você faz pode ser fatal.

---

## 2. Mecânica Principal

### 2.1 Ecolocalização
- O jogador é uma entidade **cega** em um mundo de **escuridão total**
- Seu único sentido é a **ecolocalização** (sonar biológico)
- Para "enxergar" o mapa, você precisa **emitir sons**

### 2.2 Risco-Recompensa Sonora
- **Alto nível de som** = Mapa mais revelado, mas inimigos mais ativos
- **Silêncio absoluto** = Segurança, mas desorientação total
- O jogador deve encontrar o equilíbrio

---

## 3. Inimigos (Predadores)

### Tipos de Inimigos

#### 1. **Rastreador Básico**
- Velocidade: Média
- Audição: Normal
- Comportamento: Segue o som direto

#### 2. **Rápido Silencioso**
- Velocidade: Alta
- Audição: Aguçada
- Comportamento: Rápido até ficar perto

#### 3. **Esquisito Explorador**
- Velocidade: Lenta
- Audição: Muito aguçada
- Comportamento: Padrão irregular

---

## 4. Níveis

### Modo Story
```
Level 1 - Tutorial
Level 2 - Primeiros Predadores
Level 3 - Múltiplos Inimigos
Level 4 - Labirintos
Level 5-10 - Progressão
Final - A Fonte (Boss)
```

### Modo Survival
- Mapa infinitamente expansível
- Inimigos spawnam continuamente
- Objetivo: Sobreviver o máximo possível

---

## 5. Sistema de Pontuação

```
Base de Pontos:
├── Tempo Sobrevivido: +1 ponto/segundo
├── Silêncio Mantido: +10 pontos/segundo
├── Inimigos Evitados: +100 pontos/inimigo
└── Objetivo Alcançado: +1000 pontos
```

---

## 6. Roadmap

### Sprint 1 (Semanas 1-2)
- [x] Setup Phaser 3
- [ ] Sistema de áudio básico
- [ ] Rendering de ecolocalização
- [ ] Movimento do jogador

### Sprint 2 (Semanas 3-4)
- [ ] IA de inimigos
- [ ] Colisões
- [ ] Sistema de pontuação
- [ ] UI completa

---

**Versão**: 1.0
**Status**: Em Desenvolvimento ✨