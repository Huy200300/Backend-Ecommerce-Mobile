const productModel = require("../../model/productModel");

async function filterProduct(req, res) {
  try {
    const { category, brands, priceRange, limit, page } = req.body;


    let filter = {
      status: "Completed",
    };

    if (category) {
      filter.category = category;
    }

    if (brands && brands.length > 0) {
      filter.brandName = { $in: brands };
    }

    if (priceRange && priceRange.length === 2) {
      filter.sellingPrice = { $gte: priceRange[0], $lte: priceRange[1] };
    }

    const products = await productModel
      .find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await productModel.countDocuments(filter);

    res.json({
      message: "Product",
      success: true,
      error: false,
      data: products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: error,
      success: false,
    });
  }
}

module.exports = filterProduct;
