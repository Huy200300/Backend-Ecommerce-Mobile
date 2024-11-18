const Order = require("../../model/orderModel");

async function orderDetails(req, res) {
  try {
    const sessionUser = req.userId;
    const orderId = req?.body?.orderId;
    const order = await Order.find({ orderId: orderId });
    if (!order) {
      res.json({
        error: true,
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      error: false,
      success: true,
      data: order,
      message: "Ok",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: error,
      success: false,
    });
  }
}

module.exports = orderDetails;
