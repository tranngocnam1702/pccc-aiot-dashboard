self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Lắng nghe tín hiệu Push ngầm kể cả khi tắt màn hình
self.addEventListener('push', (event) => {
  let data = { title: '🚨 BÁO CHÁY KHẨN CẤP!', body: 'Phát hiện nguy hiểm PCCC!' };
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: 'https://cdn-icons-png.flaticon.com/512/785/785116.png',
    badge: 'https://cdn-icons-png.flaticon.com/512/785/785116.png',
    // Mẫu Rung Báo Động Khẩn Cấp (Rung dài - Nghỉ ngắn - Rung dài)
    vibrate: [1000, 200, 1000, 200, 1000, 200, 1000, 200, 1000],
    tag: 'pccc-emergency-fire',
    renotify: true,
    requireInteraction: true, // Cố định trên màn hình khóa cho tới khi người dùng bấm tắt
    priority: 'high'
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Lắng nghe tin nhắn từ trang web khi app đang bật
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const options = {
      body: event.data.body,
      icon: 'https://cdn-icons-png.flaticon.com/512/785/785116.png',
      badge: 'https://cdn-icons-png.flaticon.com/512/785/785116.png',
      vibrate: [1000, 200, 1000, 200, 1000, 200, 1000],
      tag: 'pccc-emergency-fire',
      renotify: true,
      requireInteraction: true
    };

    self.registration.showNotification(event.data.title, options);
  }
});