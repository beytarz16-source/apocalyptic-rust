class AudioManager {
    constructor() {
        this.sounds = {};
        this.masterVolume = 0.7;
        this.init();
    }

    init() {
        // Web Audio API context
        this.audioContext = null;
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
        }

        // Ses efektleri için placeholder'lar
        // Gerçek ses dosyaları eklendiğinde buraya yüklenecek
        this.createPlaceholderSounds();
    }

    createPlaceholderSounds() {
        // Basit ses efektleri oluştur (synthesized)
        // Gerçek ses dosyaları için: this.loadSound('shoot', 'sounds/shoot.mp3');
    }

    loadSound(name, url) {
        return new Promise((resolve, reject) => {
            const audio = new Audio(url);
            audio.volume = this.masterVolume;
            this.sounds[name] = audio;
            audio.addEventListener('canplaythrough', () => resolve(audio));
            audio.addEventListener('error', reject);
        });
    }

    playSound(name, volume = 1.0) {
        if (!this.sounds[name]) {
            // Placeholder ses oluştur
            this.createSynthesizedSound(name);
            return;
        }

        const sound = this.sounds[name].cloneNode();
        sound.volume = this.masterVolume * volume;
        sound.play().catch(e => console.warn('Sound play failed:', e));
    }

    createSynthesizedSound(type) {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        switch (type) {
            case 'shoot':
                oscillator.type = 'square';
                oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.1);
                break;

            case 'reload':
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(100, this.audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.3);
                break;

            case 'footstep':
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(50, this.audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.02, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.1);
                break;

            case 'loot':
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.2);
                break;
        }
    }

    setVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
    }
}

window.audioManager = new AudioManager();

