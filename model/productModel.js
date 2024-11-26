const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      unique: true,
      // required: true,
    },
    brandName: {
      type: String,
      // required: true,
    },
    category: {
      type: String,
      // required: true,
    },
    productImage: [],
    colors: [],
    description: {
      type: String,
    },
    price: {
      type: Number,
      // required: true,
    },
    sellingPrice: {
      type: Number,
    },
    countInStock: {
      type: Number,
      // required: true,
    },
    rating: {
      type: Number,
      // required: true,
    },
    discount: {
      type: Number,
    },
    amount: {
      type: Number,
    },
    selled: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    isHotDeal: {
      type: Boolean,
      default: false,
    },
    hotDealDiscount: {
      type: Number,
      default: 0,
    },
    specificationsRef: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "specificationsModel",
    },
    specificationsModel: {
      type: String,
      enum: ["mobiles", "ipad", "watches", "accessory", "laptop"],
    },
  },
  {
    timestamps: true,
    suppressReservedKeysWarning: true,
  }
);
const productModel = mongoose.model("product", productSchema);
module.exports = productModel;
