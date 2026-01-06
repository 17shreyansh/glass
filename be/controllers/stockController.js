const StockManager = require('../utils/stockManager');
const Product = require('../models/Product');

/**
 * Stock Controller
 * Handles all stock-related operations for admin panel
 */

// @desc    Get low stock products
// @route   GET /api/stock/low
// @access  Private/Admin
exports.getLowStockProducts = async (req, res) => {
  try {
    const { threshold = 10 } = req.query;
    const lowStockProducts = await StockManager.getLowStockProducts(parseInt(threshold));
    
    res.json({
      success: true,
      count: lowStockProducts.length,
      threshold: parseInt(threshold),
      products: lowStockProducts
    });
  } catch (error) {
    console.error('Get low stock products error:', error);
    res.status(500).json({ error: 'Failed to fetch low stock products' });
  }
};

// @desc    Get out of stock products
// @route   GET /api/stock/out-of-stock
// @access  Private/Admin
exports.getOutOfStockProducts = async (req, res) => {
  try {
    const outOfStockProducts = await StockManager.getOutOfStockProducts();
    
    res.json({
      success: true,
      count: outOfStockProducts.length,
      products: outOfStockProducts
    });
  } catch (error) {
    console.error('Get out of stock products error:', error);
    res.status(500).json({ error: 'Failed to fetch out of stock products' });
  }
};

// @desc    Check stock availability for items
// @route   POST /api/stock/check
// @access  Public
exports.checkStockAvailability = async (req, res) => {
  try {
    const { items } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items array is required' });
    }

    const result = await StockManager.checkStockAvailability(items);
    
    res.json({
      success: true,
      available: result.available,
      insufficientItems: result.insufficientItems
    });
  } catch (error) {
    console.error('Check stock availability error:', error);
    res.status(500).json({ error: 'Failed to check stock availability' });
  }
};

// @desc    Bulk update stock
// @route   POST /api/stock/bulk-update
// @access  Private/Admin
exports.bulkUpdateStock = async (req, res) => {
  try {
    const { updates } = req.body;
    
    if (!updates || !Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ error: 'Updates array is required' });
    }

    const result = await StockManager.bulkUpdateStock(updates);
    
    res.json({
      success: result.success,
      updated: result.results.length,
      results: result.results,
      errors: result.errors
    });
  } catch (error) {
    console.error('Bulk update stock error:', error);
    res.status(500).json({ error: 'Failed to bulk update stock' });
  }
};

// @desc    Get stock summary/dashboard
// @route   GET /api/stock/summary
// @access  Private/Admin
exports.getStockSummary = async (req, res) => {
  try {
    const [
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      activeProducts
    ] = await Promise.all([
      Product.countDocuments(),
      StockManager.getLowStockProducts(10),
      StockManager.getOutOfStockProducts(),
      Product.countDocuments({ isActive: true })
    ]);

    // Calculate total stock value
    const products = await Product.find({ isActive: true });
    let totalStockValue = 0;
    let totalStockUnits = 0;

    products.forEach(product => {
      totalStockUnits += product.totalStock || 0;
      totalStockValue += (product.totalStock || 0) * (product.price || 0);
    });

    res.json({
      success: true,
      summary: {
        totalProducts,
        activeProducts,
        lowStockCount: lowStockProducts.length,
        outOfStockCount: outOfStockProducts.length,
        totalStockUnits,
        totalStockValue: Math.round(totalStockValue * 100) / 100
      },
      lowStockProducts: lowStockProducts.slice(0, 10), // Top 10
      outOfStockProducts: outOfStockProducts.slice(0, 10) // Top 10
    });
  } catch (error) {
    console.error('Get stock summary error:', error);
    res.status(500).json({ error: 'Failed to fetch stock summary' });
  }
};

// @desc    Adjust stock with reason (for manual adjustments)
// @route   POST /api/stock/adjust
// @access  Private/Admin
exports.adjustStock = async (req, res) => {
  try {
    const { productId, size, color, adjustment, reason } = req.body;
    
    if (!productId || !size || !color || adjustment === undefined) {
      return res.status(400).json({ 
        error: 'productId, size, color, and adjustment are required' 
      });
    }

    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const currentStock = product.getStockForVariant(size, color);
    const newStock = Math.max(0, currentStock + adjustment);
    
    const success = product.updateVariantStock(size, color, newStock);
    
    if (!success) {
      return res.status(404).json({ 
        error: `Variant not found with Size: ${size}, Color: ${color}` 
      });
    }

    await product.save();

    // TODO: Log this adjustment in StockHistory model
    console.log(`Stock adjusted for ${product.name} (${size}, ${color}): ${currentStock} -> ${newStock}. Reason: ${reason || 'No reason provided'}`);

    res.json({
      success: true,
      message: 'Stock adjusted successfully',
      product: {
        id: product._id,
        name: product.name,
        size,
        color,
        previousStock: currentStock,
        adjustment,
        newStock,
        totalStock: product.totalStock
      }
    });
  } catch (error) {
    console.error('Adjust stock error:', error);
    res.status(500).json({ error: 'Failed to adjust stock' });
  }
};

module.exports = exports;
