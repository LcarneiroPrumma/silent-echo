# 🔇 SILENT ECHO - Terror Acústico Reverso

Uma experiência de jogo horror inovadora onde **o silêncio é a chave para a sobrevivência**.

Você é uma entidade cega em um mundo de absoluta escuridão. Seu único sentido é a **ecolocalização**. Cada som que você emite revela o mapa, mas também alerta os **predadores que caçam pelo som**. O desafio: manter o silêncio enquanto navega pelo desconhecido.

---

## 🎮 Características Principais

✨ **Mecânica de Áudio em Tempo Real**
- Detecção de microfone real do jogador
- Sons ambientes afetam direto a gameplay
- Sistema de ecolocalização dinâmico

👻 **IA de Inimigos Avançada**
- Predadores que respondem a níveis de ruído
- Movimentação inteligente e adaptativa
- Comportamento baseado em padrões sonoros

🗺️ **Visualização por Ecolocalização**
- Mapa revelado dinamicamente através de sons
- Renderização em tempo real com Phaser 3
- Efeitos visuais baseados em ondas sonoras

⚙️ **Sistema de Progressão**
- Múltiplos níveis com dificuldade crescente
- Geração procedural de mapas
- Sistema de pontuação e desafios

---

## 🛠️ Stack Tecnológico

```
Frontend:
├── Phaser 3.55+        → Framework de jogos 2D mais poderoso
├── Web Audio API       → Análise de áudio em tempo real
├── Canvas 2D           → Renderização de alta performance
├── Webpack 5           → Build system moderno
└── Babel               → Compatibilidade ES6+
```

---

## 📦 Instalação Rápida

```bash
# Clonar repositório
git clone https://github.com/LcarneiroPrumma/silent-echo.git
cd silent-echo

# Instalar dependências
npm install

# Desenvolvimento local
npm run dev

# Build para produção
npm run build
```

---

## 🎯 Como Jogar

```
1️⃣  Permita acesso ao microfone
2️⃣  Fique em SILÊNCIO absoluto
3️⃣  Emita sons estrategicamente para mapear
4️⃣  Navegue até o objetivo
5️⃣  Sobreviva aos predadores
```

---

## 📁 Estrutura do Projeto

```
silent-echo/
├── public/
│   └── index.html              # Página principal
├── src/
│   ├── index.js                # Entry point
│   ├── scenes/
│   │   ├── MenuScene.js
│   │   ├── GameScene.js
│   │   └── GameOverScene.js
│   ├── systems/
│   │   └── AudioInputSystem.js # Captura de microfone
│   ├── entities/
│   │   └── Player.js
│   └── utils/
├── docs/
│   └── GAME_DESIGN.md
└── package.json
```

---

## 📄 Licença

MIT License - Veja [LICENSE](./LICENSE) para detalhes

---

## 👤 Autor

**LcarneiroPrumma** - [GitHub](https://github.com/LcarneiroPrumma)

---

<div align="center">

**🔇 SILENT ECHO - Where Silence Means Life 🔇**

*Um jogo que desafia seus sentidos*

</div>