class Game {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.player = null;
        this.socket = null;
        this.otherPlayers = {};
        this.lootItems = {};
        this.animationId = null;
        this.lastUpdateTime = 0;
        this.interactionRange = 3;
        this.nearbyLoot = null;
    }

    init() {
        if (!window.auth || !window.auth.getToken()) {
            console.error('Not authenticated');
            return;
        }

        this.setupScene();
        this.setupLighting();
        this.createWorld();
        this.setupPlayer();
        this.setupSocket();
        this.setupControls();
        this.animate();
    }

    setupScene() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x2a2a2a);
        this.scene.fog = new THREE.FogExp2(0x2a2a2a, 0.02);

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        const container = document.getElementById('gameContainer');
        container.appendChild(this.renderer.domElement);

        // Handle resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);

        // Directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xcd853f, 0.6);
        directionalLight.position.set(50, 100, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 500;
        directionalLight.shadow.camera.left = -100;
        directionalLight.shadow.camera.right = 100;
        directionalLight.shadow.camera.top = 100;
        directionalLight.shadow.camera.bottom = -100;
        this.scene.add(directionalLight);

        // Point lights for atmosphere
        const pointLight1 = new THREE.PointLight(0xff4444, 0.3, 50);
        pointLight1.position.set(20, 5, 20);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x4444ff, 0.2, 50);
        pointLight2.position.set(-20, 5, -20);
        this.scene.add(pointLight2);
    }

    createWorld() {
        // Ground
        const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x3a3a3a,
            roughness: 0.9,
            metalness: 0.1
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Buildings
        this.createBuildings();
    }

    createBuildings() {
        const buildingPositions = [
            { x: 20, z: 20, width: 10, height: 15, depth: 10 },
            { x: -30, z: 25, width: 12, height: 20, depth: 12 },
            { x: 40, z: -30, width: 15, height: 18, depth: 15 },
            { x: -25, z: -40, width: 8, height: 12, depth: 8 }
        ];

        buildingPositions.forEach(pos => {
            const geometry = new THREE.BoxGeometry(pos.width, pos.height, pos.depth);
            const material = new THREE.MeshStandardMaterial({
                color: 0x555555,
                roughness: 0.8,
                metalness: 0.2
            });
            const building = new THREE.Mesh(geometry, material);
            building.position.set(pos.x, pos.height / 2, pos.z);
            building.castShadow = true;
            building.receiveShadow = true;
            this.scene.add(building);

            // Add windows
            for (let i = 0; i < 3; i++) {
                const windowGeometry = new THREE.PlaneGeometry(1, 1);
                const windowMaterial = new THREE.MeshBasicMaterial({
                    color: 0x1a1a1a,
                    transparent: true,
                    opacity: 0.8
                });
                const window = new THREE.Mesh(windowGeometry, windowMaterial);
                window.position.set(
                    pos.x + (Math.random() - 0.5) * pos.width,
                    pos.height * 0.3 + i * 4,
                    pos.z + pos.depth / 2 + 0.01
                );
                this.scene.add(window);
            }
        });
    }

    setupPlayer() {
        this.player = new Player(this.scene, this.camera);
    }

    setupSocket() {
        // Socket.io bağlantısını otomatik algıla
        const socketUrl = window.location.origin;
        this.socket = io(socketUrl);

        this.socket.on('connect', () => {
            console.log('Connected to server');
            this.socket.emit('player:join', {
                username: window.auth.getUsername()
            });
        });

        this.socket.on('game:state', (data) => {
            // Initialize other players
            data.players.forEach(player => {
                if (player.id !== this.socket.id) {
                    this.addOtherPlayer(player);
                }
            });

            // Initialize loot
            data.loot.forEach(loot => {
                this.addLootItem(loot);
            });
        });

        this.socket.on('player:joined', (player) => {
            this.addOtherPlayer(player);
        });

        this.socket.on('player:moved', (data) => {
            if (this.otherPlayers[data.id]) {
                this.otherPlayers[data.id].position = data.position;
                this.otherPlayers[data.id].rotation = data.rotation;
            }
        });

        this.socket.on('player:left', (playerId) => {
            this.removeOtherPlayer(playerId);
        });

        this.socket.on('loot:collected', (data) => {
            if (this.lootItems[data.lootId]) {
                this.scene.remove(this.lootItems[data.lootId].mesh);
                if (this.lootItems[data.lootId].glow) {
                    this.scene.remove(this.lootItems[data.lootId].glow);
                }
                
                // If this player collected it, add to inventory
                if (data.playerId === this.socket.id && window.inventory && data.item) {
                    window.inventory.addItem(data.item);
                }
                
                delete this.lootItems[data.lootId];
            }
        });

        this.socket.on('loot:spawned', (data) => {
            this.addLootItem(data);
        });
    }

    addOtherPlayer(player) {
        // Create player model similar to main player
        const bodyGeometry = new THREE.CylinderGeometry(0.4, 0.4, 1.2, 8);
        const headGeometry = new THREE.SphereGeometry(0.3, 8, 8);
        const material = new THREE.MeshStandardMaterial({ color: 0xffff00 });
        
        const body = new THREE.Mesh(bodyGeometry, material);
        body.position.y = 0.6;
        
        const head = new THREE.Mesh(headGeometry, material);
        head.position.y = 1.5;
        
        const mesh = new THREE.Group();
        mesh.add(body);
        mesh.add(head);
        mesh.position.set(player.position.x, player.position.y, player.position.z);
        this.scene.add(mesh);

        this.otherPlayers[player.id] = {
            ...player,
            mesh: mesh
        };
    }

    removeOtherPlayer(playerId) {
        if (this.otherPlayers[playerId]) {
            this.scene.remove(this.otherPlayers[playerId].mesh);
            delete this.otherPlayers[playerId];
        }
    }

    addLootItem(loot) {
        const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x00ff00,
            emissive: 0x004400
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(loot.position.x, loot.position.y + 0.25, loot.position.z);
        mesh.castShadow = true;
        this.scene.add(mesh);

        // Add glow effect
        const glowGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.3
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.copy(mesh.position);
        this.scene.add(glow);

        this.lootItems[loot.id] = {
            ...loot,
            mesh: mesh,
            glow: glow
        };
    }

    setupControls() {
        // Shooting
        document.addEventListener('mousedown', (e) => {
            if (e.button === 0 && document.getElementById('inventory').classList.contains('hidden')) {
                this.shoot();
            }
        });

        // Aiming
        document.addEventListener('mousedown', (e) => {
            if (e.button === 2) {
                if (window.weaponSystem) {
                    window.weaponSystem.isAiming = true;
                }
            }
        });

        document.addEventListener('mouseup', (e) => {
            if (e.button === 2) {
                if (window.weaponSystem) {
                    window.weaponSystem.isAiming = false;
                }
            }
        });

        // Reload
        document.addEventListener('keydown', (e) => {
            if (e.key === 'r' || e.key === 'R') {
                if (window.weaponSystem) {
                    window.weaponSystem.reload();
                }
            }
        });

        // Interaction
        document.addEventListener('keydown', (e) => {
            if (e.key === 'f' || e.key === 'F') {
                this.interact();
            }
        });

        // Pause menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.togglePause();
            }
        });

        // Prevent context menu
        document.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    shoot() {
        if (!window.weaponSystem || !window.weaponSystem.canShoot()) return;

        const shot = window.weaponSystem.shoot();
        if (!shot) return;

        // Calculate direction
        const direction = new THREE.Vector3(0, 0, -1);
        direction.applyQuaternion(this.camera.quaternion);

        // Send to server
        if (this.socket) {
            this.socket.emit('player:shoot', {
                position: this.player.position,
                direction: { x: direction.x, y: direction.y, z: direction.z }
            });
        }

        // Visual feedback
        this.camera.rotation.x += window.weaponSystem.getRecoil() * 0.1;
    }

    interact() {
        if (!this.nearbyLoot) return;

        if (this.socket) {
            this.socket.emit('player:loot', this.nearbyLoot);
        }
    }

    togglePause() {
        const pauseMenu = document.getElementById('pauseMenu');
        if (pauseMenu.classList.contains('hidden')) {
            pauseMenu.classList.remove('hidden');
            document.exitPointerLock();
        } else {
            pauseMenu.classList.add('hidden');
        }
    }

    updateHUD() {
        if (!this.player) return;

        // Health
        const healthBar = document.getElementById('healthBar');
        const healthValue = document.getElementById('healthValue');
        healthBar.style.width = `${this.player.health}%`;
        healthValue.textContent = Math.round(this.player.health);

        // Armor
        const armorBar = document.getElementById('armorBar');
        const armorValue = document.getElementById('armorValue');
        armorBar.style.width = `${this.player.armor}%`;
        armorValue.textContent = Math.round(this.player.armor);

        // Hunger
        const hungerBar = document.getElementById('hungerBar');
        const hungerValue = document.getElementById('hungerValue');
        hungerBar.style.width = `${this.player.hunger}%`;
        hungerValue.textContent = Math.round(this.player.hunger);

        // Thirst
        const thirstBar = document.getElementById('thirstBar');
        const thirstValue = document.getElementById('thirstValue');
        thirstBar.style.width = `${this.player.thirst}%`;
        thirstValue.textContent = Math.round(this.player.thirst);
    }

    checkLootProximity() {
        this.nearbyLoot = null;
        const prompt = document.getElementById('interactionPrompt');

        Object.values(this.lootItems).forEach(loot => {
            if (!loot.mesh) return;

            const distance = Math.sqrt(
                Math.pow(this.player.position.x - loot.position.x, 2) +
                Math.pow(this.player.position.z - loot.position.z, 2)
            );

            if (distance < this.interactionRange) {
                this.nearbyLoot = loot.id;
                prompt.classList.remove('hidden');
                return;
            }
        });

        if (!this.nearbyLoot) {
            prompt.classList.add('hidden');
        }
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        const currentTime = performance.now();
        const deltaTime = Math.min((currentTime - this.lastUpdateTime) / 1000, 0.1);
        this.lastUpdateTime = currentTime;

        if (this.player) {
            this.player.update(deltaTime);
            this.updateHUD();
            this.checkLootProximity();

            // Update other players
            Object.values(this.otherPlayers).forEach(otherPlayer => {
                if (otherPlayer.mesh) {
                    otherPlayer.mesh.position.set(
                        otherPlayer.position.x,
                        otherPlayer.position.y,
                        otherPlayer.position.z
                    );
                    otherPlayer.mesh.rotation.y = otherPlayer.rotation.y;
                }
            });

            // Send position to server
            if (this.socket && this.socket.connected) {
                this.socket.emit('player:move', {
                    position: this.player.position,
                    rotation: this.player.rotation
                });
            }

            // Update map
            if (window.mapSystem) {
                window.mapSystem.updatePlayerPosition(this.player.position.x, this.player.position.z);
            }
        }

        this.renderer.render(this.scene, this.camera);
    }
}

window.game = new Game();

