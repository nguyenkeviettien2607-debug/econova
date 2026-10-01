/**
 * ECONOVA - Audio Synthesizer Engine (Web Audio API)
 * Procedurally generates all game sound effects, ambiances, alarms, and musical fanfares
 * without any external audio file dependencies.
 */
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.muted = false;
        this.bgmPlaying = false;
        this.bgmTimer = null;
        this.initOnUserGesture();
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    initOnUserGesture() {
        const unlock = () => {
            this.init();
            window.removeEventListener('click', unlock);
            window.removeEventListener('keydown', unlock);
            window.removeEventListener('touchstart', unlock);
        };
        window.addEventListener('click', unlock);
        window.addEventListener('keydown', unlock);
        window.addEventListener('touchstart', unlock);
    }

    toggleMute() {
        this.muted = !this.muted;
        if (this.muted && this.bgmPlaying) {
            this.stopBgm();
        } else if (!this.muted && !this.bgmPlaying) {
            this.startBgm();
        }
        return this.muted;
    }

    // --- SOUND EFFECTS ---

    // 1. Dice Roll Sound (Tumbling wooden/resin dice clicks + thump)
    playDiceRoll() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        const clicks = 8 + Math.floor(Math.random() * 4);
        for (let i = 0; i < clicks; i++) {
            const clickTime = now + (i * 0.08) + (Math.random() * 0.03);
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(450 + Math.random() * 350, clickTime);
            osc.frequency.exponentialRampToValueAtTime(120, clickTime + 0.03);

            gain.gain.setValueAtTime(0.3, clickTime);
            gain.gain.exponentialRampToValueAtTime(0.001, clickTime + 0.03);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(clickTime);
            osc.stop(clickTime + 0.035);
        }

        // Final thump
        const thumpTime = now + 0.7;
        const thumpOsc = this.ctx.createOscillator();
        const thumpGain = this.ctx.createGain();
        thumpOsc.type = 'sine';
        thumpOsc.frequency.setValueAtTime(160, thumpTime);
        thumpOsc.frequency.exponentialRampToValueAtTime(40, thumpTime + 0.15);
        thumpGain.gain.setValueAtTime(0.4, thumpTime);
        thumpGain.gain.exponentialRampToValueAtTime(0.001, thumpTime + 0.15);
        thumpOsc.connect(thumpGain);
        thumpGain.connect(this.ctx.destination);
        thumpOsc.start(thumpTime);
        thumpOsc.stop(thumpTime + 0.16);
    }

    // 2. Token Step / Hop Sound
    playPawnStep() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(540, now + 0.05);
        osc.frequency.exponentialRampToValueAtTime(240, now + 0.09);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.1);
    }

    // 3. Card Draw Whoosh & Flip
    playCardDraw() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;

        // White noise whoosh
        const bufferSize = this.ctx.sampleRate * 0.15;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1000, now);
        filter.frequency.exponentialRampToValueAtTime(3500, now + 0.12);
        filter.Q.value = 3;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

        whiteNoise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        whiteNoise.start(now);
        whiteNoise.stop(now + 0.15);

        // Chime flip
        setTimeout(() => {
            if (this.muted) return;
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, t);
            osc.frequency.exponentialRampToValueAtTime(1760, t + 0.08);
            g.gain.setValueAtTime(0.2, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
            osc.connect(g);
            g.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.15);
        }, 120);
    }

    // 4. Positive / Green Item Chime (Lush arpeggio)
    playCardSuccess() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
        notes.forEach((freq, idx) => {
            const t = now + idx * 0.07;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t);

            gain.gain.setValueAtTime(0.22, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(t);
            osc.stop(t + 0.36);
        });
    }

    // 5. Red Alert / Crisis Warning Pulse
    playAlert() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        for (let i = 0; i < 2; i++) {
            const t = now + i * 0.22;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(320, t);
            osc.frequency.linearRampToValueAtTime(220, t + 0.18);

            gain.gain.setValueAtTime(0.25, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(t);
            osc.stop(t + 0.2);
        }
    }

    // 6. Forest Zone Ambient Effect (Gentle bird chirp / twig rustle)
    playForestFX() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1600, now);
        osc.frequency.exponentialRampToValueAtTime(2400, now + 0.05);
        osc.frequency.exponentialRampToValueAtTime(1900, now + 0.12);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.16);
    }

    // 7. Ocean Zone Water Splash / Ripple
    playOceanFX() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(420, now);
        osc.frequency.exponentialRampToValueAtTime(260, now + 0.15);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
    }

    // 8. Urban Tech / Hologram Laser Sweep
    playTechFX() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(700, now);
        osc.frequency.exponentialRampToValueAtTime(2200, now + 0.08);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.15);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.17);
    }

    // 9. Crafting Fusion Spark Sound
    playCraftSuccess() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        // Ascending harmonic chords
        const chords = [
            [440, 554.37, 659.25], // A maj
            [523.25, 659.25, 783.99], // C maj
            [587.33, 739.99, 880.00]  // D maj
        ];
        chords.forEach((chord, i) => {
            const chordTime = now + i * 0.14;
            chord.forEach(freq => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, chordTime);
                gain.gain.setValueAtTime(0.18, chordTime);
                gain.gain.exponentialRampToValueAtTime(0.001, chordTime + 0.35);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(chordTime);
                osc.stop(chordTime + 0.36);
            });
        });
    }

    // 10. Epic Gaia Green Aurora Storm Fanfare
    playGaiaStorm() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        const victoryNotes = [
            523.25, 659.25, 783.99, 1046.50, // C-E-G-C
            1174.66, 1318.51, 1567.98, 2093.00 // D-E-G-C (High shimmer)
        ];
        victoryNotes.forEach((freq, idx) => {
            const noteTime = now + idx * 0.09;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, noteTime);
            gain.gain.setValueAtTime(0.25, noteTime);
            gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.7);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(noteTime);
            osc.stop(noteTime + 0.72);
        });
    }

    // 11. EcoBot Beep & Chirp
    playBotChat() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        const freqs = [700, 1100, 950];
        freqs.forEach((f, i) => {
            const t = now + i * 0.04;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, t);
            gain.gain.setValueAtTime(0.12, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.06);
        });
    }

    // Ambient procedurally generated tranquil nature soundtrack
    startBgm() {
        if (this.muted || this.bgmPlaying) return;
        this.init();
        this.bgmPlaying = true;
        const playPad = () => {
            if (!this.bgmPlaying || this.muted) return;
            const chords = [
                [261.63, 329.63, 392.00, 523.25], // C maj
                [220.00, 261.63, 329.63, 440.00], // A min
                [174.61, 220.00, 261.63, 349.23], // F maj
                [196.00, 246.94, 293.66, 392.00]  // G maj
            ];
            const chord = chords[Math.floor(Math.random() * chords.length)];
            const now = this.ctx.currentTime;
            chord.forEach(freq => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now);
                gain.gain.setValueAtTime(0.001, now);
                gain.gain.linearRampToValueAtTime(0.04, now + 1.2);
                gain.gain.linearRampToValueAtTime(0.001, now + 4.5);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now);
                osc.stop(now + 4.6);
            });
            this.bgmTimer = setTimeout(playPad, 4200);
        };
        playPad();
    }

    stopBgm() {
        this.bgmPlaying = false;
        if (this.bgmTimer) {
            clearTimeout(this.bgmTimer);
            this.bgmTimer = null;
        }
    }
}

// Global sound manager instance
window.soundEngine = new SoundEngine();
