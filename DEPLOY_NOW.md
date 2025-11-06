# 🚀 HEMEN DEPLOY ET - Adım Adım Rehber

## ✅ Tamamlanan İşlemler

- ✅ Tüm modeller eklendi ve commit edildi
- ✅ Kod güncellemeleri yapıldı
- ✅ GitHub'a push yapıldı

## 🎯 ŞİMDİ YAPMANIZ GEREKENLER

### 1. Render.com'a Gidin

1. **https://render.com** adresine gidin
2. **"Get Started for Free"** veya **"Sign In"** butonuna tıklayın
3. **GitHub ile giriş yapın**

### 2. Yeni Web Service Oluşturun

1. Render dashboard'da **"New +"** butonuna tıklayın
2. **"Web Service"** seçeneğini seçin
3. GitHub repository'nizi seçin: **`beytarz16-source/apocalyptic-rust`**
4. **"Connect"** butonuna tıklayın

### 3. Ayarları Yapın

**Temel Ayarlar:**
- **Name**: `apocalyptic-rust`
- **Region**: `Frankfurt` veya `Oregon` (size en yakın)
- **Branch**: `main`
- **Root Directory**: Boş bırakın

**Build & Deploy:**
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Instance:**
- **Instance Type**: `Free`
- **Auto-Deploy**: `Yes`

### 4. Environment Variables Ekleyin

1. **"Advanced"** bölümünü açın
2. **"Environment Variables"** bölümüne gidin
3. **"Add Environment Variable"** butonuna tıklayın
4. Şunu ekleyin:
   - **Key**: `JWT_SECRET`
   - **Value**: `Ap0c4lyP7ic-Ru5t-2024-S3cr3t-K3y-!@#$%^&*()_+`
5. **"Add"** butonuna tıklayın

### 5. Deploy Edin

1. **"Create Web Service"** butonuna tıklayın
2. **5-10 dakika bekleyin** (ilk deploy uzun sürebilir)
3. Dashboard'da **"Events"** sekmesinde ilerlemeyi izleyin

### 6. Domain Alın

1. Deploy tamamlandıktan sonra service'inize tıklayın
2. **"Settings"** sekmesine gidin
3. Render otomatik olarak bir domain verir (örn: `apocalyptic-rust.onrender.com`)
4. Bu URL'yi kopyalayın

### 7. Test Edin

1. Render'dan aldığınız URL'yi tarayıcıda açın
2. **F12** tuşuna basın (Developer Tools)
3. **Console** sekmesine gidin
4. Şu mesajları kontrol edin:
   - `Game init başlatılıyor...`
   - `GLTF model yüklendi: car`
   - `GLTF model yüklendi: barriers`
   - `GLTF model yüklendi: ak47`
   - `GLTF model yüklendi: m4a1`

## ⚠️ ÖNEMLİ NOTLAR

### Model Dosyaları Büyük Olabilir
- İlk yükleme yavaş olabilir (model dosyaları büyük)
- Render free tier'da dosya boyutu limitleri olabilir
- Eğer sorun olursa, model dosyalarını CDN'ye taşımayı düşünün

### Render Free Tier Özellikleri
- ✅ Tamamen ücretsiz
- ⚠️ 15 dakika inaktiflikten sonra uyku moduna geçer
- ⚠️ İlk istekte 10-30 saniye gecikme olabilir (uyanma süresi)
- ✅ Her push'ta otomatik deploy

### Sorun Giderme

**Deploy Başarısız:**
1. **"Logs"** sekmesine gidin
2. Hata mesajlarını okuyun
3. Genellikle `JWT_SECRET` eksik olur → Environment Variables'ı kontrol edin

**Modeller Yüklenmiyor:**
1. Browser Console'u açın (F12)
2. Network sekmesine gidin
3. 404 hatalarını kontrol edin
4. Model dosya yollarını kontrol edin

**Sayfa Açılmıyor:**
1. Render dashboard'da service durumunu kontrol edin
2. "Live" işareti yeşil mi?
3. Logları kontrol edin

## 📊 Deploy Sonrası Kontrol Listesi

- [ ] Deploy başarılı (yeşil "Live" işareti)
- [ ] URL'de sayfa açılıyor
- [ ] Login/Register ekranı görünüyor
- [ ] Kayıt olabiliyorsunuz
- [ ] Oyun başlatılabiliyor
- [ ] Modeller yükleniyor (konsol logları)
- [ ] Modeller görünüyor (oyun içinde)
- [ ] Arabalar görünüyor
- [ ] Bariyerler görünüyor
- [ ] Silahlar görünüyor

## 🎮 Oyun İçi Test

1. **Kayıt olun** veya **giriş yapın**
2. **Oyunu başlatın**
3. **Konsol loglarını kontrol edin** (F12)
4. **Modellerin yüklendiğini doğrulayın**
5. **Oyun içinde kontrol edin:**
   - First-person view çalışıyor mu?
   - Silah görünüyor mu?
   - Arabalar görünüyor mu? (5 adet)
   - Bariyerler görünüyor mu? (10 adet)
   - Binalar görünüyor mu?
   - Sandıklar görünüyor mu?

## ✅ Başarı!

Eğer tüm kontroller başarılıysa, oyununuz canlıda! 🎉

**Render URL'nizi paylaşabilirsiniz:**
- `https://apocalyptic-rust.onrender.com` (örnek)

---

**Sorun mu var?** `DEPLOYMENT_TR.md` dosyasındaki "Sorun Giderme" bölümüne bakın.

