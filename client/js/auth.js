class Auth {
    constructor() {
        this.token = localStorage.getItem('authToken');
        this.username = localStorage.getItem('username');
        this.init();
    }

    init() {
        document.getElementById('loginBtn').addEventListener('click', () => this.login());
        document.getElementById('registerBtn').addEventListener('click', () => this.register());
        
        // Enter key support
        document.getElementById('password').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.login();
        });

        // Check if already logged in
        if (this.token && this.username) {
            this.showGame();
        }
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
            const response = await fetch('/api/auth/login', {
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
            errorDiv.textContent = 'Bağlantı hatası';
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
            const response = await fetch('/api/auth/register', {
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
            errorDiv.textContent = 'Bağlantı hatası';
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


