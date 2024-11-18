const productModel = require("../../model/productModel");

async function getCategoryWiseProduct(req, res) {
  try {
    const { category } = req?.body || req?.query;
    const product = await productModel.find({ category, status: "Completed" });
    res.json({
      message: "Product",
      error: false,
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

module.exports = getCategoryWiseProduct;
