const express = require("express");
const { uploadImage } = require("../controller/ImageUploadController");
const router = express.Router();

router.route("/").post(uploadImage);
module.exports = router;
