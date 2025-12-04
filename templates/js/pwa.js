
// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('baseUrl + sw.js')
            .then((registration) => {
                console.log('[PWA] Service Worker registered successfully:', registration.scope);
                
                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New service worker available, show update notification
                            if (typeof Swal !== 'undefined') {
                                Swal.fire({
                                    title: 'Update Tersedia!',
                                    text: 'Versi baru aplikasi tersedia. Refresh halaman untuk update?',
                                    icon: 'info',
                                    showCancelButton: true,
                                    confirmButtonColor: '#0ea5e9',
                                    cancelButtonColor: '#6b7280',
                                    confirmButtonText: 'Update Sekarang',
                                    cancelButtonText: 'Nanti'
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        newWorker.postMessage({ type: 'SKIP_WAITING' });
                                        window.location.reload();
                                    }
                                });
                            }
                        }
                    });
                });
            })
            .catch((error) => {
                console.error('[PWA] Service Worker registration failed:', error);
            });
    });
}

// PWA Install Prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    console.log('[PWA] Install prompt available');
    
    // Optionally, show your own install button or notification
    // You can add a button in the UI to trigger the install prompt
});

// Track PWA installation
window.addEventListener('appinstalled', () => {
    console.log('[PWA] App was installed');
    deferredPrompt = null;
    
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Vizitrip Access berhasil diinstall sebagai aplikasi',
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
        });
    }
});

// Function to manually trigger install prompt (can be called from a button)
function installPWA() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('[PWA] User accepted the install prompt');
            } else {
                console.log('[PWA] User dismissed the install prompt');
            }
            deferredPrompt = null;
        });
    }
}