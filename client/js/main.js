// Main entry point - game initialization happens after auth
document.addEventListener('DOMContentLoaded', () => {
    // Resume button
    document.getElementById('resumeBtn').addEventListener('click', () => {
        document.getElementById('pauseMenu').classList.add('hidden');
    });

    // Quit button
    document.getElementById('quitBtn').addEventListener('click', () => {
        if (window.auth) {
            window.auth.logout();
        }
    });

    console.log('APOCALYPTIC RUST - Game Loaded');
});


