const express = require("express");
const {
  getMyProfile,
  updateMyProfile,
  deactivateMyProfile,
  searchProfiles,
  viewProfile,
  followProfile,
  unfollowProfile
} = require("../controller/profileController");
const router = express.Router();
router.route("/me").get(getMyProfile).patch(updateMyProfile);
router.route("/me/deactivate").patch(deactivateMyProfile);
router.route("/search").get(searchProfiles);
router.route("/:id").get(viewProfile);
router.route("/follow/:id").patch(followProfile)
router.route("/unfollow/:id").patch(unfollowProfile)


module.exports = router;
