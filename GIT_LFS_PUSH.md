# 🚀 Git LFS Push Rehberi

## ✅ Yapılanlar
- Git LFS kuruldu
- Model dosyaları LFS'e eklendi (.gitattributes oluşturuldu)
- Dosyalar LFS'te görünüyor

## 📋 Şimdi Yapılacaklar

### 1. Mevcut Dosyaları LFS'e Migrate Et (ÖNEMLİ!)

Eğer model dosyaları daha önce normal Git'te commit edildiyse, onları LFS'e migrate etmen gerekiyor:

```bash
# Tüm branch'lerdeki dosyaları migrate et
git lfs migrate import --include="*.gltf,*.glb,*.bin,client/models/**/*.jpeg,client/models/**/*.png" --everything

# Veya sadece son commit'leri migrate et
git lfs migrate import --include="*.gltf,*.glb,*.bin,client/models/**/*.jpeg,client/models/**/*.png" -m "Migrate model files to LFS"
```

**⚠️ DİKKAT:** Bu komut geçmiş commit'leri değiştirir! Eğer zaten GitHub'a push yaptıysan, force push gerekir.

### 2. Alternatif: Sadece Yeni Dosyaları Push Et

Eğer migrate yapmak istemiyorsan, sadece yeni commit'leri push edebilirsin:

```bash
# Değişiklikleri kontrol et
git status

# Commit et (eğer yapmadıysan)
git add .
git commit -m "Add Git LFS support for model files"

# GitHub'a push et
git push origin main
```

### 3. GitHub'da Git LFS Kontrolü

Push yaptıktan sonra GitHub'da:
1. Repository → Settings → Git LFS
2. LFS dosyalarının yüklendiğini kontrol et
3. Storage kullanımını kontrol et (ücretsiz plan: 1 GB)

### 4. Render'da Manuel Deploy

1. Render.com dashboard'a git
2. Service'inizi seçin
3. "Manual Deploy" → "Deploy latest commit" tıkla
4. Deploy'un tamamlanmasını bekle (5-10 dakika)

## 🔍 Kontrol Komutları

```bash
# LFS dosyalarını listele
git lfs ls-files

# LFS durumunu kontrol et
git lfs status

# Repository boyutunu kontrol et
git count-objects -vH
```

## ⚠️ Sorun Giderme

### Push çok yavaşsa:
- İnternet bağlantını kontrol et
- Git LFS'in düzgün çalıştığını kontrol et: `git lfs version`
- GitHub LFS quota'nı kontrol et

### LFS dosyaları yüklenmiyorsa:
- `.gitattributes` dosyasının doğru olduğunu kontrol et
- `git lfs install` komutunu tekrar çalıştır
- Dosyaları tekrar add et: `git add .gitattributes && git add client/models/`

## 📝 Notlar

- İlk push yavaş olabilir (büyük dosyalar)
- Sonraki push'lar çok daha hızlı olacak
- Git LFS ücretsiz plan: 1 GB storage + 1 GB bandwidth/ay

