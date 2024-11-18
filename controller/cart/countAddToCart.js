const addToCartModel = require("../../model/cartProduct");

async function countAddToCart(req, res) {
  try {
    const userId = req?.userId;
    const count = await addToCartModel.countDocuments({
      userId: userId,
    });
    res.json({
      message: "Oki",
      success: true,
      error: false,
      data: { count: count },
    });
  } catch (error) {
    res.json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

module.exports = countAddToCart;
