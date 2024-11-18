const UserModel = require("../../model/userModel");
const bcrypt = require("bcryptjs");


async function resetPassword(req, res) {
  try {
    const { _id,email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error("Email Hoặc Mật Khẩu Không Chính Xác");
    }
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hashSync(password, salt);
    if (!hashPassword) {
      throw new Error("Mật Khẩu Không Chính Xác");
    }
    const payload = {
      ...(email && { email: email }),
      ...(password && { password: hashPassword }),
    };
    const updateUser = await UserModel.findByIdAndUpdate(_id,  payload );
    res.json({
      message: "Thay đổi thành công!",
      success: true,
      error: false,
      data: updateUser,
    });
  } catch (error) {
    res.json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
module.exports = { resetPassword };
