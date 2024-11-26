const userModel = require("../../model/userModel");
const bcrypt = require("bcryptjs");
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const phoneRegex = /^(03|05|07|08|09|02)\d{8}$/;

async function userSignUpController(req, res) {
  try {
    const { email, name, phone, password } = req.body;

    console.log(req.body);

    const user = await userModel.findOne({ email });
    if (user) {
      throw new Error("Đã tồn tại email này.");
    }

    if (!email) {
      throw new Error("Bạn Chưa Nhập email.");
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Định dạng email không hợp lệ.",
        success: false,
        error: true,
      });
    }

    if (!name) {
      throw new Error("Bạn Chưa Nhập Tên.");
    }

    if (!phone) {
      throw new Error("Bạn Chưa Nhập Điện Thoại.");
    }

    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        message:
          "Số điện thoại không hợp lệ. Vui lòng nhập đúng số điện thoại.",
        success: false,
        error: true,
      });
    }

    if (!password) {
      throw new Error("Bạn Chưa Nhập Mật Khẩu.");
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hashSync(password, salt);

    if (!hashPassword) {
      throw new Error("Mật Khẩu Không Chính Xác.");
    }

    const payload = {
      ...req.body,
      role: "GENERAL",
      password: hashPassword,
    };

    const userData = new userModel(payload);
    const saveUser = await userData.save();

    res.status(200).json({
      data: saveUser,
      success: true,
      error: false,
      message: "Bạn Vừa Tạo Tài Khoản Thành Công!",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

module.exports = userSignUpController;
