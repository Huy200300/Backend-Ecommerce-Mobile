const productModel = require("../../model/productModel");

async function getProductDetail(req, res) {
    try {
        const { productId } = req?.body
        const product = await productModel.findById(productId)
        res.json({
            message: "Oki",
            error: false,
            success: true,
            data: product
        })
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

module.exports = getProductDetail;
