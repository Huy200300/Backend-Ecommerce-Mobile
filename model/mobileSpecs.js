const mongoose = require("mongoose");

const mobileSpecsSchema = new mongoose.Schema({
  screenSize: String, // Kích thước màn hình (ví dụ: "6.5 inch")
  resolution: String, // Độ phân giải màn hình (ví dụ: "1080 x 2400 pixels")
  battery: String, // Dung lượng pin (ví dụ: "4500mAh")
  camera: String, // Thông số camera (ví dụ: "12MP + 12MP")
  processor: String, // Bộ vi xử lý (ví dụ: "Snapdragon 888")
  ram: String, // Dung lượng RAM (ví dụ: "8GB")
  storage: String, // Dung lượng lưu trữ (ví dụ: "128GB")
  os: String, // Hệ điều hành (ví dụ: "Android 12")
  connectivity: String, // Kết nối (ví dụ: "5G, Wi-Fi 6")
  weight: String, // Khối lượng (ví dụ: "180g")
});
const MobileSpecs =
  mongoose.models.mobiles || mongoose.model("mobiles", mobileSpecsSchema);
module.exports = MobileSpecs;
