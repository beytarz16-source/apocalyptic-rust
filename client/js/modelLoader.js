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
                    `models/characters/player.gltf`,
                    `models/characters/player.glb`,
                    `models/characters/survivor.gltf`
                ]
            },
            building: {
                'apartment': [
                    `models/buildings/apartment.gltf`,
                    `models/buildings/apartment.glb`
                ],
                'warehouse': [
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
                'car': [
                    `models/objects/car.gltf`,
                    `models/objects/car.glb`
                ],
                'barriers': [
                    `models/objects/barriers.gltf`,
                    `models/objects/barriers.glb`
                ]
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
                return this.createProceduralCharacter();
            case 'chest':
                return this.createProceduralChest();
            case 'container':
                return this.createProceduralContainer();
            case 'trash_bin':
                return this.createProceduralTrashBin();
            case 'tree':
                return this.createProceduralTree();
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

    createProceduralCharacter() {
        // Zaten player.js'de var, burada sadece referans
        return null;
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

    createProceduralTree() {
        // game.js'deki gibi
        return null;
    }
}

window.ModelLoader = ModelLoader;

