export interface Planet {
    x: number;
    y: number;
    radius: number;
    color: string;
    name: string;
    isHovered: boolean;
    scale: number;
    targetScale: number;
}

export interface Star {
    x: number;
    y: number;
    size: number;
    opacity: number;
    twinkleSpeed: number;
}

export interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    life: number;
}

export interface GameState {
    currentRound: number;
    sequence: string[];
    currentIndex: number;
    isPlaying: boolean;
    score: number;
    rocket: {
        x: number;
        y: number;
        targetX: number;
        targetY: number;
        rotation: number;
    };
    astronaut: {
        x: number;
        y: number;
        scale: number;
        targetX: number;
        targetY: number;
        rotation: number;
        isJumping: boolean;
        jumpProgress: number;
        armAngle: number;
        legAngle: number;
    };
    visualGuide: {
        active: boolean;
        targetPlanet: Planet | null;
        arrowPulse: number;
        highlightPulse: number;
    };
    showingSequence: boolean;
    sequenceShowIndex: number;
} 