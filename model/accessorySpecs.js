const mongoose = require("mongoose");

// Định nghĩa schema
const accessorySpecsSchema = new mongoose.Schema({
  compatibility: [String], // Tương thích với thiết bị nào (ví dụ: ["iPhone", "iPad"])
  material: String, // Chất liệu (ví dụ: "Plastic, Metal")
  colorOptions: [String], // Các tùy chọn màu sắc (ví dụ: ["Black", "White"])
  weight: String, // Khối lượng (ví dụ: "100g")
  dimensions: String, // Kích thước (ví dụ: "10 x 5 x 2 cm")
  isWireless: Boolean, // Không dây (true/false)
  batteryLife: String, // Thời gian pin nếu có (ví dụ: "20 hours")
});

// Kiểm tra nếu model đã tồn tại, thì không đăng ký lại
const AccessorySpecs =
  mongoose.models.accessory ||
  mongoose.model("accessory", accessorySpecsSchema);

module.exports = AccessorySpecs;
