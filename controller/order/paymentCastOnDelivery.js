const Order = require("../../model/orderModel");
const userModel = require("../../model/userModel");

function generateTransactionId() {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

async function paymentCastOnDelivery(req, res) {
  try {
    const orderId = "COD" + new Date().getTime();
    const {
      userId,
      products,
      amount,
      shipping,
      shippingMethod,
      shippingAddress,
    } = req.body;
    const user = await userModel.findById(userId);

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Bạn cần đăng nhập để mua hàng",
      });
    }

    const order = new Order({
      transactionId: generateTransactionId(),
      orderId,
      amount,
      userId,
      email: user.email,
      productDetails: products,
      shippingDetails: {
        shipping,
        shippingMethod,
        shippingAddress,
      },
      status: "COD",
      paymentDetails: {
        card: "không",
        bank: "không",
      },
      bankCode: "COD",
      statusHistory: {
        orderStatus: "Pending",
        updatedAt: Date.now(),
      },
    });
    await order.save();
    res.redirect(
      `http://localhost:8080/api/payment-result?resultCode=0`
    );
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error.message || error,
      error: error,
      success: false,
    });
  }
}

module.exports = paymentCastOnDelivery;
