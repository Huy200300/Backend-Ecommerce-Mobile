const addToCartModel = require("../../model/cartProduct");

async function deleteAllAddToCartProduct(req, res) {
  try {
    const currentUserId = req.userId;
    const { ids } = req.body;
    const deleteProduct = await addToCartModel.deleteMany({ _id: ids });
    res.json({
      message: "Product deleted successfully",
      success: true,
      error: false,
      data: deleteProduct,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

module.exports = deleteAllAddToCartProduct;
