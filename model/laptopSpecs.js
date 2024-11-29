const mongoose = require("mongoose");

const laptopSpecsSchema = new mongoose.Schema({
  screenSize: String, // Kích thước màn hình (ví dụ: "15.6 inch")
  resolution: String, // Độ phân giải màn hình (ví dụ: "1920 x 1080 pixels")
  processor: String, // Bộ vi xử lý (ví dụ: "Intel Core i7")
  ram: String, // Dung lượng RAM (ví dụ: "16GB")
  storage: String, // Dung lượng lưu trữ (ví dụ: "512GB SSD")
  graphicsCard: String, // Card đồ họa (ví dụ: "NVIDIA GTX 1660 Ti")
  battery: String, // Dung lượng pin (ví dụ: "6000mAh")
  os: String, // Hệ điều hành (ví dụ: "Windows 11")
  weight: String, // Khối lượng (ví dụ: "1.8kg")
  connectivity: String, // Kết nối (ví dụ: "Wi-Fi 6, Bluetooth 5.0")
  usbPorts: Number, // Số cổng USB (ví dụ: 3)
  hasTouchscreen: Boolean, // Màn hình cảm ứng (true/false)
});
const LaptopSpecs =
  mongoose.models.laptop || mongoose.model("laptop", laptopSpecsSchema);

module.exports = LaptopSpecs;
