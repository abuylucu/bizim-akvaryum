// Basit service worker: ana ekrana eklenebilmesi için. Önbellek tutmaz, her zaman güncel sürüm yüklenir.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => { });
