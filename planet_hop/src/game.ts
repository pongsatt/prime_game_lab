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
            scale: 1,
            targetX: 0,
            targetY: 0,
            rotation: 0,
            isJumping: false,
            jumpProgress: 0,
            armAngle: 0,
            legAngle: 0
        },
        visualGuide: {
            active: false,
            targetPlanet: null,
            arrowPulse: 0,
            highlightPulse: 0
        },
        showingSequence: false,
        sequenceShowIndex: 0,
        showInstructions: true,
        instructionStep: 0
    };
    
    private flashAlpha: number = 0;
    private isFlashing: boolean = false;
    private animationTime: number = 0;
    
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
        
        // Create planets with more realistic colors
        const planetData = [
            { name: 'Moon', color: '#E8E8E8', x: 320, y: 400 },
            { name: 'Earth', color: '#2E86AB', x: 640, y: 400 },
            { name: 'Mars', color: '#CD5334', x: 960, y: 400 }
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
        this.gameState.astronaut.y = 600;
        this.gameState.astronaut.targetX = this.gameState.astronaut.x;
        this.gameState.astronaut.targetY = this.gameState.astronaut.y;
        
        // Start game loop (instructions will show first)
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
        // Handle instruction screen clicks
        if (this.gameState.showInstructions) {
            if (this.gameState.instructionStep < 2) {
                this.gameState.instructionStep++;
            } else {
                this.gameState.showInstructions = false;
                this.startNewRound();
            }
            return;
        }
        
        if (!this.gameState.isPlaying || this.gameState.showingSequence) return;
        
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
            this.moveAstronautToPlanet(planet);
            this.createParticles(planet.x, planet.y, planet.color);
            
            this.gameState.currentIndex++;
            
            if (this.gameState.currentIndex >= this.gameState.sequence.length) {
                // Round complete!
                setTimeout(() => this.completeRound(), 1500);
            } else {
                this.updateVisualGuide();
            }
        } else {
            // Wrong!
            this.audioManager.play('error');
            this.flashScreen();
            // Shake the astronaut to indicate wrong choice
            this.shakeAstronaut();
        }
    }
    
    private moveAstronautToPlanet(planet: Planet) {
        this.gameState.astronaut.targetX = planet.x;
        this.gameState.astronaut.targetY = planet.y - planet.radius - 60;
        this.gameState.astronaut.isJumping = true;
        this.gameState.astronaut.jumpProgress = 0;
    }
    
    private shakeAstronaut() {
        // Create a shake effect by rapidly changing position
        const originalX = this.gameState.astronaut.x;
        let shakeCount = 0;
        const shakeInterval = setInterval(() => {
            this.gameState.astronaut.x = originalX + (Math.random() - 0.5) * 20;
            shakeCount++;
            if (shakeCount > 10) {
                clearInterval(shakeInterval);
                this.gameState.astronaut.x = originalX;
            }
        }, 50);
    }
    
    private updateVisualGuide() {
        const currentPlanetName = this.gameState.sequence[this.gameState.currentIndex];
        const targetPlanet = this.planets.find(p => p.name === currentPlanetName);
        if (targetPlanet) {
            this.gameState.visualGuide.active = true;
            this.gameState.visualGuide.targetPlanet = targetPlanet;
        }
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
        this.gameState.isPlaying = false;
        this.gameState.showingSequence = true;
        this.gameState.sequenceShowIndex = 0;
        
        // Reset astronaut position
        this.gameState.astronaut.targetX = this.canvas.width / 2;
        this.gameState.astronaut.targetY = 600;
        
        // Show the sequence visually
        this.showSequence();
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
    
    private showSequence() {
        // Show each planet in the sequence with a delay
        const showNextPlanet = () => {
            if (this.gameState.sequenceShowIndex < this.gameState.sequence.length) {
                const planetName = this.gameState.sequence[this.gameState.sequenceShowIndex];
                const planet = this.planets.find(p => p.name === planetName);
                
                if (planet) {
                    // Highlight the planet
                    planet.targetScale = 1.5;
                    this.audioManager.play('hop');
                    
                    // Create sparkles around the planet
                    this.createSparkles(planet.x, planet.y, planet.color);
                    
                    setTimeout(() => {
                        planet.targetScale = 1;
                        this.gameState.sequenceShowIndex++;
                        showNextPlanet();
                    }, 800);
                }
            } else {
                // Sequence showing complete, start playing
                this.gameState.showingSequence = false;
                this.gameState.isPlaying = true;
                this.gameState.currentIndex = 0;
                this.updateVisualGuide();
            }
        };
        
        // Start showing after a short delay
        setTimeout(showNextPlanet, 500);
    }
    
    private createSparkles(x: number, y: number, color: string) {
        for (let i = 0; i < 15; i++) {
            const angle = (Math.PI * 2 * i) / 15;
            const speed = Math.random() * 2 + 1;
            
            this.particles.push({
                x: x + Math.cos(angle) * 40,
                y: y + Math.sin(angle) * 40,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 3 + 2,
                color,
                life: 1
            });
        }
    }
    
    private createShootingStar() {
        const startX = Math.random() * this.canvas.width;
        const startY = Math.random() * this.canvas.height * 0.3;
        const angle = Math.PI / 4 + Math.random() * Math.PI / 6;
        const speed = 10 + Math.random() * 5;
        
        this.particles.push({
            x: startX,
            y: startY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: 3,
            color: 'shooting-star',
            life: 1
        });
    }
    
    private completeRound() {
        this.audioManager.play('success');
        this.gameState.score++;
        this.gameState.visualGuide.active = false;
        
        // Make astronaut celebrate
        this.gameState.astronaut.armAngle = Math.PI / 4;
        
        // Show educational message
        this.showEducationalMessage();
        
        // Create celebration particles
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: -10,
                vx: (Math.random() - 0.5) * 2,
                vy: Math.random() * 3 + 2,
                size: Math.random() * 6 + 3,
                color: ['#E8E8E8', '#2E86AB', '#CD5334'][Math.floor(Math.random() * 3)],
                life: 1
            });
        }
        
        // Create stars around astronaut
        for (let i = 0; i < 20; i++) {
            const angle = (Math.PI * 2 * i) / 20;
            this.particles.push({
                x: this.gameState.astronaut.x,
                y: this.gameState.astronaut.y,
                vx: Math.cos(angle) * 4,
                vy: Math.sin(angle) * 4,
                size: 5,
                color: '#FFE66D',
                life: 1
            });
        }
        
        setTimeout(() => {
            this.gameState.astronaut.armAngle = 0;
            this.startNewRound();
        }, 3500);
    }
    
    private showEducationalMessage() {
        // This will be drawn in the render method
        setTimeout(() => {
            // Message will be shown for 2 seconds during the celebration
        }, 500);
    }
    
    private update(deltaTime: number) {
        this.animationTime += deltaTime;
        
        // Update stars
        this.stars.forEach(star => {
            star.opacity += Math.sin(Date.now() * star.twinkleSpeed) * 0.01;
            star.opacity = Math.max(0.2, Math.min(1, star.opacity));
        });
        
        // Update planet scales
        this.planets.forEach(planet => {
            planet.scale += (planet.targetScale - planet.scale) * 0.1;
        });
        
        // Update astronaut position
        const astronautSpeed = 0.08;
        const dx = this.gameState.astronaut.targetX - this.gameState.astronaut.x;
        const dy = this.gameState.astronaut.targetY - this.gameState.astronaut.y;
        
        if (this.gameState.astronaut.isJumping) {
            // Jumping animation
            this.gameState.astronaut.jumpProgress += 0.05;
            if (this.gameState.astronaut.jumpProgress >= 1) {
                this.gameState.astronaut.isJumping = false;
                this.gameState.astronaut.jumpProgress = 0;
            }
            
            // Parabolic jump motion
            const jumpHeight = 100;
            const progress = this.gameState.astronaut.jumpProgress;
            const jumpOffset = jumpHeight * Math.sin(progress * Math.PI);
            
            this.gameState.astronaut.x += dx * astronautSpeed;
            this.gameState.astronaut.y += dy * astronautSpeed - jumpOffset * 0.1;
            
            // Rotate during jump
            this.gameState.astronaut.rotation = progress * Math.PI * 2;
            
            // Animate limbs during jump
            this.gameState.astronaut.armAngle = Math.sin(progress * Math.PI * 2) * 0.5;
            this.gameState.astronaut.legAngle = Math.sin(progress * Math.PI * 2 + Math.PI) * 0.3;
        } else {
            // Normal movement
            this.gameState.astronaut.x += dx * astronautSpeed;
            this.gameState.astronaut.y += dy * astronautSpeed;
            this.gameState.astronaut.rotation = 0;
            
            // Idle animation
            this.gameState.astronaut.armAngle = Math.sin(this.animationTime * 0.002) * 0.1;
            this.gameState.astronaut.legAngle = Math.sin(this.animationTime * 0.002 + Math.PI) * 0.05;
        }
        
        // Update visual guide
        if (this.gameState.visualGuide.active) {
            this.gameState.visualGuide.arrowPulse = Math.sin(this.animationTime * 0.005) * 0.5 + 0.5;
            this.gameState.visualGuide.highlightPulse = Math.sin(this.animationTime * 0.003) * 0.3 + 0.7;
        }
        
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
        // Clear canvas with gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#000033');
        gradient.addColorStop(1, '#000066');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw nebula effect
        this.ctx.save();
        this.ctx.globalAlpha = 0.1;
        const nebulaGradient = this.ctx.createRadialGradient(
            this.canvas.width * 0.7, this.canvas.height * 0.3, 0,
            this.canvas.width * 0.7, this.canvas.height * 0.3, 300
        );
        nebulaGradient.addColorStop(0, '#FF6B6B');
        nebulaGradient.addColorStop(0.5, '#4ECDC4');
        nebulaGradient.addColorStop(1, 'transparent');
        this.ctx.fillStyle = nebulaGradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
        
        // Draw stars
        this.stars.forEach(star => {
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        // Draw shooting star occasionally
        if (Math.random() < 0.005) {
            this.createShootingStar();
        }
        
        // Update and draw shooting stars
        this.particles.forEach(particle => {
            if (particle.color === 'shooting-star') {
                this.ctx.strokeStyle = 'rgba(255, 255, 255, ' + particle.life + ')';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.moveTo(particle.x, particle.y);
                this.ctx.lineTo(particle.x - particle.vx * 10, particle.y - particle.vy * 10);
                this.ctx.stroke();
            }
        });
        
        // Draw planets
        this.planets.forEach((planet, index) => {
            this.ctx.save();
            this.ctx.translate(planet.x, planet.y);
            this.ctx.scale(planet.scale, planet.scale);
            
            // Planet shadow
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            this.ctx.beginPath();
            this.ctx.arc(8, 8, planet.radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Planet glow when hovered or during sequence
            if (planet.isHovered || (this.gameState.showingSequence && 
                this.gameState.sequence[this.gameState.sequenceShowIndex] === planet.name)) {
                this.ctx.shadowColor = planet.color;
                this.ctx.shadowBlur = 50;
                this.ctx.shadowOffsetX = 0;
                this.ctx.shadowOffsetY = 0;
            }
            
            // Planet base gradient
            const planetGradient = this.ctx.createRadialGradient(
                -planet.radius * 0.3, -planet.radius * 0.3, 0,
                0, 0, planet.radius
            );
            
            if (planet.name === 'Earth') {
                planetGradient.addColorStop(0, '#4A90E2');
                planetGradient.addColorStop(0.7, '#2E86AB');
                planetGradient.addColorStop(1, '#1E5A7B');
            } else if (planet.name === 'Mars') {
                planetGradient.addColorStop(0, '#E67E50');
                planetGradient.addColorStop(0.7, '#CD5334');
                planetGradient.addColorStop(1, '#8B3220');
            } else if (planet.name === 'Moon') {
                planetGradient.addColorStop(0, '#F5F5F5');
                planetGradient.addColorStop(0.7, '#E8E8E8');
                planetGradient.addColorStop(1, '#C0C0C0');
            }
            
            this.ctx.fillStyle = planetGradient;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, planet.radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Reset shadow
            this.ctx.shadowBlur = 0;
            
            // Planet texture/pattern with more realistic details
            if (planet.name === 'Mars') {
                // Mars surface features - more detailed
                this.ctx.globalAlpha = 0.3;
                this.ctx.fillStyle = '#8B3220';
                this.ctx.beginPath();
                this.ctx.arc(-25, -15, 18, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.beginPath();
                this.ctx.arc(30, 5, 12, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.beginPath();
                this.ctx.arc(-5, 30, 15, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.beginPath();
                this.ctx.arc(15, -30, 10, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Valles Marineris (large canyon)
                this.ctx.strokeStyle = 'rgba(100, 40, 20, 0.4)';
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                this.ctx.moveTo(-40, 0);
                this.ctx.bezierCurveTo(-20, 5, 20, -5, 40, 0);
                this.ctx.stroke();
                
                // Polar ice caps
                this.ctx.globalAlpha = 0.7;
                this.ctx.fillStyle = '#FFFFFF';
                this.ctx.beginPath();
                this.ctx.ellipse(0, -planet.radius + 15, 25, 12, 0, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.beginPath();
                this.ctx.ellipse(0, planet.radius - 15, 20, 10, 0, 0, Math.PI * 2);
                this.ctx.fill();
                
            } else if (planet.name === 'Earth') {
                // Earth continents with more detail
                this.ctx.globalAlpha = 0.7;
                
                // Ocean darker areas
                this.ctx.fillStyle = '#1E5A7B';
                this.ctx.beginPath();
                this.ctx.arc(35, 20, 15, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Continents (green land masses)
                this.ctx.fillStyle = '#228B22';
                this.ctx.beginPath();
                this.ctx.ellipse(-20, -5, 30, 25, 0.2, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.beginPath();
                this.ctx.ellipse(25, -15, 22, 18, -0.3, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.beginPath();
                this.ctx.ellipse(5, 25, 18, 15, 0.5, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Sandy/desert areas
                this.ctx.globalAlpha = 0.4;
                this.ctx.fillStyle = '#DEB887';
                this.ctx.beginPath();
                this.ctx.arc(-10, -20, 8, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Clouds with swirls
                this.ctx.globalAlpha = 0.5;
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                this.ctx.beginPath();
                this.ctx.ellipse(-25, -30, 15, 8, 0.3, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.beginPath();
                this.ctx.ellipse(30, 15, 12, 6, -0.5, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.beginPath();
                this.ctx.ellipse(0, 35, 10, 5, 0, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Atmosphere glow
                this.ctx.globalAlpha = 0.2;
                this.ctx.strokeStyle = '#87CEEB';
                this.ctx.lineWidth = 8;
                this.ctx.beginPath();
                this.ctx.arc(0, 0, planet.radius + 4, 0, Math.PI * 2);
                this.ctx.stroke();
                
            } else if (planet.name === 'Moon') {
                // Moon craters with depth
                this.ctx.globalAlpha = 0.4;
                
                // Large craters
                this.ctx.fillStyle = '#A9A9A9';
                this.ctx.beginPath();
                this.ctx.arc(-25, -20, 15, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.fillStyle = '#808080';
                this.ctx.beginPath();
                this.ctx.arc(-25, -20, 12, 0, Math.PI * 2);
                this.ctx.fill();
                
                this.ctx.fillStyle = '#A9A9A9';
                this.ctx.beginPath();
                this.ctx.arc(30, 10, 10, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.fillStyle = '#808080';
                this.ctx.beginPath();
                this.ctx.arc(30, 10, 8, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Medium craters
                this.ctx.fillStyle = '#A9A9A9';
                this.ctx.beginPath();
                this.ctx.arc(-10, 25, 12, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.beginPath();
                this.ctx.arc(15, -30, 8, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.beginPath();
                this.ctx.arc(0, 0, 6, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Small craters for texture
                this.ctx.globalAlpha = 0.3;
                this.ctx.fillStyle = '#696969';
                for (let i = 0; i < 8; i++) {
                    const angle = (i * Math.PI * 2) / 8;
                    const r = planet.radius * 0.6;
                    const x = Math.cos(angle) * r;
                    const y = Math.sin(angle) * r;
                    this.ctx.beginPath();
                    this.ctx.arc(x, y, 4, 0, Math.PI * 2);
                    this.ctx.fill();
                }
                
                // Mare (dark areas)
                this.ctx.globalAlpha = 0.2;
                this.ctx.fillStyle = '#5A5A5A';
                this.ctx.beginPath();
                this.ctx.ellipse(20, -10, 25, 20, 0.5, 0, Math.PI * 2);
                this.ctx.fill();
            }
            this.ctx.globalAlpha = 1;
            
            // Realistic planet highlight and shading
            const highlightGradient = this.ctx.createRadialGradient(
                -planet.radius * 0.4, -planet.radius * 0.4, 0,
                -planet.radius * 0.4, -planet.radius * 0.4, planet.radius * 0.5
            );
            highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
            highlightGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
            highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            this.ctx.fillStyle = highlightGradient;
            this.ctx.beginPath();
            this.ctx.arc(-planet.radius * 0.3, -planet.radius * 0.3, planet.radius * 0.5, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Add subtle edge shading for 3D effect
            const edgeGradient = this.ctx.createRadialGradient(
                0, 0, planet.radius * 0.8,
                0, 0, planet.radius
            );
            edgeGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
            edgeGradient.addColorStop(0.8, 'rgba(0, 0, 0, 0.1)');
            edgeGradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
            this.ctx.fillStyle = edgeGradient;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, planet.radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Planet names with educational text
            this.ctx.fillStyle = 'white';
            this.ctx.font = 'bold 20px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
            this.ctx.lineWidth = 4;
            this.ctx.strokeText(planet.name, 0, planet.radius + 30);
            this.ctx.fillText(planet.name, 0, planet.radius + 30);
            
            this.ctx.restore();
        });
        
        // Draw visual guide
        if (this.gameState.visualGuide.active && this.gameState.visualGuide.targetPlanet) {
            this.drawVisualGuide();
        }
        
        // Draw astronaut
        this.drawAstronaut();
        
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
        
        // Draw instructions if showing
        if (this.gameState.showInstructions) {
            this.drawInstructions();
        }
        
        // Draw educational message during celebration
        if (this.gameState.score > 0 && !this.gameState.isPlaying && !this.gameState.showingSequence) {
            this.drawEducationalMessage();
        }
    }
    
    private drawVisualGuide() {
        const target = this.gameState.visualGuide.targetPlanet!;
        const pulse = this.gameState.visualGuide.highlightPulse;
        
        // Draw glowing ring around target planet
        this.ctx.save();
        this.ctx.strokeStyle = `rgba(255, 255, 100, ${pulse})`;
        this.ctx.lineWidth = 5;
        this.ctx.beginPath();
        this.ctx.arc(target.x, target.y, target.radius + 20, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Draw pulsing arrow pointing to planet
        const arrowPulse = this.gameState.visualGuide.arrowPulse;
        const astronaut = this.gameState.astronaut;
        const angle = Math.atan2(target.y - astronaut.y, target.x - astronaut.x);
        const arrowDistance = 100 + arrowPulse * 20;
        const arrowX = astronaut.x + Math.cos(angle) * arrowDistance;
        const arrowY = astronaut.y + Math.sin(angle) * arrowDistance;
        
        this.ctx.translate(arrowX, arrowY);
        this.ctx.rotate(angle);
        
        // Arrow shape
        this.ctx.fillStyle = `rgba(255, 255, 100, ${0.8 + arrowPulse * 0.2})`;
        this.ctx.beginPath();
        this.ctx.moveTo(20, 0);
        this.ctx.lineTo(-10, -15);
        this.ctx.lineTo(-10, -5);
        this.ctx.lineTo(-20, -5);
        this.ctx.lineTo(-20, 5);
        this.ctx.lineTo(-10, 5);
        this.ctx.lineTo(-10, 15);
        this.ctx.closePath();
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    private drawAstronaut() {
        const { x, y, scale, rotation, armAngle, legAngle } = this.gameState.astronaut;
        
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);
        this.ctx.scale(scale, scale);
        
        // Shadow
        if (!this.gameState.astronaut.isJumping) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            this.ctx.beginPath();
            this.ctx.ellipse(0, 40, 25, 10, 0, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Left leg
        this.ctx.save();
        this.ctx.translate(-10, 20);
        this.ctx.rotate(legAngle);
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(-5, 0, 10, 25);
        this.ctx.restore();
        
        // Right leg
        this.ctx.save();
        this.ctx.translate(10, 20);
        this.ctx.rotate(-legAngle);
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(-5, 0, 10, 25);
        this.ctx.restore();
        
        // Body
        this.ctx.fillStyle = 'white';
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, 30, 40, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Chest detail
        this.ctx.fillStyle = '#FF6B6B';
        this.ctx.fillRect(-15, -10, 30, 20);
        this.ctx.fillStyle = '#4ECDC4';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 8, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Left arm
        this.ctx.save();
        this.ctx.translate(-20, -10);
        this.ctx.rotate(armAngle);
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(-5, 0, 10, 30);
        this.ctx.restore();
        
        // Right arm
        this.ctx.save();
        this.ctx.translate(20, -10);
        this.ctx.rotate(-armAngle);
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(-5, 0, 10, 30);
        this.ctx.restore();
        
        // Helmet
        this.ctx.fillStyle = 'rgba(200, 200, 255, 0.3)';
        this.ctx.beginPath();
        this.ctx.arc(0, -30, 28, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Helmet glass
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(0, -30, 28, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Helmet shine
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        this.ctx.beginPath();
        this.ctx.arc(-10, -40, 10, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Face
        this.ctx.fillStyle = 'black';
        this.ctx.beginPath();
        this.ctx.arc(-8, -30, 3, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(8, -30, 3, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Smile
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(0, -25, 8, 0, Math.PI);
        this.ctx.stroke();
        
        // Antenna
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -58);
        this.ctx.lineTo(0, -65);
        this.ctx.stroke();
        this.ctx.fillStyle = '#FF6B6B';
        this.ctx.beginPath();
        this.ctx.arc(0, -65, 4, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    private drawUI() {
        // Draw score with stars - larger and more prominent
        this.ctx.save();
        
        // Score background - bigger and darker
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        this.ctx.fillRect(20, 20, 320, 100);
        this.ctx.strokeStyle = '#FFE66D';
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(20, 20, 320, 100);
        
        // Score label
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText('SCORE:', 35, 30);
        
        // Draw stars for score - bigger
        for (let i = 0; i < Math.min(this.gameState.score, 5); i++) {
            this.ctx.fillStyle = '#FFE66D';
            this.ctx.shadowColor = '#FFE66D';
            this.ctx.shadowBlur = 10;
            this.drawStar(60 + i * 45, 75, 20);
            this.ctx.shadowBlur = 0;
        }
        
        // Draw empty stars for remaining
        for (let i = this.gameState.score; i < 5; i++) {
            this.ctx.strokeStyle = '#FFE66D';
            this.ctx.lineWidth = 2;
            this.drawStarOutline(60 + i * 45, 75, 20);
        }
        
        // Score number - much bigger
        this.ctx.fillStyle = '#FFE66D';
        this.ctx.font = 'bold 56px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.shadowColor = '#FFE66D';
        this.ctx.shadowBlur = 15;
        this.ctx.fillText(`${this.gameState.score}`, 290, 70);
        this.ctx.shadowBlur = 0;
        
        // Draw visual status indicator
        if (this.gameState.showingSequence) {
            // "Watch" indicator
            this.ctx.fillStyle = 'rgba(100, 200, 255, 0.8)';
            this.ctx.fillRect(this.canvas.width / 2 - 100, 30, 200, 60);
            this.ctx.strokeStyle = 'white';
            this.ctx.strokeRect(this.canvas.width / 2 - 100, 30, 200, 60);
            
            // Eye icon
            this.ctx.fillStyle = 'white';
            this.ctx.beginPath();
            this.ctx.arc(this.canvas.width / 2, 60, 20, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.fillStyle = '#4ECDC4';
            this.ctx.beginPath();
            this.ctx.arc(this.canvas.width / 2, 60, 10, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.fillStyle = 'black';
            this.ctx.beginPath();
            this.ctx.arc(this.canvas.width / 2, 60, 5, 0, Math.PI * 2);
            this.ctx.fill();
        } else if (this.gameState.isPlaying) {
            // "Play" indicator
            this.ctx.fillStyle = 'rgba(100, 255, 100, 0.8)';
            this.ctx.fillRect(this.canvas.width / 2 - 100, 30, 200, 60);
            this.ctx.strokeStyle = 'white';
            this.ctx.strokeRect(this.canvas.width / 2 - 100, 30, 200, 60);
            
            // Play icon (pointing hand)
            this.ctx.fillStyle = 'white';
            this.ctx.save();
            this.ctx.translate(this.canvas.width / 2, 60);
            this.ctx.beginPath();
            this.ctx.moveTo(-15, -10);
            this.ctx.lineTo(15, 0);
            this.ctx.lineTo(-15, 10);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.restore();
        }
        
        this.ctx.restore();
    }
    
    private drawStar(x: number, y: number, size: number) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
            const innerAngle = ((i + 0.5) * Math.PI * 2) / 5 - Math.PI / 2;
            
            if (i === 0) {
                this.ctx.moveTo(Math.cos(angle) * size, Math.sin(angle) * size);
            } else {
                this.ctx.lineTo(Math.cos(angle) * size, Math.sin(angle) * size);
            }
            this.ctx.lineTo(Math.cos(innerAngle) * size * 0.5, Math.sin(innerAngle) * size * 0.5);
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
    }
    
    private drawStarOutline(x: number, y: number, size: number) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
            const innerAngle = ((i + 0.5) * Math.PI * 2) / 5 - Math.PI / 2;
            
            if (i === 0) {
                this.ctx.moveTo(Math.cos(angle) * size, Math.sin(angle) * size);
            } else {
                this.ctx.lineTo(Math.cos(angle) * size, Math.sin(angle) * size);
            }
            this.ctx.lineTo(Math.cos(innerAngle) * size * 0.5, Math.sin(innerAngle) * size * 0.5);
        }
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.restore();
    }
    
    private drawInstructions() {
        // Dark overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Instruction background
        this.ctx.fillStyle = 'rgba(20, 20, 60, 0.95)';
        this.ctx.fillRect(140, 60, 1000, 600);
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(140, 60, 1000, 600);
        
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'center';
        
        if (this.gameState.instructionStep === 0) {
            // Welcome screen
            this.ctx.font = 'bold 48px Arial';
            this.ctx.fillText('🚀 Welcome to Planet Hop! 🌎', this.canvas.width / 2, 150);
            
            this.ctx.font = '28px Arial';
            this.ctx.fillText('Help the astronaut visit the planets in order!', this.canvas.width / 2, 220);
            
            // Draw sample planets
            const samplePlanets = [
                { name: 'Moon', color: '#E8E8E8', x: 320, y: 350 },
                { name: 'Earth', color: '#2E86AB', x: 640, y: 350 },
                { name: 'Mars', color: '#CD5334', x: 960, y: 350 }
            ];
            
            samplePlanets.forEach(planet => {
                this.ctx.save();
                this.ctx.translate(planet.x, planet.y);
                
                // Planet
                this.ctx.fillStyle = planet.color;
                this.ctx.beginPath();
                this.ctx.arc(0, 0, 60, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Name
                this.ctx.fillStyle = 'white';
                this.ctx.font = 'bold 24px Arial';
                this.ctx.fillText(planet.name, 0, 90);
                
                this.ctx.restore();
            });
            
            this.ctx.font = '24px Arial';
            this.ctx.fillText('Click to continue...', this.canvas.width / 2, 580);
            
        } else if (this.gameState.instructionStep === 1) {
            // How to play
            this.ctx.font = 'bold 40px Arial';
            this.ctx.fillText('How to Play', this.canvas.width / 2, 140);
            
            this.ctx.font = '26px Arial';
            this.ctx.textAlign = 'left';
            const instructions = [
                '1. 👀 Watch carefully! The planets will light up in order.',
                '2. 🌟 Remember the sequence shown.',
                '3. 👆 Click the planets in the same order.',
                '4. ✅ Get it right to score points!',
                '5. 🎯 The astronaut will hop to each planet you click.'
            ];
            
            instructions.forEach((text, index) => {
                this.ctx.fillText(text, 200, 220 + index * 60);
            });
            
            this.ctx.textAlign = 'center';
            this.ctx.font = '24px Arial';
            this.ctx.fillText('Click to continue...', this.canvas.width / 2, 580);
            
        } else {
            // Educational facts
            this.ctx.font = 'bold 40px Arial';
            this.ctx.fillText('Fun Space Facts! 🌌', this.canvas.width / 2, 140);
            
            this.ctx.font = '24px Arial';
            this.ctx.textAlign = 'left';
            const facts = [
                '🌙 The Moon is Earth\'s natural satellite',
                '🌍 Earth is the only planet with liquid water on its surface',
                '🔴 Mars is called the "Red Planet" because of iron oxide',
                '🚀 It takes about 3 days to travel to the Moon',
                '⭐ Each planet is unique and special!'
            ];
            
            facts.forEach((text, index) => {
                this.ctx.fillText(text, 200, 220 + index * 60);
            });
            
            this.ctx.textAlign = 'center';
            this.ctx.font = 'bold 32px Arial';
            this.ctx.fillStyle = '#4ECDC4';
            this.ctx.fillText('Click to start playing!', this.canvas.width / 2, 580);
        }
    }
    
    private drawEducationalMessage() {
        const messages = [
            'Great job exploring space! 🌟',
            'You\'re a space navigator! 🚀',
            'Amazing planet hopping! 🌍',
            'You\'re learning about our solar system! ✨',
            'Fantastic space journey! 🌌'
        ];
        
        const funFacts = [
            'Did you know? The Moon orbits Earth every 27 days!',
            'Fun fact: Earth is 71% covered by water!',
            'Cool! Mars has the largest volcano in our solar system!',
            'Wow! You can see the Moon from Earth without a telescope!',
            'Amazing! Mars appears red due to iron oxide on its surface!'
        ];
        
        const messageIndex = (this.gameState.score - 1) % messages.length;
        
        // Message background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(this.canvas.width / 2 - 400, 200, 800, 150);
        this.ctx.strokeStyle = '#FFE66D';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(this.canvas.width / 2 - 400, 200, 800, 150);
        
        // Success message
        this.ctx.fillStyle = '#FFE66D';
        this.ctx.font = 'bold 36px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(messages[messageIndex], this.canvas.width / 2, 250);
        
        // Fun fact
        this.ctx.fillStyle = 'white';
        this.ctx.font = '24px Arial';
        this.ctx.fillText(funFacts[messageIndex], this.canvas.width / 2, 310);
    }
    
    private gameLoop() {
        this.update(16); // Assuming 60 FPS
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
} 