const reviewModel = require("../../model/reviewModel");

async function newReviews(req, res) {
  try {
    const { rating, comment } = req.body;
    const currentUserId = req.userId;
    if (!rating) {
      throw new Error("Hãy đánh giá sản phẩm nhé ");
    }
    if (!comment) {
      throw new Error("Bạn chưa nhập nhận xét");
    }
    const payload = {
      ...req.body,
      userId: currentUserId,
    };
    const review = new reviewModel(payload);
    const saveReview = await review.save();

    res.status(200).json({
      data: saveReview,
      success: true,
      error: false,
      message: "Cảm ơn đánh giá của bạn",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

module.exports = newReviews;
