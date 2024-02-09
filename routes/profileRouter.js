const express = require("express");
const { getMyProfile,updateMyProfile,deactivateMyProfile } = require("../controllers/profileController");
const router = express.Router();
router.route("/me").get(getMyProfile).patch(updateMyProfile);
router.route("/me/deactivate").patch(deactivateMyProfile);

module.exports = router;
