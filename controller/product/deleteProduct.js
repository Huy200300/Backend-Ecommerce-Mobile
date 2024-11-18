const productModel = require("../../model/productModel");

async function deleteProduct(req, res) {
  try {
    const sessionUser = req.userId;
    const productId = req?.body?._id;
    const deleteProduct = await productModel.deleteOne({
      _id: productId,
    });
    res.json({
      message: "Product deleted successfully",
      success: true,
      error: false,
      data: deleteProduct,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: error,
      success: false,
    });
  }
}

module.exports = deleteProduct;
