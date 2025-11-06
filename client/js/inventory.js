class Inventory {
    constructor() {
        this.items = [];
        this.maxSlots = 30;
        this.isOpen = false;
        this.selectedWeapon = null;
        this.init();
    }

    init() {
        document.getElementById('closeInventory').addEventListener('click', () => this.close());
        
        // Close on E key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'e' || e.key === 'E') {
                if (this.isOpen) {
                    this.close();
                } else {
                    this.open();
                }
            }
        });
    }

    open() {
        if (document.getElementById('pauseMenu').classList.contains('hidden') === false) return;
        if (document.getElementById('map').classList.contains('hidden') === false) return;
        
        this.isOpen = true;
        document.getElementById('inventory').classList.remove('hidden');
        this.render();
    }

    close() {
        this.isOpen = false;
        document.getElementById('inventory').classList.add('hidden');
        document.getElementById('weaponAttachments').classList.add('hidden');
    }

    addItem(item) {
        if (this.items.length >= this.maxSlots) {
            return false; // Inventory full
        }

        this.items.push(item);
        this.render();
        return true;
    }

    removeItem(index) {
        if (index >= 0 && index < this.items.length) {
            const item = this.items.splice(index, 1)[0];
            this.render();
            return item;
        }
        return null;
    }

    useItem(index) {
        const item = this.items[index];
        if (!item) return;

        if (item.type === 'weapon') {
            this.equipWeapon(item);
        } else if (item.type === 'food') {
            this.consumeFood(item);
        } else if (item.type === 'water') {
            this.consumeWater(item);
        } else if (item.type === 'attachment') {
            this.attachToWeapon(item);
        } else if (item.type === 'ammo') {
            this.addAmmo(item);
        }
    }

    equipWeapon(item) {
        if (!window.weaponSystem) return;

        // Find ammo for this weapon
        const weaponData = window.weaponSystem.weapons[item.name];
        if (!weaponData) return;

        const ammoType = weaponData.ammoType;
        const ammoItem = this.items.find(i => i.type === 'ammo' && i.name === ammoType);
        const ammoCount = ammoItem ? ammoItem.count : 0;

        if (window.weaponSystem.equipWeapon(item.name, ammoCount)) {
            this.selectedWeapon = item;
            this.showAttachments();
        }
    }

    attachToWeapon(item) {
        if (!this.selectedWeapon || !window.weaponSystem) return;
        if (!window.weaponSystem.equippedWeapon) {
            alert('Önce bir silah kuşanmalısınız');
            return;
        }

        if (window.weaponSystem.attachItem(item.name)) {
            // Remove attachment from inventory
            const index = this.items.findIndex(i => i.name === item.name && i.type === 'attachment');
            if (index >= 0) {
                this.removeItem(index);
            }
            this.showAttachments();
        }
    }

    addAmmo(item) {
        if (!window.weaponSystem || !window.weaponSystem.equippedWeapon) return;

        const weaponAmmoType = window.weaponSystem.equippedWeapon.ammoType;
        if (item.name === weaponAmmoType) {
            window.weaponSystem.totalAmmo += item.count;
            window.weaponSystem.updateAmmoDisplay();
            
            const index = this.items.findIndex(i => i.name === item.name && i.type === 'ammo');
            if (index >= 0) {
                this.removeItem(index);
            }
        }
    }

    consumeFood(item) {
        if (window.game && window.game.player) {
            window.game.player.hunger = Math.min(100, window.game.player.hunger + item.value);
            window.game.updateHUD();
            
            const index = this.items.findIndex(i => i.name === item.name && i.type === 'food');
            if (index >= 0) {
                this.removeItem(index);
            }
        }
    }

    consumeWater(item) {
        if (window.game && window.game.player) {
            window.game.player.thirst = Math.min(100, window.game.player.thirst + item.value);
            window.game.updateHUD();
            
            const index = this.items.findIndex(i => i.name === item.name && i.type === 'water');
            if (index >= 0) {
                this.removeItem(index);
            }
        }
    }

    showAttachments() {
        if (!window.weaponSystem || !window.weaponSystem.equippedWeapon) {
            document.getElementById('weaponAttachments').classList.add('hidden');
            return;
        }

        document.getElementById('weaponAttachments').classList.remove('hidden');
        const attachmentsList = document.getElementById('attachmentsList');
        attachmentsList.innerHTML = '';

        const availableAttachments = this.items.filter(i => i.type === 'attachment');
        
        availableAttachments.forEach(item => {
            const div = document.createElement('div');
            div.className = 'attachment-item';
            div.textContent = item.name;
            div.addEventListener('click', () => {
                const index = this.items.findIndex(i => i.name === item.name && i.type === 'attachment');
                this.useItem(index);
            });
            attachmentsList.appendChild(div);
        });

        // Show equipped attachments
        if (window.weaponSystem.equippedWeapon.attachments.length > 0) {
            const equippedDiv = document.createElement('div');
            equippedDiv.innerHTML = '<strong>Takılı Eklentiler:</strong>';
            attachmentsList.appendChild(equippedDiv);

            window.weaponSystem.equippedWeapon.attachments.forEach(att => {
                const div = document.createElement('div');
                div.className = 'attachment-item';
                div.style.background = 'rgba(34, 197, 94, 0.2)';
                div.style.borderColor = '#22c55e';
                div.textContent = att.name + ' (Takılı)';
                attachmentsList.appendChild(div);
            });
        }
    }

    render() {
        const grid = document.getElementById('inventoryGrid');
        grid.innerHTML = '';

        // Render items
        for (let i = 0; i < this.maxSlots; i++) {
            const slot = document.createElement('div');
            slot.className = 'inventory-slot';
            
            if (i < this.items.length) {
                const item = this.items[i];
                slot.classList.add(item.type);
                
                const itemName = document.createElement('div');
                itemName.className = 'item-name';
                itemName.textContent = item.name;
                slot.appendChild(itemName);

                if (item.count) {
                    const count = document.createElement('div');
                    count.style.position = 'absolute';
                    count.style.bottom = '5px';
                    count.style.right = '5px';
                    count.style.fontSize = '12px';
                    count.textContent = item.count;
                    slot.appendChild(count);
                }

                slot.addEventListener('click', () => this.useItem(i));
            }

            grid.appendChild(slot);
        }
    }
}

window.inventory = new Inventory();


