// Service Worker - Sara Nails Admin PWA

var CACHE_NAME = 'sara-nails-v1';

// Install
self.addEventListener('install', function(e) {
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', function(e) {
  e.waitUntil(self.clients.claim());
});

// Fetch - network first, fallback to cache
self.addEventListener('fetch', function(e) {
  e.respondWith(
    fetch(e.request).then(function(response) {
      return response;
    }).catch(function() {
      return caches.match(e.request);
    })
  );
});

// Push notification received
self.addEventListener('push', function(e) {
  var data = e.data ? e.data.json() : {};
  var title = data.title || 'Sara Nails';
  var options = {
    body: data.body || 'Novo agendamento recebido!',
    icon: 'https://cfmtngpivszyzdsszzvj.supabase.co/storage/v1/object/public/assets/logo.png',
    badge: 'https://cfmtngpivszyzdsszzvj.supabase.co/storage/v1/object/public/assets/logo.png',
    vibrate: [200, 100, 200],
    tag: 'novo-agendamento',
    renotify: true
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

// Click on notification
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({type: 'window'}).then(function(clients) {
      if (clients.length > 0) {
        return clients[0].focus();
      }
      return self.clients.openWindow('./admin.html');
    })
  );
});
