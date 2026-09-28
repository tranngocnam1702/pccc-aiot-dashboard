self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const title = event.data.title || '🔥 HỆ THỐNG PCCC AIoT';
    const options = {
      body: event.data.body || 'Phát hiện cảnh báo!',
      icon: 'https://cdn-icons-png.flaticon.com/512/785/785116.png',
      badge: 'https://cdn-icons-png.flaticon.com/512/785/785116.png',
      vibrate: [500, 200, 500, 200, 500],
      tag: 'pccc-fire-alarm',
      renotify: true,
      requireInteraction: true
    };

    self.registration.showNotification(title, options);
  }
});