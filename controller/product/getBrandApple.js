const productModel = require("../../model/productModel");

async function getBrandApple(req, res) {
  try {
    const apple = req?.body?.apple;
    const product = await productModel.find({brandName: apple})
    res.json({
      message: "Product by category",
      success: true,
      error: false,
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

module.exports = getBrandApple;
