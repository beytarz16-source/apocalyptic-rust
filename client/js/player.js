class Player {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.position = { x: 0, y: 1.6, z: 0 };
        this.rotation = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0, z: 0 };
        this.speed = 5;
        this.walkSpeed = 5;
        this.runSpeed = 8;
        this.jumpSpeed = 8;
        this.isGrounded = true;
        this.isRunning = false;
        
        // Stats
        this.health = 100;
        this.armor = 0;
        this.hunger = 100;
        this.thirst = 100;

        // Controls
        this.keys = {};
        this.mouseMovement = { x: 0, y: 0 };
        this.mouseSensitivity = 0.002;

        // First person camera
        this.isFirstPerson = true;
        this.cameraHeight = 1.6; // Göz seviyesi
        this.weaponOffset = { x: 0.3, y: -0.2, z: -0.5 }; // Silah pozisyonu
        this.weaponMesh = null;
        this.armorMesh = null;

        this.init();
    }

    async init() {
        // Create player model (more human-like)
        await this.createPlayerModel();
        
        // Setup controls
        this.setupControls();
    }

    async createPlayerModel() {
        // GLTF model yükleme dene
        if (window.game && window.game.modelLoader) {
            try {
                const model = await window.game.modelLoader.loadModel('character', 'player');
                if (model) {
                    // Model yüklendi
                    if (this.mesh) {
                        this.scene.remove(this.mesh);
                        this.mesh.geometry?.dispose();
                        this.mesh.material?.dispose();
                    }
                    
                    // Ölçeklendirme (gerçekçi insan boyutu: ~1.75m)
                    model.scale.set(1, 1, 1);
                    model.position.set(this.position.x, this.position.y, this.position.z);
                    model.castShadow = true;
                    model.receiveShadow = true;
                    this.mesh = model;
                    this.scene.add(this.mesh);
                    console.log('✅ GLTF player model yüklendi');
                    return; // GLTF model kullanıldı, procedural'a geçme
                }
            } catch (error) {
                console.warn('Player modeli yüklenemedi, procedural kullanılıyor:', error);
            }
        }
        
        // Fallback: Procedural player model
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x8b4513,
            roughness: 0.8,
            metalness: 0.2
        });

        // Gerçekçi insan boyutları (metre cinsinden)
        // Ortalama insan: ~1.75m boy, baş ~0.22m çap
        
        // Head (gerçekçi: ~0.22m çap, ~0.25m yükseklik)
        const headGeometry = new THREE.SphereGeometry(0.11, 16, 16);
        const head = new THREE.Mesh(headGeometry, material);
        head.position.y = 1.65; // Göz seviyesi ~1.6m

        // Body (torso) - gerçekçi: ~0.4m genişlik, ~0.5m derinlik, ~0.6m yükseklik
        const bodyGeometry = new THREE.BoxGeometry(0.4, 0.6, 0.25);
        const body = new THREE.Mesh(bodyGeometry, material);
        body.position.y = 1.2;

        // Arms - gerçekçi: ~0.08m çap, ~0.65m uzunluk
        const armGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.65, 8);
        const leftArm = new THREE.Mesh(armGeometry, material);
        leftArm.position.set(-0.25, 1.15, 0);
        leftArm.rotation.z = 0.2;

        const rightArm = new THREE.Mesh(armGeometry, material);
        rightArm.position.set(0.25, 1.15, 0);
        rightArm.rotation.z = -0.2;

        // Legs - gerçekçi: ~0.12m çap, ~0.85m uzunluk
        const legGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.85, 8);
        const leftLeg = new THREE.Mesh(legGeometry, material);
        leftLeg.position.set(-0.1, 0.425, 0);

        const rightLeg = new THREE.Mesh(legGeometry, material);
        rightLeg.position.set(0.1, 0.425, 0);

        // Group them together
        this.mesh = new THREE.Group();
        this.mesh.add(head);
        this.mesh.add(body);
        this.mesh.add(leftArm);
        this.mesh.add(rightArm);
        this.mesh.add(leftLeg);
        this.mesh.add(rightLeg);
        this.mesh.position.set(this.position.x, this.position.y, this.position.z);
        this.scene.add(this.mesh);
    }

    async createWeaponModel(weaponName) {
        if (this.weaponMesh) {
            this.scene.remove(this.weaponMesh);
            this.weaponMesh.geometry?.dispose();
            this.weaponMesh.material?.dispose();
        }

        // GLTF loader varsa GLTF model yükle, yoksa basit model kullan
        if (window.game && window.game.modelLoader) {
            await this.loadWeaponGLTF(weaponName);
            return;
        }

        // Basit silah modelleri (fallback)
        const weaponGroup = new THREE.Group();
        
        if (weaponName === 'M4A1' || weaponName === 'AK-47') {
            // Rifle model
            const stock = new THREE.BoxGeometry(0.15, 0.05, 0.3);
            const barrel = new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8);
            const grip = new THREE.BoxGeometry(0.05, 0.15, 0.1);
            
            const material = new THREE.MeshStandardMaterial({ 
                color: 0x333333,
                roughness: 0.3,
                metalness: 0.8
            });
            
            const stockMesh = new THREE.Mesh(stock, material);
            stockMesh.position.set(0, 0, 0.1);
            
            const barrelMesh = new THREE.Mesh(barrel, material);
            barrelMesh.rotation.x = Math.PI / 2;
            barrelMesh.position.set(0, 0, -0.15);
            
            const gripMesh = new THREE.Mesh(grip, material);
            gripMesh.position.set(0, -0.1, 0);
            
            weaponGroup.add(stockMesh);
            weaponGroup.add(barrelMesh);
            weaponGroup.add(gripMesh);
        } else if (weaponName === 'Glock 17') {
            // Pistol model
            const body = new THREE.BoxGeometry(0.1, 0.05, 0.15);
            const barrel = new THREE.CylinderGeometry(0.015, 0.015, 0.1, 8);
            
            const material = new THREE.MeshStandardMaterial({ 
                color: 0x444444,
                roughness: 0.3,
                metalness: 0.8
            });
            
            const bodyMesh = new THREE.Mesh(body, material);
            const barrelMesh = new THREE.Mesh(barrel, material);
            barrelMesh.rotation.x = Math.PI / 2;
            barrelMesh.position.set(0, 0, -0.1);
            
            weaponGroup.add(bodyMesh);
            weaponGroup.add(barrelMesh);
        } else {
            // Default weapon (box)
            const geometry = new THREE.BoxGeometry(0.1, 0.05, 0.2);
            const material = new THREE.MeshStandardMaterial({ color: 0x666666 });
            weaponGroup.add(new THREE.Mesh(geometry, material));
        }

        this.weaponMesh = weaponGroup;
        this.scene.add(this.weaponMesh);
    }

    async loadWeaponGLTF(weaponName) {
        if (!window.game || !window.game.modelLoader) {
            await this.createWeaponModel(weaponName);
            return;
        }

        try {
            const model = await window.game.modelLoader.loadModel('weapon', weaponName);
            
            if (model) {
                // Model yüklendi
                if (this.weaponMesh) {
                    this.scene.remove(this.weaponMesh);
                    this.weaponMesh.geometry?.dispose();
                    this.weaponMesh.material?.dispose();
                }

                // Ölçeklendirme (silah tipine göre)
                if (weaponName === 'M4A1' || weaponName === 'AK-47') {
                    model.scale.set(0.1, 0.1, 0.1);
                } else if (weaponName === 'Glock 17') {
                    model.scale.set(0.15, 0.15, 0.15);
                } else {
                    model.scale.set(0.1, 0.1, 0.1);
                }

                this.weaponMesh = model;
                this.scene.add(this.weaponMesh);
                console.log(`GLTF model yüklendi: ${weaponName}`);
            } else {
                // Model yüklenemedi, procedural kullan
                console.log(`GLTF model bulunamadı, procedural model kullanılıyor: ${weaponName}`);
                await this.createWeaponModel(weaponName);
            }
        } catch (error) {
            console.warn(`Model yükleme hatası: ${weaponName}`, error);
            await this.createWeaponModel(weaponName);
        }
    }

    updateWeaponPosition() {
        if (!this.weaponMesh || !this.camera) return;

        // Silahı kameranın önüne yerleştir
        const weaponPosition = new THREE.Vector3(
            this.weaponOffset.x,
            this.weaponOffset.y,
            this.weaponOffset.z
        );

        // Kameranın rotasyonuna göre silahı döndür
        this.weaponMesh.position.copy(this.camera.position);
        this.weaponMesh.rotation.copy(this.camera.rotation);
        
        // Offset uygula
        const offset = new THREE.Vector3();
        offset.setFromMatrixColumn(this.camera.matrix, 0);
        offset.multiplyScalar(this.weaponOffset.x);
        this.weaponMesh.position.add(offset);

        offset.setFromMatrixColumn(this.camera.matrix, 1);
        offset.multiplyScalar(this.weaponOffset.y);
        this.weaponMesh.position.add(offset);

        offset.setFromMatrixColumn(this.camera.matrix, 2);
        offset.multiplyScalar(this.weaponOffset.z);
        this.weaponMesh.position.add(offset);
    }

    updateArmorVisual() {
        if (!this.mesh) return;

        // Zırh seviyesine göre görsel değişiklik
        if (this.armor > 0 && !this.armorMesh) {
            // Zırh görseli ekle (basit bir overlay)
            const armorGeometry = new THREE.BoxGeometry(0.55, 1.0, 0.35);
            const armorMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x1e3a8a,
                roughness: 0.2,
                metalness: 0.9,
                transparent: true,
                opacity: 0.6
            });
            this.armorMesh = new THREE.Mesh(armorGeometry, armorMaterial);
            this.armorMesh.position.y = 1.0;
            this.mesh.add(this.armorMesh);
        } else if (this.armor <= 0 && this.armorMesh) {
            this.mesh.remove(this.armorMesh);
            this.scene.remove(this.armorMesh);
            this.armorMesh = null;
        }
    }

    setupControls() {
        // Keyboard
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });

        // Mouse
        document.addEventListener('mousemove', (e) => {
            if (document.pointerLockElement) {
                this.rotation.y -= e.movementX * this.mouseSensitivity;
                this.rotation.x -= e.movementY * this.mouseSensitivity;
                this.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.rotation.x));
            }
        });

        // Pointer lock
        document.addEventListener('click', () => {
            if (!document.pointerLockElement && document.getElementById('gameScreen').classList.contains('hidden') === false) {
                document.body.requestPointerLock();
            }
        });
    }

    update(deltaTime) {
        // Check if running (Shift key)
        this.isRunning = this.keys['shift'] || false;
        this.speed = this.isRunning ? this.runSpeed : this.walkSpeed;

        // Movement
        const moveVector = new THREE.Vector3();
        
        if (this.keys['w']) moveVector.z -= 1;
        if (this.keys['s']) moveVector.z += 1;
        if (this.keys['a']) moveVector.x -= 1;
        if (this.keys['d']) moveVector.x += 1;

        moveVector.normalize();
        moveVector.multiplyScalar(this.speed * deltaTime);

        // Rotate movement vector based on player rotation
        const rotationMatrix = new THREE.Matrix4();
        rotationMatrix.makeRotationY(this.rotation.y);
        moveVector.applyMatrix4(rotationMatrix);

        // Collision detection - önce yeni pozisyonu kontrol et
        const newX = this.position.x + moveVector.x;
        const newZ = this.position.z + moveVector.z;
        
        if (this.checkCollision(newX, newZ)) {
            // Çarpışma var, hareketi engelle
            return;
        }
        
        this.position.x = newX;
        this.position.z = newZ;

        // Ayak sesi efekti (koşarken veya yürürken)
        if (moveVector.length() > 0 && this.isGrounded) {
            const footstepInterval = this.isRunning ? 0.3 : 0.5;
            if (!this.lastFootstep || Date.now() - this.lastFootstep > footstepInterval * 1000) {
                if (window.audioManager) {
                    window.audioManager.playSound('footstep', 0.1);
                }
                this.lastFootstep = Date.now();
            }
        }

        // Gravity
        if (!this.isGrounded) {
            this.velocity.y -= 9.8 * deltaTime;
        } else {
            this.velocity.y = 0;
        }

        // Jump
        if (this.keys[' '] && this.isGrounded) {
            this.velocity.y = this.jumpSpeed;
            this.isGrounded = false;
        }

        this.position.y += this.velocity.y * deltaTime;

        // Ground collision (simplified)
        if (this.position.y < 1.6) {
            this.position.y = 1.6;
            this.velocity.y = 0;
            this.isGrounded = true;
        }

        // Update mesh position (mesh henüz oluşturulmamış olabilir)
        if (this.mesh) {
            this.mesh.position.set(this.position.x, this.position.y, this.position.z);
            this.mesh.rotation.y = this.rotation.y;
        }

        // Update camera (first person)
        this.camera.position.set(
            this.position.x,
            this.position.y + this.cameraHeight,
            this.position.z
        );
        
        // Kamerayı rotasyona göre döndür
        const euler = new THREE.Euler(this.rotation.x, this.rotation.y, 0, 'YXZ');
        this.camera.quaternion.setFromEuler(euler);

        // Silah pozisyonunu güncelle
        this.updateWeaponPosition();

        // Zırh görselini güncelle
        this.updateArmorVisual();

        // Decrease hunger and thirst over time
        this.hunger = Math.max(0, this.hunger - 0.5 * deltaTime);
        this.thirst = Math.max(0, this.thirst - 0.8 * deltaTime);

        // Apply penalties
        if (this.hunger <= 0) {
            this.health = Math.max(0, this.health - 1 * deltaTime);
        }
        if (this.thirst <= 0) {
            this.health = Math.max(0, this.health - 2 * deltaTime);
        }
    }

    checkCollision(newX, newZ) {
        if (!window.game || !window.game.collisionObjects) {
            return false;
        }
        
        const playerRadius = 0.4; // Player collision radius (~0.8m çap)
        const playerHeight = 1.6; // Player yüksekliği
        
        for (const obj of window.game.collisionObjects) {
            if (obj.type === 'box') {
                // AABB (Axis-Aligned Bounding Box) collision detection
                const halfWidth = obj.size.width / 2;
                const halfDepth = obj.size.depth / 2;
                const halfHeight = obj.size.height / 2;
                
                // Player'ın AABB'si
                const playerMinX = newX - playerRadius;
                const playerMaxX = newX + playerRadius;
                const playerMinZ = newZ - playerRadius;
                const playerMaxZ = newZ + playerRadius;
                
                // Objenin AABB'si
                const objMinX = obj.position.x - halfWidth;
                const objMaxX = obj.position.x + halfWidth;
                const objMinZ = obj.position.z - halfDepth;
                const objMaxZ = obj.position.z + halfDepth;
                
                // XZ düzleminde AABB kesişimi kontrolü
                if (playerMinX <= objMaxX &&
                    playerMaxX >= objMinX &&
                    playerMinZ <= objMaxZ &&
                    playerMaxZ >= objMinZ) {
                    // Yükseklik kontrolü (player'ın alt kısmı objeye çarpıyorsa)
                    const playerBottomY = this.position.y;
                    const playerTopY = this.position.y + playerHeight;
                    const objBottomY = obj.position.y - halfHeight;
                    const objTopY = obj.position.y + halfHeight;
                    
                    if (playerBottomY <= objTopY && playerTopY >= objBottomY) {
                        return true; // Çarpışma var
                    }
                }
            } else if (obj.type === 'cylinder') {
                // Cylinder collision (ağaçlar için) - Circle collision in XZ plane
                const dx = newX - obj.position.x;
                const dz = newZ - obj.position.z;
                const distance = Math.sqrt(dx * dx + dz * dz);
                
                // Yarıçap toplamı
                const combinedRadius = obj.size.radius + playerRadius;
                
                if (distance < combinedRadius) {
                    // Yükseklik kontrolü
                    const playerBottomY = this.position.y;
                    const playerTopY = this.position.y + playerHeight;
                    const objBottomY = obj.position.y - obj.size.height / 2;
                    const objTopY = obj.position.y + obj.size.height / 2;
                    
                    if (playerBottomY <= objTopY && playerTopY >= objBottomY) {
                        return true; // Çarpışma var
                    }
                }
            }
        }
        
        return false; // Çarpışma yok
    }

    takeDamage(amount) {
        const actualDamage = Math.max(0, amount - this.armor * 0.5);
        this.health = Math.max(0, this.health - actualDamage);
        
        if (this.armor > 0) {
            this.armor = Math.max(0, this.armor - amount * 0.1);
        }
    }
}

