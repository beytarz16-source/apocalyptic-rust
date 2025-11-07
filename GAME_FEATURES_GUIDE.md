# 🎮 APOCALYPTIC RUST - Oyun Özellikleri ve Geliştirme Rehberi

## 📋 MEVCUT OYUN ÖZELLİKLERİ

### 🎯 Temel Sistemler

#### 1. **Kimlik Doğrulama Sistemi**
- ✅ Kullanıcı kayıt ve giriş
- ✅ JWT token tabanlı authentication
- ✅ Şifre hashleme (bcrypt)
- ✅ Session yönetimi

#### 2. **3D Dünya ve Grafik**
- ✅ Three.js tabanlı 3D render engine
- ✅ Açık dünya haritası (1000x1000 birim)
- ✅ First-person kamera
- ✅ Fog efekti (atmosfer)
- ✅ Shadow mapping (gölgeler)
- ✅ Procedural texture'lar (zemin, yollar, binalar)
- ✅ GLTF model desteği (buildings, characters, weapons, chests)
- ✅ Procedural fallback modeller

#### 3. **Oyun Dünyası (World)**
- ✅ **Zemin**: Procedural beton/asfalt texture
- ✅ **Yollar**: Asfalt + sarı çizgiler
- ✅ **Binalar**: 
  - 6 adet (apartment, warehouse)
  - GLTF modelleri
  - Collision detection
- ✅ **Araçlar**: 5 adet terk edilmiş araba (procedural)
- ✅ **Bariyerler**: 10 adet çit/bariyer
- ✅ **Konteynerler**: 8 adet (2.4m x 2.4m x 6m)
- ✅ **Çöp Kutuları**: 25 adet
- ✅ **Ağaçlar**: 50 adet (procedural, rastgele boyut)
- ✅ **Sokak Lambaları**: 15 adet (ışıklı)
- ✅ **Çöp ve Moloz**: 20 adet rastgele

#### 4. **Oyuncu Sistemi (Player)**
- ✅ **Hareket**: W/A/S/D
- ✅ **Koşma**: Shift tuşu (8 birim/saniye)
- ✅ **Yürüme**: Normal hız (5 birim/saniye)
- ✅ **Zıplama**: Boşluk tuşu
- ✅ **Kamera**: Mouse ile bakış
- ✅ **İstatistikler**:
  - Can (Health): 100
  - Zırh (Armor): 0-100
  - Açlık (Hunger): 0-100
  - Susuzluk (Thirst): 0-100
- ✅ **Collision Detection**: 
  - Binalar, ağaçlar, konteynerler, arabalar, bariyerler
  - AABB (Axis-Aligned Bounding Box) algoritması
- ✅ **Gravity**: Fizik tabanlı düşme
- ✅ **Ground Detection**: Zemin algılama

#### 5. **Silah Sistemi (Weapons)**
- ✅ **5 Silah Türü**:
  - **M4A1**: Rifle, 30 damage, 600 RPM, 30 mermi
  - **AK-47**: Rifle, 35 damage, 600 RPM, 30 mermi
  - **Kar98k**: Sniper, 75 damage, 30 RPM, 5 mermi
  - **MP5**: SMG, 25 damage, 800 RPM, 30 mermi
  - **Glock 17**: Pistol, 20 damage, 400 RPM, 17 mermi
- ✅ **Ateş Sistemi**: Sol tık
- ✅ **Nişan Alma (ADS)**: Sağ tık
- ✅ **Şarjör Değiştirme**: R tuşu
- ✅ **Mühimmat Sistemi**: 
  - Şarjör içi mermi
  - Toplam mermi
  - Mühimmat türleri (5.56mm, 7.62mm, 9mm)
- ✅ **Fire Rate**: Silah başına farklı atış hızı
- ✅ **Recoil**: Geri tepme sistemi
- ✅ **Range**: Menzil sistemi

#### 6. **Eklenti Sistemi (Attachments)**
- ✅ **Scope'lar**:
  - Red Dot Sight
  - 2x Scope
  - 4x Scope
- ✅ **Namlu Eklentileri**:
  - Suppressor (Susturucu)
  - Compensator (Kompansatör)
- ✅ **Kabza Eklentileri**:
  - Vertical Grip (Dikey Kabza)
  - Angled Grip (Açılı Kabza)
- ✅ **Şarjör Eklentileri**:
  - Extended Magazine (Genişletilmiş Şarjör)
  - Quick Draw Magazine (Hızlı Çekme Şarjörü)
- ✅ Eklentiler silaha takılabilir
- ✅ Eklenti efektleri (henüz tam implement edilmemiş)

#### 7. **Envanter Sistemi (Inventory)**
- ✅ 30 slot envanter
- ✅ E tuşu ile aç/kapa
- ✅ Drag & drop desteği (planlanmış)
- ✅ **Eşya Türleri**:
  - Silahlar
  - Mühimmat
  - Yiyecek
  - Su
  - Eklentiler
- ✅ Eşya kullanma (tıklama)
- ✅ Eklenti yönetimi

#### 8. **Loot Sistemi (Toplanabilir Eşyalar)**
- ✅ **Loot Chests**: Sandık sistemi
  - GLTF modelleri
  - Rastgele konumlarda spawn
  - F tuşu ile toplama
  - 3 metre etkileşim menzili
- ✅ **Loot Türleri**:
  - Silahlar (tüm silah türleri)
  - Mühimmat (5.56mm, 7.62mm, 9mm)
  - Eklentiler (tüm eklenti türleri)
  - Yiyecek (Canned Food)
  - Su (Water Bottle)
- ✅ Loot animasyonu (yukarı-aşağı hareket, dönme)
- ✅ Glow efekti (parıltı)

#### 9. **Çok Oyunculu (Multiplayer)**
- ✅ Socket.io tabanlı real-time iletişim
- ✅ Diğer oyuncuları görme
- ✅ Pozisyon senkronizasyonu
- ✅ Oyuncu giriş/çıkış bildirimleri
- ✅ Loot toplama senkronizasyonu
- ✅ Game state senkronizasyonu

#### 10. **HUD (Heads-Up Display)**
- ✅ **Can Barı**: Kırmızı, 0-100
- ✅ **Zırh Barı**: Turuncu, 0-100
- ✅ **Açlık Barı**: Turuncu, 0-100
- ✅ **Susuzluk Barı**: Mavi, 0-100
- ✅ **Mühimmat Göstergesi**: "30/120" formatı
- ✅ **Etkileşim İpucu**: "F - Topla" mesajı
- ✅ **Çıkış Butonu**: Sağ üst köşe

#### 11. **Harita Sistemi (Map)**
- ✅ M tuşu ile aç/kapa
- ✅ Canvas tabanlı harita
- ✅ Oyuncu pozisyonu gösterimi
- ✅ Dünya haritası görünümü
- ✅ Responsive tasarım

#### 12. **Ses Sistemi (Audio)**
- ✅ **AudioManager** sınıfı
- ✅ **Ses Efektleri**:
  - Ateş sesi (shoot)
  - Şarjör değiştirme (reload)
  - Ayak sesi (footstep)
  - Loot toplama (loot)
- ✅ Synthesized sesler (gerçek dosyalar eklenebilir)
- ✅ Ses seviyesi kontrolü

#### 13. **Parçacık Efektleri (Particles)**
- ✅ **Muzzle Flash**: Namlu ağzında parıltı
- ✅ **Duman**: Ateş sonrası duman efekti
- ✅ Otomatik temizleme (performans)
- ✅ Three.js Points sistemi

#### 14. **Menü Sistemleri**
- ✅ **Duraklatma Menüsü**: ESC tuşu
- ✅ **Envanter Menüsü**: E tuşu
- ✅ **Harita Menüsü**: M tuşu
- ✅ Menü geçişleri (bir menü açıkken diğeri kapanır)

#### 15. **Collision Detection**
- ✅ AABB (Axis-Aligned Bounding Box) algoritması
- ✅ Cylinder collision (ağaçlar için)
- ✅ Box collision (binalar, konteynerler, arabalar, bariyerler)
- ✅ Yükseklik kontrolü
- ✅ Player radius (0.4 birim)

---

## 🚀 EKLENEBİLECEK ÖZELLİKLER

### 🎯 Yüksek Öncelikli Özellikler

#### 1. **Combat Sistemi**
- ⚠️ **Player vs Player (PvP)**: Diğer oyunculara hasar verme
- ⚠️ **Damage Calculation**: Zırh, mesafe, silah türüne göre hasar
- ⚠️ **Hit Detection**: Raycasting ile isabet kontrolü
- ⚠️ **Health System**: Can azalması, ölüm, respawn
- ⚠️ **Kill Feed**: Öldürme bildirimleri
- ⚠️ **Damage Numbers**: Hasar sayıları gösterimi

#### 2. **Crafting Sistemi**
- ⚠️ **Crafting Table**: Üretim masası
- ⚠️ **Recipe System**: Tarif sistemi
- ⚠️ **Material Gathering**: Malzeme toplama
- ⚠️ **Item Crafting**: Eşya üretimi
  - Silah üretimi
  - Eklenti üretimi
  - Yiyecek üretimi
  - Zırh üretimi

#### 3. **Base Building**
- ⚠️ **Foundation**: Temel inşaat
- ⚠️ **Walls**: Duvar inşaatı
- ⚠️ **Doors**: Kapı inşaatı
- ⚠️ **Windows**: Pencere inşaatı
- ⚠️ **Storage**: Depolama alanları
- ⚠️ **Crafting Stations**: Üretim istasyonları

#### 4. **Survival Mekanikleri**
- ⚠️ **Hunger/Thirst Decay**: Açlık/susuzluk azalması
- ⚠️ **Health Decay**: Açlık/susuzluk sıfırken can azalması
- ⚠️ **Temperature System**: Sıcaklık sistemi
- ⚠️ **Radiation Zones**: Radyasyon bölgeleri
- ⚠️ **Day/Night Cycle**: Gündüz/gece döngüsü
- ⚠️ **Weather System**: Hava durumu

#### 5. **AI ve NPC'ler**
- ⚠️ **Zombies**: Zombi düşmanlar
- ⚠️ **Wildlife**: Vahşi hayvanlar
- ⚠️ **Traders**: Tüccar NPC'ler
- ⚠️ **AI Pathfinding**: Yapay zeka yol bulma
- ⚠️ **AI Combat**: NPC savaş sistemi

### 🎨 Orta Öncelikli Özellikler

#### 6. **Gelişmiş Silah Sistemi**
- ⚠️ **Weapon Modding**: Silah modifikasyonu
- ⚠️ **Weapon Durability**: Silah dayanıklılığı
- ⚠️ **Weapon Repair**: Silah tamiri
- ⚠️ **Weapon Skins**: Silah görünümleri
- ⚠️ **Weapon Stats**: Detaylı silah istatistikleri

#### 7. **Araç Sistemi**
- ⚠️ **Vehicle Spawning**: Araç spawn etme
- ⚠️ **Vehicle Driving**: Araç kullanma
- ⚠️ **Vehicle Fuel**: Yakıt sistemi
- ⚠️ **Vehicle Repair**: Araç tamiri
- ⚠️ **Vehicle Storage**: Araç envanteri

#### 8. **Gelişmiş Envanter**
- ⚠️ **Item Stacking**: Eşya yığınlama
- ⚠️ **Item Sorting**: Eşya sıralama
- ⚠️ **Item Search**: Eşya arama
- ⚠️ **Quick Slots**: Hızlı slotlar (1-9)
- ⚠️ **Hotbar**: Alt çubuk

#### 9. **Ticaret Sistemi**
- ⚠️ **Player Trading**: Oyuncu ticareti
- ⚠️ **NPC Trading**: NPC ticareti
- ⚠️ **Currency System**: Para sistemi
- ⚠️ **Market System**: Pazar sistemi

#### 10. **Quest/Mission Sistemi**
- ⚠️ **Daily Quests**: Günlük görevler
- ⚠️ **Story Quests**: Hikaye görevleri
- ⚠️ **Random Events**: Rastgele olaylar
- ⚠️ **Reward System**: Ödül sistemi

### 🎮 Düşük Öncelikli Özellikler

#### 11. **Görsel İyileştirmeler**
- ⚠️ **Better Textures**: Daha iyi texture'lar
- ⚠️ **Normal Maps**: Normal haritalar
- ⚠️ **PBR Materials**: Fiziksel render materyalleri
- ⚠️ **Post-Processing**: Görsel efektler
- ⚠️ **Better Lighting**: Gelişmiş aydınlatma

#### 12. **Ses İyileştirmeleri**
- ⚠️ **Real Sound Files**: Gerçek ses dosyaları
- ⚠️ **3D Audio**: 3D ses sistemi
- ⚠️ **Music System**: Müzik sistemi
- ⚠️ **Ambient Sounds**: Ortam sesleri

#### 13. **UI/UX İyileştirmeleri**
- ⚠️ **Better HUD**: Daha iyi HUD tasarımı
- ⚠️ **Settings Menu**: Ayarlar menüsü
- ⚠️ **Keybindings**: Tuş atamaları
- ⚠️ **Graphics Settings**: Grafik ayarları
- ⚠️ **Accessibility**: Erişilebilirlik

#### 14. **Sosyal Özellikler**
- ⚠️ **Clan System**: Klan sistemi
- ⚠️ **Friends System**: Arkadaş sistemi
- ⚠️ **Chat System**: Sohbet sistemi
- ⚠️ **Voice Chat**: Sesli sohbet
- ⚠️ **Emotes**: İfadeler

#### 15. **İstatistik ve İlerleme**
- ⚠️ **Player Stats**: Oyuncu istatistikleri
- ⚠️ **Achievements**: Başarımlar
- ⚠️ **Leaderboards**: Liderlik tablosu
- ⚠️ **Progression System**: İlerleme sistemi
- ⚠️ **Level System**: Seviye sistemi

---

## 🛠️ TEKNİK DETAYLAR

### Backend
- **Node.js** + **Express**
- **Socket.io** (real-time iletişim)
- **JWT** (authentication)
- **bcrypt** (şifre hashleme)
- **JSON** (veri saklama)

### Frontend
- **Three.js** (3D render)
- **WebGL** (grafik API)
- **HTML5** + **CSS3**
- **JavaScript (ES6+)**

### Model Formatları
- **GLTF/GLB** (3D modeller)
- **Procedural Models** (fallback)

### Dosya Yapısı
```
client/
├── js/
│   ├── game.js          # Ana oyun mantığı
│   ├── player.js        # Oyuncu sistemi
│   ├── weapons.js       # Silah sistemi
│   ├── inventory.js     # Envanter sistemi
│   ├── lootChest.js     # Sandık sistemi
│   ├── map.js           # Harita sistemi
│   ├── audio.js         # Ses sistemi
│   ├── particles.js     # Parçacık efektleri
│   ├── modelLoader.js   # Model yükleme
│   ├── auth.js          # Kimlik doğrulama
│   └── main.js          # Ana başlatma
├── models/              # 3D modeller
│   ├── buildings/
│   ├── characters/
│   ├── weapons/
│   ├── chests/
│   └── objects/
└── sounds/              # Ses dosyaları (planlanmış)

server/
├── index.js             # Ana sunucu
├── routes/              # API route'ları
├── game/                # Oyun sunucu mantığı
└── data/                # Veri dosyaları
```

---

## 📝 GELİŞTİRME ÖNERİLERİ

### 1. **Combat Sistemi Ekleme**
```javascript
// client/js/combat.js
class CombatSystem {
    calculateDamage(weapon, distance, armor) {
        // Hasar hesaplama
    }
    
    raycastHit(start, direction, range) {
        // Raycasting ile isabet kontrolü
    }
}
```

### 2. **Crafting Sistemi Ekleme**
```javascript
// client/js/crafting.js
class CraftingSystem {
    recipes = {
        'M4A1': {
            materials: ['Metal', 'Wood', 'Spring'],
            time: 30
        }
    }
}
```

### 3. **Base Building Ekleme**
```javascript
// client/js/building.js
class BuildingSystem {
    placeFoundation(position) {
        // Temel yerleştirme
    }
}
```

---

## 🎯 SONUÇ

Oyun şu anda **temel hayatta kalma mekanikleri** ile çalışıyor. En önemli eksiklikler:
1. **Combat sistemi** (PvP)
2. **Crafting sistemi**
3. **Base building**
4. **AI/NPC'ler**

Bu özellikler eklendiğinde oyun tam bir **survival game** haline gelecek!

