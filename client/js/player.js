class Player {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.position = { x: 0, y: 1.6, z: 0 };
        this.rotation = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0, z: 0 };
        this.speed = 5;
        this.jumpSpeed = 8;
        this.isGrounded = true;
        
        // Stats
        this.health = 100;
        this.armor = 0;
        this.hunger = 100;
        this.thirst = 100;

        // Controls
        this.keys = {};
        this.mouseMovement = { x: 0, y: 0 };
        this.mouseSensitivity = 0.002;

        // Third person camera
        this.cameraDistance = 5;
        this.cameraHeight = 2;
        this.cameraAngle = 0;

        this.init();
    }

    init() {
        // Create player model (simplified - using cylinder for body and sphere for head)
        const bodyGeometry = new THREE.CylinderGeometry(0.4, 0.4, 1.2, 8);
        const headGeometry = new THREE.SphereGeometry(0.3, 8, 8);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x8b4513,
            roughness: 0.8,
            metalness: 0.2
        });
        
        // Body
        const body = new THREE.Mesh(bodyGeometry, material);
        body.position.y = 0.6;
        
        // Head
        const head = new THREE.Mesh(headGeometry, material);
        head.position.y = 1.5;
        
        // Group them together
        this.mesh = new THREE.Group();
        this.mesh.add(body);
        this.mesh.add(head);
        this.mesh.position.set(this.position.x, this.position.y, this.position.z);
        this.scene.add(this.mesh);

        // Setup controls
        this.setupControls();
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

        this.position.x += moveVector.x;
        this.position.z += moveVector.z;

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

        // Update mesh position
        this.mesh.position.set(this.position.x, this.position.y, this.position.z);
        this.mesh.rotation.y = this.rotation.y;

        // Update camera (third person)
        const cameraOffset = new THREE.Vector3(0, this.cameraHeight, this.cameraDistance);
        cameraOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotation.y);
        
        this.camera.position.set(
            this.position.x + cameraOffset.x,
            this.position.y + cameraOffset.y,
            this.position.z + cameraOffset.z
        );
        this.camera.lookAt(this.position.x, this.position.y + 1, this.position.z);

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

    takeDamage(amount) {
        const actualDamage = Math.max(0, amount - this.armor * 0.5);
        this.health = Math.max(0, this.health - actualDamage);
        
        if (this.armor > 0) {
            this.armor = Math.max(0, this.armor - amount * 0.1);
        }
    }
}

