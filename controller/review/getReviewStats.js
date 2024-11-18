const reviewModel = require("../../model/reviewModel");

const getReviewStats = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await reviewModel.find({ productId });
    const reviewCount = reviews.length;
    const averageRating =
      reviewCount > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
        : 0;
    res.json({
      success: true,
      error: false,
      reviewCount,
      averageRating,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

module.exports = {
  getReviewStats,
};
