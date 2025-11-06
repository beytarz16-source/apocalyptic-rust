# APOCALYPTIC RUST - Detaylı Yükleme Rehberi (Türkçe)

Oyununuzu internet sitenize yüklemek için adım adım, ekran görüntüleriyle desteklenmiş detaylı rehber.

---

## 📋 İçindekiler

1. [GitHub'a Yükleme (Detaylı)](#1-githuba-yükleme-detaylı)
2. [Railway ile Deploy (Adım Adım)](#2-railway-ile-deploy-adım-adım)
3. [Render ile Deploy (Alternatif)](#3-render-ile-deploy-alternatif)
4. [Kendi Sunucunuzda Çalıştırma](#4-kendi-sunucunuzda-çalıştırma)

---

## 1. GitHub'a Yükleme (Detaylı)

### Adım 1.1: Git Kurulumu Kontrolü

Önce Git'in kurulu olup olmadığını kontrol edin:

**Windows PowerShell'de:**
```powershell
git --version
```

Eğer "git is not recognized" hatası alırsanız:
1. https://git-scm.com/download/win adresinden Git'i indirin
2. Kurulum sırasında "Git from the command line and also from 3rd-party software" seçeneğini seçin
3. Bilgisayarınızı yeniden başlatın

### Adım 1.2: GitHub Hesabı Oluşturma

1. https://github.com adresine gidin
2. Sağ üst köşede "Sign up" butonuna tıklayın
3. Email, şifre ve kullanıcı adı girin
4. Email'inize gelen doğrulama linkine tıklayın

### Adım 1.3: Yeni Repository Oluşturma

1. GitHub'da giriş yaptıktan sonra sağ üst köşede **"+"** işaretine tıklayın
2. **"New repository"** seçeneğini seçin
3. Şu bilgileri doldurun:
   - **Repository name**: `apocalyptic-rust` (veya istediğiniz isim)
   - **Description**: "Post-apokaliptik çok oyunculu hayatta kalma oyunu" (opsiyonel)
   - **Public** veya **Private** seçin (Public önerilir)
   - **"Add a README file"** seçeneğini işaretlemeyin (zaten var)
   - **"Add .gitignore"** seçeneğini işaretlemeyin (zaten var)
4. **"Create repository"** butonuna tıklayın

### Adım 1.4: Projeyi Git Repository'ye Çevirme

**ÖNEMLİ:** Aşağıdaki komutları kopyalarken sadece komutları kopyalayın, ` ```powershell` ve ` ``` ` işaretlerini kopyalamayın!

**Windows PowerShell'de proje klasörünüze gidin:**

1. PowerShell'i açın (Windows tuşu + X → "Windows PowerShell" veya "Terminal")
2. Proje klasörünüze gidin (zaten oradaysanız bu adımı atlayın):
   ```
   cd C:\Users\elfk9\Desktop\A.RUST
   ```

3. **ÖNCE Git kullanıcı bilgilerinizi ayarlayın** (bunu yapmadan commit yapamazsınız):
   ```
   git config --global user.name "GitHub Kullanıcı Adınız"
   git config --global user.email "email@example.com"
   ```
   
   **Örnek:**
   ```
   git config --global user.name "elfk9"
   git config --global user.email "sizin-email@example.com"
   ```

4. Git repository başlatın:
   ```
   git init
   ```

5. Tüm dosyaları ekleyin:
   ```
   git add .
   ```

6. İlk commit'i yapın:
   ```
   git commit -m "İlk commit - APOCALYPTIC RUST oyunu"
   ```

**Not:** Eğer "Author identity unknown" hatası alırsanız, 3. adımdaki `git config` komutlarını çalıştırın.

### Adım 1.5: GitHub Repository'ye Bağlama

**ÖNEMLİ:** Aşağıdaki komutları kopyalarken sadece komutları kopyalayın, ` ```powershell` ve ` ``` ` işaretlerini kopyalamayın!

1. GitHub'da oluşturduğunuz repository sayfasında yeşil **"Code"** butonuna tıklayın
2. URL'yi kopyalayın (örn: `https://github.com/KULLANICI_ADI/apocalyptic-rust.git`)

**PowerShell'de şu komutları sırayla çalıştırın:**

1. GitHub repository'nizi remote olarak ekleyin:
   ```
   git remote add origin https://github.com/KULLANICI_ADI/apocalyptic-rust.git
   ```
   (KULLANICI_ADI yerine kendi GitHub kullanıcı adınızı yazın)

2. Branch'i main olarak ayarlayın:
   ```
   git branch -M main
   ```

3. Dosyaları GitHub'a yükleyin:
   ```
   git push -u origin main
   ```

**İlk kez push yaparken GitHub giriş bilgilerinizi soracak:**
- Kullanıcı adınızı girin
- Şifre yerine **Personal Access Token** kullanmanız gerekebilir

### Adım 1.6: Personal Access Token Oluşturma (Gerekirse)

Eğer şifre ile giriş yapamıyorsanız:

1. GitHub → Sağ üst köşe → **Settings**
2. Sol menüden **"Developer settings"**
3. **"Personal access tokens"** → **"Tokens (classic)"**
4. **"Generate new token"** → **"Generate new token (classic)"**
5. **Note**: "Git Push" yazın
6. **Expiration**: İstediğiniz süreyi seçin
7. **Scopes**: `repo` seçeneğini işaretleyin
8. **"Generate token"** butonuna tıklayın
9. **Token'ı kopyalayın** (bir daha gösterilmeyecek!)
10. Push yaparken şifre yerine bu token'ı kullanın

### Adım 1.7: Yükleme Kontrolü

GitHub repository sayfanızı yenileyin. Tüm dosyalarınız görünüyor olmalı:
- `package.json`
- `server/` klasörü
- `client/` klasörü
- `README.md`
- vb.

✅ **GitHub'a yükleme tamamlandı!**

---

## 2. Railway ile Deploy (Adım Adım)

### Adım 2.1: Railway'a Kayıt Olma

1. https://railway.app adresine gidin
2. Sağ üst köşede **"Login"** butonuna tıklayın
3. **"Login with GitHub"** seçeneğini seçin
4. GitHub hesabınızla giriş yapın
5. Railway'a GitHub repository erişimi vermek için **"Authorize Railway"** butonuna tıklayın

### Adım 2.2: Yeni Proje Oluşturma

1. Railway dashboard'da **"New Project"** butonuna tıklayın
2. Açılan menüde **"Deploy from GitHub repo"** seçeneğini seçin
3. İlk kez ise GitHub repository'lerinizi görmek için **"Configure GitHub App"** butonuna tıklayın
4. Repository'lerinizi seçin (veya "All repositories" seçin)
5. **"Install"** butonuna tıklayın

### Adım 2.3: Repository Seçimi ve Deploy

1. Railway'a geri dönün
2. **"Deploy from GitHub repo"** seçeneğini tekrar seçin
3. Listeden **`apocalyptic-rust`** repository'nizi bulun ve seçin
4. Railway otomatik olarak:
   - Repository'nizi klonlar
   - `package.json` dosyanızı algılar
   - `npm install` komutunu çalıştırır
   - Uygulamanızı başlatır

**Bu işlem 2-5 dakika sürebilir.** Dashboard'da ilerlemeyi görebilirsiniz.

### Adım 2.4: Deploy Durumunu Kontrol Etme

Railway dashboard'da:
- **"Deployments"** sekmesinde deploy durumunu görebilirsiniz
- Yeşil tik işareti = Başarılı
- Kırmızı X işareti = Hata (logları kontrol edin)

### Adım 2.5: Environment Variables (Gizli Anahtarlar) Ekleme

1. Railway dashboard'da projenize tıklayın
2. Üst menüden **"Variables"** sekmesine tıklayın
3. **"New Variable"** butonuna tıklayın
4. Şu bilgileri girin:
   - **Key**: `JWT_SECRET`
   - **Value**: Güçlü bir rastgele string (örn: `aP0c4lyP7ic-Ru5t-2024-S3cr3t-K3y-!@#$%`)
   
   **Güçlü bir şifre oluşturmak için:**
   - En az 32 karakter
   - Büyük/küçük harf, sayı ve özel karakterler içermeli
   - Rastgele olmalı (şifre üretici kullanabilirsiniz)
   
5. **"Add"** butonuna tıklayın

**Not:** Railway otomatik olarak `PORT` değişkenini ayarlar, siz ayarlamanıza gerek yok.

### Adım 2.6: Domain (Alan Adı) Ayarlama

1. Railway dashboard'da projenize tıklayın
2. Üst menüden **"Settings"** sekmesine tıklayın
3. **"Domains"** bölümüne inin
4. **"Generate Domain"** butonuna tıklayın
5. Railway size ücretsiz bir domain verir (örn: `apocalyptic-rust-production.up.railway.app`)

**Kendi Domain'inizi Bağlama (Opsiyonel):**
1. **"Custom Domain"** bölümünde domain'inizi girin
2. Railway size DNS kayıtlarını gösterir
3. Domain sağlayıcınızda (GoDaddy, Namecheap vb.) bu DNS kayıtlarını ekleyin
4. Railway otomatik olarak SSL sertifikası ekler (HTTPS)

### Adım 2.7: Uygulamayı Test Etme

1. Railway dashboard'da **"Settings"** → **"Domains"** bölümünden URL'nizi kopyalayın
2. Tarayıcıda bu URL'yi açın (örn: `https://apocalyptic-rust-production.up.railway.app`)
3. **Giriş ekranı görünmeli!**

**Test Adımları:**
- [ ] Sayfa açılıyor mu?
- [ ] Giriş ekranı görünüyor mu?
- [ ] "Kayıt Ol" butonu çalışıyor mu?
- [ ] Yeni kullanıcı oluşturabiliyor musunuz?
- [ ] Oyun açılıyor mu?
- [ ] 3D sahne yükleniyor mu?

### Adım 2.8: Logları Kontrol Etme

Eğer bir sorun varsa:

1. Railway dashboard'da projenize tıklayın
2. **"Deployments"** sekmesine gidin
3. Son deployment'a tıklayın
4. **"View Logs"** butonuna tıklayın
5. Hata mesajlarını kontrol edin

**Yaygın Hatalar:**
- `Module not found`: Bağımlılık eksik, `package.json` kontrol edin
- `Port already in use`: Railway otomatik ayarlar, sorun değil
- `JWT_SECRET not found`: Environment variable eklemeyi unutmuş olabilirsiniz

✅ **Railway deployment tamamlandı!**

---

## 3. Render ile Deploy (Alternatif)

### Adım 3.1: Render'a Kayıt Olma

1. https://render.com adresine gidin
2. Sağ üst köşede **"Get Started for Free"** butonuna tıklayın
3. **"Sign up with GitHub"** seçeneğini seçin
4. GitHub hesabınızla giriş yapın
5. Render'a GitHub repository erişimi verin

### Adım 3.2: Yeni Web Service Oluşturma

1. Render dashboard'da **"New +"** butonuna tıklayın
2. Açılan menüden **"Web Service"** seçeneğini seçin
3. **"Connect account"** ile GitHub hesabınızı bağlayın (eğer bağlı değilse)
4. Repository listesinden **`apocalyptic-rust`** repository'nizi seçin
5. **"Connect"** butonuna tıklayın

### Adım 3.3: Service Ayarlarını Yapılandırma

Açılan formda şu bilgileri doldurun:

**Temel Ayarlar:**
- **Name**: `apocalyptic-rust` (veya istediğiniz isim)
- **Region**: En yakın bölgeyi seçin (örn: `Frankfurt` veya `Oregon`)
- **Branch**: `main` (veya hangi branch'i deploy etmek istiyorsanız)
- **Root Directory**: Boş bırakın (proje root'ta)

**Build & Deploy Ayarları:**
- **Environment**: `Node` seçin
- **Build Command**: `npm install` yazın
- **Start Command**: `npm start` yazın

**Instance Ayarları:**
- **Instance Type**: `Free` seçin (veya daha yüksek performans için ücretli plan)
- **Auto-Deploy**: `Yes` (her push'ta otomatik deploy)

### Adım 3.4: Environment Variables Ekleme

1. Formun altında **"Advanced"** bölümünü genişletin
2. **"Environment Variables"** bölümüne gidin
3. **"Add Environment Variable"** butonuna tıklayın
4. Şunu ekleyin:
   - **Key**: `JWT_SECRET`
   - **Value**: Güçlü bir rastgele string (Railway'daki gibi)
5. **"Add"** butonuna tıklayın

**Ek Environment Variables (Opsiyonel):**
- **Key**: `NODE_ENV`
- **Value**: `production`

### Adım 3.5: Deploy Başlatma

1. Formun en altında **"Create Web Service"** butonuna tıklayın
2. Render otomatik olarak:
   - Repository'nizi klonlar
   - Bağımlılıkları yükler (`npm install`)
   - Uygulamanızı başlatır (`npm start`)

**Bu işlem 5-10 dakika sürebilir.** Dashboard'da ilerlemeyi görebilirsiniz.

### Adım 3.6: Deploy Durumunu İzleme

Render dashboard'da:
- **"Events"** sekmesinde deploy loglarını görebilirsiniz
- **"Logs"** sekmesinde canlı logları izleyebilirsiniz
- Yeşil "Live" işareti = Başarılı deploy

### Adım 3.7: Domain Ayarlama

1. Render dashboard'da service'inize tıklayın
2. Sol menüden **"Settings"** seçin
3. **"Custom Domain"** bölümüne inin
4. Render otomatik olarak bir domain verir (örn: `apocalyptic-rust.onrender.com`)

**Kendi Domain'inizi Bağlama:**
1. **"Add Custom Domain"** butonuna tıklayın
2. Domain'inizi girin
3. Render size DNS kayıtlarını gösterir
4. Domain sağlayıcınızda bu kayıtları ekleyin
5. Render otomatik olarak SSL ekler

### Adım 3.8: Uyku Modu Hakkında

⚠️ **Önemli:** Render'ın ücretsiz planı:
- 15 dakika inaktiflikten sonra uyku moduna geçer
- İlk istekte uyanır (10-30 saniye gecikme olabilir)
- Bu normaldir ve ücretsiz planın bir özelliğidir

**Çözüm:**
- Ücretli plana geçin (uyku modu yok)
- Veya Railway kullanın (uyku modu yok)

✅ **Render deployment tamamlandı!**

---

## 4. Kendi Sunucunuzda Çalıştırma (VPS)

Eğer kendi VPS (Virtual Private Server) veya sunucunuz varsa (DigitalOcean, AWS, Linode vb.):

### Adım 4.1: VPS Satın Alma ve Bağlanma

**VPS Sağlayıcıları:**
- **DigitalOcean**: https://www.digitalocean.com (5$/ay başlangıç)
- **Linode**: https://www.linode.com
- **Vultr**: https://www.vultr.com
- **AWS EC2**: https://aws.amazon.com/ec2

**VPS Özellikleri (Minimum):**
- 1 CPU Core
- 1GB RAM
- 25GB Storage
- Ubuntu 20.04 veya 22.04 LTS

**Sunucuya Bağlanma (Windows'tan):**

1. **PuTTY** indirin: https://www.putty.org
2. PuTTY'yi açın
3. **Host Name**: Sunucu IP adresinizi girin
4. **Port**: 22
5. **Connection type**: SSH
6. **"Open"** butonuna tıklayın
7. Kullanıcı adı ve şifrenizi girin (genellikle `root`)

**Veya Windows PowerShell'den:**
```powershell
ssh root@SUNUCU_IP_ADRESI
```

### Adım 4.2: Sunucuyu Güncelleme

Sunucuya bağlandıktan sonra:

```bash
# Paket listesini güncelle
sudo apt update

# Sistem paketlerini güncelle
sudo apt upgrade -y

# Gerekli araçları kur
sudo apt install -y curl wget git build-essential
```

### Adım 4.3: Node.js Kurulumu

```bash
# Node.js 18.x repository'sini ekle
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Node.js'yi kur
sudo apt install -y nodejs

# Versiyonları kontrol et
node --version   # v18.x.x görünmeli
npm --version    # 9.x.x görünmeli
```

**Eğer hata alırsanız:**
```bash
# Alternatif kurulum yöntemi
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
```

### Adım 4.4: Projeyi Sunucuya Yükleme

**Yöntem 1: Git ile (Önerilen)**

```bash
# Proje klasörüne git
cd /var/www  # veya istediğiniz bir klasör

# Repository'yi klonla
git clone https://github.com/KULLANICI_ADI/apocalyptic-rust.git

# Proje klasörüne gir
cd apocalyptic-rust

# Bağımlılıkları yükle
npm install
```

**Yöntem 2: FileZilla ile (Manuel)**

1. **FileZilla** indirin: https://filezilla-project.org
2. FileZilla'da:
   - **Host**: `sftp://SUNUCU_IP`
   - **Username**: `root`
   - **Password**: Şifreniz
   - **Port**: 22
3. **"Quickconnect"** butonuna tıklayın
4. Sol taraftan proje klasörünüzü seçin
5. Sağ taraftan `/var/www` klasörüne sürükleyin
6. Sunucuda:
```bash
cd /var/www/apocalyptic-rust
npm install
```

### Adım 4.5: Environment Variables Oluşturma

```bash
# Proje klasöründe .env dosyası oluştur
cd /var/www/apocalyptic-rust
nano .env
```

**İçine şunu yazın:**
```
JWT_SECRET=çok-güçlü-ve-rastgele-bir-şifre-buraya-en-az-32-karakter
NODE_ENV=production
PORT=3000
```

**Dosyayı kaydetmek için:**
- `Ctrl + O` (kaydet)
- `Enter` (onayla)
- `Ctrl + X` (çık)

**Güçlü şifre oluşturma:**
```bash
# Rastgele şifre oluştur (32 karakter)
openssl rand -base64 32
```

### Adım 4.6: PM2 ile Uygulamayı Çalıştırma

PM2, uygulamanızın sürekli çalışmasını ve sunucu yeniden başladığında otomatik başlamasını sağlar.

```bash
# PM2'yi global olarak kur
sudo npm install -g pm2

# Uygulamayı başlat
cd /var/www/apocalyptic-rust
pm2 start server/index.js --name apocalyptic-rust

# PM2 durumunu kontrol et
pm2 status

# Logları görüntüle
pm2 logs apocalyptic-rust

# Sunucu yeniden başladığında otomatik başlat
pm2 startup
# Çıkan komutu çalıştırın (sudo ile başlayan)
pm2 save
```

**PM2 Komutları:**
```bash
pm2 restart apocalyptic-rust  # Yeniden başlat
pm2 stop apocalyptic-rust      # Durdur
pm2 delete apocalyptic-rust     # Sil
pm2 monit                      # Canlı izleme
```

### Adım 4.7: Firewall Ayarları

```bash
# UFW firewall'u aktif et
sudo ufw enable

# SSH portunu aç (önemli! Yoksa bağlanamazsınız)
sudo ufw allow 22/tcp

# HTTP portunu aç
sudo ufw allow 80/tcp

# HTTPS portunu aç
sudo ufw allow 443/tcp

# Node.js portunu aç (3000)
sudo ufw allow 3000/tcp

# Firewall durumunu kontrol et
sudo ufw status
```

### Adım 4.8: Nginx Reverse Proxy Kurulumu

Nginx, domain'inizi Node.js uygulamanıza yönlendirir ve SSL sağlar.

```bash
# Nginx'i kur
sudo apt install -y nginx

# Nginx'i başlat
sudo systemctl start nginx
sudo systemctl enable nginx

# Yapılandırma dosyası oluştur
sudo nano /etc/nginx/sites-available/apocalyptic-rust
```

**Dosyaya şunu yazın:**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Dosyayı kaydedin ve aktif edin:**
```bash
# Symbolic link oluştur
sudo ln -s /etc/nginx/sites-available/apocalyptic-rust /etc/nginx/sites-enabled/

# Varsayılan siteyi kaldır (opsiyonel)
sudo rm /etc/nginx/sites-enabled/default

# Nginx yapılandırmasını test et
sudo nginx -t

# Hata yoksa Nginx'i yeniden başlat
sudo systemctl restart nginx
```

### Adım 4.9: Domain DNS Ayarları

Domain sağlayıcınızda (GoDaddy, Namecheap, Cloudflare vb.):

1. DNS ayarlarına gidin
2. **A Record** ekleyin:
   - **Name**: `@` (veya boş)
   - **Value**: Sunucu IP adresiniz
   - **TTL**: 3600
3. **CNAME Record** ekleyin (www için):
   - **Name**: `www`
   - **Value**: `yourdomain.com`
   - **TTL**: 3600

**DNS yayılması 24-48 saat sürebilir, genellikle birkaç saat içinde çalışır.**

### Adım 4.10: SSL Sertifikası (HTTPS) Kurulumu

Let's Encrypt ile ücretsiz SSL:

```bash
# Certbot'u kur
sudo apt install -y certbot python3-certbot-nginx

# SSL sertifikası al ve Nginx'i otomatik yapılandır
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Sertifika otomatik yenileme testi
sudo certbot renew --dry-run
```

Certbot size email adresi soracak, girin. Sertifika otomatik olarak 90 günde bir yenilenir.

### Adım 4.11: Data Klasörü İzinleri

```bash
# Data klasörünün yazılabilir olduğundan emin ol
cd /var/www/apocalyptic-rust
sudo chmod 755 server/data
sudo chown -R $USER:$USER server/data
```

### Adım 4.12: Test ve Kontrol

1. Tarayıcıda `http://yourdomain.com` adresine gidin
2. HTTP'den HTTPS'e yönlendirme otomatik olmalı
3. Oyun açılmalı

**Kontrol Komutları:**
```bash
# PM2 durumu
pm2 status

# Nginx durumu
sudo systemctl status nginx

# Node.js çalışıyor mu?
curl http://localhost:3000

# Logları kontrol et
pm2 logs apocalyptic-rust
sudo tail -f /var/log/nginx/error.log
```

---

## ✅ Deployment Sonrası Kontrol Listesi

- [ ] Sunucu çalışıyor mu? (Tarayıcıda URL'yi açın)
- [ ] Giriş ekranı görünüyor mu?
- [ ] Kayıt olabiliyor musunuz?
- [ ] Oyun açılıyor mu?
- [ ] Socket.io bağlantısı çalışıyor mu? (Browser console'da hata var mı?)
- [ ] Diğer oyuncuları görebiliyor musunuz?

---

## 🆘 Sorun Giderme (Detaylı)

### Sorun 1: "Port already in use" Hatası

**Belirtiler:**
- Railway/Render'da deploy başarısız
- Loglarda "EADDRINUSE" hatası

**Çözüm:**
- Railway ve Render otomatik olarak PORT'u ayarlar
- `server/index.js` dosyasında `process.env.PORT || 3000` kullanıldığından emin olun
- VPS'de başka bir uygulama 3000 portunu kullanıyorsa:
  ```bash
  # Hangi uygulama kullanıyor?
  sudo lsof -i :3000
  # Veya PORT'u değiştirin
  ```

### Sorun 2: Socket.io Bağlantı Hatası

**Belirtiler:**
- Browser console'da "WebSocket connection failed" hatası
- Diğer oyuncular görünmüyor
- Çok oyunculu özellikler çalışmıyor

**Çözüm Adımları:**

1. **CORS Ayarlarını Kontrol Edin:**
   - `server/index.js` dosyasında CORS ayarlarının doğru olduğundan emin olun
   - Production'da domain'inizi ekleyin:
   ```javascript
   cors: {
     origin: "https://yourdomain.com",
     methods: ["GET", "POST"]
   }
   ```

2. **WebSocket Desteği:**
   - Railway/Render otomatik olarak WebSocket'i destekler
   - VPS'de Nginx yapılandırmasında WebSocket proxy ayarlarının olduğundan emin olun

3. **Firewall Kontrolü:**
   ```bash
   # VPS'de portların açık olduğundan emin olun
   sudo ufw status
   sudo ufw allow 3000/tcp
   ```

4. **Browser Console Kontrolü:**
   - F12 → Console sekmesi
   - Socket.io hatalarını kontrol edin
   - Network sekmesinde WebSocket bağlantısını kontrol edin

### Sorun 3: Static Dosyalar Yüklenmiyor (CSS/JS/HTML)

**Belirtiler:**
- Sayfa açılıyor ama stil yok
- 404 hatası (client/index.html bulunamıyor)
- Oyun yüklenmiyor

**Çözüm:**

1. **Dosya Yapısını Kontrol Edin:**
   ```
   apocalyptic-rust/
   ├── client/
   │   ├── index.html
   │   ├── styles.css
   │   └── js/
   ├── server/
   └── package.json
   ```

2. **Express Static Path:**
   - `server/index.js` dosyasında:
   ```javascript
   app.use(express.static(path.join(__dirname, '../client')));
   ```
   - Path'in doğru olduğundan emin olun

3. **GitHub'a Yükleme:**
   - Tüm `client/` klasörünün GitHub'a yüklendiğinden emin olun
   - `.gitignore` dosyasında `client/` yoksa sorun yok

4. **Deploy Sonrası Kontrol:**
   - Railway/Render'da dosyaların yüklendiğini kontrol edin
   - Loglarda "Cannot GET /" hatası varsa static path yanlış

### Sorun 4: Database/Users.json Hatası

**Belirtiler:**
- Kayıt olurken hata
- "Cannot write to users.json" hatası
- Kullanıcı verileri kaydedilmiyor

**Çözüm:**

1. **Klasör İzinleri (VPS):**
   ```bash
   cd /var/www/apocalyptic-rust
   sudo chmod 755 server/data
   sudo chown -R $USER:$USER server/data
   ```

2. **Klasörün Var Olduğundan Emin Olun:**
   ```bash
   mkdir -p server/data
   ```

3. **Railway/Render:**
   - Platform otomatik olarak klasör oluşturur
   - Eğer sorun varsa, `server/routes/auth.js` dosyasında `initUsersFile()` fonksiyonunun çalıştığından emin olun

### Sorun 5: JWT_SECRET Hatası

**Belirtiler:**
- Giriş yapamıyorsunuz
- "Token invalid" hatası
- Authentication çalışmıyor

**Çözüm:**

1. **Environment Variable Kontrolü:**
   - Railway: Variables sekmesinde `JWT_SECRET` var mı?
   - Render: Environment Variables'da `JWT_SECRET` var mı?
   - VPS: `.env` dosyasında `JWT_SECRET` var mı?

2. **Deploy Sonrası Yeniden Başlatma:**
   - Environment variable ekledikten sonra uygulamayı yeniden başlatın
   - Railway: Otomatik yeniden başlar
   - Render: "Manual Deploy" yapın
   - VPS: `pm2 restart apocalyptic-rust`

### Sorun 6: Three.js Yüklenmiyor

**Belirtiler:**
- 3D sahne görünmüyor
- "THREE is not defined" hatası
- Oyun ekranı siyah

**Çözüm:**

1. **CDN Kontrolü:**
   - `client/index.html` dosyasında Three.js CDN linkinin doğru olduğundan emin olun:
   ```html
   <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
   ```

2. **İnternet Bağlantısı:**
   - CDN'den yükleniyor, internet bağlantısını kontrol edin

3. **Browser Console:**
   - F12 → Console'da Three.js hatalarını kontrol edin

### Sorun 7: Deploy Çok Yavaş / Timeout

**Belirtiler:**
- Deploy 10+ dakika sürüyor
- Timeout hatası alıyorsunuz

**Çözüm:**

1. **Build Command Optimizasyonu:**
   - `npm install` yerine `npm ci --production` kullanabilirsiniz (daha hızlı)
   - `package.json`'da gereksiz bağımlılıkları kaldırın

2. **Repository Boyutu:**
   - `.gitignore` dosyasında `node_modules/` olduğundan emin olun
   - Büyük dosyaları GitHub'a yüklemeyin

3. **Platform Limitleri:**
   - Railway/Render ücretsiz planlarında limitler olabilir
   - Logları kontrol edin, hangi adımda takılıyor?

### Sorun 8: Domain DNS Yayılmıyor

**Belirtiler:**
- Domain çalışmıyor
- "Site can't be reached" hatası
- DNS kayıtlarını eklediniz ama çalışmıyor

**Çözüm:**

1. **DNS Kontrolü:**
   ```bash
   # Windows PowerShell'de
   nslookup yourdomain.com
   # IP adresinin doğru olduğunu kontrol edin
   ```

2. **DNS Yayılma Süresi:**
   - DNS yayılması 24-48 saat sürebilir
   - Genellikle 1-4 saat içinde çalışır
   - Sabırlı olun

3. **DNS Kayıtlarını Kontrol Edin:**
   - A Record: Domain → IP adresi
   - CNAME: www → Domain
   - TTL: 3600 (1 saat)

### Sorun 9: SSL Sertifikası Hatası

**Belirtiler:**
- "Not Secure" uyarısı
- HTTPS çalışmıyor
- SSL sertifikası geçersiz

**Çözüm:**

1. **Railway/Render:**
   - Otomatik SSL sağlar
   - Domain bağlandıktan sonra birkaç dakika bekleyin

2. **VPS - Let's Encrypt:**
   ```bash
   # Sertifikayı yeniden al
   sudo certbot renew
   
   # Nginx'i yeniden başlat
   sudo systemctl restart nginx
   ```

### Sorun 10: PM2 Uygulama Çalışmıyor (VPS)

**Belirtiler:**
- `pm2 status` → "stopped" veya "errored"
- Uygulama başlamıyor

**Çözüm:**

```bash
# Logları kontrol et
pm2 logs apocalyptic-rust

# Hataları görüntüle
pm2 logs apocalyptic-rust --err

# Uygulamayı yeniden başlat
pm2 restart apocalyptic-rust

# Eğer hala çalışmıyorsa, sil ve yeniden ekle
pm2 delete apocalyptic-rust
cd /var/www/apocalyptic-rust
pm2 start server/index.js --name apocalyptic-rust
pm2 save
```

---

## 📋 Hızlı Kontrol Listesi

Deploy sonrası şunları kontrol edin:

### Railway/Render:
- [ ] Deploy başarılı (yeşil tik)
- [ ] Environment variables eklendi (JWT_SECRET)
- [ ] Domain oluşturuldu
- [ ] URL'de sayfa açılıyor
- [ ] Giriş ekranı görünüyor
- [ ] Kayıt olabiliyorsunuz
- [ ] Oyun açılıyor
- [ ] 3D sahne yükleniyor
- [ ] Browser console'da hata yok

### VPS:
- [ ] Node.js kurulu (`node --version`)
- [ ] PM2 çalışıyor (`pm2 status`)
- [ ] Nginx çalışıyor (`sudo systemctl status nginx`)
- [ ] Firewall ayarları doğru (`sudo ufw status`)
- [ ] SSL sertifikası var (`sudo certbot certificates`)
- [ ] Domain DNS ayarları doğru
- [ ] Data klasörü yazılabilir
- [ ] Loglarda hata yok

---

## 💡 İpuçları

1. **Railway** - Başlangıç için en kolay seçenek
2. **Render** - Ücretsiz alternatif (uyku modu var)
3. **VPS** - Tam kontrol ve özelleştirme istiyorsanız

### Güvenlik Önerileri

- `JWT_SECRET` mutlaka güçlü ve rastgele olmalı
- HTTPS kullanın (Let's Encrypt ücretsiz)
- Düzenli yedekleme yapın
- Logları düzenli kontrol edin

---

## 📞 Yardım

Herhangi bir sorunla karşılaşırsanız:
1. Hosting platformunun dokümantasyonuna bakın
2. Logları kontrol edin (Railway/Render dashboard veya `pm2 logs`)
3. Browser console'da hataları kontrol edin

Başarılar! 🎮

