# ROLE
You are a **Senior Web Game Developer** who specialises in tiny, toddler-friendly 2-D educational games using TypeScript and HTML5 Canvas.

# TASK SUMMARY
Build **Planet Hop**: a one-scene web-based game that helps a 2 y 8 m child practise colour recognition and sequencing by clicking planets in the prompted order.

# IMPLEMENTATION STATUS ✅

## Latest Updates (Visual-Based Gameplay) [✅]
- [x] Replaced text prompts with visual guides
  - [x] Glowing rings around target planets
  - [x] Animated arrows pointing to next planet
  - [x] Eye icon for "watch" phase
  - [x] Play arrow for "play" phase
- [x] Made astronaut the main character
  - [x] Astronaut now jumps between planets
  - [x] Added jumping animations with rotation
  - [x] Animated limbs (arms and legs)
  - [x] Added shadow effects
  - [x] Celebration animations
- [x] Enhanced visual interest
  - [x] Gradient space background
  - [x] Nebula effects
  - [x] Shooting stars
  - [x] Planet textures (craters, continents, sun rays)
  - [x] Visual symbols instead of text (♂, ⊕, ☉)
  - [x] Enhanced particle effects
  - [x] Visual score display with stars

## 1. Development Environment [✅]
- [x] Set up TypeScript project
  - [x] Initialize npm project
  - [x] Install TypeScript
  - [x] Install webpack and webpack-dev-server
  - [x] Configure TypeScript (tsconfig.json)
  - [x] Configure webpack (webpack.config.js)
- [x] Set up version control
  - [x] Initialize git repository
  - [x] Create .gitignore
  - [x] Set up initial commit
- [x] Create README.md
  - [x] Add project description
  - [x] Add setup instructions
  - [x] Add development requirements
  - [x] Add build instructions

## 2. Project Configuration [✅]
- [x] Create project structure
  - [x] Set up planet_hop directory
  - [x] Create src directory
  - [x] Create assets directory
- [x] Configure build system
  - [x] Set up webpack configuration
  - [x] Configure TypeScript compilation
  - [x] Set up development server
  - [x] Configure HTML template

## 3. Asset Pipeline Setup [✅]
- [x] Create source file structure
  - [x] /src/index.ts (entry point)
  - [x] /src/game.ts (main game class)
  - [x] /src/types.ts (TypeScript interfaces)
  - [x] /src/audio.ts (sound manager)
  - [x] /src/index.html (HTML template)

# IMPLEMENTATION DETAILS

## 1. Technology Stack [✅]
- [x] TypeScript for type-safe development
- [x] HTML5 Canvas for rendering
- [x] Web Audio API for sound effects
- [x] Webpack for bundling
- [x] npm for package management

## 2. Game Features [✅]
- [x] Interactive planet clicking
- [x] Color-coded planets (Mars/Red, Earth/Blue, Sun/Yellow)
- [x] Animated rocket ship movement
- [x] Astronaut character
- [x] Twinkling star background
- [x] Particle effects
- [x] Sound effects (synthetic)
- [x] Score tracking
- [x] Touch/mouse support

## 3. Core Implementation [✅]
- [x] Game loop with requestAnimationFrame
- [x] Canvas rendering system
- [x] Event handling (click/touch)
- [x] State management
- [x] Animation system
- [x] Audio synthesis
- [x] Responsive design

# TECHNICAL SPECIFICATIONS (AS IMPLEMENTED)
1. **Technology Stack**
   - TypeScript 5.7.2
   - Webpack 5.97.1
   - HTML5 Canvas API
   - Web Audio API

2. **Display Settings**
   - Resolution: 1280 × 720
   - Responsive scaling
   - Canvas-based rendering
   - Background: Dark blue (#000033)

3. **Input Handling**
   - Mouse click support
   - Touch support for tablets
   - Hover effects on desktop

4. **Core Game Elements**
   - **Astronaut Character** (UPDATED)
     - Main playable character
     - Jumping animations between planets
     - Animated limbs and rotation
     - Shadow effects
     - Detailed spacesuit with antenna
     - Celebration animations

   - **Planets** (ENHANCED)
     - Count: 3 (Mars, Earth, Sun)
     - Visual symbols instead of text
     - Planet-specific textures
     - Glow effects on hover
     - Visual highlighting during sequence

   - **Visual Guide System** (NEW)
     - Glowing rings around target planets
     - Animated arrows pointing direction
     - Pulsing effects for attention
     - No text required

   - **Background** (ENHANCED)
     - Gradient space background
     - Twinkling stars effect
     - Nebula effects
     - Shooting stars
     - Particle system for celebrations

   - **UI Elements** (VISUAL-ONLY)
     - Visual status indicators (eye/play icons)
     - Score display with star icons
     - No text prompts - all visual cues

5. **Game Logic**
   - **Sequence Generation**
     - Random order each round
     - All 3 planets per sequence
     - Fisher-Yates shuffle algorithm

   - **Interaction Flow**
     - Click detection on planets
     - Visual feedback (scaling)
     - Audio feedback
     - Rocket movement animation
     - Particle effects on success

6. **Audio System**
   - Synthetic sound generation
   - Three sound types:
     - Hop sound (correct click)
     - Error sound (wrong click)
     - Success sound (round complete)

7. **Code Architecture**
   - Object-oriented design
   - TypeScript interfaces for type safety
   - Modular file structure
   - Clean separation of concerns

# PROJECT STRUCTURE
```
prime_game_lab/
├── plan.md                    # This file (updated)
├── planet_hop/               # Game folder
│   ├── README.md            # Game documentation
│   ├── package.json         # NPM configuration
│   ├── tsconfig.json        # TypeScript config
│   ├── webpack.config.js    # Build configuration
│   ├── src/                 # Source code
│   │   ├── index.ts        # Entry point
│   │   ├── game.ts         # Main game class
│   │   ├── types.ts        # TypeScript interfaces
│   │   ├── audio.ts        # Sound manager
│   │   └── index.html      # HTML template
│   ├── assets/             # Game assets (empty)
│   ├── dist/               # Built files (generated)
│   └── node_modules/       # Dependencies
└── .cursor/
    └── rules/
        └── agents.mdc       # Project guidelines
```

# HOW TO RUN
1. Navigate to the game directory:
   ```bash
   cd planet_hop
   ```

2. Install dependencies (if not already done):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. The game will open automatically in your browser at http://localhost:8080

# BUILD FOR PRODUCTION
```bash
cd planet_hop
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

# FUTURE ENHANCEMENTS
- [ ] Add more planets/colors
- [ ] Progressive difficulty levels
- [ ] Parent dashboard
- [ ] Progress tracking
- [ ] More sound variations
- [ ] Additional visual effects
- [ ] Mobile app version
- [ ] Offline support with PWA

# NOTES
- The game was successfully converted from the original Godot plan to a web-based TypeScript implementation
- All core features have been implemented and are working
- The game is playable and meets the educational goals for the target age group
- The codebase is clean, well-organized, and ready for future enhancements
