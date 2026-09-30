self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// 1. Nhận Push ngầm từ Firebase/Server khi TẮT MÀNH HÌNH
self.addEventListener('push', (event) => {
  let data = { title: '🚨 BÁO CHÁY KHẨN CẤP!', body: 'Phát hiện nguy cơ cháy nổ!' };
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
    // Mẫu Rung Báo Động dồn dập: Rung 1s - Nghỉ 0.2s - Rung 1s ...
    vibrate: [1000, 200, 1000, 200, 1000, 200, 1000, 200, 1000, 200, 1000],
    tag: 'pccc-fire-alarm',
    renotify: true,
    requireInteraction: true // Cố định thông báo trên Màn hình khóa S25 Ultra đến khi bấm tắt
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 2. Nhận tin nhắn trực tiếp khi App/Web đang mở
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const options = {
      body: event.data.body,
      icon: 'https://cdn-icons-png.flaticon.com/512/785/785116.png',
      badge: 'https://cdn-icons-png.flaticon.com/512/785/785116.png',
      vibrate: [1000, 200, 1000, 200, 1000, 200, 1000, 200, 1000],
      tag: 'pccc-fire-alarm',
      renotify: true,
      requireInteraction: true
    };

    self.registration.showNotification(event.data.title, options);
  }
});