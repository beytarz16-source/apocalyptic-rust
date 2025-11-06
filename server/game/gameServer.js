class GameServer {
  constructor(io) {
    this.io = io;
    this.players = new Map();
    this.lootItems = new Map();
    this.bullets = [];
    this.initLoot();
  }

  initLoot() {
    // Initialize some loot items in the world
    const lootPositions = [
      { x: 10, y: 0, z: 10 },
      { x: -15, y: 0, z: 20 },
      { x: 25, y: 0, z: -10 },
      { x: -20, y: 0, z: -25 },
      { x: 30, y: 0, z: 15 }
    ];

    lootPositions.forEach((pos, index) => {
      const loot = this.generateRandomLoot();
      this.lootItems.set(`loot_${index}`, {
        id: `loot_${index}`,
        position: pos,
        item: loot,
        collected: false
      });
    });
  }

  generateRandomLoot() {
    const lootTypes = [
      { type: 'weapon', name: 'M4A1', ammo: 30 },
      { type: 'weapon', name: 'AK-47', ammo: 30 },
      { type: 'weapon', name: 'Kar98k', ammo: 5 },
      { type: 'weapon', name: 'MP5', ammo: 30 },
      { type: 'weapon', name: 'Glock 17', ammo: 17 },
      { type: 'attachment', name: 'Red Dot Sight' },
      { type: 'attachment', name: '2x Scope' },
      { type: 'attachment', name: '4x Scope' },
      { type: 'attachment', name: 'Suppressor' },
      { type: 'attachment', name: 'Compensator' },
      { type: 'attachment', name: 'Vertical Grip' },
      { type: 'attachment', name: 'Angled Grip' },
      { type: 'attachment', name: 'Extended Magazine' },
      { type: 'attachment', name: 'Quick Draw Magazine' },
      { type: 'ammo', name: '5.56mm', count: 60 },
      { type: 'ammo', name: '7.62mm', count: 30 },
      { type: 'ammo', name: '9mm', count: 60 },
      { type: 'food', name: 'Canned Food', value: 20 },
      { type: 'water', name: 'Water Bottle', value: 20 }
    ];

    return lootTypes[Math.floor(Math.random() * lootTypes.length)];
  }

  addPlayer(socketId, data, socket) {
    const spawnPosition = { x: 0, y: 0, z: 0 };
    const player = {
      id: socketId,
      username: data.username || 'Player',
      position: spawnPosition,
      rotation: { x: 0, y: 0, z: 0 },
      health: 100,
      armor: 0,
      hunger: 100,
      thirst: 100,
      inventory: [],
      equippedWeapon: null,
      ammo: {}
    };

    this.players.set(socketId, player);
    
    // Send current game state to new player
    this.io.to(socketId).emit('game:state', {
      players: Array.from(this.players.values()),
      loot: Array.from(this.lootItems.values()).filter(l => !l.collected)
    });

    // Notify other players
    socket.broadcast.emit('player:joined', player);
  }

  updatePlayerPosition(socketId, data, socket) {
    const player = this.players.get(socketId);
    if (player) {
      player.position = data.position;
      player.rotation = data.rotation;
      
      // Broadcast to all other players
      socket.broadcast.emit('player:moved', {
        id: socketId,
        position: data.position,
        rotation: data.rotation
      });
    }
  }

  handleShoot(socketId, data) {
    const player = this.players.get(socketId);
    if (!player || !player.equippedWeapon) return;

    // Check ammo
    const weaponAmmo = player.ammo[player.equippedWeapon.ammoType] || 0;
    if (weaponAmmo <= 0) return;

    // Deduct ammo
    player.ammo[player.equippedWeapon.ammoType] = Math.max(0, weaponAmmo - 1);

    // Create bullet
    const bullet = {
      id: `bullet_${Date.now()}_${socketId}`,
      playerId: socketId,
      position: data.position,
      direction: data.direction,
      damage: player.equippedWeapon.damage || 25,
      speed: 100
    };

    this.bullets.push(bullet);

    // Broadcast shot
    this.io.emit('bullet:created', bullet);
  }

  handleLoot(socketId, lootId) {
    const loot = this.lootItems.get(lootId);
    if (!loot || loot.collected) return;

    const player = this.players.get(socketId);
    if (!player) return;

    // Check distance
    const distance = Math.sqrt(
      Math.pow(player.position.x - loot.position.x, 2) +
      Math.pow(player.position.z - loot.position.z, 2)
    );

    if (distance > 3) return; // Too far

    loot.collected = true;
    player.inventory.push(loot.item);

    // Broadcast loot collection with item data
    this.io.emit('loot:collected', { 
      lootId, 
      playerId: socketId,
      item: loot.item
    });

    // Spawn new loot after delay
    setTimeout(() => {
      const newLoot = this.generateRandomLoot();
      const newPosition = {
        x: (Math.random() - 0.5) * 100,
        y: 0,
        z: (Math.random() - 0.5) * 100
      };
      this.lootItems.set(lootId, {
        id: lootId,
        position: newPosition,
        item: newLoot,
        collected: false
      });
      this.io.emit('loot:spawned', {
        id: lootId,
        position: newPosition,
        item: newLoot
      });
    }, 30000); // Respawn after 30 seconds
  }

  updateInventory(socketId, inventory) {
    const player = this.players.get(socketId);
    if (player) {
      player.inventory = inventory;
    }
  }

  removePlayer(socketId) {
    this.players.delete(socketId);
    this.io.emit('player:left', socketId);
  }
}

module.exports = { GameServer };

