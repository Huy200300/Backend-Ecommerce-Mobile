const productModel = require("../../model/productModel");

async function searchProduct(req, res) {
  try {
    const { q, price, category, inStock, onSale } = req.query;
    let filterQuery = {};

    if (q) {
      const regex = new RegExp(q, "i"); 
      filterQuery.$or = [{ productName: regex }, { category: regex }];
    }

    // Lọc theo giá
    if (price) {
      const [minPrice, maxPrice] = price.split("-").map(Number);
      filterQuery.sellingPrice = {};
      if (minPrice) filterQuery.sellingPrice.$gte = minPrice; 
      if (maxPrice) filterQuery.sellingPrice.$lte = maxPrice; 
    }

    if (category) {
      filterQuery.category = category;
    }

    // Lọc theo tình trạng còn hàng
    if (inStock) {
      filterQuery.inStock = inStock === "true"; // Chuyển đổi từ chuỗi 'true' thành boolean
    }

    // Lọc theo sản phẩm đang giảm giá
    if (onSale) {
      filterQuery.onSale = onSale === "true";
    }

    const products = await productModel.find({
      $and: [
        filterQuery,
        { status: "Completed" }, 
      ],
    });

    res.json({
      message: "Search for product",
      error: false,
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

module.exports = searchProduct;
