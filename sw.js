self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "CẢNH BÁO BÁO CHÁY!";
  const options = {
    body: data.body || "Phát hiện nguy cơ sự cố!",
    icon: "https://cdn-icons-png.flaticon.com/512/785/785116.png",
    badge: "https://cdn-icons-png.flaticon.com/512/785/785116.png",
    vibrate: [200, 100, 200, 100, 200]
  };
  event.waitUntil(self.registration.showNotification(title, options));
});