const express = require("express");
const protect = require("../middleware/protect");
const verifyUser = require("../middleware/verifyUser");
const router = express.Router();
const {
  userSignup,
  userLogin,
  changePassword,
} = require("../controller/authController");
router.route("/signup").post(userSignup);
router.route("/login").post(userLogin);
router.route("/change-password").patch(protect, verifyUser, changePassword);

module.exports = router;
