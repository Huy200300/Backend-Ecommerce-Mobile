const orderModel = require("../../model/orderModel");

async function orderSearch(req, res) {
  try {
    const { query, page, limit } = req.query;

    const orders = await orderModel
      .find({
        $or: [
          { orderId: { $regex: query, $options: "i" } },
          { "productDetails.productName": { $regex: query, $options: "i" } },
        ],
      })
      .skip((page - 1) * limit) // Phân trang, bỏ qua những bản ghi trước đó
      .limit(parseInt(limit)) // Giới hạn số lượng kết quả trả về
      .exec();
    
    const totalOrders = await orderModel.countDocuments({
      $or: [
        { orderId: { $regex: query, $options: "i" } },
        { "productDetails.productName": { $regex: query, $options: "i" } },
      ],
    });


     res.json({
       data: orders,
       totalPages: Math.ceil(totalOrders / limit),
       currentPage: parseInt(page),
       success: true,
       message: "Orders retrieved successfully",
     });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error.message || error,
      error: error,
      success: false,
    });
  }
}

module.exports = orderSearch;
