const bcrypt = require("bcryptjs");
const userModel = require("../../model/userModel");
const jwt = require("jsonwebtoken");

async function userSignInController(req, res) {
  try {
    const { email, password } = req.body;
    if (!email) {
      throw new Error("Bạn Chưa Nhập email");
    }
    if (!password) {
      throw new Error("Bạn Chưa Nhập Mật Khẩu");
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error("Email Hoặc Mật Khẩu Không Chính Xác");
    }
    const chechPassword = await bcrypt.compare(password, user.password);
    if (chechPassword) {
      const tokenData = {
        _id: user._id,
        email: user.email,
        role: user.role
      };
      const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, {
        expiresIn: 60 * 60 * 8,
      });
      const tokenOptions = {
        httpOnly: true,
        secure: true,
        sameSite:"None"
      }
      res.cookie("token",token,tokenOptions).json({
        message: "Đăng Nhập Thành Công",
        data: token,
        success: true,
        error: false
      })
    } else {
      throw new Error("Mật khẩu không chính xác");
    }
  } catch (error) {
    res.json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
module.exports = userSignInController;
