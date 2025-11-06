# APOCALYPTIC RUST - Deployment Rehberi

Bu oyunu internet sitenize yüklemek için birkaç seçeneğiniz var. En popüler ve kolay yöntemler:

## 🚀 Seçenek 1: Railway (Önerilen - Ücretsiz Başlangıç)

Railway, Node.js uygulamaları için mükemmel bir hosting servisidir.

### Adımlar:

1. **Railway'a Kayıt Olun**
   - https://railway.app adresine gidin
   - GitHub hesabınızla giriş yapın

2. **Projeyi Yükleyin**
   - "New Project" butonuna tıklayın
   - "Deploy from GitHub repo" seçeneğini seçin
   - GitHub repository'nizi bağlayın
   - Railway otomatik olarak `package.json` dosyanızı algılayacak

3. **Environment Variables (Gerekirse)**
   - Railway dashboard'da "Variables" sekmesine gidin
   - `JWT_SECRET` değişkenini ekleyin (güçlü bir rastgele string)
   - `PORT` değişkeni otomatik olarak ayarlanır

4. **Domain Ayarlama (Opsiyonel)**
   - "Settings" > "Generate Domain" ile ücretsiz domain alın
   - Veya kendi domain'inizi bağlayın

### Avantajlar:
- ✅ Ücretsiz başlangıç (500 saat/ay)
- ✅ Otomatik deployment
- ✅ Kolay kullanım
- ✅ Socket.io desteği

---

## 🌐 Seçenek 2: Render

Render da ücretsiz bir alternatiftir.

### Adımlar:

1. **Render'a Kayıt Olun**
   - https://render.com adresine gidin
   - GitHub hesabınızla giriş yapın

2. **Yeni Web Service Oluşturun**
   - "New +" > "Web Service"
   - GitHub repository'nizi seçin
   - Ayarlar:
     - **Name**: apocalyptic-rust
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Instance Type**: Free (veya daha yüksek)

3. **Environment Variables**
   - `JWT_SECRET`: Güçlü bir rastgele string
   - `NODE_ENV`: production

4. **Deploy**
   - "Create Web Service" butonuna tıklayın
   - Render otomatik olarak deploy edecek

### Not:
- Ücretsiz plan 15 dakika inaktiflikten sonra uyku moduna geçer
- İlk istekte uyanır (biraz gecikme olabilir)

---

## ☁️ Seçenek 3: Heroku

Klasik ve güvenilir bir seçenek.

### Adımlar:

1. **Heroku CLI Kurulumu**
   ```bash
   # Windows için: https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Heroku'ya Giriş**
   ```bash
   heroku login
   ```

3. **Proje Oluşturma**
   ```bash
   heroku create apocalyptic-rust
   ```

4. **Environment Variables**
   ```bash
   heroku config:set JWT_SECRET=your-secret-key-here
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

### Not:
- Heroku ücretsiz planı 2022'de sona erdi, artık ücretli

---

## 🖥️ Seçenek 4: Kendi VPS/Server'ınız

Eğer kendi sunucunuz varsa:

### Adımlar:

1. **Sunucuya Bağlanın**
   ```bash
   ssh kullanici@sunucu-ip
   ```

2. **Node.js Kurulumu**
   ```bash
   # Node.js 18+ kurun
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Projeyi Yükleyin**
   ```bash
   git clone https://github.com/kullanici/apocalyptic-rust.git
   cd apocalyptic-rust
   npm install
   ```

4. **PM2 ile Çalıştırın (Process Manager)**
   ```bash
   npm install -g pm2
   pm2 start server/index.js --name apocalyptic-rust
   pm2 save
   pm2 startup
   ```

5. **Nginx Reverse Proxy (Opsiyonel)**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## 🔧 Production Ayarları

### 1. Environment Variables

`.env` dosyası oluşturun (veya hosting platformunda ayarlayın):

```env
JWT_SECRET=your-very-strong-secret-key-here-change-this
NODE_ENV=production
PORT=3000
```

### 2. Güvenlik

- `JWT_SECRET` mutlaka güçlü bir değer olmalı
- CORS ayarlarını production domain'inize göre güncelleyin
- HTTPS kullanın (Let's Encrypt ücretsiz SSL)

### 3. Database (İsteğe Bağlı)

Şu anda JSON dosyası kullanılıyor. Production için:
- MongoDB Atlas (ücretsiz)
- PostgreSQL
- MySQL

---

## 📝 GitHub'a Yükleme

Eğer henüz GitHub'a yüklemediyseniz:

```bash
# Git repository oluştur
git init
git add .
git commit -m "Initial commit"

# GitHub'da yeni repository oluşturun, sonra:
git remote add origin https://github.com/kullanici/apocalyptic-rust.git
git branch -M main
git push -u origin main
```

---

## ✅ Deployment Sonrası Kontrol

1. **Sunucu Çalışıyor mu?**
   - Tarayıcıda `https://your-domain.com` adresine gidin
   - Giriş ekranı görünmeli

2. **Socket.io Çalışıyor mu?**
   - Oyunu açın ve bağlantıyı test edin
   - Browser console'da hata olmamalı

3. **Logları Kontrol Edin**
   - Railway/Render: Dashboard'dan logları görüntüleyin
   - VPS: `pm2 logs apocalyptic-rust`

---

## 🆘 Sorun Giderme

### Port Hatası
- Hosting platformu PORT'u otomatik ayarlar
- `process.env.PORT` kullanıldığından emin olun

### Socket.io Bağlantı Hatası
- CORS ayarlarını kontrol edin
- WebSocket desteğinin açık olduğundan emin olun

### Static Dosyalar Yüklenmiyor
- `express.static` path'ini kontrol edin
- Build işlemi gerekli mi kontrol edin

---

## 💡 Öneriler

1. **Railway** - En kolay ve hızlı başlangıç için
2. **Render** - Ücretsiz alternatif
3. **VPS** - Tam kontrol istiyorsanız

Herhangi bir sorunla karşılaşırsanız, hosting platformunun dokümantasyonuna bakın veya logları kontrol edin.


