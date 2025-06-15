export class AudioManager {
    private audioContext: AudioContext | null = null;
    private sounds: Map<string, AudioBuffer> = new Map();
    
    constructor() {
        try {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported:', e);
        }
    }
    
    // Create synthetic sound effects
    async initialize() {
        if (!this.audioContext) return;
        
        // Create hop sound (success)
        this.sounds.set('hop', this.createHopSound());
        
        // Create error sound
        this.sounds.set('error', this.createErrorSound());
        
        // Create success sound
        this.sounds.set('success', this.createSuccessSound());
    }
    
    private createHopSound(): AudioBuffer {
        if (!this.audioContext) return new AudioBuffer({ length: 1, sampleRate: 44100 });
        
        const duration = 0.3;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            // Rising pitch sweep
            const frequency = 200 + (600 * t);
            data[i] = Math.sin(2 * Math.PI * frequency * t) * Math.exp(-t * 3);
        }
        
        return buffer;
    }
    
    private createErrorSound(): AudioBuffer {
        if (!this.audioContext) return new AudioBuffer({ length: 1, sampleRate: 44100 });
        
        const duration = 0.2;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            // Low buzz
            data[i] = Math.sin(2 * Math.PI * 100 * t) * 0.3 * Math.exp(-t * 2);
        }
        
        return buffer;
    }
    
    private createSuccessSound(): AudioBuffer {
        if (!this.audioContext) return new AudioBuffer({ length: 1, sampleRate: 44100 });
        
        const duration = 0.8;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        const notes = [523.25, 659.25, 783.99]; // C, E, G
        
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            let sample = 0;
            
            notes.forEach((freq, index) => {
                const noteStart = index * 0.2;
                if (t >= noteStart) {
                    const noteT = t - noteStart;
                    sample += Math.sin(2 * Math.PI * freq * noteT) * 
                             Math.exp(-noteT * 2) * 0.3;
                }
            });
            
            data[i] = sample;
        }
        
        return buffer;
    }
    
    play(soundName: string) {
        if (!this.audioContext || !this.sounds.has(soundName)) return;
        
        const buffer = this.sounds.get(soundName)!;
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(this.audioContext.destination);
        source.start();
    }
} 