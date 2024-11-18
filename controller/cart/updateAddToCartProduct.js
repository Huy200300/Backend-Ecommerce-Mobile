const addToCartModel = require("../../model/cartProduct");

async function updateAddToCartProduct(req, res) {
  try {
    const currentUserId = req.userId;
    const addToCartProductId = req?.body?._id;
    const qty = req.body.quantity;

    const update = await addToCartModel.updateOne(
      { _id: addToCartProductId },
      {
        ...(qty && { quantity: qty }),
      }
    );
    res.json({
      message: "Product updated successfully",
      success: true,
      error: false,
      data: update,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

module.exports = updateAddToCartProduct;
