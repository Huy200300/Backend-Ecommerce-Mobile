const UserModel = require("../../model/userModel");

async function verifyUser(req, res, next) {
  try {
    const { email } = req.method == "GET" ? req.query : req.body;
    const exist = await UserModel.findOne({ email });
    if (!exist)
      return res.json({
        success: false,
        error: true,
        message: "Không tìm thấy tài khoản của bạn !",
      });
    else {
      next();
    }
  } catch (error) {
    res.json({
      error: true,
      success: false,
      message: error.message || error,
    });
  }
}

async function verifyEmailUser(req, res) {
  try {
    const { email } =  req.body;;
    // check the user existance
    const exist = await UserModel.findOne({ email });
    if (!exist)
      return res.json({
        success: false,
        error: true,
        message: "Không tìm thấy tài khoản của bạn !",
      });
    res.json({
      success: true,
      error: false,
      data: exist,
      message: "Oki",
    });
  } catch (error) {
    res.json({
      error: true,
      success: false,
      message: error.message || error,
    });
  }
}

module.exports = { verifyUser, verifyEmailUser };
