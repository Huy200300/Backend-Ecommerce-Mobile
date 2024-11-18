const productModel = require("../../model/productModel");

async function getNewProducts(req, res) {
  try {
    const { limit, days } = req.body;

    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - days);

    const filter = {
      status: "Completed",
      isNew:true
    };

    const products = await productModel
      .find(filter)
      .limit(limit * 1)
      .sort({ createdAt: 1 })
      .exec();
    
    res.json({
      message: "New Products",
      success: true,
      error: false,
      data: products,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: error,
      success: false,
    });
  }
}

module.exports = getNewProducts;
