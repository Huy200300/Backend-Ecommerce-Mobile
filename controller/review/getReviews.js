const reviewModel = require("../../model/reviewModel");

async function getReviews(req, res) {
  try {
    const { productId } = req?.body;
    
    const { page = 1, limit = 3 } = req.query;
    const reviews = await reviewModel
      .find({ productId })
      .populate("userId")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await reviewModel.countDocuments({
      productId,
    });
    res.status(200).json({
      data: reviews,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalReview: { count: count },
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

module.exports = getReviews;
