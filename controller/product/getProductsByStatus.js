const productModel = require("../../model/productModel");

async function getProductsByStatus(req, res) {
  const { status, page, limit } = req.body;
  try {
    let products;

    if (limit && page) {
      products = await productModel
        .find({ status: status })
        .limit(limit * 1)
        .sort({ updatedAt: -1 })
        .skip((page - 1) * limit)
        .exec();
    } else {
      products = await productModel
        .find({ status: status })
        .sort({ updatedAt: -1 })
        .exec();
    }

    const count = await productModel.countDocuments({ status });

    const totalPages = limit ? Math.ceil(count / limit) : 1;

    res.status(200).json({
      data: products,
      totalPages: totalPages,
      currentPage: page || 1,
      success: true,
      error: false,
      message: "Lấy sản phẩm theo trạng thái thành công",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

module.exports = getProductsByStatus;
