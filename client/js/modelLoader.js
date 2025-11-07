class ModelLoader {
    constructor(scene) {
        this.scene = scene;
        this.gltfLoader = null;
        this.loadedModels = {};
        this.initLoader();
    }

    initLoader() {
        const tryInit = () => {
            if (typeof THREE !== 'undefined' && THREE.GLTFLoader) {
                this.gltfLoader = new THREE.GLTFLoader();
                console.log('✅ GLTF Loader initialized in ModelLoader');
                return true;
            }
            return false;
        };

        // Hemen dene
        if (!tryInit()) {
            console.warn('⚠️ GLTF Loader yüklenemedi, tekrar denenecek...');
            // GLTF Loader yüklenene kadar bekle (max 5 saniye)
            let attempts = 0;
            const maxAttempts = 10;
            const interval = setInterval(() => {
                attempts++;
                if (tryInit()) {
                    clearInterval(interval);
                } else if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    console.error('❌ GLTF Loader hala yüklenemedi! THREE:', typeof THREE, 'GLTFLoader:', typeof THREE !== 'undefined' ? THREE.GLTFLoader : 'undefined');
                }
            }, 500);
        }
    }

    // Ücretsiz GLTF model CDN'lerinden yükleme
    async loadModel(modelType, modelName) {
        const cacheKey = `${modelType}_${modelName}`;
        
        // Cache kontrolü
        if (this.loadedModels[cacheKey]) {
            return this.loadedModels[cacheKey].clone();
        }

        // Özel durumlar: scene.bin eksik modeller için direkt procedural kullan
        // Sadece car ve barriers için procedural kullan (tree ve building modelleri GLTF ile yüklenecek)
        if ((modelType === 'object' && modelName === 'car') ||
            (modelType === 'object' && modelName === 'barriers')) {
            const proceduralModel = this.createProceduralModel(modelType, modelName);
            if (proceduralModel) {
                this.loadedModels[cacheKey] = proceduralModel;
                console.log(`⚠️ Procedural model kullanılıyor (scene.bin eksik): ${modelType}/${modelName}`);
                return proceduralModel.clone();
            }
        }

        // Model URL'leri (ücretsiz kaynaklardan)
        const modelUrls = this.getModelUrl(modelType, modelName);
        
        if (!modelUrls || !this.gltfLoader) {
            // Procedural model oluştur
            const proceduralModel = this.createProceduralModel(modelType, modelName);
            if (proceduralModel) {
                this.loadedModels[cacheKey] = proceduralModel;
                return proceduralModel.clone();
            }
            console.warn(`Model yüklenemedi: ${modelType}/${modelName}, procedural model kullanılacak`);
            return null;
        }
        
        // URL'leri mutlak path'e çevir (yerel dosyalar için)
        const absoluteUrls = modelUrls.map(url => {
            if (url.startsWith('models/')) {
                // Relative path - tarayıcı otomatik çözümleyecek
                // Eğer client klasörü root ise, path'i olduğu gibi bırak
                return url;
            }
            return url;
        });
        
        console.log(`📂 Model path'leri:`, absoluteUrls);

        return new Promise((resolve, reject) => {
            // GLTF Loader kontrolü
            if (!this.gltfLoader) {
                console.error(`❌ GLTF Loader henüz hazır değil! Model: ${modelType}/${modelName}`);
                // Procedural model dene
                const proceduralModel = this.createProceduralModel(modelType, modelName);
                if (proceduralModel) {
                    this.loadedModels[cacheKey] = proceduralModel;
                    console.log(`⚠️ Procedural model kullanılıyor (GLTF Loader yok): ${modelType}/${modelName}`);
                    resolve(proceduralModel.clone());
                } else {
                    resolve(null);
                }
                return;
            }
            
            console.log(`🔍 Model yükleniyor: ${modelType}/${modelName} - ${absoluteUrls[0]}`);
            console.log(`📦 GLTF Loader durumu:`, this.gltfLoader ? 'Hazır' : 'Yok');
            
            // İlk URL'den dene
            this.gltfLoader.load(
                absoluteUrls[0],
                (gltf) => {
                    const model = gltf.scene;
                    this.loadedModels[cacheKey] = model;
                    console.log(`✅ Model başarıyla yüklendi: ${modelType}/${modelName}`);
                    resolve(model.clone());
                },
                (progress) => {
                    // Progress callback
                    if (progress.total > 0) {
                        const percent = (progress.loaded / progress.total * 100).toFixed(0);
                        console.log(`📥 Model yükleniyor: ${modelType}/${modelName} - %${percent}`);
                    }
                },
                (error) => {
                    console.warn(`❌ Model yükleme hatası (${absoluteUrls[0]}):`, error);
                    // İlk URL başarısız, alternatif dene
                    if (absoluteUrls[1]) {
                        console.log(`🔄 Alternatif model deneniyor: ${absoluteUrls[1]}`);
                        this.gltfLoader.load(
                            absoluteUrls[1],
                            (gltf) => {
                                const model = gltf.scene;
                                this.loadedModels[cacheKey] = model;
                                console.log(`✅ Model başarıyla yüklendi (alternatif): ${modelType}/${modelName}`);
                                resolve(model.clone());
                            },
                            undefined,
                            (error2) => {
                                console.warn(`❌ Alternatif model de başarısız (${absoluteUrls[1]}):`, error2);
                                // Tüm URL'ler başarısız, procedural model dene
                                const proceduralModel = this.createProceduralModel(modelType, modelName);
                                if (proceduralModel) {
                                    this.loadedModels[cacheKey] = proceduralModel;
                                    console.log(`⚠️ Procedural model kullanılıyor: ${modelType}/${modelName}`);
                                    resolve(proceduralModel.clone());
                                } else {
                                    console.warn(`Model yüklenemedi: ${modelType}/${modelName}`, error2);
                                    resolve(null);
                                }
                            }
                        );
                    } else {
                        // Alternatif URL yok, procedural model dene
                        const proceduralModel = this.createProceduralModel(modelType, modelName);
                        if (proceduralModel) {
                            this.loadedModels[cacheKey] = proceduralModel;
                            console.log(`⚠️ Procedural model kullanılıyor: ${modelType}/${modelName}`);
                            resolve(proceduralModel.clone());
                        } else {
                            console.warn(`Model yüklenemedi: ${modelType}/${modelName}`, error);
                            resolve(null);
                        }
                    }
                }
            );
        });
    }

    getModelUrl(modelType, modelName) {
        // Ücretsiz GLTF model CDN'leri ve yerel dosyalar
        const models = {
            weapon: {
                'M4A1': [
                    `models/weapons/m4a1.gltf`,
                    `models/weapons/m4a1.glb`,
                    `models/weapons/rifle.gltf`
                ],
                'AK-47': [
                    `models/weapons/ak47.gltf`,
                    `models/weapons/ak47.glb`,
                    `models/weapons/rifle.gltf`
                ],
                'Glock 17': [
                    `models/weapons/glock17.gltf`,
                    `models/weapons/glock17.glb`,
                    `models/weapons/pistol.gltf`
                ]
            },
            character: {
                'player': [
                    `models/characters/player/player.gltf`,
                    `models/characters/player/player.glb`,
                    `models/characters/player.gltf`,
                    `models/characters/survivor.gltf`
                ]
            },
            building: {
                'apartment': [
                    `models/buildings/apartment/apartment.gltf`,
                    `models/buildings/apartment.gltf`,
                    `models/buildings/apartment.glb`
                ],
                'warehouse': [
                    `models/buildings/warehouse/warehouse.gltf`,
                    `models/buildings/warehouse.gltf`,
                    `models/buildings/warehouse.glb`
                ]
            },
            chest: {
                'loot_chest': [
                    `models/chests/chest.gltf`,
                    `models/chests/chest.glb`,
                    `models/chests/wooden_chest.gltf`
                ]
            },
            object: {
                'container': [
                    `models/objects/container.gltf`,
                    `models/objects/container.glb`,
                    `models/objects/shipping_container.gltf`
                ],
                'trash_bin': [
                    `models/objects/trash_bin.gltf`,
                    `models/objects/trash_bin.glb`
                ],
                'tree': [
                    `models/objects/tree.gltf`,
                    `models/objects/tree.glb`
                ],
                // car ve barriers için scene.bin eksik, direkt procedural kullan
                // 'car': [
                //     `models/objects/car.gltf`,
                //     `models/objects/car.glb`
                // ],
                // 'barriers': [
                //     `models/objects/barriers.gltf`,
                //     `models/objects/barriers.glb`
                // ]
            }
        };

        return models[modelType]?.[modelName] || null;
    }

    // Procedural detaylı modeller (fallback)
    createProceduralModel(modelType, modelName) {
        switch (modelType) {
            case 'weapon':
                return this.createProceduralWeapon(modelName);
            case 'character':
                if (modelName === 'player') {
                    return this.createProceduralCharacter();
                }
                return null;
            case 'chest':
                return this.createProceduralChest();
            case 'container':
                return this.createProceduralContainer();
            case 'trash_bin':
                return this.createProceduralTrashBin();
            case 'tree':
                return this.createProceduralTree();
            case 'building':
                return this.createProceduralBuilding(modelName);
            case 'object':
                if (modelName === 'car') {
                    return this.createProceduralCar();
                } else if (modelName === 'barriers') {
                    return this.createProceduralBarriers();
                } else if (modelName === 'tree') {
                    return this.createProceduralTree();
                }
                return null;
            default:
                return null;
        }
    }

    createProceduralWeapon(weaponName) {
        const group = new THREE.Group();
        
        if (weaponName === 'M4A1' || weaponName === 'AK-47') {
            // Çok detaylı rifle modeli
            const material = new THREE.MeshStandardMaterial({
                color: 0x2a2a2a,
                roughness: 0.2,
                metalness: 0.9
            });

            // Ana gövde
            const body = new THREE.Mesh(
                new THREE.BoxGeometry(0.5, 0.08, 0.12),
                material
            );
            body.position.set(0, 0, 0);
            group.add(body);

            // Namlu
            const barrel = new THREE.Mesh(
                new THREE.CylinderGeometry(0.015, 0.015, 0.4, 16),
                material
            );
            barrel.rotation.z = Math.PI / 2;
            barrel.position.set(0.25, 0, 0);
            group.add(barrel);

            // Dipçik
            const stock = new THREE.Mesh(
                new THREE.BoxGeometry(0.2, 0.1, 0.08),
                material
            );
            stock.position.set(-0.3, 0, 0);
            group.add(stock);

            // Kabza
            const grip = new THREE.Mesh(
                new THREE.BoxGeometry(0.06, 0.15, 0.06),
                material
            );
            grip.position.set(0.1, -0.1, 0);
            group.add(grip);

            // Nişangah
            const sight = new THREE.Mesh(
                new THREE.BoxGeometry(0.15, 0.02, 0.02),
                material
            );
            sight.position.set(0.2, 0.05, 0);
            group.add(sight);
        } else if (weaponName === 'Glock 17') {
            // Detaylı pistol modeli
            const material = new THREE.MeshStandardMaterial({
                color: 0x3a3a3a,
                roughness: 0.2,
                metalness: 0.9
            });

            // Gövde
            const body = new THREE.Mesh(
                new THREE.BoxGeometry(0.15, 0.05, 0.08),
                material
            );
            group.add(body);

            // Namlu
            const barrel = new THREE.Mesh(
                new THREE.CylinderGeometry(0.01, 0.01, 0.1, 16),
                material
            );
            barrel.rotation.z = Math.PI / 2;
            barrel.position.set(0.1, 0, 0);
            group.add(barrel);

            // Tetik koruması
            const triggerGuard = new THREE.Mesh(
                new THREE.TorusGeometry(0.03, 0.005, 8, 16),
                material
            );
            triggerGuard.rotation.x = Math.PI / 2;
            triggerGuard.position.set(0, -0.02, 0);
            group.add(triggerGuard);
        }

        return group;
    }

    createProceduralChest() {
        // Zaten lootChest.js'de var
        return null;
    }

    createProceduralContainer() {
        const group = new THREE.Group();
        
        // Ana gövde
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(2.4, 2.4, 6.0),
            new THREE.MeshStandardMaterial({
                color: 0x444444,
                roughness: 0.7,
                metalness: 0.3
            })
        );
        body.position.y = 1.2;
        group.add(body);

        // Detaylar (kapı, köşeler vb.) - game.js'deki gibi
        return group;
    }

    createProceduralTrashBin() {
        // game.js'deki gibi
        return null;
    }

    createProceduralCharacter() {
        // Basit player modeli (fallback)
        const group = new THREE.Group();
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x8b4513,
            roughness: 0.8,
            metalness: 0.2
        });
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.11, 16, 16);
        const head = new THREE.Mesh(headGeometry, material);
        head.position.y = 1.65;
        group.add(head);
        
        // Body
        const bodyGeometry = new THREE.BoxGeometry(0.4, 0.6, 0.25);
        const body = new THREE.Mesh(bodyGeometry, material);
        body.position.y = 1.2;
        group.add(body);
        
        // Arms
        const armGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.65, 8);
        const leftArm = new THREE.Mesh(armGeometry, material);
        leftArm.position.set(-0.25, 1.15, 0);
        leftArm.rotation.z = 0.2;
        group.add(leftArm);
        
        const rightArm = new THREE.Mesh(armGeometry, material);
        rightArm.position.set(0.25, 1.15, 0);
        rightArm.rotation.z = -0.2;
        group.add(rightArm);
        
        // Legs
        const legGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.85, 8);
        const leftLeg = new THREE.Mesh(legGeometry, material);
        leftLeg.position.set(-0.1, 0.425, 0);
        group.add(leftLeg);
        
        const rightLeg = new THREE.Mesh(legGeometry, material);
        rightLeg.position.set(0.1, 0.425, 0);
        group.add(rightLeg);
        
        return group;
    }

    createProceduralBuilding(buildingType) {
        // Basit bina modeli (fallback) - standart boyut (game.js'de ölçeklendirilecek)
        const group = new THREE.Group();
        // Standart boyut (10x15x10) - game.js'de pos.width/height/depth ile ölçeklendirilecek
        const geometry = new THREE.BoxGeometry(10, 15, 10);
        const material = new THREE.MeshStandardMaterial({
            color: 0x555555,
            roughness: 0.8,
            metalness: 0.2
        });
        const building = new THREE.Mesh(geometry, material);
        building.position.y = 7.5; // height / 2
        building.castShadow = true;
        building.receiveShadow = true;
        group.add(building);
        
        return group;
    }

    createProceduralTree() {
        const group = new THREE.Group();
        
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
        group.add(trunk);
        
        // Yapraklar (taç) - gerçekçi: ~3-6m çap
        const crownSize = 2 + Math.random() * 2;
        const crownGeometry = new THREE.ConeGeometry(crownSize, crownSize * 1.5, 8);
        const crownMaterial = new THREE.MeshStandardMaterial({
            color: 0x2d5016,
            roughness: 0.8
        });
        const crown = new THREE.Mesh(crownGeometry, crownMaterial);
        crown.position.y = trunkHeight + crownSize * 0.5;
        group.add(crown);
        
        return group;
    }

    createProceduralCar() {
        const group = new THREE.Group();
        
        // Araba gövdesi
        const bodyGeometry = new THREE.BoxGeometry(4, 1.5, 2);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.3,
            metalness: 0.7
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.75;
        group.add(body);
        
        // Tekerlekler
        const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
        const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
        const wheels = [
            { x: -1.2, z: 0.8 },
            { x: 1.2, z: 0.8 },
            { x: -1.2, z: -0.8 },
            { x: 1.2, z: -0.8 }
        ];
        wheels.forEach(wheel => {
            const wheelMesh = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheelMesh.rotation.z = Math.PI / 2;
            wheelMesh.position.set(wheel.x, 0.4, wheel.z);
            group.add(wheelMesh);
        });
        
        // Camlar
        const windowGeometry = new THREE.BoxGeometry(1.5, 0.8, 0.05);
        const windowMaterial = new THREE.MeshStandardMaterial({
            color: 0x88ccff,
            transparent: true,
            opacity: 0.3
        });
        const frontWindow = new THREE.Mesh(windowGeometry, windowMaterial);
        frontWindow.position.set(0, 1.2, 1);
        group.add(frontWindow);
        
        return group;
    }

    createProceduralBarriers() {
        const group = new THREE.Group();
        
        // Bariyer (traffic cone benzeri)
        const coneGeometry = new THREE.ConeGeometry(0.3, 0.8, 8);
        const coneMaterial = new THREE.MeshStandardMaterial({
            color: 0xff6600,
            roughness: 0.5
        });
        const cone = new THREE.Mesh(coneGeometry, coneMaterial);
        cone.position.y = 0.4;
        group.add(cone);
        
        // Reflektör bandı
        const bandGeometry = new THREE.TorusGeometry(0.35, 0.05, 8, 16);
        const bandMaterial = new THREE.MeshStandardMaterial({
            color: 0xffff00,
            emissive: 0xffff00,
            emissiveIntensity: 0.5
        });
        const band = new THREE.Mesh(bandGeometry, bandMaterial);
        band.rotation.x = Math.PI / 2;
        band.position.y = 0.3;
        group.add(band);
        
        return group;
    }
}

window.ModelLoader = ModelLoader;

