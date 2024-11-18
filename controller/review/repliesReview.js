const reviewModel = require("../../model/reviewModel");

async function repliesReview(req, res) {
  try {
    const { reviewId, comment, userId, userName, avatar } = req.body;

    const review = await reviewModel.findById(reviewId);

    if (!review) {
      throw new Error("Không tìm thấy bình luận");
    }

    const reply = {
      userId,
      userName,
      avatar,
      comment,
      createdAt: new Date(),
    };

    review.replies.push(reply);

    const updatedReview = await review.save();

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
}

module.exports = repliesReview;
