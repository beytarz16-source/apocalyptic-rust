# Deploy Kontrol Listesi

## ✅ Yapılan İşlemler

### 1. Modeller Eklendi
- ✅ AK-47 silah modeli
- ✅ M4A1 silah modeli
- ✅ Karakter modeli
- ✅ Sandık modelleri
- ✅ Bina modelleri (apartment, warehouse)
- ✅ Çöp kutusu modeli
- ✅ Araba modeli
- ✅ Bariyer modelleri

### 2. Kod Güncellemeleri
- ✅ Model yükleme sistemi (`modelLoader.js`)
- ✅ Oyun entegrasyonu (`game.js`)
- ✅ Async/await desteği
- ✅ Fallback sistemi

### 3. Git İşlemleri
- ✅ Değişiklikler commit edildi
- ✅ Model dosyaları eklendi

## 🚀 Deploy Adımları

### Render.com için:

1. **GitHub'a Push Yapın** (eğer remote yoksa):
   ```bash
   git remote add origin https://github.com/KULLANICI_ADI/REPO_ADI.git
   git push -u origin main
   ```

2. **Render Dashboard'a Gidin**:
   - https://dashboard.render.com
   - "New +" butonuna tıklayın
   - "Web Service" seçin

3. **Repository Bağlayın**:
   - GitHub repository'nizi seçin
   - Branch: `main` veya `master`

4. **Ayarları Yapın**:
   - **Name**: `apocalyptic-rust` (veya istediğiniz isim)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server/index.js`
   - **Plan**: Free

5. **Environment Variables Ekleyin**:
   - `JWT_SECRET`: Güçlü bir secret key (örn: `your-super-secret-key-here-12345`)
   - `NODE_ENV`: `production`
   - `PORT`: Render otomatik ayarlar (genelde 10000)

6. **Deploy Edin**:
   - "Create Web Service" butonuna tıklayın
   - İlk deploy 5-10 dakika sürebilir

## 🧪 Test Adımları

### Yerel Test:
1. `npm start` ile başlatın
2. `http://localhost:3000` adresine gidin
3. Konsol loglarını kontrol edin (F12)
4. Modellerin yüklendiğini doğrulayın

### Deploy Sonrası Test:
1. Render'dan verilen URL'e gidin
2. Kayıt ol / Giriş yap
3. Oyunu başlatın
4. Modellerin göründüğünü kontrol edin
5. Konsol hatalarını kontrol edin

## ⚠️ Önemli Notlar

- Model dosyaları büyük olabilir, ilk yükleme yavaş olabilir
- Texture dosyaları da yüklenecek, toplam boyut kontrol edin
- Render free tier'da dosya boyutu limitleri olabilir
- Eğer model dosyaları çok büyükse, CDN kullanmayı düşünün

## 🔍 Sorun Giderme

### Model Yüklenmiyor:
1. Konsol hatalarını kontrol edin
2. Network sekmesinde 404 hatalarını kontrol edin
3. Model dosya yollarını kontrol edin
4. CORS hatalarını kontrol edin

### Deploy Başarısız:
1. Build loglarını kontrol edin
2. `package.json` dosyasını kontrol edin
3. Environment variables'ı kontrol edin
4. Node.js versiyonunu kontrol edin

