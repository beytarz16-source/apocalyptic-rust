# GLTF Model Yükleme Sistemi

## Sistem Hazır!

Model yükleme sistemi tamamen hazır. Şimdi gerçek GLTF modellerini eklemeniz gerekiyor.

## Model Dosyalarını Ekleme

### 1. Klasör Yapısı
```
client/
  models/
    weapons/
      m4a1.gltf
      ak47.gltf
      glock17.gltf
    characters/
      player.gltf
    buildings/
      apartment.gltf
      warehouse.gltf
    chests/
      chest.gltf
    objects/
      container.gltf
      trash_bin.gltf
      tree.gltf
```

### 2. Model İndirme Kaynakları

#### Ücretsiz GLTF Modeller:
1. **Sketchfab** (https://sketchfab.com)
   - Ücretsiz modeller için "Download" → "glTF" formatını seçin
   - CC0 lisanslı modelleri tercih edin

2. **Poly Haven** (https://polyhaven.com)
   - Tamamen ücretsiz, CC0 lisanslı
   - Yüksek kaliteli modeller

3. **Free3D** (https://free3d.com)
   - Ücretsiz GLTF modelleri

4. **TurboSquid** (https://www.turbosquid.com)
   - Ücretsiz bölümü var

### 3. Model Önerileri

#### Silahlar:
- **M4A1**: "M4A1 rifle gltf" araması
- **AK-47**: "AK47 assault rifle gltf" araması
- **Glock 17**: "Glock 17 pistol gltf" araması

#### Karakter:
- "Survivor character gltf"
- "Post apocalyptic character gltf"
- "Human character gltf"

#### Binalar:
- "Apartment building gltf"
- "Warehouse gltf"
- "Abandoned building gltf"

#### Sandık:
- "Wooden chest gltf"
- "Treasure chest gltf"
- "Loot chest gltf"

#### Objeler:
- "Shipping container gltf"
- "Trash bin gltf"
- "Tree gltf"

### 4. Model Yükleme

Model dosyalarını `client/models/` klasörüne ekledikten sonra, sistem otomatik olarak yükleyecektir.

### 5. Fallback Sistemi

Eğer GLTF model yüklenemezse, sistem otomatik olarak detaylı procedural modeller kullanacaktır.

## Notlar

- Model dosyaları `.gltf` veya `.glb` formatında olmalı
- Texture dosyaları da aynı klasörde olmalı
- Model boyutları otomatik ölçeklendirilecek
- Cache sistemi sayesinde modeller bir kez yüklenecek

## Test

Model dosyalarını ekledikten sonra:
1. Tarayıcı konsolunu açın (F12)
2. "GLTF model yüklendi" mesajlarını kontrol edin
3. Modellerin göründüğünü doğrulayın

