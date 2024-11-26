const axios = require("axios");
const crypto = require("crypto");
const Order = require("../../model/orderModel");
const productModel = require("../../model/productModel");
const userModel = require("../../model/userModel");

const accessKey = process.env.MOMO_ACCESSKEY;
const secretKey = process.env.MOMO_SECRETKEY;

const paymentMomo = async (req, res) => {
  const { userId, products, shipping, shippingMethod, shippingAddress } =
    req.body;

  // Kiểm tra xem có giao dịch nào trước đó chưa hoàn tất hoặc bị lỗi không
  const existingOrder = await Order.findOne({
    userId,
    status: { $in: ["pending"] },
  });

  if (existingOrder) {
    // Nếu có giao dịch bị lỗi hoặc chưa hoàn tất, trả về phản hồi
    await Order.deleteOne({
      _id: existingOrder._id,
    });
    return res.status(400).json({
      success: false,
      error: true,
      message:
        "Giao dịch trước đó chưa hoàn tất hoặc bị lỗi. Vui lòng thanh toán sau ít phút nữa.",
      orderId: existingOrder.orderId, // Trả về orderId của giao dịch lỗi để người dùng biết
      status: existingOrder.status, // Trạng thái của giao dịch trước đó
    });
  }

  if (!products) {
    return res.status(400).json({
      success: false,
      error: true,
      message: "Bạn chưa chọn sản phẩm để thanh toán",
    });
  }

  if (!userId) {
    return res.status(400).json({
      success: false,
      error: true,
      message: "Bạn cần đăng nhập để mua hàng",
    });
  }

  if (!shippingAddress) {
    return res.status(400).json({
      success: false,
      error: true,
      message: "Bạn chưa nhập địa chỉ giao hàng",
    });
  }

  const user = await userModel.findById(userId);

  const orderInfo = "pay with MoMo";
  const partnerCode = "MOMO";
  const redirectUrl = "http://localhost:8080/api/payment-result";
  const ipnUrl = "https://04bf-42-119-190-21.ngrok-free.app/api/callback";
  const requestType = "payWithMethod";
  const amount = req.body.amount;
  const orderId = partnerCode + new Date().getTime();
  const requestId = orderId;
  const extraData = "";
  const orderGroupId = "";
  const autoCapture = true;
  const lang = req.body.lang;

  var rawSignature =
    "accessKey=" +
    accessKey +
    "&amount=" +
    amount +
    "&extraData=" +
    extraData +
    "&ipnUrl=" +
    ipnUrl +
    "&orderId=" +
    orderId +
    "&orderInfo=" +
    orderInfo +
    "&partnerCode=" +
    partnerCode +
    "&redirectUrl=" +
    redirectUrl +
    "&requestId=" +
    requestId +
    "&requestType=" +
    requestType;

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  const requestBody = {
    partnerCode: partnerCode,
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    lang: lang,
    requestType: requestType,
    autoCapture: autoCapture,
    extraData: extraData,
    orderGroupId: orderGroupId,
    signature: signature,
  };

  const options = {
    method: "POST",
    url: "https://test-payment.momo.vn/v2/gateway/api/create",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(JSON.stringify(requestBody)),
    },
    data: requestBody,
  };

  try {
    const order = new Order({
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
    });

    await order.save();
    const result = await axios(options);
    return res.json(result.data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: true,
      statusCode: 500,
      message: "Server error: " + error.message,
    });
  }
};

const paymentCallback = async (req, res) => {
  const {
    orderId,
    transId,
    resultCode,
    payType,
    partnerCode,
    orderType,
    message,
  } = req.body;

  const order = await Order.findOne({ orderId: orderId });
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }
  order.transactionId = transId;
  order.status = resultCode === 0 ? "paid" : "failed";
  if (resultCode !== 0) {
    order.paymentDetails = {
      card: "không",
      bank: "không",
    };
  } else {
    order.paymentDetails = {
      card: payType,
      bank: partnerCode,
    };
  }
  order.bankCode = orderType;

  if (resultCode === 0) {
    order.statusHistory.push({
      orderStatus: "Pending",
      updatedAt: Date.now(),
    });
    order.isPaid = true;
    order.paidAt = Date.now();

    const promises = order.productDetails.map(async (product) => {
      if (product.selectedColor) {
        // $elemMatch là một toán tử trong MongoDB dùng để tìm kiếm các
        // phần tử trong mảng mà thỏa mãn tất cả các điều kiện trong biểu thức của nó.
        await productModel.findOneAndUpdate(
          {
            _id: product.productId,
            colors: {
              $elemMatch: {
                colorName: product.selectedColor,
                stock: { $gte: product.quantity },
              },
            },
          },
          {
            $inc: {
              "colors.$[elem].stock": -product.quantity, // Trừ stock theo số lượng mua
              selled: product.quantity, // Tăng số lượng đã bán
            },
          },
          {
            // arrayFilters cung cấp điều kiện lọc cho các phần tử mảng mà bạn muốn áp dụng cập nhật.
            arrayFilters: [{ "elem.colorName": product.selectedColor }],
            new: true,
          }
        );
      } else {
        // Nếu sản phẩm không có `selectedColor`, cập nhật `countInStock` và `selled`
        await productModel.findOneAndUpdate(
          {
            _id: product.productId,
            countInStock: { $gte: product.quantity }, // Kiểm tra tồn kho của sản phẩm
          },
          {
            $inc: {
              countInStock: -product.quantity, // Trừ số lượng tồn kho
              selled: +product.quantity, // Tăng số lượng đã bán
            },
          },
          {
            new: true,
          }
        );
      }
    });

    await Promise.all(promises);
    await order.save();

    return res
      .status(200)
      .json({ success: true, error: false, message: "Payment processed" });
  } else {
    return res
      .status(200)
      .json({ success: false, error: false, message: "Payment rejected" });
  }
};

const transactionStatus = async (req, res) => {
  const { orderId } = req.body;
  const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;
  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  const requestBody = JSON.stringify({
    partnerCode: "MOMO",
    requestId: orderId,
    orderId,
    signature,
    lang: "vi",
  });
  // option axios
  const options = {
    method: "POST",
    url: "https://test-payment.momo.vn/v2/gateway/api/query",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestBody,
  };
  let result = await axios(options);
  return res.status(200).json(result.data);
};

module.exports = {
  paymentMomo,
  paymentCallback,
  transactionStatus,
};
