const cloudinary = require("cloudinary").v2;
const fs = require("fs").promises;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload file to Cloudinary
const uploadImageToCloudinary = async (filePath,crop) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      transformation: [{ width: 800, height: 800, crop:crop}],
    });
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    throw new Error("Error uploading file to Cloudinary");
  }
};

// File upload controller
const uploadImage = async (req, res) => {
  const { crop } = req.query; // pad || fill
  //Access the temporary file path from req.file
  const tempFilePath = req.file.path;
  if (!tempFilePath) {
    return res
      .status(400)
      .json({ status: "fail", message: "No file uploaded!" });
  }
  try {
    // Upload temporary file to Cloudinary
    const imageUrl = await uploadImageToCloudinary(tempFilePath,crop);
    // File uploaded successfully to Cloudinary, return the Cloudinary URL
    res.json({ status: "success", image_url: imageUrl });
    // Delete temporary file after upload
    await fs.unlink(tempFilePath);
  } catch (error) {
    res.status(500).json({ status: "fail", message: "Error uploading file!" });
  }
};

module.exports = {
  uploadImage,
};
