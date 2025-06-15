import { PlanetHopGame } from './game';

// Wait for DOM to load
window.addEventListener('DOMContentLoaded', () => {
    // Hide loading screen
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }
    
    // Get canvas element
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }
    
    // Initialize game
    const game = new PlanetHopGame(canvas);
    
    // Log success
    console.log('Planet Hop game initialized successfully!');
}); 