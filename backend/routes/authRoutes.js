const express = require("express");
const {
  registerUser,
  loginUser,
  getUserInfo,
  getAllUsers,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getUser", protect, getUserInfo);
router.get("/users", getAllUsers);

// Image upload route
router.post("/upload-image", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    
    // Create the full URL for the uploaded file
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    // Return the image URL
    res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: imageUrl
    });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({ message: "Error uploading image", error: error.message });
  }
});

module.exports = router;