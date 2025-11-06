class LootChest {
    constructor(scene, position, lootData) {
        this.scene = scene;
        this.position = position;
        this.lootData = lootData;
        this.isOpen = false;
        this.chestGroup = null;
        this.lootMesh = null;
        this.createChest();
    }

    createChest() {
        this.chestGroup = new THREE.Group();

        // Sandık gövdesi (gerçekçi: ~1m x 0.6m x 0.8m)
        const bodyGeometry = new THREE.BoxGeometry(1.0, 0.6, 0.8);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b4513, // Kahverengi ahşap
            roughness: 0.9,
            metalness: 0.1
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.3;
        body.castShadow = true;
        body.receiveShadow = true;
        this.chestGroup.add(body);

        // Sandık kapağı (açılacak)
        const lidGeometry = new THREE.BoxGeometry(1.0, 0.1, 0.8);
        const lid = new THREE.Mesh(lidGeometry, bodyMaterial);
        lid.position.set(0, 0.65, -0.4);
        lid.castShadow = true;
        lid.userData.isLid = true;
        this.lid = lid;
        this.chestGroup.add(lid);

        // Kilit/demir bantlar
        const bandGeometry = new THREE.BoxGeometry(1.1, 0.05, 0.05);
        const bandMaterial = new THREE.MeshStandardMaterial({
            color: 0x444444,
            metalness: 0.8,
            roughness: 0.3
        });
        
        // Üst bant
        const topBand = new THREE.Mesh(bandGeometry, bandMaterial);
        topBand.position.set(0, 0.65, 0);
        this.chestGroup.add(topBand);

        // Alt bant
        const bottomBand = new THREE.Mesh(bandGeometry, bandMaterial);
        bottomBand.position.set(0, 0.3, 0);
        this.chestGroup.add(bottomBand);

        // Yan bantlar
        const sideBandGeometry = new THREE.BoxGeometry(0.05, 0.6, 0.05);
        const leftBand = new THREE.Mesh(sideBandGeometry, bandMaterial);
        leftBand.position.set(-0.5, 0.3, 0);
        this.chestGroup.add(leftBand);

        const rightBand = new THREE.Mesh(sideBandGeometry, bandMaterial);
        rightBand.position.set(0.5, 0.3, 0);
        this.chestGroup.add(rightBand);

        // Glow efekti (açılmamış sandıklar için)
        const glowGeometry = new THREE.BoxGeometry(1.2, 0.8, 1.0);
        const glowMaterial = new THREE.MeshStandardMaterial({
            color: 0xffff00,
            emissive: 0xffff00,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.2
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.y = 0.4;
        this.glow = glow;
        this.chestGroup.add(glow);

        // Loot içeriği (kapalıyken görünmez)
        this.createLootContent();

        this.chestGroup.position.set(this.position.x, 0, this.position.z);
        this.scene.add(this.chestGroup);
    }

    createLootContent() {
        if (!this.lootData) return;

        // Loot tipine göre model oluştur
        const lootGroup = new THREE.Group();

        if (this.lootData.item.type === 'weapon') {
            // Silah modeli
            const weaponGeometry = new THREE.BoxGeometry(0.3, 0.1, 0.5);
            const weaponMaterial = new THREE.MeshStandardMaterial({
                color: 0x333333,
                metalness: 0.8
            });
            const weapon = new THREE.Mesh(weaponGeometry, weaponMaterial);
            weapon.rotation.x = Math.PI / 2;
            lootGroup.add(weapon);
        } else if (this.lootData.item.type === 'ammo') {
            // Mühimmat kutusu
            const ammoGeometry = new THREE.BoxGeometry(0.2, 0.15, 0.2);
            const ammoMaterial = new THREE.MeshStandardMaterial({
                color: 0xff6600,
                metalness: 0.5
            });
            const ammo = new THREE.Mesh(ammoGeometry, ammoMaterial);
            lootGroup.add(ammo);
        } else if (this.lootData.item.type === 'food') {
            // Yiyecek
            const foodGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.15, 8);
            const foodMaterial = new THREE.MeshStandardMaterial({
                color: 0x8b4513
            });
            const food = new THREE.Mesh(foodGeometry, foodMaterial);
            lootGroup.add(food);
        } else if (this.lootData.item.type === 'water') {
            // Su şişesi
            const waterGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.2, 8);
            const waterMaterial = new THREE.MeshStandardMaterial({
                color: 0x4488ff,
                transparent: true,
                opacity: 0.7
            });
            const water = new THREE.Mesh(waterGeometry, waterMaterial);
            lootGroup.add(water);
        }

        lootGroup.position.set(0, 0.5, 0);
        lootGroup.visible = false; // Kapalıyken görünmez
        this.lootMesh = lootGroup;
        this.chestGroup.add(lootGroup);
    }

    open() {
        if (this.isOpen) return;

        this.isOpen = true;

        // Kapağı aç (animasyon)
        const openAnimation = () => {
            const targetRotation = -Math.PI / 2.5; // ~72 derece
            const currentRotation = this.lid.rotation.x;
            const diff = targetRotation - currentRotation;

            if (Math.abs(diff) > 0.01) {
                this.lid.rotation.x += diff * 0.1;
                requestAnimationFrame(openAnimation);
            } else {
                this.lid.rotation.x = targetRotation;
            }
        };
        openAnimation();

        // Glow efektini kaldır
        if (this.glow) {
            this.glow.material.opacity = 0;
            setTimeout(() => {
                this.chestGroup.remove(this.glow);
            }, 500);
        }

        // Loot içeriğini göster
        if (this.lootMesh) {
            this.lootMesh.visible = true;
            // Yavaşça yukarı çık
            const floatAnimation = () => {
                if (this.lootMesh.position.y < 0.8) {
                    this.lootMesh.position.y += 0.02;
                    requestAnimationFrame(floatAnimation);
                }
            };
            floatAnimation();
        }

        // Parçacık efekti
        if (window.game && window.game.particleSystem) {
            const particlePos = new THREE.Vector3(
                this.position.x,
                0.5,
                this.position.z
            );
            window.game.particleSystem.createSmoke(particlePos);
        }

        // Ses efekti
        if (window.audioManager) {
            window.audioManager.playSound('loot', 0.5);
        }
    }

    dispose() {
        if (this.chestGroup) {
            this.scene.remove(this.chestGroup);
            this.chestGroup.traverse((child) => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) child.material.dispose();
            });
        }
    }
}

window.LootChest = LootChest;

