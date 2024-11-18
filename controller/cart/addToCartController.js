const addToCartModel = require("../../model/cartProduct");
// const productModel = require("../../model/productModel");

async function addToCartController(req, res) {
  try {
    const { productId,count } = req?.body;
    const currentUser = req.userId;
    const isProductAvailable = await addToCartModel.findOne({
      productId,
      userId: currentUser,
    });

    if (isProductAvailable) {
      return res.json({
        message: "Sản phẩm đã có trong giỏ hàng",
        error: true,
        success: false,
      });
    }
    const payload = {
      productId: productId,
      quantity: count,
      userId: currentUser || "",
    };

    const newAddToCart = new addToCartModel(payload);
    const saveProduct = await newAddToCart.save();
    return res.json({
      message: "Sản phẩm đã được thêm vào giỏ hàng",
      success: true,
      error: false,
      data: saveProduct,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

module.exports = addToCartController;
