const moment = require("moment");
const Order = require("../../model/orderModel");
const productModel = require("../../model/productModel");
const userModel = require("../../model/userModel");
const mongoose = require("mongoose");
const config = require("config");
const querystring = require("qs");
const crypto = require("crypto");
const addToCartModel = require("../../model/cartProduct");

const createVNPAYTransaction = async (req, res) => {
  process.env.TZ = "Asia/Ho_Chi_Minh";

  let date = new Date();
  let createDate = moment(date).format("YYYYMMDDHHmmss");

  let ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  let tmnCode = config.get("vnp_TmnCode");
  let secretKey = config.get("vnp_HashSecret");
  let vnpUrl = config.get("vnp_Url");
  let returnUrl = config.get("vnp_ReturnUrl");
  let orderId = moment(date).format("DDHHmmss");
  let amount = req.body.amount;
  let bankCode = req.body.bankCode;

  let locale = req.body.language;
  if (!locale) {
    locale = "vn";
  }
  let currCode = "VND";
  let vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = tmnCode;
  vnp_Params["vnp_Locale"] = locale;
  vnp_Params["vnp_CurrCode"] = currCode;
  vnp_Params["vnp_TxnRef"] = orderId;
  vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + orderId;
  vnp_Params["vnp_OrderType"] = "other";
  vnp_Params["vnp_Amount"] = amount * 100;
  vnp_Params["vnp_ReturnUrl"] = returnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;
  if (bankCode) {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);
  const { productId, userId, shipping, shippingMethod, shippingAddress } =
    req.body;
  try {
    const productsInfo = await Promise.all(
      productId.map(async (item) => {
        return {
          productId: item._id,
          name: item.productName,
          price: item.price,
          image: item.productImage,
          quantity: item.amount,
        };
      })
    );

    const payload = {
      orderId: vnp_Params["vnp_TxnRef"],
      amount: vnp_Params["vnp_Amount"] / 100,
      bankCode: vnp_Params["vnp_BankCode"],
      userId: userId,
      productDetails: productsInfo,
      shippingDetails: {
        shipping: shipping,
        shippingMethod: shippingMethod,
        shippingAddress: shippingAddress,
      },
    };
    const order = new Order(payload);
    await order.save();

    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

    res.json({ url: vnpUrl });
  } catch (error) {
    console.error("Error creating VNPAY transaction:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const vnpayReturn = async (req, res) => {
  let vnp_Params = req.query;
  let secureHash = vnp_Params["vnp_SecureHash"];
  const orderId = vnp_Params["vnp_TxnRef"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);
  let secretKey = config.get("vnp_HashSecret");
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  if (secureHash === signed) {
    try {
      const order = await Order.findOne({ orderId: orderId });

      if (!order) {
        return res.redirect(
          `${process.env.FRONTEND_URL}/payment-result?status=error`
        );
      }
      order.transactionId = vnp_Params["vnp_TransactionNo"];
      order.status =
        vnp_Params["vnp_ResponseCode"] === "00" ? "paid" : "failed";
      order.isPaid = true;
      order.paidAt = Date.now();
      order.statusHistory.push({
        orderStatus: "Pending",
        updatedAt: Date.now(),
      });
      if (vnp_Params["vnp_ResponseCode"] === "failed") {
        order.paymentDetails = {
          card: "không",
          bank: "không",
        };
      } else {
        order.paymentDetails = {
          card: "card",
          bank: "VNPay",
        };
      }

      await order.save();

      if (vnp_Params["vnp_ResponseCode"] === "00") {
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
        await addToCartModel.deleteMany(
          {
            productId: { $in: order.productDetails.map((id) => id.productId) },
          },
          {
            new: true,
          }
        );

        res.redirect(
          `${process.env.FRONTEND_URL}/payment-result?status=success`
        );
      } else {
        res.redirect(`${process.env.FRONTEND_URL}/payment-result?status=error`);
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      res.redirect(`${process.env.FRONTEND_URL}/payment-result?status=error`);
    }
  } else {
    res.redirect(`${process.env.FRONTEND_URL}/payment-result?status=error`);
  }
};

const orderVNPAY = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, status, startDate, endDate } = req.query;

    const filter = { userId };

    if (status) {
      filter.$expr = {
        $eq: [{ $arrayElemAt: ["$statusHistory.orderStatus", -1] }, status],
      };
    }

    if (startDate && endDate) {
      const start = new Date(startDate); // Ngày bắt đầu
      start.setHours(0, 0, 0, 0); // Đặt giờ bắt đầu là 00:00

      const end = new Date(endDate); // Ngày kết thúc
      end.setHours(23, 59, 59, 999); // Đặt giờ kết thúc là 23:59

      filter.createdAt = {
        $gte: start,
        $lte: end,
      };
    }

    const orders = await Order.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .exec();

    const totalOrders = await Order.countDocuments(filter);

    res.json({
      data: orders,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: parseInt(page),
      message: "Order List",
      error: false,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy thông tin đơn hàng", error });
  }
};

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

module.exports = {
  createVNPAYTransaction,
  vnpayReturn,
  orderVNPAY,
};
