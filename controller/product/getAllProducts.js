const productModel = require("../../model/productModel");
async function allProduct(req, res) {
  try {
    const product = await productModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "All Product",
      success: true,
      error: false,
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: error,
      success: false,
    });
  }
}

module.exports = allProduct;
