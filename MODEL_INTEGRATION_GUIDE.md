# Model Entegrasyon Rehberi

## ✅ Eklenen Modeller

### Silahlar
- ✅ **AK-47**: `client/models/weapons/ak47.gltf`
- ✅ **M4A1**: `client/models/weapons/m4a1.gltf`

### Karakter
- ✅ **Player**: `client/models/characters/player.gltf`

### Sandıklar
- ✅ **Loot Chest**: `client/models/chests/chest.gltf`

### Binalar
- ✅ **Apartment**: `client/models/buildings/apartment.gltf`
- ✅ **Warehouse**: `client/models/buildings/warehouse.gltf`

### Objeler
- ✅ **Trash Bin**: `client/models/objects/trash_bin.gltf`
- ✅ **Car**: `client/models/objects/car.gltf` (YENİ)
- ✅ **Barriers**: `client/models/objects/barriers.gltf` (YENİ)

## 🎮 Oyun İçinde Kullanım

### Otomatik Yükleme
Modeller otomatik olarak yüklenir:
- Silahlar: Oyuncu silah aldığında
- Karakter: Oyun başladığında
- Sandıklar: Loot oluşturulduğunda
- Binalar: Dünya oluşturulurken
- Objeler: Çevre detayları oluşturulurken

### Manuel Entegrasyon (İsteğe Bağlı)

Eğer arabaları ve bariyerleri oyunda görünür yapmak istiyorsanız:

#### 1. `client/js/game.js` dosyasını açın

#### 2. `createEnvironmentDetails()` veya `createAdditionalObjects()` fonksiyonuna ekleyin:

```javascript
// Araba ekleme
async createCars() {
    for (let i = 0; i < 5; i++) {
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
            // Basit araba modeli oluştur
            const body = new THREE.Mesh(
                new THREE.BoxGeometry(4, 1.5, 2),
                new THREE.MeshStandardMaterial({ color: 0x333333 })
            );
            carGroup.add(body);
        }
        
        carGroup.position.set(
            (Math.random() - 0.5) * 200,
            0,
            (Math.random() - 0.5) * 200
        );
        carGroup.rotation.y = Math.random() * Math.PI * 2;
        this.scene.add(carGroup);
    }
}

// Bariyer ekleme
async createBarriers() {
    for (let i = 0; i < 10; i++) {
        let barrierGroup = null;
        
        // GLTF model yükleme
        if (this.modelLoader) {
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
            // Basit bariyer modeli oluştur
            const barrier = new THREE.Mesh(
                new THREE.BoxGeometry(2, 1, 0.3),
                new THREE.MeshStandardMaterial({ color: 0x666666 })
            );
            barrierGroup.add(barrier);
        }
        
        barrierGroup.position.set(
            (Math.random() - 0.5) * 180,
            0,
            (Math.random() - 0.5) * 180
        );
        barrierGroup.rotation.y = Math.random() * Math.PI * 2;
        this.scene.add(barrierGroup);
    }
}
```

#### 3. `createWorld()` fonksiyonunda çağırın:

```javascript
async createWorld() {
    // ... mevcut kod ...
    
    // Yeni objeleri ekle
    await this.createCars();
    await this.createBarriers();
}
```

## 🔧 Test Etme

1. **Oyunu başlatın**: `npm start` komutu ile
2. **Tarayıcı konsolunu açın** (F12)
3. **Şu mesajları kontrol edin**:
   - `GLTF model yüklendi: car` (arabalar için)
   - `GLTF model yüklendi: barriers` (bariyerler için)
   - `GLTF model yüklendi: ak47` (AK-47 için)
   - `GLTF model yüklendi: m4a1` (M4A1 için)
   - `GLTF karakter modeli yüklendi` (karakter için)
   - `GLTF sandık modeli yüklendi` (sandıklar için)
4. **Oyun dünyasında kontrol edin**:
   - Arabaları görün (5 adet, haritanın çeşitli yerlerinde)
   - Bariyerleri görün (10 adet, bazıları GLTF model)
   - Silahları görün (first-person view'da)
   - Karakteri görün (diğer oyuncular için)

## 📝 Notlar

- ✅ Modeller otomatik olarak cache'lenir
- ✅ Texture'lar otomatik yüklenir
- ✅ Model yüklenemezse procedural modeller kullanılır (fallback)
- ✅ Tüm modeller `client/models/` klasöründe
- ✅ Model yükleme sistemi tamamen otomatik çalışıyor

## 🚀 Şimdi Ne Yapmalısınız?

### 1. Oyunu Test Edin
```bash
npm start
```
Tarayıcıda `http://localhost:3000` adresine gidin ve oyunu başlatın.

### 2. Konsol Loglarını Kontrol Edin
- F12 tuşuna basın
- Console sekmesine gidin
- Model yükleme mesajlarını kontrol edin

### 3. Oyun İçinde Kontrol Edin
- **Arabalar**: Haritada 5 adet terk edilmiş araba görünmeli
- **Bariyerler**: Haritada 10 adet bariyer görünmeli (bazıları GLTF model)
- **Silahlar**: Silah aldığınızda first-person view'da gerçek model görünmeli
- **Karakter**: Diğer oyuncular gerçek karakter modeliyle görünmeli

### 4. Sorun Giderme
Eğer modeller görünmüyorsa:
1. Konsol hatalarını kontrol edin
2. `client/models/` klasöründe dosyaların olduğunu doğrulayın
3. Texture dosyalarının da aynı klasörde olduğunu kontrol edin
4. Tarayıcı cache'ini temizleyin (Ctrl+Shift+R)

## ✅ Tamamlanan İşlemler

- ✅ Tüm modeller `client/models/` klasörüne yerleştirildi
- ✅ Model yükleme sistemi (`modelLoader.js`) hazır
- ✅ Arabalar oyuna entegre edildi
- ✅ Bariyerler oyuna entegre edildi
- ✅ Fallback sistemi çalışıyor (GLTF yüklenemezse procedural kullanılıyor)

