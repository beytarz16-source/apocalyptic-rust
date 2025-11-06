# Debug Rehberi - Siyah Ekran Sorunu

## Sorun: Ekran Siyah Kalıyor

Eğer oyun ekranı siyah kalıyorsa, şu adımları izleyin:

### 1. Tarayıcı Konsolunu Açın
- **Chrome/Edge**: F12 veya Ctrl+Shift+I
- **Firefox**: F12 veya Ctrl+Shift+K
- **Safari**: Cmd+Option+I

### 2. Konsolda Hata Kontrolü
Konsolda şu mesajları arayın:

#### ✅ Başarılı Mesajlar:
- `"Game init başlatılıyor..."`
- `"Player oluşturuldu"`
- `"Game başarıyla başlatıldı!"`

#### ❌ Hata Mesajları:
- `"THREE.js yüklenmedi!"` → Three.js kütüphanesi yüklenmemiş
- `"ParticleSystem yüklenmedi"` → Parçacık sistemi yüklenmemiş (kritik değil)
- `"Player class yüklenmedi!"` → Player.js yüklenmemiş
- `"Scene oluşturulamadı!"` → Scene oluşturulamadı
- `"Not authenticated"` → Giriş yapılmamış

### 3. Yaygın Sorunlar ve Çözümleri

#### Sorun 1: THREE.js Yüklenmedi
**Çözüm:**
- İnternet bağlantınızı kontrol edin
- CDN'e erişim engellenmiş olabilir
- Tarayıcıyı yenileyin (Ctrl+F5)

#### Sorun 2: Script Yükleme Hatası
**Çözüm:**
- Network sekmesinde hangi script'in yüklenemediğini kontrol edin
- Script dosyalarının doğru yolda olduğundan emin olun

#### Sorun 3: Authentication Hatası
**Çözüm:**
- Önce giriş yapın
- Token'ın localStorage'da olduğundan emin olun

#### Sorun 4: Render Hatası
**Çözüm:**
- WebGL desteğini kontrol edin: https://get.webgl.org/
- Tarayıcıyı güncelleyin
- Grafik sürücülerini güncelleyin

### 4. Manuel Test

Tarayıcı konsolunda şu komutları çalıştırın:

```javascript
// THREE.js yüklendi mi?
console.log(typeof THREE);

// Game instance var mı?
console.log(window.game);

// Scene oluşturuldu mu?
console.log(window.game?.scene);

// Player var mı?
console.log(window.game?.player);

// Renderer var mı?
console.log(window.game?.renderer);
```

### 5. Hızlı Düzeltme

Eğer hala çalışmıyorsa:

1. **Tarayıcıyı tamamen kapatıp açın**
2. **Cache'i temizleyin** (Ctrl+Shift+Delete)
3. **Hard refresh yapın** (Ctrl+F5)
4. **Farklı bir tarayıcı deneyin**

### 6. Log Dosyası

Konsoldaki tüm hataları kopyalayıp paylaşın, böylece daha spesifik yardım edebiliriz.

