const express = require("express");
const { getFeed } = require("../controller/feedController");
const router = express.Router();
router.route("/feed").get(getFeed);
module.exports = router;
