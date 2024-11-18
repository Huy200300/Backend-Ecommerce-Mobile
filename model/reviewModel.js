const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
  {
    userId: { ref: "user", type: String },
    userName: { type: String },
    avatar: { type: String },
    comment: { type: String },
    likes: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const reviewSchema = new mongoose.Schema(
  {
    productId: { ref: "product", type: String },
    userId: { ref: "user", type: String },
    rating: { type: Number },
    comment: { type: String },
    likes: { type: Number, default: 0 },
    likedBy: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
      default: [],
    },
    replies: [replySchema],
  },
  {
    timestamps: true,
  }
);

const reviewModel = mongoose.model("review", reviewSchema);

module.exports = reviewModel;
