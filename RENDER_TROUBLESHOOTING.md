# Render 500 Hatası - Sorun Giderme Rehberi

## 500 Hatası Nedir?

500 hatası, backend sunucunuzda bir hata olduğu anlamına gelir. En yaygın nedenler:

1. **JWT_SECRET environment variable eksik**
2. **server/data klasörü yazılabilir değil**
3. **Bağımlılıklar eksik**
4. **Kod hatası**

## Adım Adım Çözüm

### 1. Render Loglarını Kontrol Edin

1. Render dashboard'da service'inize tıklayın
2. **"Logs"** sekmesine gidin
3. Hata mesajlarını okuyun

**Aranacak Hatalar:**
- `JWT_SECRET is not defined`
- `Cannot find module`
- `EACCES: permission denied` (klasör izinleri)
- `ENOENT: no such file or directory` (dosya bulunamadı)

### 2. Environment Variables Kontrolü

1. Render dashboard'da service'inize tıklayın
2. Sol menüden **"Environment"** sekmesine gidin
3. **`JWT_SECRET`** değişkeninin olduğundan emin olun
4. Eğer yoksa:
   - **"Add Environment Variable"** butonuna tıklayın
   - **Key**: `JWT_SECRET`
   - **Value**: Güçlü bir rastgele string (örn: `aP0c4lyP7ic-Ru5t-2024-S3cr3t-K3y-!@#$%`)
   - **"Save Changes"** butonuna tıklayın
   - Render otomatik olarak yeniden deploy eder

### 3. Build Loglarını Kontrol Edin

1. Render dashboard'da service'inize tıklayın
2. **"Events"** sekmesine gidin
3. Son build'e tıklayın
4. Build loglarını kontrol edin

**Kontrol Edilecekler:**
- `npm install` başarılı mı?
- Tüm bağımlılıklar yüklendi mi?
- Build hatası var mı?

### 4. Manuel Yeniden Deploy

1. Render dashboard'da service'inize tıklayın
2. Sağ üst köşede **"Manual Deploy"** butonuna tıklayın
3. **"Deploy latest commit"** seçeneğini seçin
4. Bekleyin (5-10 dakika)

### 5. GitHub Repository Kontrolü

1. GitHub repository'nize gidin
2. Tüm dosyaların yüklendiğinden emin olun:
   - `package.json` var mı?
   - `server/` klasörü var mı?
   - `client/` klasörü var mı?
   - `server/data/` klasörü var mı? (yoksa otomatik oluşturulur)

### 6. package.json Kontrolü

`package.json` dosyanızda şu bağımlılıklar olmalı:

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "socket.io": "^4.6.1",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5"
  }
}
```

## Yaygın Hatalar ve Çözümleri

### Hata: "JWT_SECRET is not defined"

**Çözüm:**
1. Render dashboard → Environment sekmesi
2. `JWT_SECRET` environment variable ekleyin
3. Yeniden deploy edin

### Hata: "Cannot find module 'express'"

**Çözüm:**
1. `package.json` dosyasını kontrol edin
2. Bağımlılıkların doğru olduğundan emin olun
3. GitHub'a push yapın
4. Render otomatik olarak yeniden deploy eder

### Hata: "EACCES: permission denied"

**Çözüm:**
- Render otomatik olarak klasör izinlerini ayarlar
- Kod güncellemesi yapıldı (server/routes/auth.js)
- Yeniden deploy edin

### Hata: "ENOENT: no such file or directory"

**Çözüm:**
- Kod güncellemesi yapıldı (server/routes/auth.js)
- `server/data` klasörü otomatik oluşturulacak
- Yeniden deploy edin

## Test Adımları

1. Render loglarında "Server running on port XXXX" mesajını görüyor musunuz?
2. Environment variables'da `JWT_SECRET` var mı?
3. Build başarılı mı?
4. Browser console'da hala 500 hatası alıyor musunuz?

## Hala Çalışmıyorsa

1. Render loglarını kopyalayın
2. Browser console'daki hata mesajlarını kopyalayın
3. Bu bilgileri paylaşın, daha spesifik yardım edebilirim

