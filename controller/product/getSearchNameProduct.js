const productModel = require("../../model/productModel");

async function getSearchNameProduct(req, res) {
  try {
    const search = req.query.query;
    const regex = new RegExp(search, "i", "g");
    const product = await productModel
      .find({
        $and: [
          {
            $or: [{ productName: regex }, { category: regex }],
          },
          { status: "Completed" },
        ],
      })
      .limit(5)
      .exec();
    res.json({
      message: "Search for product ",
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

module.exports = getSearchNameProduct;
