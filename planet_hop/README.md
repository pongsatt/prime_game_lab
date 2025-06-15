# Planet Hop - Educational Color Recognition Game

An engaging space-themed educational game designed for children aged 2.5-3.5 years, focusing on color recognition, memory skills, and visual learning through interactive play.

## 🎮 Game Overview

Planet Hop features an astronaut character who jumps between colorful planets in a specific sequence. The game uses visual guides instead of text, making it perfect for pre-readers.

### Key Features

- **Visual Learning**: No reading required - uses icons, animations, and visual cues
- **Astronaut Character**: A friendly astronaut who jumps between planets with fun animations
- **Interactive Planets**: Each planet has unique visual characteristics and symbols
- **Visual Guidance System**: 
  - Glowing rings highlight target planets
  - Animated arrows point the way
  - Eye icon shows when to watch the sequence
  - Play icon indicates when it's your turn
- **Engaging Effects**:
  - Shooting stars in the background
  - Nebula effects for atmosphere
  - Particle effects for successful jumps
  - Celebration animations

### Educational Goals

- **Color Recognition**: Learn to identify and remember colors (Red/Mars, Blue/Earth, Yellow/Sun)
- **Memory Skills**: Remember and repeat sequences
- **Visual Pattern Recognition**: Follow visual cues and patterns
- **Motor Skills**: Click/tap accuracy and hand-eye coordination
- **Cause and Effect**: Immediate visual and audio feedback
- **Sequential Memory**: Following instructions in order

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

1. **Watch Phase**: An eye icon appears, and planets light up one by one showing the sequence
2. **Play Phase**: A play arrow appears, and glowing rings with arrows guide you to click planets in order
3. **Success**: The astronaut jumps to each planet with fun animations
4. **Celebration**: Stars appear around the astronaut when you complete a round
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

## Visual Design

- **Astronaut**: Detailed character with animated limbs, helmet shine, and antenna
- **Planets**: 
  - Mars (Red): Features craters and Mars symbol (♂)
  - Earth (Blue): Shows continents and Earth symbol (⊕)
  - Sun (Yellow): Has radiating rays and Sun symbol (☉)
- **Background**: Space gradient with twinkling stars and nebula effects
- **UI Elements**: Visual indicators replace all text prompts

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
- Check your browser allows audio playbook
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