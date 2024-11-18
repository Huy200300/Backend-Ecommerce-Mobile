const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      unique: true,
      default: "",
    },
    password: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: [
        "GENERAL",
        "ADMIN",
        "orderManager",
        "productManager",
        "paymentVerifier",
        "deliveryStaff",
      ],
      default: "GENERAL",
    },
    phone: {
      type: String,
      default: "",
    },
    address: [],
  },
  {
    timestamps: true,
  }
);
const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
