const reviewModel = require("../../model/reviewModel");

const likeReview = async (req, res) => {
  try {
    const { reviewId, userId } = req.body;

    const review = await reviewModel.findById(reviewId);

    if (!review) {
      throw new Error("Không tìm thấy bình luận");
    }

    if (review.likedBy.includes(userId)) {
      throw new Error("Bạn đã thích bình luận này rồi");
    }
    const updatedReview = await reviewModel.findByIdAndUpdate(
      reviewId,
      {
        $inc: { likes: 1 },
        $push: { likedBy: userId },
      },
      { new: true }
    );

    res.json({
      success: true,
      error: false,
      data: updatedReview,
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
  likeReview,
};
