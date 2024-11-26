const productModel = require("../../model/productModel");
async function getProductSpecificationsById(req, res) {
  try {
    const { productId } = req.params;
    const product = await productModel
      .findById(productId)
      .populate("specificationsRef");
    return res.json({
      message: "Product successfully",
      success: true,
      error: false,
      data: {
        specificationsRef: product.specificationsRef,
        specificationsModel: product.specificationsModel,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error.message || error,
      error: error,
      success: false,
    });
  }
}

module.exports = getProductSpecificationsById;
