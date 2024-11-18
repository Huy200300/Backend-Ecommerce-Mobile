const productModel = require("../../model/productModel");
const uploadProductPermission = require("../../helper/permission");

async function updateProduct(req, res) {
  try {
    if (!uploadProductPermission(req.userId)) {
      throw new Error("Permission denied");
    }
    const { _id, ...resBody } = req.body;
    const updateProduct = await productModel.findByIdAndUpdate(
      _id,
      { ...resBody, amount: 1 },
      {
        new: true,
      }
    );
    res.json({
      message: "Product updated successfully",
      success: true,
      error: false,
      data: updateProduct,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

module.exports = updateProduct;
