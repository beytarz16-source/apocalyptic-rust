// Main entry point - game initialization happens after auth
document.addEventListener('DOMContentLoaded', () => {
    // Resume button
    document.getElementById('resumeBtn').addEventListener('click', () => {
        document.getElementById('pauseMenu').classList.add('hidden');
    });

    // Quit button (pause menu)
    document.getElementById('quitBtn').addEventListener('click', () => {
        if (window.auth) {
            window.auth.logout();
        }
    });

    // Logout button (HUD)
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (window.auth) {
                if (confirm('Çıkış yapmak istediğinize emin misiniz?')) {
                    window.auth.logout();
                }
            }
        });
    }

    console.log('APOCALYPTIC RUST - Game Loaded');
});


