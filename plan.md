# ROLE
You are a **Senior Godot 4.2 Developer** who specialises in tiny, toddler-friendly 2-D educational games.

# TASK SUMMARY
Build **Planet Hop**: a one-scene desktop game that helps a 2 y 8 m child practise colour recognition and sequencing by clicking planets in the prompted order.

# ENVIRONMENT SETUP

## 1. Development Environment [ ]
- [ ] Install Godot 4.2
  - [ ] Download from official website
  - [ ] Verify installation
- [ ] Set up version control
  - [ ] Initialize git repository
  - [ ] Create .gitignore for Godot
  - [ ] Set up initial commit
- [ ] Create README.md
  - [ ] Add project description
  - [ ] Add setup instructions
  - [ ] Add development requirements
  - [ ] Add build instructions

## 2. Project Configuration [ ]
- [ ] Create new project
  - [ ] Set project name: "Planet Hop"
  - [ ] Choose project location
  - [ ] Select Godot 4.2 template
- [ ] Configure project settings
  - [ ] Set display resolution (1280 × 720)
  - [ ] Configure viewport stretch mode
  - [ ] Set up input mappings
  - [ ] Configure macOS export settings

## 3. Asset Pipeline Setup [ ]
- [ ] Create asset directories
  - [ ] /assets/sprites
  - [ ] /assets/audio
- [ ] Set up asset naming conventions
  - [ ] Sprite naming: planet_[color], astronaut, rocket
  - [ ] Audio naming: sfx_[action], music_[type]

# IMPLEMENTATION CHECKLIST

## 1. Asset Creation [ ]
- [ ] Create basic shapes for testing
  - [ ] Planet circles (256x256px)
  - [ ] Astronaut placeholder (128x128px)
  - [ ] Rocket placeholder (128x128px)
- [ ] Prepare sound effects
  - [ ] Record/create hop sound
  - [ ] Record/create error sound
  - [ ] Record/create success sound

## 2. Scene Setup [ ]
- [ ] Create base scene
  - [ ] Set up Main.tscn
  - [ ] Create node hierarchy
- [ ] Implement background
  - [ ] Add star field
  - [ ] Set up particle system
- [ ] Add game elements
  - [ ] Place planets
  - [ ] Add astronaut
  - [ ] Position rocket
- [ ] Set up UI
  - [ ] Add prompt label
  - [ ] Create menu button

## 3. Core Implementation [ ]
- [ ] Basic functionality
  - [ ] Implement click detection
  - [ ] Add sequence management
  - [ ] Create round system
- [ ] Movement and animation
  - [ ] Add rocket movement
  - [ ] Implement planet animations
- [ ] Feedback systems
  - [ ] Add sound effects
  - [ ] Implement visual feedback

# TESTING CHECKLIST

## 1. Basic Testing [ ]
- [ ] Game Launch Test
  - [ ] Verify game launches on macOS
  - [ ] Check window size and display
  - [ ] Verify input responsiveness
- [ ] Core Functionality Test
  - [ ] Test planet clicking
  - [ ] Verify sequence progression
  - [ ] Check sound playback
- [ ] Performance Test
  - [ ] Verify 60 FPS on target hardware
  - [ ] Check memory usage

# TECHNICAL SPECIFICATIONS
1. **Engine & Language**
   - Godot 4.2
   - GDScript only
   - Single scene architecture

2. **Display Settings**
   - Resolution: 1280 × 720
   - Orientation: Landscape
   - Viewport: Stretch mode = "canvas_items"
   - Background: Black (#000000)

3. **Input Handling**
   - Primary: Mouse click
   - Input mapping: Left mouse button = "click"

4. **Core Game Elements**
   - **Astronaut Character**
     - Type: Sprite2D
     - Size: 128x128px minimum
     - Position: Top-center of screen

   - **Planets**
     - Type: Sprite2D (3 instances)
     - Size: 256x256px minimum
     - Colors: Red (Mars), Blue (Earth), Yellow (Sun)
     - Hitbox: 120px radius

   - **Rocket Ship**
     - Type: Sprite2D
     - Size: 128x128px minimum
     - Movement: Smooth tween between planets

   - **Background**
     - Type: Sprite2D
     - Effect: Twinkling stars (CPUParticles2D)
     - Color: Dark blue (#000033)

   - **UI Elements**
     - Prompt Label: Top-center
     - Font: System default, 32pt
     - Color: White (#FFFFFF)
     - Menu Button: Top-right corner

5. **Game Logic**
   - **Round Management**
     - Sequence: Array of 3 colors
     - Randomization: Fisher-Yates shuffle
     - Progress tracking: Integer index

   - **Interaction Flow**
     ```
     Start Round
     ├── Randomize sequence
     ├── Display first prompt
     └── Wait for input
         ├── Correct Click
         │   ├── Play hop sound
         │   ├── Animate planet
         │   ├── Move rocket
         │   └── Next prompt/Complete
         └── Wrong Click
             ├── Flash screen red
             └── Repeat prompt
     ```

6. **Audio Specifications**
   - Format: WAV (16-bit, 44.1kHz)
   - Required sounds:
     - Hop (correct click)
     - Error (wrong click)
     - Success (sequence complete)

7. **Code Structure**
   - **Main.gd**
     - Constants section
     - Node references
     - Core functions:
       - `_ready()`
       - `start_round()`
       - `handle_click()`
       - `check_sequence()`
       - `complete_round()`

8. **Scene Tree Structure**
   ```
   Main (Node2D)
   ├── Background
   │   └── Stars (CPUParticles2D)
   ├── GameElements
   │   ├── Astronaut (Sprite2D)
   │   ├── Rocket (Sprite2D)
   │   └── Planets
   │       ├── Mars (Sprite2D + ColorRect)
   │       ├── Earth (Sprite2D + ColorRect)
   │       └── Sun (Sprite2D + ColorRect)
   ├── UI
   │   ├── PromptLabel (Label)
   │   └── MenuButton (TextureButton)
   └── Effects
       └── Confetti (CPUParticles2D)
   ```

# DELIVERABLES
1. README.md with setup and build instructions
2. Complete scene file (Main.tscn)
3. Main script (Main.gd)
4. Asset list and specifications
5. macOS build
6. Basic test results

# OUTPUT FORMAT
Return **one markdown document** with the following sections:
1. `# Planet Hop – Godot 4 Implementation`
2. `## Environment Setup` (development environment configuration)
3. `## Scene Tree` (node hierarchy)
4. `## Code` (complete Main.gd)
5. `## How to Run` (setup instructions)
6. `## Test Results` (completed checklist)

# README.md TEMPLATE
```markdown
# Planet Hop

A simple educational game for toddlers to practice color recognition and sequencing.

## Requirements

- macOS 10.15 or later
- Godot 4.2 or later
- Git

## Setup Instructions

1. Install Godot 4.2
   - Download from [Godot's official website](https://godotengine.org/download)
   - Extract and move to Applications folder
   - Launch Godot and verify installation

2. Clone the repository
   ```bash
   git clone [repository-url]
   cd planet-hop
   ```

3. Open the project
   - Launch Godot
   - Click "Import"
   - Navigate to the cloned directory
   - Select the project.godot file

4. Run the game
   - Click the "Play" button in the top-right corner
   - Or press F5

## Development

- Project structure follows standard Godot conventions
- Main scene: `Main.tscn`
- Main script: `Main.gd`
- Assets are stored in `/assets` directory

## Building for macOS

1. In Godot, go to Project > Export
2. Select "Mac OSX"
3. Click "Export Project"
4. Choose destination and click "Save"

## Testing

Basic tests are included to verify:
- Game launches correctly
- Core gameplay functions
- Performance meets requirements

## License

[Add license information]
```

# ITERATION PROTOCOL
- Error logs: Return corrected diff only
- Feature tweaks: Show changed snippets only
- Keep responses under 200 lines

# READY
When you understand, produce the complete implementation now.
