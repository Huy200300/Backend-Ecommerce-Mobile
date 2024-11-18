const orderModel = require("../../model/orderModel");

async function orderByStaff(req, res) {
  try {
    const { orderId } = req.params;
    const order = await orderModel
      .findById(orderId)
      .populate("userId", "name email")
      .populate("statusHistory.createdBy", "name")
      .exec();
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

module.exports = orderByStaff;
