const productModel = require("../../model/productModel");
const MobileSpecs = require("../../model/MobileSpecs");
const AccessorySpecs = require("../../model/AccessorySpecs");
const LaptopSpecs = require("../../model/LaptopSpecs");
const TabletSpecs = require("../../model/TabletSpecs");
const WatchSpecs = require("../../model/WatchSpecs");
async function getProductSpecificationsById(req, res) {
  try {
    const { productId } = req.params;
    const product = await productModel
      .findById(productId)
      .populate("specificationsRef");
    return res.json({
      message: "Product successfully",
      success: true,
      error: false,
      data: {
        specificationsRef: product.specificationsRef,
        specificationsModel: product.specificationsModel,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error.message || error,
      error: error,
      success: false,
    });
  }
}

module.exports = getProductSpecificationsById;
