# Planet Hop

A simple educational game for toddlers to practice color recognition and sequencing.

## Overview

Planet Hop is a one-scene desktop game designed for children aged 2-3 years. Players help an astronaut visit planets in the correct color sequence by clicking them in the prompted order. The game features:

- Color recognition practice (Red/Mars, Blue/Earth, Yellow/Sun)
- Sequential memory development
- Visual and audio feedback
- Simple click-based interaction
- Animated rocket movement between planets
- Celebration effects for completed sequences

## Requirements

- macOS 10.15 or later (or Windows/Linux)
- Godot 4.2 or later
- Git

## Setup Instructions

1. Install Godot 4.2
   - Download from [Godot's official website](https://godotengine.org/download)
   - Extract and move to Applications folder (macOS) or install as appropriate for your OS
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
   - Click "Import & Edit"

4. Run the game
   - Click the "Play" button in the top-right corner
   - Or press F5

## How to Play

1. The game displays a prompt asking the child to click a specific colored planet
2. Click the correct planet to make the rocket fly to it
3. Complete the sequence of three planets to win the round
4. Wrong clicks result in a gentle error feedback
5. Each round generates a new random sequence

## Development

### Project Structure
```
planet_hop/
├── README.md               # This file
├── project.godot          # Godot project configuration
├── scenes/                # Game scenes
│   └── Main.tscn         # Main game scene
├── scripts/              # Game scripts
│   └── Main.gd          # Main game logic
└── assets/              # Game assets (sprites, audio)
    ├── sprites/
    └── audio/
```

### Key Features
- **Educational Focus**: Color recognition and sequencing
- **Toddler-Friendly**: Large click areas, clear visuals
- **Positive Reinforcement**: Celebration effects and encouraging feedback
- **Simple Controls**: Click-only interaction

## Building for Distribution

### macOS
1. In Godot, go to Project > Export
2. Click "Add..." and select "macOS"
3. Configure export settings:
   - Application name: Planet Hop
   - Bundle identifier: com.example.planethop
4. Click "Export Project"
5. Choose destination and click "Save"

### Windows
1. In Godot, go to Project > Export
2. Click "Add..." and select "Windows Desktop"
3. Configure export settings
4. Click "Export Project"
5. Choose destination and click "Save"

## Testing

Basic tests to verify:
- [x] Game launches correctly
- [x] Planets are clickable
- [x] Sequence progression works
- [x] Visual feedback displays properly
- [x] Game resets after completing a round
- [x] Error feedback for wrong clicks

## Future Enhancements

- Add actual audio files for sound effects
- Create custom planet and character sprites
- Add difficulty levels
- Implement progress tracking
- Add more educational content (numbers, letters)
- Create a parent settings menu

## License

This project is created for educational purposes. Feel free to modify and use as needed.

## Credits

Created as an educational game for toddlers to learn colors and sequences through interactive play.