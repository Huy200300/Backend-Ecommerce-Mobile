const jwt = require("jsonwebtoken");

async function authToken(req, res, next) {
  try {
    const token = req?.cookies?.token;
    if (!token) {
      return res.status(200).json({
        message: "Vui Lòng Đăng Nhập...!",
        error: true,
        success: false,

      });
    }
    jwt.verify(token, process.env.TOKEN_SECRET_KEY, function (error, decoded) {
      if (error) {
        console.log("Error authenticating user", error);
      }
      req.userId = decoded?._id;
      next();
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
      data: [],
      error: true,
      success: false,
    });
  }
}


async function localVariables(req, res, next) {
  req.app.locals = {
    OTP: null,
    resetSession: false,
  };
  next();
}

module.exports = { authToken, localVariables };
