const mongoose = require("mongoose");

const statusUpdateSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "order_new",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  oldStatus: { type: String, required: true },
  newStatus: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
});

const StatusUpdate = mongoose.model("StatusUpdate", statusUpdateSchema);
module.exports = StatusUpdate;
