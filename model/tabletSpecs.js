const mongoose = require("mongoose");

const tabletSpecsSchema = new mongoose.Schema({
  screenSize: String, // Kích thước màn hình (ví dụ: "10.2 inch")
  resolution: String, // Độ phân giải màn hình (ví dụ: "2160 x 1620 pixels")
  battery: String, // Dung lượng pin (ví dụ: "8827mAh")
  camera: String, // Thông số camera (ví dụ: "8MP")
  processor: String, // Bộ vi xử lý (ví dụ: "Apple A13 Bionic")
  ram: String, // Dung lượng RAM (ví dụ: "4GB")
  storage: String, // Dung lượng lưu trữ (ví dụ: "64GB")
  os: String, // Hệ điều hành (ví dụ: "iPadOS 15")
  connectivity: String, // Kết nối (ví dụ: "Wi-Fi, 4G")
  weight: String, // Khối lượng (ví dụ: "490g")
  hasStylusSupport: Boolean, // Hỗ trợ bút cảm ứng (ví dụ: true/false)
});
const TabletSpecs =
  mongoose.models.ipad || mongoose.model("ipad", tabletSpecsSchema);
module.exports = TabletSpecs;
