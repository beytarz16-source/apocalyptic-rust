# 🧪 Deploy Test Rehberi

## ✅ Render Deploy Tamamlandı!

Şimdi test edelim:

## 1️⃣ Render URL'ini Alın

1. Render dashboard'da service'inize tıklayın
2. Üst kısımda URL görünecek (örn: `https://apocalyptic-rust.onrender.com`)
3. Bu URL'yi kopyalayın

## 2️⃣ Tarayıcıda Test Edin

1. Render URL'ini tarayıcıda açın
2. **F12** tuşuna basın (Developer Tools)
3. **Console** sekmesine gidin

## 3️⃣ Kontrol Edilecekler

### A) Sayfa Yükleniyor mu?
- ✅ Login/Register ekranı görünüyor mu?
- ✅ Hata mesajı var mı? (kırmızı yazılar)

### B) Konsol Logları
Şu mesajları arayın:
- ✅ `Game init başlatılıyor...`
- ✅ `GLTF model yüklendi: car`
- ✅ `GLTF model yüklendi: barriers`
- ✅ `GLTF model yüklendi: ak47`
- ✅ `GLTF model yüklendi: m4a1`
- ✅ `GLTF karakter modeli yüklendi`
- ✅ `GLTF sandık modeli yüklendi`

### C) Network Kontrolü
1. **Network** sekmesine gidin
2. Sayfayı yenileyin (F5)
3. Şu dosyalar yükleniyor mu?
   - `modelLoader.js`
   - `game.js`
   - `player.js`
   - `models/weapons/ak47.gltf`
   - `models/weapons/m4a1.gltf`
   - vb.

## 4️⃣ Oyun İçi Test

1. **Kayıt olun** veya **giriş yapın**
2. **Oyunu başlatın**
3. **Kontrol edin:**
   - First-person view çalışıyor mu?
   - Silah görünüyor mu? (first-person'da)
   - Arabalar görünüyor mu? (haritada 5 adet)
   - Bariyerler görünüyor mu? (haritada 10 adet)
   - Binalar görünüyor mu?
   - Sandıklar görünüyor mu?

## ⚠️ Sorun Varsa

### Deploy Başarısız mı?
1. Render dashboard → "Logs" sekmesine gidin
2. Hata mesajlarını okuyun
3. Genellikle `JWT_SECRET` eksik olur

### Modeller Yüklenmiyor mu?
1. Console'da 404 hataları var mı?
2. Network sekmesinde model dosyaları yükleniyor mu?
3. Model dosya yolları doğru mu?

### Sayfa Açılmıyor mu?
1. Render dashboard'da service durumunu kontrol edin
2. "Live" işareti yeşil mi?
3. Logları kontrol edin

## 📊 Test Sonuçları

Test sonuçlarınızı buraya yazabilirsiniz:
- [ ] Sayfa açılıyor
- [ ] Login/Register çalışıyor
- [ ] Oyun başlatılabiliyor
- [ ] Modeller yükleniyor (konsol)
- [ ] Modeller görünüyor (oyun içi)
- [ ] Arabalar görünüyor
- [ ] Bariyerler görünüyor
- [ ] Silahlar görünüyor

---

**Render URL'niz nedir?** Test sonuçlarını paylaşın!

