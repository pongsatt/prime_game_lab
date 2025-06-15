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
   git clone https://github.com/pongsatt/planet-hop.git
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

MIT License 