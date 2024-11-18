const productModel = require("../../model/productModel");

async function getTopSellingProduct(req, res) {
  try {
    const { limit } = req.body;

    const filter = {
      status: "Completed",
    };

    const products = await productModel
      .find(filter)
      .limit(limit * 1)
      .sort({ selled: -1 })
      .exec();

    res.json({
      message: "Top Selling Products",
      success: true,
      error: false,
      data: products,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: error,
      success: false,
    });
  }
}

module.exports = getTopSellingProduct;
