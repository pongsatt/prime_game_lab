# ROLE
You are a **Senior Godot 4.2 Developer** who specialises in tiny, toddler-friendly 2-D educational games.

# TASK SUMMARY
Build **Planet Hop**: a one-scene desktop game that helps a 2 y 8 m child practise colour recognition and sequencing by clicking planets in the prompted order.

# ENVIRONMENT SETUP

## 1. Development Environment [ ]
- [ ] Install Godot 4.2
  - [ ] Download from official website
  - [ ] Verify installation
  - [ ] Set up project templates
- [ ] Set up version control
  - [ ] Initialize git repository
  - [ ] Create .gitignore for Godot
  - [ ] Set up initial commit
- [ ] Configure development tools
  - [ ] Set up code editor
  - [ ] Configure GDScript formatting
  - [ ] Set up debugging tools

## 2. Project Configuration [ ]
- [ ] Create new project
  - [ ] Set project name: "Planet Hop"
  - [ ] Choose project location
  - [ ] Select Godot 4.2 template
- [ ] Configure project settings
  - [ ] Set display resolution (1280 × 720)
  - [ ] Configure viewport stretch mode
  - [ ] Set up input mappings
  - [ ] Configure export templates
- [ ] Set up project structure
  - [ ] Create asset directories
  - [ ] Set up scene organization
  - [ ] Create script templates

## 3. Asset Pipeline Setup [ ]
- [ ] Create asset directories
  - [ ] /assets/sprites
  - [ ] /assets/audio
  - [ ] /assets/fonts
- [ ] Set up asset naming conventions
  - [ ] Sprite naming: planet_[color], astronaut, rocket
  - [ ] Audio naming: sfx_[action], music_[type]
- [ ] Configure import settings
  - [ ] Set sprite import defaults
  - [ ] Configure audio import settings
  - [ ] Set up font import settings

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
  - [ ] Find/create background music

## 2. Scene Setup [ ]
- [ ] Create base scene
  - [ ] Set up Main.tscn
  - [ ] Create node hierarchy
  - [ ] Configure scene properties
- [ ] Implement background
  - [ ] Add star field
  - [ ] Set up particle system
  - [ ] Configure background color
- [ ] Add game elements
  - [ ] Place planets
  - [ ] Add astronaut
  - [ ] Position rocket
- [ ] Set up UI
  - [ ] Add prompt label
  - [ ] Create menu button
  - [ ] Add confetti system

## 3. Core Implementation [ ]
- [ ] Basic functionality
  - [ ] Implement click detection
  - [ ] Add sequence management
  - [ ] Create round system
- [ ] Movement and animation
  - [ ] Add rocket movement
  - [ ] Implement planet animations
  - [ ] Create astronaut animations
- [ ] Feedback systems
  - [ ] Add sound effects
  - [ ] Implement visual feedback
  - [ ] Create particle effects

## 4. Polish [ ]
- [ ] Visual polish
  - [ ] Refine animations
  - [ ] Add screen transitions
  - [ ] Improve particle effects
- [ ] Audio polish
  - [ ] Balance sound levels
  - [ ] Add audio mixing
  - [ ] Implement music system
- [ ] UI polish
  - [ ] Refine menu design
  - [ ] Add loading screen
  - [ ] Improve prompt display

# TESTING CHECKLIST

## 1. Development Testing [ ]
- [ ] Unit testing
  - [ ] Test sequence generation
  - [ ] Verify click detection
  - [ ] Check animation systems
- [ ] Integration testing
  - [ ] Test scene interactions
  - [ ] Verify sound triggers
  - [ ] Check particle systems
- [ ] Performance testing
  - [ ] Monitor frame rate
  - [ ] Check memory usage
  - [ ] Test load times

## 2. Quality Assurance [ ]
- [ ] Functionality testing
  - [ ] Verify all game features
  - [ ] Test edge cases
  - [ ] Check error handling
- [ ] Accessibility testing
  - [ ] Verify hitbox sizes
  - [ ] Test color contrast
  - [ ] Check sound levels
- [ ] Cross-platform testing
  - [ ] Test on Windows
  - [ ] Test on macOS
  - [ ] Test on Linux

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
   - Primary: Mouse click (desktop)
   - Secondary: Touch support (for future mobile)
   - Input mapping: Left mouse button/touch = "click"

4. **Core Game Elements**
   - **Astronaut Character**
     - Type: Sprite2D
     - Size: 128x128px minimum
     - Position: Top-center of screen
     - Animation: Idle bounce (2s loop)

   - **Planets**
     - Type: Sprite2D (3 instances)
     - Size: 256x256px minimum
     - Colors: Red (Mars), Blue (Earth), Yellow (Sun)
     - Hitbox: 120px radius (using ColorRect)
     - Animation: Scale bounce on correct click

   - **Rocket Ship**
     - Type: Sprite2D
     - Size: 128x128px minimum
     - Movement: Smooth tween between planets
     - Animation: Engine particles

   - **Background**
     - Type: Sprite2D
     - Effect: Twinkling stars (CPUParticles2D)
     - Color: Dark blue (#000033)

   - **UI Elements**
     - Prompt Label: Top-center
     - Font: System default, 32pt
     - Color: White (#FFFFFF)
     - Menu Button: Top-right corner (gear icon)

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

   - **Completion Handling**
     - Confetti burst: CPUParticles2D (1s)
     - Success sound: AudioStreamPlayer
     - Round delay: 1.5s timer

6. **Audio Specifications**
   - Format: WAV (16-bit, 44.1kHz)
   - Required sounds:
     - Hop (correct click)
     - Error (wrong click)
     - Success (sequence complete)
     - Background music (optional)

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
     - Signal handlers
     - Helper functions

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

# IMPLEMENTATION PRIORITIES
1. Basic scene setup and node structure
2. Planet placement and click detection
3. Sequence randomization and prompt system
4. Rocket movement and animations
5. Sound effects and visual feedback
6. UI polish and accessibility features

# TESTING CRITERIA
1. All planets must be easily clickable (120px hitbox)
2. Sequence must be truly random
3. Visual feedback must be clear and immediate
4. Game must run at 60 FPS consistently
5. No memory leaks or performance issues

# DELIVERABLES
1. Development environment setup guide
2. Complete scene file (Main.tscn)
3. Main script (Main.gd)
4. Asset list and specifications
5. Build instructions
6. Test results document

# OUTPUT FORMAT
Return **one markdown document** with the following sections:
1. `# Planet Hop – Godot 4 Implementation`
2. `## Environment Setup` (development environment configuration)
3. `## Scene Tree` (node hierarchy)
4. `## Code` (complete Main.gd)
5. `## How to Run` (setup instructions)
6. `## Test Results` (completed checklist)

# ITERATION PROTOCOL
- Error logs: Return corrected diff only
- Feature tweaks: Show changed snippets only
- Keep responses under 200 lines

# READY
When you understand, produce the complete implementation now.
