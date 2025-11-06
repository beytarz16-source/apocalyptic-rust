class MapSystem {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.isOpen = false;
        this.playerPosition = { x: 0, z: 0 };
        this.mapSize = 1000; // World size
        this.init();
    }

    init() {
        this.canvas = document.getElementById('mapCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size
        this.resize();
        window.addEventListener('resize', () => this.resize());

        document.getElementById('closeMap').addEventListener('click', () => this.close());
        
        // Toggle on M key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'm' || e.key === 'M') {
                if (this.isOpen) {
                    this.close();
                } else {
                    this.open();
                }
            }
        });
    }

    resize() {
        const maxWidth = window.innerWidth * 0.9;
        const maxHeight = window.innerHeight * 0.8;
        const size = Math.min(maxWidth, maxHeight, 1200);
        this.canvas.width = size;
        this.canvas.height = size;
        this.render();
    }

    open() {
        if (document.getElementById('pauseMenu').classList.contains('hidden') === false) return;
        if (document.getElementById('inventory').classList.contains('hidden') === false) return;
        
        this.isOpen = true;
        document.getElementById('map').classList.remove('hidden');
        this.render();
    }

    close() {
        this.isOpen = false;
        document.getElementById('map').classList.add('hidden');
    }

    updatePlayerPosition(x, z) {
        this.playerPosition = { x, z };
        if (this.isOpen) {
            this.render();
        }
    }

    render() {
        if (!this.ctx) return;

        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;

        // Clear canvas
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, width, height);

        // Draw grid
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 1;
        const gridSize = 10;
        for (let i = 0; i <= gridSize; i++) {
            const pos = (i / gridSize) * width;
            ctx.beginPath();
            ctx.moveTo(pos, 0);
            ctx.lineTo(pos, height);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, pos);
            ctx.lineTo(width, pos);
            ctx.stroke();
        }

        // Draw buildings/landmarks (simplified)
        ctx.fillStyle = '#666';
        const buildings = [
            { x: 200, z: 200 },
            { x: -300, z: 150 },
            { x: 400, z: -200 },
            { x: -250, z: -350 }
        ];

        buildings.forEach(building => {
            const screenX = ((building.x + this.mapSize / 2) / this.mapSize) * width;
            const screenZ = ((building.z + this.mapSize / 2) / this.mapSize) * height;
            ctx.fillRect(screenX - 5, screenZ - 5, 10, 10);
        });

        // Draw player position
        const playerScreenX = ((this.playerPosition.x + this.mapSize / 2) / this.mapSize) * width;
        const playerScreenZ = ((this.playerPosition.z + this.mapSize / 2) / this.mapSize) * height;
        
        ctx.fillStyle = '#ff4444';
        ctx.beginPath();
        ctx.arc(playerScreenX, playerScreenZ, 8, 0, Math.PI * 2);
        ctx.fill();

        // Draw player direction indicator
        ctx.strokeStyle = '#ff4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(playerScreenX, playerScreenZ);
        ctx.lineTo(playerScreenX, playerScreenZ - 15);
        ctx.stroke();

        // Draw other players if available
        if (window.game && window.game.otherPlayers) {
            ctx.fillStyle = '#ffff00';
            Object.values(window.game.otherPlayers).forEach(player => {
                const screenX = ((player.position.x + this.mapSize / 2) / this.mapSize) * width;
                const screenZ = ((player.position.z + this.mapSize / 2) / this.mapSize) * height;
                ctx.beginPath();
                ctx.arc(screenX, screenZ, 6, 0, Math.PI * 2);
                ctx.fill();
            });
        }

        // Draw map border
        ctx.strokeStyle = '#8b4513';
        ctx.lineWidth = 3;
        ctx.strokeRect(0, 0, width, height);

        // Draw compass
        ctx.fillStyle = '#cd853f';
        ctx.font = '16px Arial';
        ctx.fillText('N', width / 2, 30);
        ctx.fillText('S', width / 2, height - 10);
        ctx.fillText('W', 10, height / 2);
        ctx.fillText('E', width - 20, height / 2);
    }
}

window.mapSystem = new MapSystem();


