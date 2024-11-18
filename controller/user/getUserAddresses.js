const userModel = require("../../model/userModel");

async function getUserAddresses(req, res) {
  try {
    const { userId } = req.params;

    const user = await userModel.findById(userId);

    if (!user) {
      throw new Error("User không tồn tại");
    }

    res.status(200).json({
      message: "oki",
      error: false,
      success: true,
      data: user.address,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

module.exports = getUserAddresses;
