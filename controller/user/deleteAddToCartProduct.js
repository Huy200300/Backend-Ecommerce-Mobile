const addToCartModel = require("../../model/cartProduct");

async function deleteAddToCartProduct(req, res) {
  try {
    const currentUserId = req.userId;
    const addToCartProductId = req?.body?._id;
    const deleteProduct = await addToCartModel.deleteOne({
      _id: addToCartProductId,
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
      error: true,
      success: false,
    });
  }
}

module.exports = deleteAddToCartProduct;
