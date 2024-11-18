const productModel = require("../../model/productModel");

async function getProductByCategory(req, res) {
  try {
    const product = await productModel.aggregate([
      { $project: { category: 1, brandName: 1 } },
      { $match: { brandName: "apple" } },
    ]);
    res.json({
      message: "Oki",
      error: false,
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

module.exports = getProductByCategory;
