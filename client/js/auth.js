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

        // Check if already logged in
        if (this.token && this.username) {
            this.showGame();
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
        
        // Initialize game after auth
        if (window.game) {
            window.game.init();
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


