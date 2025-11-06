# APOCALYPTIC RUST (APOKALİPTİK PAS)

Post-apokaliptik çok oyunculu hayatta kalma oyunu.

## Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Sunucuyu başlatın:
```bash
npm start
```

veya geliştirme modu için:
```bash
npm run dev
```

3. Tarayıcınızda `http://localhost:3000` adresine gidin.

## Özellikler

- ✅ Kullanıcı kayıt ve giriş sistemi
- ✅ 3D açık dünya haritası
- ✅ Üçüncü şahıs kamera
- ✅ Çok oyunculu desteği (Socket.io)
- ✅ HUD (Can, Zırh, Açlık, Susuzluk, Mühimmat)
- ✅ Envanter sistemi (E tuşu)
- ✅ Harita görünümü (M tuşu)
- ✅ Loot sistemi (F tuşu ile toplama)
- ✅ Silah sistemi (M4A1, AK-47, Kar98k, MP5, Glock 17)
- ✅ Eklenti sistemi (Scope, Namlu, Kabza, Şarjör)
- ✅ Duraklatma menüsü (ESC)

## Kontroller

- **W, A, S, D**: Hareket
- **F**: Etkileşim/Toplama
- **E**: Envanter Aç/Kapa
- **M**: Harita Aç/Kapa
- **ESC**: Duraklatma Menüsü
- **Sol Tık**: Ateş Et
- **Sağ Tık**: Nişan Al (ADS)
- **R**: Şarjör Değiştir
- **Boşluk**: Zıpla

## Teknolojiler

- **Backend**: Node.js, Express, Socket.io
- **Frontend**: Three.js (WebGL), HTML5, CSS3
- **Authentication**: JWT, bcrypt

## Notlar

- Oyun geliştirme aşamasındadır.
- Sunucu verileri `server/data/users.json` dosyasında saklanır.
- Production ortamında JWT_SECRET değiştirilmelidir.


