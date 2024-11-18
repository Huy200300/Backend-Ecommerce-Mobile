const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true },
    amount: { type: Number, required: true },
    bankCode: { type: String },
    transactionId: { type: Number },
    status: { type: String },
    productDetails: [],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    email: { type: String },
    shippingDetails: [],
    paymentDetails: [],
    taxPrice: { type: Number, required: true, default: 0.0 },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },
    status: { type: String, default: "pending" },
    statusHistory: [
      {
        orderStatus: { type: String },
        updatedAt: { type: Date },
        reason: { type: String },
        createdBy: {
          type: mongoose.Schema.Types.ObjectId, 
          ref: "user",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("order_new", orderSchema);
