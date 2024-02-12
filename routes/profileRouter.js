const express = require("express");
const {
  getMyProfile,
  updateMyProfile,
  deactivateMyProfile,
  searchProfiles,
  viewProfile,
  followAccount,
  unfollowAccount
} = require("../controllers/profileController");
const router = express.Router();
router.route("/me").get(getMyProfile).patch(updateMyProfile);
router.route("/me/deactivate").patch(deactivateMyProfile);
router.route("/search").get(searchProfiles);
router.route("/:id").get(viewProfile);
router.route("/follow/:id").patch(followAccount)
router.route("/unfollow/:id").patch(unfollowAccount)


module.exports = router;
