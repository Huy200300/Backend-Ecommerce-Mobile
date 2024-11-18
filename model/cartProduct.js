const mongoose = require("mongoose");

const addToCart = new mongoose.Schema(
  {
    productId: { ref: "product", type: String },
    quantity: { type: Number },
    userId: { ref: "user",type: String },
  },
  {
    timestamps: true,
  }
);
const addToCartModel = mongoose.model("addToCart", addToCart);
module.exports = addToCartModel;
