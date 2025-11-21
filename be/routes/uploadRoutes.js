const express = require("express");
const { uploadImage, uploadMultipleImages, getFiles, deleteFile } = require("../controllers/uploadController");
const { protect, isAdmin } = require("../middleware/authMiddleware"); // Assuming these exist

const router = express.Router();

// Upload routes
router.post("/", protect, isAdmin, uploadImage);
router.post("/multiple", protect, isAdmin, uploadMultipleImages);
router.get("/files", protect, isAdmin, getFiles);
router.delete("/files/:id", protect, isAdmin, deleteFile);

module.exports = router;