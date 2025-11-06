class Auth {
    constructor() {
        this.token = localStorage.getItem('authToken');
        this.username = localStorage.getItem('username');
        this.init();
    }

    init() {
        // Butonların yüklendiğinden emin ol
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        
        if (!loginBtn || !registerBtn) {
            console.error('Login buttons not found!');
            return;
        }

        loginBtn.addEventListener('click', () => this.login());
        registerBtn.addEventListener('click', () => this.register());
        
        // Enter key support
        const passwordInput = document.getElementById('password');
        if (passwordInput) {
            passwordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.login();
            });
        }

        // Check if already logged in - script'lerin yüklenmesi için bekle
        if (this.token && this.username) {
            // Script'lerin yüklenmesi için kısa bir gecikme
            setTimeout(() => {
                this.showGame();
            }, 200);
        }

        console.log('Auth system initialized');
    }

    async login() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('authError');

        if (!username || !password) {
            errorDiv.textContent = 'Lütfen kullanıcı adı ve şifre girin';
            return;
        }

        try {
            // Backend URL'ini otomatik algıla
            const apiUrl = window.location.origin;
            const response = await fetch(`${apiUrl}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                this.token = data.token;
                this.username = data.username;
                localStorage.setItem('authToken', this.token);
                localStorage.setItem('username', this.username);
                this.showGame();
            } else {
                errorDiv.textContent = data.error || 'Giriş başarısız';
            }
        } catch (error) {
            console.error('Login error:', error);
            errorDiv.textContent = `Bağlantı hatası: ${error.message}. Backend çalışıyor mu kontrol edin.`;
        }
    }

    async register() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('authError');

        if (!username || !password) {
            errorDiv.textContent = 'Lütfen kullanıcı adı ve şifre girin';
            return;
        }

        if (password.length < 6) {
            errorDiv.textContent = 'Şifre en az 6 karakter olmalıdır';
            return;
        }

        try {
            // Backend URL'ini otomatik algıla
            const apiUrl = window.location.origin;
            const response = await fetch(`${apiUrl}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                this.token = data.token;
                this.username = data.username;
                localStorage.setItem('authToken', this.token);
                localStorage.setItem('username', this.username);
                this.showGame();
            } else {
                errorDiv.textContent = data.error || 'Kayıt başarısız';
            }
        } catch (error) {
            console.error('Register error:', error);
            errorDiv.textContent = `Bağlantı hatası: ${error.message}. Backend çalışıyor mu kontrol edin.`;
        }
    }

    showGame() {
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('gameScreen').classList.remove('hidden');
        
        // Initialize game after auth - script yükleme sırası için bekle
        const initGame = () => {
            if (window.game) {
                console.log('Game instance bulundu, init çağrılıyor...');
                window.game.init();
            } else {
                console.warn('Game instance henüz yüklenmedi, bekleniyor...');
                // Script yüklenene kadar bekle (max 5 saniye)
                let attempts = 0;
                const checkInterval = setInterval(() => {
                    attempts++;
                    if (window.game) {
                        console.log('Game instance yüklendi, init çağrılıyor...');
                        clearInterval(checkInterval);
                        window.game.init();
                    } else if (attempts > 50) { // 5 saniye sonra vazgeç
                        console.error('Game instance yüklenemedi!');
                        clearInterval(checkInterval);
                    }
                }, 100);
            }
        };
        
        // DOMContentLoaded bekleniyorsa bekle, değilse hemen çalıştır
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initGame);
        } else {
            // Script'lerin yüklenmesi için kısa bir gecikme
            setTimeout(initGame, 100);
        }
    }

    logout() {
        this.token = null;
        this.username = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        document.getElementById('loginScreen').classList.remove('hidden');
        document.getElementById('gameScreen').classList.add('hidden');
    }

    getToken() {
        return this.token;
    }

    getUsername() {
        return this.username;
    }
}

window.auth = new Auth();


