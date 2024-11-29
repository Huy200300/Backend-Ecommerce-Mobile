const productModel = require("../../model/productModel");

async function getCategoryProduct(req, res) {
  try {
    // Bước 1: Đếm số lượng sản phẩm trong từng category có status = "Completed" và sắp xếp
    const categories = await productModel.aggregate([
      { $match: { status: "Completed" } }, // Lọc các sản phẩm có status = "Completed"
      {
        $group: {
          _id: "$category", // Nhóm theo category
          count: { $sum: 1 }, // Đếm số lượng sản phẩm trong mỗi category
        },
      },
      { $sort: { count: -1 } }, // Sắp xếp theo số lượng sản phẩm giảm dần
    ]);

    // Sử dụng Promise.all để chạy các truy vấn song song
    const productByCategoryPromises = categories.map(async (category) => {
      // Lấy toàn bộ sản phẩm của category đã sắp xếp và chỉ chọn trường productImage
      const products = await productModel
        .find({
          category: category._id,
          status: "Completed",
        })
        .select("productImage"); // Chỉ lấy trường productImage

      if (products.length) {
        return {
          category: category._id,
          products: products,
        };
      }
      return null; // Nếu không có sản phẩm, trả về null để lọc sau
    });

    // Chờ tất cả các Promise hoàn tất
    const productByCategory = (
      await Promise.all(productByCategoryPromises)
    ).filter(Boolean); // Lọc bỏ những giá trị null

    res.json({
      message: "Product by category",
      success: true,
      error: false,
      data: productByCategory,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

module.exports = getCategoryProduct;
