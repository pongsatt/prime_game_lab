# Planet Hop

A simple educational game for toddlers to practice color recognition and sequencing. Built with TypeScript and HTML5 Canvas.

## 🎮 Game Overview

Planet Hop is an interactive space-themed game where children click planets in the correct order. An astronaut travels between planets in a rocket ship, providing visual feedback for correct sequences.

### Educational Goals
- Color recognition (Red/Mars, Blue/Earth, Yellow/Sun)
- Sequential memory
- Hand-eye coordination
- Following instructions

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or later)
- npm (comes with Node.js)

### Installation

1. Clone or download this project
2. Navigate to the project directory:
   ```bash
   cd planet_hop
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. The game will automatically open in your browser at `http://localhost:8080`

## 🎯 How to Play

1. Watch for the prompt at the top of the screen (e.g., "Click the Mars!")
2. Click the correct planet
3. The rocket will fly to the planet if correct
4. Complete all three planets in the sequence to finish a round
5. Each round presents a new random sequence

### Controls
- **Mouse**: Click on planets
- **Touch**: Tap on planets (tablet support)

## 🛠️ Development

### Project Structure
```
planet_hop/
├── src/
│   ├── index.ts      # Entry point
│   ├── game.ts       # Main game logic
│   ├── types.ts      # TypeScript interfaces
│   ├── audio.ts      # Sound effects manager
│   └── index.html    # HTML template
├── assets/           # Game assets (if any)
├── dist/            # Built files (generated)
├── package.json     # Project configuration
├── tsconfig.json    # TypeScript configuration
└── webpack.config.js # Build configuration
```

### Available Scripts

- `npm start` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run dev` - Build for development

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist/` directory. You can deploy these files to any static web hosting service.

## 🎨 Customization

### Changing Colors
Edit the planet colors in `src/game.ts`:
```typescript
const planetData = [
    { name: 'Mars', color: '#FF6B6B', x: 320, y: 400 },
    { name: 'Earth', color: '#4ECDC4', x: 640, y: 400 },
    { name: 'Sun', color: '#FFE66D', x: 960, y: 400 }
];
```

### Adjusting Difficulty
- Change the number of planets in the sequence
- Adjust the delay between rounds
- Modify planet sizes or positions

## 🔊 Sound Effects

The game uses Web Audio API to generate synthetic sound effects:
- **Hop sound**: Plays when clicking the correct planet
- **Error sound**: Plays when clicking the wrong planet
- **Success sound**: Plays when completing a round

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers with touch support

## 🐛 Troubleshooting

### Game doesn't load
- Ensure Node.js is installed correctly
- Try clearing your browser cache
- Check the browser console for errors

### No sound
- Check your browser allows audio playback
- Some browsers require user interaction before playing audio

### Performance issues
- Close other browser tabs
- Try a different browser
- Ensure your device meets minimum requirements

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 👨‍👩‍👧‍👦 For Parents

This game is designed for children aged 2.5-3.5 years. Features include:
- Large, easy-to-click targets
- Clear visual feedback
- Positive reinforcement
- No ads or external links
- Safe, controlled environment

Tips for playing with your child:
- Sit together and name the colors
- Celebrate their successes
- Help them understand the sequence
- Take breaks as needed 