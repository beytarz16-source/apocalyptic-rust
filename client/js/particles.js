class ParticleSystem {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
    }

    createMuzzleFlash(position, direction) {
        // Ateş parçacıkları
        const particleCount = 20;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);
        const lifetimes = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            positions[i3] = position.x;
            positions[i3 + 1] = position.y;
            positions[i3 + 2] = position.z;

            // Rastgele hız
            const speed = 0.5 + Math.random() * 0.5;
            const angle = Math.random() * Math.PI * 2;
            velocities[i3] = direction.x * speed + (Math.random() - 0.5) * 0.2;
            velocities[i3 + 1] = direction.y * speed + (Math.random() - 0.5) * 0.2;
            velocities[i3 + 2] = direction.z * speed + (Math.random() - 0.5) * 0.2;

            lifetimes[i] = 0.2 + Math.random() * 0.3;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
        geometry.setAttribute('lifetime', new THREE.BufferAttribute(lifetimes, 1));

        const material = new THREE.PointsMaterial({
            color: 0xff6600,
            size: 0.1,
            transparent: true,
            opacity: 1.0
        });

        const particles = new THREE.Points(geometry, material);
        particles.userData = {
            type: 'muzzleFlash',
            age: 0,
            maxAge: 0.5,
            velocities: velocities,
            lifetimes: lifetimes
        };

        this.scene.add(particles);
        this.particles.push(particles);

        return particles;
    }

    createSmoke(position) {
        // Duman parçacıkları
        const particleCount = 30;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);
        const lifetimes = new Float32Array(particleCount);
        const sizes = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            positions[i3] = position.x + (Math.random() - 0.5) * 0.5;
            positions[i3 + 1] = position.y;
            positions[i3 + 2] = position.z + (Math.random() - 0.5) * 0.5;

            velocities[i3] = (Math.random() - 0.5) * 0.1;
            velocities[i3 + 1] = 0.3 + Math.random() * 0.2;
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.1;

            lifetimes[i] = 2 + Math.random() * 2;
            sizes[i] = 0.2 + Math.random() * 0.3;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
        geometry.setAttribute('lifetime', new THREE.BufferAttribute(lifetimes, 1));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            color: 0x666666,
            size: 0.3,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(geometry, material);
        particles.userData = {
            type: 'smoke',
            age: 0,
            maxAge: 4,
            velocities: velocities,
            lifetimes: lifetimes,
            sizes: sizes
        };

        this.scene.add(particles);
        this.particles.push(particles);

        return particles;
    }

    update(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            const userData = particle.userData;
            userData.age += deltaTime;

            if (userData.age >= userData.maxAge) {
                this.scene.remove(particle);
                particle.geometry.dispose();
                particle.material.dispose();
                this.particles.splice(i, 1);
                continue;
            }

            const positions = particle.geometry.attributes.position.array;
            const velocities = userData.velocities;
            const lifetimes = userData.lifetimes;

            for (let j = 0; j < positions.length; j += 3) {
                const index = j / 3;
                const lifetime = lifetimes[index];
                const age = userData.age;

                if (age < lifetime) {
                    // Pozisyonu güncelle
                    positions[j] += velocities[j] * deltaTime;
                    positions[j + 1] += velocities[j + 1] * deltaTime;
                    positions[j + 2] += velocities[j + 2] * deltaTime;

                    // Opacity'yi güncelle
                    const progress = age / lifetime;
                    particle.material.opacity = 1 - progress;
                }
            }

            particle.geometry.attributes.position.needsUpdate = true;
        }
    }
}

window.ParticleSystem = ParticleSystem;

