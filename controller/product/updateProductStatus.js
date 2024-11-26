const productModel = require("../../model/productModel");

async function updateProductStatus(req, res) {
  const { productId, status } = req.body;


  if (!["Pending", "Completed"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const updatedProduct = await productModel.findByIdAndUpdate(
      productId,
      { status: status },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({
      data: updatedProduct,
      success: true,
      error: false,
      message: "Product completed successfully",
    });
  } catch (error) {
    console.log(error)
    res.status(400).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

module.exports = updateProductStatus;
