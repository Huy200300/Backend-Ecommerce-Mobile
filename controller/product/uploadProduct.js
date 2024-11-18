const uploadProductPermission = require("../../helper/permission");
const productModel = require("../../model/productModel");

async function uploadProduct(req, res) {
  try {
    const sessionUserId = req.userId;
    if (!uploadProductPermission(sessionUserId)) {
      throw new Error("Permission denied");
    }
    const product = new productModel({ ...req.body, status: "Pending" });
    const saveProduct = await product.save();
    res.status(200).json({
      data: saveProduct,
      success: true,
      error: false,
      message: "Product saved successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

module.exports = uploadProduct;
