const productModel = require("../../model/productModel");

async function filterSellingProduct(req, res) {
  try {
    const { category, limit = 3 } = req.query;
    const pipeline = [
      {
        $match: {
          category: category,
          status: "Completed",
        },
      },
      { $sort: { selled: -1 } },
      { $limit: parseInt(limit) },
    ];

    const topSelling = await productModel.aggregate(pipeline);

    res.json({
      message: "Product",
      success: true,
      error: false,
      data: topSelling,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: error,
      success: false,
    });
  }
}
module.exports = filterSellingProduct;
