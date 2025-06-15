# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a TypeScript-based educational game development lab targeting toddlers (2.5-3.5 years). The main project is **Planet Hop**, a color recognition and sequencing game.

```
prime_game_lab/
├── planet_hop/               # Main game directory
│   ├── README.md            # Game-specific documentation
│   ├── src/                  # TypeScript source code
│   │   ├── game.ts          # Core game logic and rendering
│   │   ├── types.ts         # TypeScript interfaces
│   │   ├── audio.ts         # Web Audio API sound manager
│   │   ├── index.ts         # Entry point
│   │   └── index.html       # HTML template
│   ├── package.json         # Dependencies and scripts
│   ├── webpack.config.js    # Build configuration
│   └── tsconfig.json        # TypeScript configuration
└── plan.md                  # Implementation status and project overview
```

**Important**: Each game should have its own `README.md` file within its directory containing game-specific documentation, setup instructions, and user guides.

## Development Commands

Navigate to `planet_hop/` directory first for all commands:

```bash
cd planet_hop
```

### Essential Commands
- `npm start` - Start development server with hot reload on port 8080
- `npm run build` - Build for production (outputs to `dist/`)
- `npm run dev` - Build for development

### Development Server
- Runs on port 8080 (automatically opens browser)
- Uses webpack-dev-server with hot reload
- Canvas game renders at 1280x720 resolution

## Architecture Overview

### Game Architecture
The game uses a class-based architecture with the main `PlanetHopGame` class handling:

- **Canvas Rendering**: HTML5 Canvas with 60fps game loop using `requestAnimationFrame`
- **State Management**: Single `GameState` interface managing all game state
- **Animation System**: Custom easing and interpolation for smooth movements
- **Audio System**: Web Audio API for synthetic sound generation (no external audio files)

### Key Components
- **Astronaut Character**: Main playable character with jumping animations and limb movement
- **Planet System**: 3 planets (Mars/Red, Earth/Blue, Sun/Yellow) with hover effects and visual symbols
- **Visual Guide System**: Glowing rings and animated arrows instead of text prompts
- **Particle System**: Celebration effects and background stars
- **Input Handling**: Mouse and touch support with large touch targets (80px radius)

### TypeScript Structure
All game objects are strongly typed using interfaces in `types.ts`:
- `Planet`, `Star`, `Particle` - Visual elements
- `GameState` - Complete game state including rocket and astronaut positions
- Extensive use of TypeScript for type safety throughout

## Code Conventions

### Educational Game Principles
- **Visual-First Design**: Uses symbols (♂, ⊕, ☉) and visual cues instead of text
- **Large Interactive Areas**: 80px radius planets for easy toddler interaction  
- **Immediate Feedback**: Sound and visual feedback on every interaction
- **Error Prevention**: No way to "lose" - only positive reinforcement

### Canvas Rendering Patterns
- All rendering happens in the main game loop
- Uses transform/restore pattern for rotations and scaling
- Particle effects use object pooling pattern
- Animation uses linear interpolation (lerp) for smooth transitions

### Audio Implementation
- Synthetic sound generation only (no external files)
- Three sound types: hop (success), error, success (round complete)
- Audio initialized on first user interaction due to browser policies

## Build System

Uses Webpack 5 with:
- TypeScript compilation via ts-loader
- HTML template injection
- Asset copying from `assets/` directory
- Development server with hot reload
- Production builds with optimization

The game is designed to work offline once loaded and requires no external dependencies at runtime.