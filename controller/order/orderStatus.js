const Order = require("../../model/orderModel");

async function orderStatus(req, res) {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);

    res.status(200).json({
      message: "Trạng thái đơn hàng",
      error: false,
      success: true,
      data: order.statusHistory
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: error,
      success: false,
    });
  }
}

module.exports = orderStatus;
