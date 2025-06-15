import { Planet, Star, Particle, GameState } from './types';
import { AudioManager } from './audio';

export class PlanetHopGame {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private audioManager: AudioManager;
    
    private planets: Planet[] = [];
    private stars: Star[] = [];
    private particles: Particle[] = [];
    
    private gameState: GameState = {
        currentRound: 0,
        sequence: [],
        currentIndex: 0,
        isPlaying: false,
        score: 0,
        rocket: {
            x: 0,
            y: 0,
            targetX: 0,
            targetY: 0,
            rotation: 0
        },
        astronaut: {
            x: 0,
            y: 0,
            scale: 1
        }
    };
    
    private promptText: string = "Click the planets in order!";
    private flashAlpha: number = 0;
    private isFlashing: boolean = false;
    
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        this.audioManager = new AudioManager();
        
        this.setupCanvas();
        this.initializeGame();
        this.setupEventListeners();
    }
    
    private setupCanvas() {
        this.canvas.width = 1280;
        this.canvas.height = 720;
        
        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
        this.handleResize();
    }
    
    private handleResize() {
        const aspectRatio = 1280 / 720;
        const windowAspectRatio = window.innerWidth / window.innerHeight;
        
        if (windowAspectRatio > aspectRatio) {
            this.canvas.style.height = '90vh';
            this.canvas.style.width = 'auto';
        } else {
            this.canvas.style.width = '90vw';
            this.canvas.style.height = 'auto';
        }
    }
    
    private async initializeGame() {
        await this.audioManager.initialize();
        
        // Create stars
        for (let i = 0; i < 100; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                opacity: Math.random(),
                twinkleSpeed: Math.random() * 0.02 + 0.01
            });
        }
        
        // Create planets
        const planetData = [
            { name: 'Mars', color: '#FF6B6B', x: 320, y: 400 },
            { name: 'Earth', color: '#4ECDC4', x: 640, y: 400 },
            { name: 'Sun', color: '#FFE66D', x: 960, y: 400 }
        ];
        
        planetData.forEach(data => {
            this.planets.push({
                x: data.x,
                y: data.y,
                radius: 80,
                color: data.color,
                name: data.name,
                isHovered: false,
                scale: 1,
                targetScale: 1
            });
        });
        
        // Initialize astronaut position
        this.gameState.astronaut.x = this.canvas.width / 2;
        this.gameState.astronaut.y = 120;
        
        // Initialize rocket position
        this.gameState.rocket.x = this.gameState.astronaut.x;
        this.gameState.rocket.y = this.gameState.astronaut.y + 50;
        this.gameState.rocket.targetX = this.gameState.rocket.x;
        this.gameState.rocket.targetY = this.gameState.rocket.y;
        
        // Start first round
        this.startNewRound();
        
        // Start game loop
        this.gameLoop();
    }
    
    private setupEventListeners() {
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        
        // Touch support for tablets
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const x = (touch.clientX - rect.left) * (this.canvas.width / rect.width);
            const y = (touch.clientY - rect.top) * (this.canvas.height / rect.height);
            this.handleClickAt(x, y);
        });
    }
    
    private handleClick(e: MouseEvent) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (this.canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (this.canvas.height / rect.height);
        this.handleClickAt(x, y);
    }
    
    private handleClickAt(x: number, y: number) {
        if (!this.gameState.isPlaying) return;
        
        // Check if any planet was clicked
        for (const planet of this.planets) {
            const distance = Math.sqrt((x - planet.x) ** 2 + (y - planet.y) ** 2);
            if (distance <= planet.radius) {
                this.checkPlanetClick(planet);
                break;
            }
        }
    }
    
    private handleMouseMove(e: MouseEvent) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (this.canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (this.canvas.height / rect.height);
        
        // Update hover states
        this.planets.forEach(planet => {
            const distance = Math.sqrt((x - planet.x) ** 2 + (y - planet.y) ** 2);
            planet.isHovered = distance <= planet.radius;
            planet.targetScale = planet.isHovered ? 1.1 : 1;
        });
    }
    
    private checkPlanetClick(planet: Planet) {
        const expectedPlanet = this.gameState.sequence[this.gameState.currentIndex];
        
        if (planet.name === expectedPlanet) {
            // Correct!
            this.audioManager.play('hop');
            this.moveRocketToPlanet(planet);
            this.createParticles(planet.x, planet.y, planet.color);
            
            this.gameState.currentIndex++;
            
            if (this.gameState.currentIndex >= this.gameState.sequence.length) {
                // Round complete!
                setTimeout(() => this.completeRound(), 1000);
            } else {
                this.updatePrompt();
            }
        } else {
            // Wrong!
            this.audioManager.play('error');
            this.flashScreen();
            this.updatePrompt();
        }
    }
    
    private moveRocketToPlanet(planet: Planet) {
        this.gameState.rocket.targetX = planet.x;
        this.gameState.rocket.targetY = planet.y - planet.radius - 40;
    }
    
    private createParticles(x: number, y: number, color: string) {
        for (let i = 0; i < 20; i++) {
            const angle = (Math.PI * 2 * i) / 20;
            const speed = Math.random() * 3 + 2;
            
            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 4 + 2,
                color,
                life: 1
            });
        }
    }
    
    private flashScreen() {
        this.isFlashing = true;
        this.flashAlpha = 0.5;
    }
    
    private startNewRound() {
        this.gameState.currentRound++;
        this.gameState.currentIndex = 0;
        this.gameState.sequence = this.generateSequence();
        this.gameState.isPlaying = true;
        
        // Reset rocket position
        this.gameState.rocket.targetX = this.gameState.astronaut.x;
        this.gameState.rocket.targetY = this.gameState.astronaut.y + 50;
        
        this.updatePrompt();
    }
    
    private generateSequence(): string[] {
        const planetNames = this.planets.map(p => p.name);
        const sequence = [...planetNames];
        
        // Fisher-Yates shuffle
        for (let i = sequence.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [sequence[i], sequence[j]] = [sequence[j], sequence[i]];
        }
        
        return sequence;
    }
    
    private updatePrompt() {
        const currentPlanet = this.gameState.sequence[this.gameState.currentIndex];
        this.promptText = `Click the ${currentPlanet}!`;
    }
    
    private completeRound() {
        this.audioManager.play('success');
        this.gameState.score++;
        this.promptText = "Great job! Get ready for the next round!";
        
        // Create celebration particles
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: -10,
                vx: (Math.random() - 0.5) * 2,
                vy: Math.random() * 3 + 2,
                size: Math.random() * 6 + 3,
                color: ['#FF6B6B', '#4ECDC4', '#FFE66D'][Math.floor(Math.random() * 3)],
                life: 1
            });
        }
        
        setTimeout(() => this.startNewRound(), 2000);
    }
    
    private update(deltaTime: number) {
        // Update stars
        this.stars.forEach(star => {
            star.opacity += Math.sin(Date.now() * star.twinkleSpeed) * 0.01;
            star.opacity = Math.max(0.2, Math.min(1, star.opacity));
        });
        
        // Update planet scales
        this.planets.forEach(planet => {
            planet.scale += (planet.targetScale - planet.scale) * 0.1;
        });
        
        // Update rocket position
        const rocketSpeed = 0.1;
        this.gameState.rocket.x += (this.gameState.rocket.targetX - this.gameState.rocket.x) * rocketSpeed;
        this.gameState.rocket.y += (this.gameState.rocket.targetY - this.gameState.rocket.y) * rocketSpeed;
        
        // Update rocket rotation
        const dx = this.gameState.rocket.targetX - this.gameState.rocket.x;
        const dy = this.gameState.rocket.targetY - this.gameState.rocket.y;
        this.gameState.rocket.rotation = Math.atan2(dy, dx) + Math.PI / 2;
        
        // Update particles
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.2; // Gravity
            particle.life -= 0.02;
            return particle.life > 0;
        });
        
        // Update flash
        if (this.isFlashing) {
            this.flashAlpha -= 0.05;
            if (this.flashAlpha <= 0) {
                this.isFlashing = false;
                this.flashAlpha = 0;
            }
        }
    }
    
    private render() {
        // Clear canvas
        this.ctx.fillStyle = '#000033';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw stars
        this.stars.forEach(star => {
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        // Draw planets
        this.planets.forEach(planet => {
            this.ctx.save();
            this.ctx.translate(planet.x, planet.y);
            this.ctx.scale(planet.scale, planet.scale);
            
            // Planet shadow
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            this.ctx.beginPath();
            this.ctx.arc(5, 5, planet.radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Planet
            this.ctx.fillStyle = planet.color;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, planet.radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Planet highlight
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            this.ctx.beginPath();
            this.ctx.arc(-planet.radius * 0.3, -planet.radius * 0.3, planet.radius * 0.4, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Planet name
            this.ctx.fillStyle = 'white';
            this.ctx.font = 'bold 24px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(planet.name, 0, 0);
            
            this.ctx.restore();
        });
        
        // Draw astronaut
        this.drawAstronaut();
        
        // Draw rocket
        this.drawRocket();
        
        // Draw particles
        this.particles.forEach(particle => {
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.life;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.globalAlpha = 1;
        });
        
        // Draw UI
        this.drawUI();
        
        // Draw flash effect
        if (this.isFlashing) {
            this.ctx.fillStyle = `rgba(255, 0, 0, ${this.flashAlpha})`;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    
    private drawAstronaut() {
        const { x, y, scale } = this.gameState.astronaut;
        
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.scale(scale, scale);
        
        // Body
        this.ctx.fillStyle = 'white';
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, 30, 40, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Helmet
        this.ctx.fillStyle = 'rgba(200, 200, 255, 0.3)';
        this.ctx.beginPath();
        this.ctx.arc(0, -20, 25, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Helmet glass
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(0, -20, 25, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Face
        this.ctx.fillStyle = 'black';
        this.ctx.beginPath();
        this.ctx.arc(-8, -20, 3, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(8, -20, 3, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Smile
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(0, -15, 8, 0, Math.PI);
        this.ctx.stroke();
        
        this.ctx.restore();
    }
    
    private drawRocket() {
        const { x, y, rotation } = this.gameState.rocket;
        
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);
        
        // Rocket body
        this.ctx.fillStyle = '#FF6B6B';
        this.ctx.beginPath();
        this.ctx.moveTo(0, -30);
        this.ctx.lineTo(-15, 20);
        this.ctx.lineTo(15, 20);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Window
        this.ctx.fillStyle = '#4ECDC4';
        this.ctx.beginPath();
        this.ctx.arc(0, -10, 8, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Flames
        if (Math.abs(this.gameState.rocket.x - this.gameState.rocket.targetX) > 5 ||
            Math.abs(this.gameState.rocket.y - this.gameState.rocket.targetY) > 5) {
            this.ctx.fillStyle = '#FFE66D';
            this.ctx.beginPath();
            this.ctx.moveTo(-10, 20);
            this.ctx.lineTo(0, 35 + Math.random() * 5);
            this.ctx.lineTo(10, 20);
            this.ctx.closePath();
            this.ctx.fill();
            
            this.ctx.fillStyle = '#FF6B6B';
            this.ctx.beginPath();
            this.ctx.moveTo(-5, 20);
            this.ctx.lineTo(0, 30 + Math.random() * 3);
            this.ctx.lineTo(5, 20);
            this.ctx.closePath();
            this.ctx.fill();
        }
        
        this.ctx.restore();
    }
    
    private drawUI() {
        // Draw prompt
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 36px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText(this.promptText, this.canvas.width / 2, 30);
        
        // Draw score
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Score: ${this.gameState.score}`, 30, 30);
        
        // Draw menu button
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.fillRect(this.canvas.width - 120, 20, 100, 40);
        this.ctx.strokeStyle = 'white';
        this.ctx.strokeRect(this.canvas.width - 120, 20, 100, 40);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('Menu', this.canvas.width - 70, 40);
    }
    
    private gameLoop() {
        this.update(16); // Assuming 60 FPS
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
} 