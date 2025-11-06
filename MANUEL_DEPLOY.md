# 🚀 Manuel Deploy Rehberi - Hızlı Adımlar

## 1️⃣ Git Push (PowerShell'de)

```powershell
cd C:\Users\elfk9\Desktop\A.RUST
git push origin main
```

**Not:** Eğer GitHub şifresi sorarsa, Personal Access Token kullanın.

## 2️⃣ Render.com Deploy

### Adım 1: Render'a Gidin
- https://render.com → "Sign In" → GitHub ile giriş

### Adım 2: Yeni Web Service
- "New +" → "Web Service"
- Repository: `beytarz16-source/apocalyptic-rust`
- "Connect"

### Adım 3: Ayarlar
- **Name**: `apocalyptic-rust`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: `Free`

### Adım 4: Environment Variable (ÖNEMLİ!)
- "Advanced" → "Environment Variables"
- **Key**: `JWT_SECRET`
- **Value**: `Ap0c4lyP7ic-Ru5t-2024-S3cr3t-K3y-!@#$%^&*()_+`
- "Add"

### Adım 5: Deploy
- "Create Web Service"
- 5-10 dakika bekleyin

### Adım 6: Test
- Render'dan verilen URL'yi açın
- F12 → Console → Model yükleme mesajlarını kontrol edin

## ✅ Tamamlandı!

**Detaylı rehber:** `DEPLOY_NOW.md` dosyasına bakın.

