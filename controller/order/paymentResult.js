async function paymentResult(req, res) {
  try {
    const originalUrl = req.originalUrl;

    const queryParams = new URLSearchParams(originalUrl.split("?")[1]);

    const resultCode = queryParams.get("resultCode");

    res.redirect(
      `${process.env.FRONTEND_URL}/payment-result?resultCode=${resultCode}`
    );
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      error: error,
      success: false,
    });
  }
}

module.exports = paymentResult;
