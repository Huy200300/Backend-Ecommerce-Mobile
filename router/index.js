const express = require("express");
const userSignUpController = require("../controller/user/userSignUp");
const userSignInController = require("../controller/user/userSignIn");
const userDetailsController = require("../controller/user/userDetails");

const userLogOut = require("../controller/user/userLogOut");
const AllUsers = require("../controller/user/allUsers");
const updateUser = require("../controller/user/updateUser");
const uploadProduct = require("../controller/product/uploadProduct");
const allProduct = require("../controller/product/getAllProducts");
const updateProduct = require("../controller/product/updateProduct");
const getCategoryProduct = require("../controller/product/getCategoryProductOne");
const getCategoryWiseProduct = require("../controller/product/getCategoryWiseProduct");
const getProductDetail = require("../controller/product/getProductDetail");
const addToCartController = require("../controller/cart/addToCartController");
const countAddToCart = require("../controller/cart/countAddToCart");
const addToCartViewProduct = require("../controller/cart/addToCartViewProduct");
const updateAddToCartProduct = require("../controller/cart/updateAddToCartProduct");
const deleteAddToCartProduct = require("../controller/user/deleteAddToCartProduct");
const searchProduct = require("../controller/product/searchProduct");
const filterProduct = require("../controller/product/filterProduct");
const deleteProduct = require("../controller/product/deleteProduct");
const getProductByCategory = require("../controller/product/getProductByCategory");
const getBrandApple = require("../controller/product/getBrandApple");
const { authToken, localVariables } = require("../middleware/authToken");
const {
  verifyUser,
  verifyEmailUser,
} = require("../controller/user/verifyUser");
const generateOTP = require("../controller/user/generateOTP");
const registerMail = require("../controller/user/mailer");
const verifyOTP = require("../controller/user/verifyOTP");
const { resetPassword } = require("../controller/user/resetPassword");

const newReviews = require("../controller/review/newReviews");
const getReviews = require("../controller/review/getReviews");
const deleteAllAddToCartProduct = require("../controller/user/deleteAllAddToCartProduct");
const {
  createVNPAYTransaction,
  vnpayReturn,
  orderVNPAY,
} = require("../controller/order/orderControllerVNPay");
const orderDetails = require("../controller/order/orderDetails");
const {
  paymentMomo,
  paymentCallback,
  transactionStatus,
} = require("../controller/order/orderControllerMomo");
const { likeReview } = require("../controller/review/likeReview");
const repliesReview = require("../controller/review/repliesReview");
const { getReviewStats } = require("../controller/review/getReviewStats");
const paymentResult = require("../controller/order/paymentResult");
const filterSellingProduct = require("../controller/product/filterSellingProduct");
const updateProductStatus = require("../controller/product/updateProductStatus");
const getProductsByStatus = require("../controller/product/getProductsByStatus");
const getNewProducts = require("../controller/product/getNewProducts");
const getNewProductByCategory = require("../controller/product/getNewProductByCategory");
const addNewAddress = require("../controller/user/addNewAddress ");
const getUserAddresses = require("../controller/user/getUserAddresses");
const getTopSellingProduct = require("../controller/product/getTopSellingProduct");
const orderStatus = require("../controller/order/orderStatus");
const paymentCastOnDelivery = require("../controller/order/paymentCastOnDelivery");
const orderByStaff = require("../controller/order/orderByStaff");
const getSearchNameProduct = require("../controller/product/getSearchNameProduct");
const getProductHotdeals = require("../controller/product/getProductHotdeals");
const countCategoryProduct = require("../controller/product/countCategoryProduct");
const getProductSpecificationsById = require("../controller/product/getProductSpecificationsById");
const orderSearch = require("../controller/order/orderSearch");


const router = express.Router();

router.post("/signup", userSignUpController);
router.post("/signin", userSignInController);
router.get("/user-details", authToken, userDetailsController);
router.post("/authenticate", verifyUser, (req, res) => res.end());
router.post("/verify-email", verifyEmailUser);
router.get("/logout", userLogOut);
router.get("/generateOTP", verifyUser, localVariables, generateOTP);
router.post("/registerMail", registerMail);
router.get("/verifyOTP", verifyUser, verifyOTP);
router.put("/resetPassword", resetPassword);
router.post("/addNewAddress", authToken, addNewAddress);
router.get("/user/:userId/address", getUserAddresses);

// addmin-panel
router.get("/all-users", authToken, AllUsers);
router.post("/update-user", authToken, updateUser);
router.post("/delete-product", authToken, deleteProduct);

// product
router.post("/create-product", authToken, uploadProduct);
router.get("/all-products", allProduct);
router.post("/update-product", authToken, updateProduct);
router.get("/get-category", getCategoryProduct);
router.post("/category-products", getCategoryWiseProduct);
router.post("/product-detail", getProductDetail);
router.get("/search-product", searchProduct);
router.get("/search", getSearchNameProduct);
router.post("/filter-product", filterProduct);
router.get("/get-product-by-category", getProductByCategory);
router.post("/get-brand-apple", getBrandApple);
router.get("/top-selling-product", filterSellingProduct);
router.post("/products-status", updateProductStatus);
router.post("/products-filter-status", getProductsByStatus);
router.post("/get-new-product", getNewProducts);
router.post("/get-top-selling-product", getTopSellingProduct);
router.post("/get-new-product-by-category", getNewProductByCategory);
router.get("/get-product-hot-deals", getProductHotdeals);
router.get("/count-category-product", countCategoryProduct);
router.get("/specifications-by-id/:productId", getProductSpecificationsById);


// user add to cart
router.post("/add-to-cart", authToken, addToCartController);
router.get("/count-add-to-cart", authToken, countAddToCart);
router.get("/view-cart-product", authToken, addToCartViewProduct);
router.post("/update-cart-product", authToken, updateAddToCartProduct);
router.post("/delete-cart-product", authToken, deleteAddToCartProduct);
router.post("/delete-all-cart-product", authToken, deleteAllAddToCartProduct);

//payment and order
router.post("/create_payment_url", authToken, createVNPAYTransaction);
router.get("/vnpay_return", vnpayReturn);
router.get("/orders/user/:userId", orderVNPAY);
router.post("/orders-detail", authToken, orderDetails);
router.post("/payment_momo", paymentMomo);
router.post("/callback", paymentCallback);
router.post("/transaction_tatus", transactionStatus);
router.get("/payment-result", paymentResult);
router.post("/get-order-status", orderStatus)
router.post("/payment_cast_on_delivery", paymentCastOnDelivery);
router.get("/orders/staff/:orderId", orderByStaff);
router.get("/orders/search", orderSearch);

// review product
router.post("/reviews", authToken, newReviews);
router.post("/get-reviews", getReviews);
router.post("/reviews/like", likeReview);
router.post("/reviews/replies", repliesReview);
router.get("/reviews/stats/:productId", getReviewStats);

module.exports = router;
