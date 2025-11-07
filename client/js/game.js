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
        this.particleSystem = null;
        this.textureLoader = null;
        this.gltfLoader = null;
        this.lootChests = {}; // Sandık sistemi
        this.modelLoader = null; // Model yükleme sistemi
        this.collisionObjects = []; // Collision detection için objeler
    }

    async init() {
        console.log('Game init başlatılıyor...');
        
        if (!window.auth || !window.auth.getToken()) {
            console.error('Not authenticated');
            return;
        }

        try {
            this.setupScene();
            
            // Scene oluşturuldu mu kontrol et
            if (!this.scene) {
                console.error('Scene oluşturulamadı!');
                return;
            }
            
            // ModelLoader'ı initialize et
            if (typeof ModelLoader !== 'undefined') {
                this.modelLoader = new ModelLoader(this.scene);
                console.log('ModelLoader initialized');
            } else {
                console.warn('ModelLoader class yüklenmedi!');
            }
            
            this.setupLighting();
            await this.createWorld();
            await this.setupPlayer();
            this.setupSocket();
            this.setupControls();
            this.animate();
            
            console.log('Game başarıyla başlatıldı!');
        } catch (error) {
            console.error('Game init hatası:', error);
            console.error('Stack trace:', error.stack);
        }
    }

    setupScene() {
        // THREE.js kontrolü
        if (typeof THREE === 'undefined') {
            console.error('THREE.js yüklenmedi!');
            return;
        }

        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x2a2a2a);
        this.scene.fog = new THREE.FogExp2(0x2a2a2a, 0.02);

        // Texture loader
        this.textureLoader = new THREE.TextureLoader();

        // GLTF loader (CDN'den yüklenecek - HTML'de script tag'i var)
        // GLTF Loader yüklendikten sonra kullanılabilir
        this.gltfLoader = null;
        if (typeof THREE !== 'undefined' && THREE.GLTFLoader) {
            this.gltfLoader = new THREE.GLTFLoader();
        } else {
            // Script yüklendikten sonra kontrol et
            setTimeout(() => {
                if (typeof THREE !== 'undefined' && THREE.GLTFLoader) {
                    this.gltfLoader = new THREE.GLTFLoader();
                    console.log('GLTF Loader loaded');
                }
            }, 1000);
        }

        // Particle system (try-catch ile güvenli yükleme)
        try {
            if (typeof ParticleSystem !== 'undefined') {
                this.particleSystem = new ParticleSystem(this.scene);
            } else {
                console.warn('ParticleSystem yüklenmedi, parçacık efektleri devre dışı');
                this.particleSystem = null;
            }
        } catch (error) {
            console.error('ParticleSystem hatası:', error);
            this.particleSystem = null;
        }

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

    async createWorld() {
        // Ground with texture variation
        const groundGeometry = new THREE.PlaneGeometry(1000, 1000, 50, 50);
        
        // Texture oluştur (procedural)
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // Zemin texture'ı (beton/asfalt görünümü)
        const gradient = ctx.createLinearGradient(0, 0, 512, 512);
        gradient.addColorStop(0, '#2a2a2a');
        gradient.addColorStop(0.5, '#3a3a3a');
        gradient.addColorStop(1, '#2a2a2a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 512, 512);
        
        // Noise ekle
        const imageData = ctx.getImageData(0, 0, 512, 512);
        for (let i = 0; i < imageData.data.length; i += 4) {
            const noise = (Math.random() - 0.5) * 20;
            imageData.data[i] = Math.max(0, Math.min(255, imageData.data[i] + noise));
            imageData.data[i + 1] = Math.max(0, Math.min(255, imageData.data[i + 1] + noise));
            imageData.data[i + 2] = Math.max(0, Math.min(255, imageData.data[i + 2] + noise));
        }
        ctx.putImageData(imageData, 0, 0);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(20, 20);
        
        const groundMaterial = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.9,
            metalness: 0.1
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Yollar (opsiyonel)
        this.createRoads();

        // Buildings
        await this.createBuildings();

        // Çevre detayları (araçlar, çöp, vb.)
        await this.createEnvironmentDetails();
        
        // Konteynerler, çöp kutuları, ağaçlar
        await this.createAdditionalObjects();
    }

    createRoads() {
        // Ana yol texture'ı
        const roadCanvas = document.createElement('canvas');
        roadCanvas.width = 512;
        roadCanvas.height = 64;
        const roadCtx = roadCanvas.getContext('2d');
        roadCtx.fillStyle = '#1a1a1a';
        roadCtx.fillRect(0, 0, 512, 64);
        
        // Yol çizgileri
        roadCtx.fillStyle = '#ffff00';
        for (let i = 0; i < 512; i += 40) {
            roadCtx.fillRect(i, 30, 20, 4);
        }
        
        const roadTexture = new THREE.CanvasTexture(roadCanvas);
        roadTexture.wrapS = THREE.RepeatWrapping;
        roadTexture.wrapT = THREE.RepeatWrapping;
        roadTexture.repeat.set(10, 1);
        
        // Ana yol
        const roadGeometry = new THREE.PlaneGeometry(200, 8);
        const roadMaterial = new THREE.MeshStandardMaterial({
            map: roadTexture,
            roughness: 0.7
        });
        const mainRoad = new THREE.Mesh(roadGeometry, roadMaterial);
        mainRoad.rotation.x = -Math.PI / 2;
        mainRoad.position.set(0, 0.01, 0);
        this.scene.add(mainRoad);
    }

    async createEnvironmentDetails() {
        // Terk edilmiş araçlar
        const carPositions = [
            { x: 15, z: 5, rotation: Math.PI / 4 },
            { x: -20, z: 15, rotation: -Math.PI / 3 },
            { x: 35, z: -25, rotation: Math.PI / 2 },
            { x: -40, z: -30, rotation: Math.PI },
            { x: 50, z: 20, rotation: -Math.PI / 4 }
        ];

        for (const pos of carPositions) {
            let carGroup = null;
            
            // GLTF model yükleme
            if (this.modelLoader) {
                try {
                    const model = await this.modelLoader.loadModel('object', 'car');
                    if (model) {
                        model.scale.set(1, 1, 1);
                        carGroup = model;
                    }
                } catch (error) {
                    console.warn('Araba modeli yüklenemedi, procedural kullanılıyor');
                }
            }
            
            // Fallback: Procedural
            if (!carGroup) {
                carGroup = new THREE.Group();
                
                // Araba gövdesi
                const bodyGeometry = new THREE.BoxGeometry(4, 1.5, 2);
                const bodyMaterial = new THREE.MeshStandardMaterial({
                    color: 0x444444,
                    roughness: 0.8
                });
                const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
                body.position.y = 0.75;
                carGroup.add(body);

                // Tekerlekler
                const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
                const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
                const positions = [
                    { x: 1.2, z: 1.1 },
                    { x: -1.2, z: 1.1 },
                    { x: 1.2, z: -1.1 },
                    { x: -1.2, z: -1.1 }
                ];
                positions.forEach(wheelPos => {
                    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
                    wheel.rotation.z = Math.PI / 2;
                    wheel.position.set(wheelPos.x, 0.4, wheelPos.z);
                    carGroup.add(wheel);
                });
            }

            carGroup.position.set(pos.x, 0, pos.z);
            carGroup.rotation.y = pos.rotation;
            carGroup.castShadow = true;
            carGroup.receiveShadow = true;
            this.scene.add(carGroup);
            
            // Collision box ekle (araba: ~4m x 2m x 1.5m)
            this.collisionObjects.push({
                type: 'box',
                position: { x: pos.x, y: 0.75, z: pos.z },
                size: { width: 4, height: 1.5, depth: 2 }
            });
        }

        // Çöp ve moloz (gerçekçi boyutlar)
        for (let i = 0; i < 20; i++) {
            const debrisGeometry = new THREE.BoxGeometry(
                0.3 + Math.random() * 0.5, // 0.3-0.8m
                0.2 + Math.random() * 0.3, // 0.2-0.5m
                0.3 + Math.random() * 0.5  // 0.3-0.8m
            );
            const debrisMaterial = new THREE.MeshStandardMaterial({
                color: new THREE.Color().setHSL(0, 0, 0.2 + Math.random() * 0.3),
                roughness: 0.9
            });
            const debris = new THREE.Mesh(debrisGeometry, debrisMaterial);
            debris.position.set(
                (Math.random() - 0.5) * 200,
                0.15,
                (Math.random() - 0.5) * 200
            );
            debris.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            this.scene.add(debris);
        }

        // Sokak lambaları
        for (let i = 0; i < 15; i++) {
            const lampGroup = new THREE.Group();
            
            // Direk
            const poleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 4, 8);
            const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
            const pole = new THREE.Mesh(poleGeometry, poleMaterial);
            pole.position.y = 2;
            lampGroup.add(pole);
            
            // Lamba
            const lampGeometry = new THREE.SphereGeometry(0.3, 8, 8);
            const lampMaterial = new THREE.MeshStandardMaterial({ 
                color: 0xffffaa,
                emissive: 0xffffaa,
                emissiveIntensity: 0.5
            });
            const lamp = new THREE.Mesh(lampGeometry, lampMaterial);
            lamp.position.y = 4;
            lampGroup.add(lamp);
            
            // Işık
            const light = new THREE.PointLight(0xffffaa, 0.5, 10);
            light.position.y = 4;
            lampGroup.add(light);
            
            lampGroup.position.set(
                (Math.random() - 0.5) * 150,
                0,
                (Math.random() - 0.5) * 150
            );
            this.scene.add(lampGroup);
        }

        // Çitler ve bariyerler
        for (let i = 0; i < 10; i++) {
            let barrierGroup = null;
            
            // GLTF bariyer modeli yükleme (her 3 bariyerden birini GLTF ile yükle)
            if (this.modelLoader && i % 3 === 0) {
                try {
                    const model = await this.modelLoader.loadModel('object', 'barriers');
                    if (model) {
                        model.scale.set(1, 1, 1);
                        barrierGroup = model;
                    }
                } catch (error) {
                    console.warn('Bariyer modeli yüklenemedi, procedural kullanılıyor');
                }
            }
            
            // Fallback: Procedural
            if (!barrierGroup) {
                barrierGroup = new THREE.Group();
                const fenceLength = 5 + Math.random() * 5;
                
                for (let j = 0; j < fenceLength; j++) {
                    const postGeometry = new THREE.BoxGeometry(0.1, 1, 0.1);
                    const postMaterial = new THREE.MeshStandardMaterial({ color: 0x4a4a4a });
                    const post = new THREE.Mesh(postGeometry, postMaterial);
                    post.position.set(j * 0.5, 0.5, 0);
                    barrierGroup.add(post);
                    
                    if (j < fenceLength - 1) {
                        const barGeometry = new THREE.BoxGeometry(0.5, 0.05, 0.05);
                        const bar = new THREE.Mesh(barGeometry, postMaterial);
                        bar.position.set(j * 0.5 + 0.25, 0.5, 0);
                        barrierGroup.add(bar);
                    }
                }
            }
            
            const barrierPos = {
                x: (Math.random() - 0.5) * 180,
                z: (Math.random() - 0.5) * 180
            };
            barrierGroup.position.set(barrierPos.x, 0, barrierPos.z);
            barrierGroup.rotation.y = Math.random() * Math.PI * 2;
            barrierGroup.castShadow = true;
            barrierGroup.receiveShadow = true;
            this.scene.add(barrierGroup);
            
            // Collision box ekle (bariyer: ~1.5m x 0.8m x 5m)
            this.collisionObjects.push({
                type: 'box',
                position: { x: barrierPos.x, y: 0.4, z: barrierPos.z },
                size: { width: 5, height: 0.8, depth: 1.5 }
            });
        }
    }

    async createAdditionalObjects() {
        // Konteynerler (gerçekçi: 2.4m x 2.4m x 6m)
        for (let i = 0; i < 8; i++) {
            const containerGroup = new THREE.Group();
            
            // Ana gövde
            const bodyGeometry = new THREE.BoxGeometry(2.4, 2.4, 6.0);
            const bodyMaterial = new THREE.MeshStandardMaterial({
                color: 0x444444,
                roughness: 0.7,
                metalness: 0.3
            });
            const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
            body.position.y = 1.2;
            containerGroup.add(body);
            
            // Kapı çerçevesi
            const doorFrameGeometry = new THREE.BoxGeometry(2.0, 2.0, 0.1);
            const doorFrame = new THREE.Mesh(doorFrameGeometry, new THREE.MeshStandardMaterial({ color: 0x333333 }));
            doorFrame.position.set(0, 1.2, 3.0);
            containerGroup.add(doorFrame);
            
            // Kaldırma köşeleri
            const cornerGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
            const cornerMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00, metalness: 0.9 });
            const corners = [
                { x: -1.1, z: -2.9 },
                { x: 1.1, z: -2.9 },
                { x: -1.1, z: 2.9 },
                { x: 1.1, z: 2.9 }
            ];
            corners.forEach(corner => {
                const cornerMesh = new THREE.Mesh(cornerGeometry, cornerMaterial);
                cornerMesh.position.set(corner.x, 2.4, corner.z);
                containerGroup.add(cornerMesh);
            });
            
            const containerPos = {
                x: (Math.random() - 0.5) * 150,
                z: (Math.random() - 0.5) * 150
            };
            containerGroup.position.set(containerPos.x, 0, containerPos.z);
            containerGroup.rotation.y = Math.random() * Math.PI * 2;
            this.scene.add(containerGroup);
            
            // Collision box ekle (konteyner: 2.4m x 2.4m x 6m)
            this.collisionObjects.push({
                type: 'box',
                position: { x: containerPos.x, y: 1.2, z: containerPos.z },
                size: { width: 2.4, height: 2.4, depth: 6.0 }
            });
        }

        // Çöp kutuları (gerçekçi: ~1m x 1m x 1.2m)
        for (let i = 0; i < 25; i++) {
            const trashGroup = new THREE.Group();
            
            // Ana gövde
            const trashGeometry = new THREE.BoxGeometry(1.0, 1.2, 1.0);
            const trashMaterial = new THREE.MeshStandardMaterial({
                color: 0x333333,
                roughness: 0.8
            });
            const trash = new THREE.Mesh(trashGeometry, trashMaterial);
            trash.position.y = 0.6;
            trashGroup.add(trash);
            
            // Kapak
            const lidGeometry = new THREE.BoxGeometry(1.05, 0.1, 1.05);
            const lid = new THREE.Mesh(lidGeometry, trashMaterial);
            lid.position.y = 1.25;
            trashGroup.add(lid);
            
            // Tutma kolu
            const handleGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8);
            const handle = new THREE.Mesh(handleGeometry, new THREE.MeshStandardMaterial({ color: 0x666666 }));
            handle.rotation.z = Math.PI / 2;
            handle.position.set(0, 1.3, 0.5);
            trashGroup.add(handle);
            
            trashGroup.position.set(
                (Math.random() - 0.5) * 180,
                0,
                (Math.random() - 0.5) * 180
            );
            this.scene.add(trashGroup);
        }

        // Ağaçlar (gerçekçi: ~0.5-1m gövde çapı, ~5-10m yükseklik)
        for (let i = 0; i < 50; i++) {
            let treeGroup = null;

            // GLTF model yükleme - TÜM ağaçlar için GLTF model yüklemeyi dene
            if (this.modelLoader) {
                try {
                    const model = await this.modelLoader.loadModel('object', 'tree');
                    if (model) {
                        model.scale.set(1, 1, 1);
                        treeGroup = model;
                        console.log(`✅ Ağaç GLTF modeli yüklendi: ${i + 1}/50`);
                    }
                } catch (error) {
                    console.warn(`Ağaç modeli yüklenemedi (${i + 1}/50), procedural kullanılıyor:`, error);
                }
            }

            // Fallback: Procedural (GLTF yüklenemezse)
            if (!treeGroup) {
                treeGroup = new THREE.Group();
            
                // Gövde (gerçekçi: ~0.3-0.6m çap, ~4-8m yükseklik)
                const trunkHeight = 4 + Math.random() * 4;
                const trunkRadius = 0.15 + Math.random() * 0.15;
                const trunkGeometry = new THREE.CylinderGeometry(trunkRadius, trunkRadius * 1.2, trunkHeight, 8);
                const trunkMaterial = new THREE.MeshStandardMaterial({
                    color: 0x4a2c1a,
                    roughness: 0.9
                });
                const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
                trunk.position.y = trunkHeight / 2;
                treeGroup.add(trunk);
                
                // Yapraklar (taç) - gerçekçi: ~3-6m çap
                const crownSize = 2 + Math.random() * 2;
                const crownGeometry = new THREE.ConeGeometry(crownSize, crownSize * 1.5, 8);
                const crownMaterial = new THREE.MeshStandardMaterial({
                    color: 0x2d5016,
                    roughness: 0.8
                });
                const crown = new THREE.Mesh(crownGeometry, crownMaterial);
                crown.position.y = trunkHeight + crownSize * 0.5;
                treeGroup.add(crown);
                
                // İkinci katman (daha gerçekçi)
                const crown2Size = crownSize * 0.7;
                const crown2 = new THREE.Mesh(
                    new THREE.ConeGeometry(crown2Size, crown2Size * 1.2, 8),
                    crownMaterial
                );
                crown2.position.y = trunkHeight + crownSize * 0.3;
                treeGroup.add(crown2);
            }
            
            const treePos = {
                x: (Math.random() - 0.5) * 200,
                z: (Math.random() - 0.5) * 200
            };
            treeGroup.position.set(treePos.x, 0, treePos.z);
            treeGroup.castShadow = true;
            treeGroup.receiveShadow = true;
            this.scene.add(treeGroup);
            
            // Collision box ekle (ağaç: ~2-4m çap, ~4-8m yükseklik)
            const treeRadius = 1.5 + Math.random() * 1.5; // Taç genişliği
            const treeHeight = 4 + Math.random() * 4;
            this.collisionObjects.push({
                type: 'cylinder',
                position: { x: treePos.x, y: treeHeight / 2, z: treePos.z },
                size: { radius: treeRadius, height: treeHeight }
            });
        }
    }

    async createBuildings() {
        const buildingPositions = [
            { x: 20, z: 20, width: 10, height: 15, depth: 10, floors: 4, type: 'apartment' },
            { x: -30, z: 25, width: 12, height: 20, depth: 12, floors: 5, type: 'warehouse' },
            { x: 40, z: -30, width: 15, height: 18, depth: 15, floors: 4, type: 'apartment' },
            { x: -25, z: -40, width: 8, height: 12, depth: 8, floors: 3, type: 'apartment' },
            { x: 50, z: 30, width: 14, height: 16, depth: 14, floors: 4, type: 'warehouse' },
            { x: -40, z: -20, width: 10, height: 14, depth: 10, floors: 3, type: 'apartment' }
        ];

        for (const pos of buildingPositions) {
            // GLTF model yükleme - TÜM binalar için GLTF model yüklemeyi dene
            if (this.modelLoader) {
                try {
                    const model = await this.modelLoader.loadModel('building', pos.type);
                    if (model) {
                        // Model yüklendi, pozisyon ve ölçek ayarla
                        model.position.set(pos.x, 0, pos.z);
                        
                        // Warehouse için 9 derece yatır (ev olarak kullanılacak)
                        if (pos.type === 'warehouse') {
                            // 9 derece = 9 * Math.PI / 180 radyan
                            model.rotation.x = 9 * Math.PI / 180;
                            console.log(`🏠 Warehouse 9 derece yatırıldı ve ev olarak kullanılıyor: (${pos.x}, ${pos.z})`);
                            
                            // Warehouse içine loot ekle (bölge olarak kullanılacak)
                            this.addLootToWarehouse(pos);
                        }
                        
                        // Ölçeklendirme (GLTF modelleri için)
                        if (pos.width && pos.height && pos.depth) {
                            model.scale.set(pos.width / 10, pos.height / 10, pos.depth / 10);
                        }
                        
                        model.castShadow = true;
                        model.receiveShadow = true;
                        this.scene.add(model);
                        
                        // Collision box ekle
                        this.collisionObjects.push({
                            type: 'box',
                            position: { x: pos.x, y: pos.height / 2, z: pos.z },
                            size: { width: pos.width, height: pos.height, depth: pos.depth }
                        });
                        console.log(`✅ Bina GLTF modeli yüklendi: ${pos.type} at (${pos.x}, ${pos.z})`);
                        continue; // Bu bina için model kullanıldı
                    }
                } catch (error) {
                    console.warn(`Bina modeli yüklenemedi (${pos.type}), procedural kullanılıyor:`, error);
                }
            }
            // Fallback: Procedural bina
            this.createDetailedBuilding(pos);
        }
    }

    // Warehouse içine loot ekle (bölge olarak kullanılacak)
    addLootToWarehouse(buildingPos) {
        // Warehouse içine 3-5 loot item ekle
        const lootCount = 3 + Math.floor(Math.random() * 3); // 3-5 arası
        const lootTypes = ['weapon', 'ammo', 'food', 'water'];
        const weaponNames = ['M4A1', 'AK-47', 'Glock 17'];
        
        for (let i = 0; i < lootCount; i++) {
            // Warehouse içinde rastgele pozisyon (bina içinde)
            const offsetX = (Math.random() - 0.5) * (buildingPos.width * 0.6); // Bina genişliğinin %60'ı içinde
            const offsetZ = (Math.random() - 0.5) * (buildingPos.depth * 0.6); // Bina derinliğinin %60'ı içinde
            const lootY = 0.5 + Math.random() * 2; // Yerde veya biraz yukarıda
            
            const lootType = lootTypes[Math.floor(Math.random() * lootTypes.length)];
            let itemName = '';
            
            if (lootType === 'weapon') {
                itemName = weaponNames[Math.floor(Math.random() * weaponNames.length)];
            } else if (lootType === 'ammo') {
                itemName = 'Ammo Box';
            } else if (lootType === 'food') {
                itemName = 'Canned Food';
            } else if (lootType === 'water') {
                itemName = 'Water Bottle';
            }
            
            const loot = {
                id: `warehouse_loot_${buildingPos.x}_${buildingPos.z}_${i}`,
                position: {
                    x: buildingPos.x + offsetX,
                    y: lootY,
                    z: buildingPos.z + offsetZ
                },
                item: {
                    type: lootType,
                    name: itemName
                }
            };
            
            // Loot item'ı ekle
            this.addLootItem(loot);
            console.log(`🎁 Warehouse içine loot eklendi: ${lootType} (${itemName}) at (${loot.position.x.toFixed(1)}, ${loot.position.y.toFixed(1)}, ${loot.position.z.toFixed(1)})`);
        }
    }

    createDetailedBuilding(pos) {
        const buildingGroup = new THREE.Group();

        // Bina texture'ı oluştur
        const buildingCanvas = document.createElement('canvas');
        buildingCanvas.width = 256;
        buildingCanvas.height = 256;
        const buildingCtx = buildingCanvas.getContext('2d');
        
        // Beton görünümü
        const buildingGradient = buildingCtx.createLinearGradient(0, 0, 256, 256);
        buildingGradient.addColorStop(0, '#444444');
        buildingGradient.addColorStop(0.5, '#555555');
        buildingGradient.addColorStop(1, '#333333');
        buildingCtx.fillStyle = buildingGradient;
        buildingCtx.fillRect(0, 0, 256, 256);
        
        // Tuğla deseni
        buildingCtx.strokeStyle = '#333333';
        buildingCtx.lineWidth = 1;
        for (let y = 0; y < 256; y += 16) {
            buildingCtx.beginPath();
            buildingCtx.moveTo(0, y);
            buildingCtx.lineTo(256, y);
            buildingCtx.stroke();
        }
        for (let x = 0; x < 256; x += 32) {
            buildingCtx.beginPath();
            buildingCtx.moveTo(x, 0);
            buildingCtx.lineTo(x, 256);
            buildingCtx.stroke();
        }
        
        const buildingTexture = new THREE.CanvasTexture(buildingCanvas);
        buildingTexture.wrapS = THREE.RepeatWrapping;
        buildingTexture.wrapT = THREE.RepeatWrapping;
        buildingTexture.repeat.set(2, 4);
        
        // Ana bina gövdesi
        const geometry = new THREE.BoxGeometry(pos.width, pos.height, pos.depth);
        const material = new THREE.MeshStandardMaterial({
            map: buildingTexture,
            roughness: 0.8,
            metalness: 0.2
        });
        const building = new THREE.Mesh(geometry, material);
        building.position.y = pos.height / 2;
        building.castShadow = true;
        building.receiveShadow = true;
        buildingGroup.add(building);

        // Katlar arası çizgiler
        for (let i = 1; i < pos.floors; i++) {
            const floorLine = new THREE.Mesh(
                new THREE.BoxGeometry(pos.width + 0.1, 0.1, pos.depth + 0.1),
                new THREE.MeshStandardMaterial({ color: 0x333333 })
            );
            floorLine.position.y = (pos.height / pos.floors) * i;
            buildingGroup.add(floorLine);
        }

        // Pencereler (daha detaylı)
        const windowSpacing = pos.width / 4;
        const windowHeight = 1.5;
        const windowWidth = 0.8;
        
        for (let floor = 1; floor <= pos.floors; floor++) {
            for (let side = 0; side < 4; side++) {
                const windowCount = Math.floor(pos.width / windowSpacing);
                for (let i = 0; i < windowCount; i++) {
                    const windowGeometry = new THREE.PlaneGeometry(windowWidth, windowHeight);
                    const windowFrame = new THREE.Mesh(
                        new THREE.PlaneGeometry(windowWidth + 0.1, windowHeight + 0.1),
                        new THREE.MeshStandardMaterial({ color: 0x2a2a2a })
                    );
                    
                    const windowGlass = new THREE.Mesh(
                        windowGeometry,
                        new THREE.MeshStandardMaterial({
                            color: 0x1a1a1a,
                            transparent: true,
                            opacity: 0.6,
                            emissive: 0x000000,
                            emissiveIntensity: Math.random() * 0.3 // Bazı pencereler hafif ışıklı
                        })
                    );

                    let x, z, rotation;
                    if (side === 0) { // Ön
                        x = (i - windowCount / 2) * windowSpacing;
                        z = pos.depth / 2 + 0.01;
                        rotation = 0;
                    } else if (side === 1) { // Sağ
                        x = pos.width / 2 + 0.01;
                        z = (i - windowCount / 2) * windowSpacing;
                        rotation = Math.PI / 2;
                    } else if (side === 2) { // Arka
                        x = (i - windowCount / 2) * windowSpacing;
                        z = -pos.depth / 2 - 0.01;
                        rotation = Math.PI;
                    } else { // Sol
                        x = -pos.width / 2 - 0.01;
                        z = (i - windowCount / 2) * windowSpacing;
                        rotation = -Math.PI / 2;
                    }

                    windowFrame.position.set(x, (pos.height / pos.floors) * (floor - 0.5), z);
                    windowFrame.rotation.y = rotation;
                    windowGlass.position.set(x, (pos.height / pos.floors) * (floor - 0.5), z + 0.001);
                    windowGlass.rotation.y = rotation;

                    buildingGroup.add(windowFrame);
                    buildingGroup.add(windowGlass);
                }
            }
        }

        // Kapı
        const doorGeometry = new THREE.PlaneGeometry(1.5, 2.5);
        const doorMaterial = new THREE.MeshStandardMaterial({
            color: 0x3a2a1a,
            roughness: 0.9
        });
        const door = new THREE.Mesh(doorGeometry, doorMaterial);
        door.position.set(0, 1.25, pos.depth / 2 + 0.01);
        buildingGroup.add(door);

        // Çatı detayları
        const roofGeometry = new THREE.BoxGeometry(pos.width + 0.5, 0.5, pos.depth + 0.5);
        const roofMaterial = new THREE.MeshStandardMaterial({
            color: 0x444444,
            roughness: 0.9
        });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = pos.height + 0.25;
        buildingGroup.add(roof);

        // Hasar efektleri (rastgele)
        if (Math.random() > 0.5) {
            const damageGeometry = new THREE.BoxGeometry(2, 2, 0.2);
            const damageMaterial = new THREE.MeshStandardMaterial({
                color: 0x000000,
                roughness: 1.0
            });
            const damage = new THREE.Mesh(damageGeometry, damageMaterial);
            damage.position.set(
                (Math.random() - 0.5) * pos.width,
                Math.random() * pos.height,
                pos.depth / 2 + 0.1
            );
            buildingGroup.add(damage);
        }

        buildingGroup.position.set(pos.x, 0, pos.z);
        this.scene.add(buildingGroup);
        
        // Collision box ekle
        this.collisionObjects.push({
            type: 'box',
            position: { x: pos.x, y: pos.height / 2, z: pos.z },
            size: { width: pos.width, height: pos.height, depth: pos.depth }
        });
    }

    async setupPlayer() {
        try {
            if (typeof Player === 'undefined') {
                console.error('Player class yüklenmedi!');
                return;
            }
            this.player = new Player(this.scene, this.camera);
            // Player'ı initialize et
            await this.player.init();
            console.log('Player oluşturuldu ve initialize edildi');
        } catch (error) {
            console.error('Player oluşturma hatası:', error);
        }
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

            // Initialize loot (sandık sistemi)
            data.loot.forEach(loot => {
                this.addLootChest(loot);
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
            this.addLootChest(data);
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

    addLootChest(loot) {
        // Sandık sistemi kullan
        if (typeof LootChest !== 'undefined') {
            const chest = new LootChest(this.scene, loot.position, loot);
            this.lootChests[loot.id] = chest;
            this.lootItems[loot.id] = loot; // Backend için
        } else {
            // Fallback: Eski sistem
            this.addLootItem(loot);
        }
    }

    addLootItem(loot) {
        const lootGroup = new THREE.Group();

        // Loot tipine göre görsel
        if (loot.item.type === 'weapon') {
            // Silah kutusu
            const boxGeometry = new THREE.BoxGeometry(0.4, 0.3, 0.6);
            const boxMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x8b4513,
                roughness: 0.7,
                metalness: 0.3
            });
            const box = new THREE.Mesh(boxGeometry, boxMaterial);
            box.position.y = 0.15;
            lootGroup.add(box);

            // Kilit
            const lockGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.05);
            const lockMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x444444,
                metalness: 0.9
            });
            const lock = new THREE.Mesh(lockGeometry, lockMaterial);
            lock.position.set(0, 0.2, 0.3);
            lootGroup.add(lock);
        } else if (loot.item.type === 'ammo') {
            // Mühimmat kutusu
            const ammoGeometry = new THREE.BoxGeometry(0.3, 0.2, 0.3);
            const ammoMaterial = new THREE.MeshStandardMaterial({ 
                color: 0xffaa00,
                roughness: 0.5
            });
            const ammoBox = new THREE.Mesh(ammoGeometry, ammoMaterial);
            ammoBox.position.y = 0.1;
            lootGroup.add(ammoBox);
        } else if (loot.item.type === 'food' || loot.item.type === 'water') {
            // Yiyecek/içecek
            const itemGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.2, 8);
            const itemMaterial = new THREE.MeshStandardMaterial({ 
                color: loot.item.type === 'food' ? 0xff6600 : 0x0066ff,
                roughness: 0.3
            });
            const item = new THREE.Mesh(itemGeometry, itemMaterial);
            item.rotation.x = Math.PI / 2;
            item.position.y = 0.1;
            lootGroup.add(item);
        } else {
            // Diğer eşyalar için genel kutu
            const defaultGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
            const defaultMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x666666,
                roughness: 0.6
            });
            const defaultBox = new THREE.Mesh(defaultGeometry, defaultMaterial);
            defaultBox.position.y = 0.15;
            lootGroup.add(defaultBox);
        }

        // Glow efekti
        const glowGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.2
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.y = 0.25;
        lootGroup.add(glow);

        // Animasyon için referans
        lootGroup.userData = { 
            rotationSpeed: 0.01,
            floatSpeed: 0.002,
            floatOffset: Math.random() * Math.PI * 2
        };

        lootGroup.position.set(loot.position.x, loot.position.y + 0.25, loot.position.z);
        lootGroup.castShadow = true;
        this.scene.add(lootGroup);

        this.lootItems[loot.id] = {
            ...loot,
            mesh: lootGroup,
            glow: glow
        };

        // Loot toplandığında ses efekti
        // (interact fonksiyonunda zaten var)
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

        // Muzzle flash pozisyonu (kameranın önü)
        const muzzlePosition = new THREE.Vector3();
        this.camera.getWorldPosition(muzzlePosition);
        const forward = new THREE.Vector3(0, 0, -1);
        forward.applyQuaternion(this.camera.quaternion);
        forward.multiplyScalar(0.5);
        muzzlePosition.add(forward);

        // Parçacık efektleri
        if (this.particleSystem) {
            this.particleSystem.createMuzzleFlash(muzzlePosition, direction);
            // Duman efekti
            setTimeout(() => {
                this.particleSystem.createSmoke(muzzlePosition);
            }, 50);
        }

        // Ses efekti
        if (window.audioManager) {
            window.audioManager.playSound('shoot', 0.5);
        }

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

        // Sandık sistemi kontrolü
        if (this.lootChests[this.nearbyLoot]) {
            const chest = this.lootChests[this.nearbyLoot];
            if (!chest.isOpen) {
                // Sandığı aç
                chest.open();
                return;
            } else {
                // Sandık açık, loot topla
                if (this.socket) {
                    this.socket.emit('player:loot', this.nearbyLoot);
                }
                // Sandığı kaldır
                setTimeout(() => {
                    chest.dispose();
                    delete this.lootChests[this.nearbyLoot];
                }, 1000);
            }
        } else {
            // Eski sistem (fallback)
            if (window.audioManager) {
                window.audioManager.playSound('loot', 0.5);
            }

            if (this.socket) {
                this.socket.emit('player:loot', this.nearbyLoot);
            }
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
        const prompt = document.getElementById('interactionPrompt');
        this.nearbyLoot = null;

        // Sandık sistemi kontrolü
        Object.entries(this.lootChests).forEach(([id, chest]) => {
            if (!chest || !chest.chestGroup) return;

            const distance = Math.sqrt(
                Math.pow(this.player.position.x - chest.position.x, 2) +
                Math.pow(this.player.position.z - chest.position.z, 2)
            );

            if (distance < this.interactionRange) {
                this.nearbyLoot = id;
                prompt.classList.remove('hidden');
                prompt.textContent = chest.isOpen ? '[F] Topla' : '[F] Sandığı Aç';
                return;
            }
        });

        // Eski sistem (fallback)
        if (!this.nearbyLoot) {
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
        }

        if (!this.nearbyLoot) {
            prompt.classList.add('hidden');
        }
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        // Scene ve renderer kontrolü
        if (!this.scene || !this.camera || !this.renderer) {
            console.warn('Scene, camera veya renderer eksik!');
            return;
        }

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

            // Animate loot items
            Object.values(this.lootItems).forEach(loot => {
                if (loot.mesh && loot.mesh.userData) {
                    // Yavaşça döndür
                    loot.mesh.rotation.y += loot.mesh.userData.rotationSpeed;
                    // Yukarı aşağı hareket
                    const floatAmount = Math.sin(Date.now() * loot.mesh.userData.floatSpeed + loot.mesh.userData.floatOffset) * 0.1;
                    loot.mesh.position.y = loot.position.y + 0.25 + floatAmount;
                }
            });

            // Update particle system
            if (this.particleSystem) {
                this.particleSystem.update(deltaTime);
            }

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

        // Render
        try {
            if (this.renderer && this.scene && this.camera) {
                this.renderer.render(this.scene, this.camera);
            }
        } catch (error) {
            console.error('Render hatası:', error);
        }
    }
}

// Game instance oluştur
window.game = new Game();
console.log('Game instance oluşturuldu:', window.game);

