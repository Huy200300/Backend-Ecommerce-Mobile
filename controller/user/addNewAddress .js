const userModel = require("../../model/userModel");
const phoneRegex = /^(03|05|07|08|09|02)\d{8}$/;

async function addNewAddress(req, res) {
  try {
    const {
      userId,
      fullName,
      addressType,
      defaultAddress,
      detailAddress,
      fullAddress,
      phone,
    } = req.body;

    const user = await userModel.findById(userId);

    if (!user) {
      throw new Error("User không tồn tại");
    }

    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        message:
          "Số điện thoại không hợp lệ. Vui lòng nhập đúng số điện thoại.",
        success: false,
        error: true,
      });
    }

    const newAddress = {
      fullName,
      addressType,
      defaultAddress: defaultAddress || false,
      detailAddress: detailAddress || "",
      fullAddress,
      phone,
    };

    user.address.push(newAddress);

    const address = await user.save();

    res.status(200).json({
      message: "Thêm địa chỉ mới thành công",
      data: address,
      error: false,
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

module.exports = addNewAddress;
