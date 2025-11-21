const express = require("express");
const {
  createProduct,
  getProducts,
  getProductById,
  getProductsByType,
  getRelatedProducts,
  updateProduct,
  deleteProduct,
  updateStock,
} = require("../controllers/productController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Admin-only routes
router.post("/", protect, isAdmin, createProduct);
router.put("/:id", protect, isAdmin, updateProduct);
router.delete("/:id", protect, isAdmin, deleteProduct);
router.patch("/:id/stock", protect, isAdmin, updateStock);

// Public routes
router.get("/", getProducts);
router.get("/type/:type", getProductsByType);
router.get("/:identifier/related", getRelatedProducts);
router.get("/:identifier", getProductById);


module.exports = router;