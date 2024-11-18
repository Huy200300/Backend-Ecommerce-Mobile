
async function verifyOTP(req, res) {
  try {
      const { code } = req.query;
      if (parseInt(req.app.locals.OTP) === parseInt(code)) {
          req.app.locals.OTP = null;
          req.app.locals.resetSession = true;
          return res.status(201).send({msg:"Verify Successfully"})
      }
          
      return res.status(404).send({msg:"Invalid "})
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

module.exports = verifyOTP;
