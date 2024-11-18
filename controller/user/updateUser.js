const userModel = require("../../model/userModel");

async function updateUser(req, res) {
  try {
    const sessionUser = req.userId;
    const {
      userId,
      name,
      email,
      address,
      phone,
      avatar,
      role,
      city,
      fullName,
      addressType,
      defaultAddress,
      detailAddress,
      fullAddress,
    } = req.body;
    const payload = {
      ...(email && { email: email }),
      ...(name && { name: name }),
      ...(role && { role: role }),
      ...(address && { address: address }),
      ...(phone && { phone: phone }),
      ...(avatar && { avatar: avatar }),
      ...(city && { city: city }),
      ...(fullName && { fullName: fullName }),
      ...(addressType && { addressType: addressType }),
      ...(defaultAddress && { defaultAddress: defaultAddress }),
      ...(detailAddress && { detailAddress: detailAddress }),
      ...(fullAddress && { fullAddress: fullAddress }),
    };
    const user = await userModel.findById(sessionUser);
    const updateUser = await userModel.findByIdAndUpdate(userId, payload, {
      new: true,
    });
    res.json({
      message: "Cập nhật thành công",
      success: true,
      error: false,
      data: updateUser,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

module.exports = updateUser;
