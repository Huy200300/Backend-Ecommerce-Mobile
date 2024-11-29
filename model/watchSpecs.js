const mongoose = require("mongoose");

const watchSpecsSchema = new mongoose.Schema({
  screenSize: String, // Kích thước màn hình (ví dụ: "1.78 inch")
  resolution: String, // Độ phân giải màn hình (ví dụ: "448 x 368 pixels")
  battery: String, // Dung lượng pin (ví dụ: "300mAh")
  os: String, // Hệ điều hành (ví dụ: "watchOS 7")
  connectivity: String, // Kết nối (ví dụ: "Bluetooth 5.0, GPS")
  weight: String, // Khối lượng (ví dụ: "40g")
  waterResistance: String, // Chống nước (ví dụ: "50m")
  sensors: [String], // Cảm biến (ví dụ: ["Heart Rate", "SpO2"])
  strapMaterial: String, // Chất liệu dây (ví dụ: "Silicone")
  isFitnessTracker: Boolean, // Theo dõi sức khỏe (true/false)
});
const WatchSpecs =
  mongoose.models.watches || mongoose.model("watches", watchSpecsSchema);
module.exports = WatchSpecs;
