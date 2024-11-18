const userModel = require("../../model/userModel");
const bcrypt = require("bcryptjs");

async function userSignUpController(req, res) {
  try {
    const { email, name, phone, password  } = req.body;

    const user = await userModel.findOne({ email });
    if (user) {
      throw new Error("Đã tồn tại email này. ");
    }
    if (!email) {
      throw new Error("Bạn Chưa Nhập email");
    }
    if (!name) {
      throw new Error("Bạn Chưa Nhập Tên");
    }
    if (!phone) {
      throw new Error("Bạn Chưa Nhập Điện Thoại");
    }
    if (!password) {
      throw new Error("Bạn Chưa Nhập Mật Khẩu");
    }
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hashSync(password, salt);

    if (!hashPassword) {
      throw new Error("Mật Khẩu Không Chính Xác");
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
    res.json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

module.exports = userSignUpController;
