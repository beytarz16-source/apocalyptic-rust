class WeaponSystem {
    constructor() {
        this.equippedWeapon = null;
        this.currentAmmo = 0;
        this.totalAmmo = 0;
        this.isReloading = false;
        this.lastShotTime = 0;
        this.isAiming = false;
        
        this.weapons = {
            'M4A1': {
                name: 'M4A1',
                type: 'rifle',
                damage: 30,
                fireRate: 600, // rounds per minute
                range: 200,
                ammoType: '5.56mm',
                magazineSize: 30,
                reloadTime: 2.5,
                recoil: 0.5,
                model: null
            },
            'AK-47': {
                name: 'AK-47',
                type: 'rifle',
                damage: 35,
                fireRate: 600,
                range: 200,
                ammoType: '7.62mm',
                magazineSize: 30,
                reloadTime: 3.0,
                recoil: 0.7,
                model: null
            },
            'Kar98k': {
                name: 'Kar98k',
                type: 'sniper',
                damage: 75,
                fireRate: 30,
                range: 500,
                ammoType: '7.62mm',
                magazineSize: 5,
                reloadTime: 3.5,
                recoil: 1.2,
                model: null
            },
            'MP5': {
                name: 'MP5',
                type: 'smg',
                damage: 25,
                fireRate: 800,
                range: 100,
                ammoType: '9mm',
                magazineSize: 30,
                reloadTime: 2.0,
                recoil: 0.3,
                model: null
            },
            'Glock 17': {
                name: 'Glock 17',
                type: 'pistol',
                damage: 20,
                fireRate: 400,
                range: 50,
                ammoType: '9mm',
                magazineSize: 17,
                reloadTime: 1.5,
                recoil: 0.2,
                model: null
            }
        };

        this.attachments = {
            'Red Dot Sight': { type: 'scope', zoom: 1.0, name: 'Red Dot Sight' },
            '2x Scope': { type: 'scope', zoom: 2.0, name: '2x Scope' },
            '4x Scope': { type: 'scope', zoom: 4.0, name: '4x Scope' },
            'Suppressor': { type: 'muzzle', recoilReduction: 0.1, name: 'Suppressor' },
            'Compensator': { type: 'muzzle', recoilReduction: 0.2, name: 'Compensator' },
            'Vertical Grip': { type: 'grip', recoilReduction: 0.15, name: 'Vertical Grip' },
            'Angled Grip': { type: 'grip', recoilReduction: 0.1, name: 'Angled Grip' },
            'Extended Magazine': { type: 'magazine', capacityMultiplier: 1.5, name: 'Extended Magazine' },
            'Quick Draw Magazine': { type: 'magazine', reloadSpeed: 0.7, name: 'Quick Draw Magazine' }
        };

        // Başlangıçta mühimmat sayacını güncelle
        this.updateAmmoDisplay();
    }

    equipWeapon(weaponName, ammoCount = 0) {
        if (!this.weapons[weaponName]) return false;

        this.equippedWeapon = { ...this.weapons[weaponName] };
        this.equippedWeapon.attachments = [];
        this.currentAmmo = Math.min(this.equippedWeapon.magazineSize, ammoCount);
        this.totalAmmo = ammoCount - this.currentAmmo;
        
        // Karaktere silah modeli ekle
        if (window.game && window.game.player) {
            window.game.player.createWeaponModel(weaponName);
        }
        
        this.updateAmmoDisplay();
        return true;
    }

    attachItem(attachmentName) {
        if (!this.equippedWeapon || !this.attachments[attachmentName]) return false;

        const attachment = this.attachments[attachmentName];
        
        // Remove existing attachment of same type
        this.equippedWeapon.attachments = this.equippedWeapon.attachments.filter(
            a => a.type !== attachment.type
        );

        this.equippedWeapon.attachments.push(attachment);

        // Apply attachment effects
        if (attachment.type === 'magazine' && attachment.capacityMultiplier) {
            this.equippedWeapon.magazineSize = Math.floor(
                this.weapons[this.equippedWeapon.name].magazineSize * attachment.capacityMultiplier
            );
        }

        return true;
    }

    canShoot() {
        if (!this.equippedWeapon) return false;
        if (this.isReloading) return false;
        if (this.currentAmmo <= 0) return false;
        
        const now = Date.now();
        const timeBetweenShots = 60000 / this.equippedWeapon.fireRate;
        if (now - this.lastShotTime < timeBetweenShots) return false;

        return true;
    }

    shoot() {
        if (!this.canShoot()) return null;

        this.currentAmmo--;
        this.lastShotTime = Date.now();
        this.updateAmmoDisplay();

        return {
            weapon: this.equippedWeapon.name,
            damage: this.equippedWeapon.damage,
            range: this.equippedWeapon.range
        };
    }

    reload() {
        if (!this.equippedWeapon) return false;
        if (this.isReloading) return false;
        if (this.totalAmmo <= 0) return false;
        if (this.currentAmmo >= this.equippedWeapon.magazineSize) return false;

        this.isReloading = true;
        
        // Ses efekti
        if (window.audioManager) {
            window.audioManager.playSound('reload', 0.4);
        }
        
        const reloadTime = this.equippedWeapon.reloadTime * 1000;
        const quickDraw = this.equippedWeapon.attachments.find(a => a.reloadSpeed);
        const actualReloadTime = quickDraw ? reloadTime * quickDraw.reloadSpeed : reloadTime;

        setTimeout(() => {
            const needed = this.equippedWeapon.magazineSize - this.currentAmmo;
            const reloadAmount = Math.min(needed, this.totalAmmo);
            this.currentAmmo += reloadAmount;
            this.totalAmmo -= reloadAmount;
            this.isReloading = false;
            this.updateAmmoDisplay();
        }, actualReloadTime);

        return true;
    }

    updateAmmoDisplay() {
        const currentAmmoEl = document.getElementById('currentAmmo');
        const totalAmmoEl = document.getElementById('totalAmmo');
        
        if (this.equippedWeapon) {
            if (currentAmmoEl) currentAmmoEl.textContent = this.currentAmmo;
            if (totalAmmoEl) totalAmmoEl.textContent = this.totalAmmo;
        } else {
            if (currentAmmoEl) currentAmmoEl.textContent = '-';
            if (totalAmmoEl) totalAmmoEl.textContent = '-';
        }
    }

    getZoomLevel() {
        if (!this.isAiming || !this.equippedWeapon) return 1.0;
        
        const scope = this.equippedWeapon.attachments.find(a => a.type === 'scope');
        return scope ? scope.zoom : 1.0;
    }

    getRecoil() {
        if (!this.equippedWeapon) return 0;
        
        let recoil = this.equippedWeapon.recoil;
        
        // Apply attachment reductions
        this.equippedWeapon.attachments.forEach(att => {
            if (att.recoilReduction) {
                recoil *= (1 - att.recoilReduction);
            }
        });

        return recoil;
    }
}

window.weaponSystem = new WeaponSystem();


