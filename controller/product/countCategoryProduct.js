const productModel = require("../../model/productModel");

async function countCategoryProduct(req, res) {
  const categoriesToFind = [
    "laptop",
    "mobiles",
    "watches",
    "accessory",
    "ipad",
  ];

  try {
    const counts = await productModel.aggregate([
      { $match: { category: { $in: categoriesToFind } } }, // Lọc theo danh mục
      {
        $group: {
          _id: "$category", // Nhóm theo trường category
          count: { $sum: 1 }, // Đếm số lượng sản phẩm trong mỗi nhóm
        },
      },
    ]);
    const categoryCounts = counts.reduce((acc, curr) => {
      acc[curr._id] = curr.count; // Tạo đối tượng với tên danh mục và số lượng
      return acc;
    }, {});
    categoriesToFind.forEach((category) => {
      if (!categoryCounts[category]) {
        categoryCounts[category] = 0; // Đặt count là 0 nếu không có sản phẩm
      }
    });
    res.json({
      message: "Product successfully",
      success: true,
      error: false,
      data: categoryCounts,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: error,
      success: false,
    });
  }
}

module.exports = countCategoryProduct;
