const addToCartModel = require("../../model/cartProduct");

async function addToCartViewProduct(req, res) {
  try {
    const currentUser = req.userId;
    const allProducts = await addToCartModel
      .find({
        userId: currentUser,
      })
      .populate("productId");
    res.json({
      message: "Oki",
      success: true,
      error: false,
      data: allProducts,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

module.exports = addToCartViewProduct;
