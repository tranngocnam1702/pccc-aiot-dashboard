const axios = require('axios');

// 1. Cấu hình URL Firebase và Telegram
const FIREBASE_URL = "https://duanpccc-7ca9b-default-rtdb.asia-southeast1.firebasedatabase.app/DanhSachTram.json";
const TELEGRAM_BOT_TOKEN = "8516283366:AAH8mFiOIcgdwrxYtb4BSmCn9LbT5Xt2peY";
const TELEGRAM_CHAT_ID = "8737033875";

const alertCooldown = {};

console.log("🔥 Service Báo Cháy AIoT Telegram đang hoạt động (Chế độ quét liên tục)...");

// 2. Tự động lấy dữ liệu từ Firebase mỗi 3 giây
setInterval(async () => {
  try {
    const response = await axios.get(FIREBASE_URL);
    const data = response.data;
    
    if (!data) return;

    const now = Date.now();

    for (const [tramKey, tramData] of Object.entries(data)) {
      const isFire = tramData.CoTiaLua === true || tramData.CoTiaLua === "true";
      const temp = parseFloat(tramData.NhietDo || 0);
      const gas = parseFloat(tramData.NongDoGas || 0);

      // Điều kiện báo động: Có lửa HOẶC Nhiệt độ > 50°C HOẶC Gas > 600 PPM
      const isDangerous = isFire || temp > 50 || gas > 700;

      if (isDangerous) {
        // Giới hạn 20 giây gửi 1 tin nhắn/trạm để chống rác tin
        if (!alertCooldown[tramKey] || (now - alertCooldown[tramKey]) > 20000) {
          alertCooldown[tramKey] = now;
          
          const stationName = tramKey.replace('_', ' ');
          let reason = [];
          if (isFire) reason.push("🔥 TIA LỬA TRỰC TIẾP");
          if (temp > 50) reason.push(`🌡️ Nhiệt độ quá cao (${temp}°C)`);
          if (gas > 700) reason.push(`💨 Nồng độ Gas nguy hiểm (${gas} PPM)`);

          const msg = `🚨 *CẢNH BÁO PCCC KHẨN CẤP*\n\n📍 *Trạm:* ${stationName}\n⚠️ *Cảnh báo:* ${reason.join(" | ")}\n\n📊 *Thông số hiện tại:*\n• Nhiệt độ: \`${temp} °C\`\n• Nồng độ Gas: \`${gas} PPM\`\n• Độ ẩm: \`${tramData.DoAm || '--'} %\` \n\n👉 *Đề nghị kiểm tra khu vực ngay lập tức!*`;

          sendTelegramAlert(msg);
        }
      }
    }
  } catch (error) {
    console.error("❌ Lỗi mạng khi quét dữ liệu:", error.message);
  }
}, 3000); // 3000ms = 3 giây

// 3. Hàm bắn thông báo sang Telegram API
async function sendTelegramAlert(text) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  try {
    await axios.post(url, {
      chat_id: TELEGRAM_CHAT_ID,
      text: text,
      parse_mode: 'Markdown'
    });
    console.log("✅ Đã phát thông báo báo cháy sang Telegram!");
  } catch (err) {
    console.error("❌ Lỗi gửi Telegram:", err.message);
  }
}