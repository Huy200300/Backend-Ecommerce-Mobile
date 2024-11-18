const productModel = require("../../model/productModel");

async function getProductHotdeals(req, res) {
  const { page = 1, limit = 10 } = req.query;
  try {
    const skip = (page - 1) * limit;
    const hotDeals = await productModel
      .find({
        isHotDeal: true,
        status: "Completed",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalHotDeals = await productModel.countDocuments({
      isHotDeal: true,
      status: "Completed",
    });
    res.json({
      message: "Product successfully",
      success: true,
      error: false,
      data: hotDeals,
      totalPages: Math.ceil(totalHotDeals / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: error,
      success: false,
    });
  }
}

module.exports = getProductHotdeals;
