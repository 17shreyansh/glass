const Product = require('../models/Product');

/**
 * Stock Manager Utility
 * Centralized stock management for production-ready operations
 */

class StockManager {
  /**
   * Check if sufficient stock is available for an order
   * @param {Array} items - Array of order items [{_id, size, color, quantity}]
   * @returns {Promise<{available: boolean, insufficientItems: Array}>}
   */
  static async checkStockAvailability(items) {
    const insufficientItems = [];

    for (const item of items) {
      const product = await Product.findById(item._id);
      
      if (!product) {
        insufficientItems.push({
          productId: item._id,
          reason: 'Product not found',
          requested: item.quantity,
          available: 0
        });
        continue;
      }

      const availableStock = product.getStockForVariant(item.size, item.color);
      
      if (availableStock < item.quantity) {
        insufficientItems.push({
          productId: item._id,
          productName: product.name,
          size: item.size,
          color: item.color,
          reason: 'Insufficient stock',
          requested: item.quantity,
          available: availableStock
        });
      }
    }

    return {
      available: insufficientItems.length === 0,
      insufficientItems
    };
  }

  /**
   * Reserve stock for an order (decrease stock)
   * @param {Array} items - Array of order items
   * @returns {Promise<{success: boolean, updatedProducts: Array}>}
   */
  static async reserveStock(items) {
    const updatedProducts = [];
    const errors = [];

    for (const item of items) {
      try {
        const product = await Product.findById(item.productId || item._id);
        
        if (!product) {
          errors.push(`Product ${item.productId || item._id} not found`);
          continue;
        }

        const currentStock = product.getStockForVariant(item.size, item.color);
        const success = product.updateVariantStock(
          item.size,
          item.color,
          currentStock - item.quantity
        );

        if (success) {
          await product.save();
          updatedProducts.push({
            productId: product._id,
            productName: product.name,
            size: item.size,
            color: item.color,
            previousStock: currentStock,
            newStock: currentStock - item.quantity
          });
        } else {
          errors.push(`Failed to update stock for ${product.name}`);
        }
      } catch (error) {
        errors.push(`Error updating ${item.productId}: ${error.message}`);
      }
    }

    return {
      success: errors.length === 0,
      updatedProducts,
      errors
    };
  }

  /**
   * Release stock (increase stock) - for cancellations/returns
   * @param {Array} items - Array of order items
   * @returns {Promise<{success: boolean, updatedProducts: Array}>}
   */
  static async releaseStock(items) {
    const updatedProducts = [];
    const errors = [];

    for (const item of items) {
      try {
        const product = await Product.findById(item.productId || item._id);
        
        if (!product) {
          errors.push(`Product ${item.productId || item._id} not found`);
          continue;
        }

        const currentStock = product.getStockForVariant(item.size, item.color);
        const success = product.updateVariantStock(
          item.size,
          item.color,
          currentStock + item.quantity
        );

        if (success) {
          await product.save();
          updatedProducts.push({
            productId: product._id,
            productName: product.name,
            size: item.size,
            color: item.color,
            previousStock: currentStock,
            newStock: currentStock + item.quantity
          });
        } else {
          errors.push(`Failed to release stock for ${product.name}`);
        }
      } catch (error) {
        errors.push(`Error releasing stock for ${item.productId}: ${error.message}`);
      }
    }

    return {
      success: errors.length === 0,
      updatedProducts,
      errors
    };
  }

  /**
   * Get low stock products (for admin alerts)
   * @param {number} threshold - Stock threshold (default: 10)
   * @returns {Promise<Array>}
   */
  static async getLowStockProducts(threshold = 10) {
    const products = await Product.find({ isActive: true });
    const lowStockProducts = [];

    for (const product of products) {
      if (product.totalStock <= threshold) {
        const variantsInfo = product.variants.map(v => ({
          attributes: Object.fromEntries(v.attributes || new Map()),
          stock: v.stock,
          sku: v.sku
        }));

        lowStockProducts.push({
          _id: product._id,
          name: product.name,
          sku: product.sku,
          totalStock: product.totalStock,
          variants: variantsInfo
        });
      }
    }

    return lowStockProducts;
  }

  /**
   * Get out of stock products
   * @returns {Promise<Array>}
   */
  static async getOutOfStockProducts() {
    return await Product.find({ 
      isActive: true, 
      totalStock: 0 
    }).select('name sku totalStock variants');
  }

  /**
   * Bulk update stock for multiple variants
   * @param {Array} updates - Array of {productId, size, color, stock}
   * @returns {Promise<{success: boolean, results: Array}>}
   */
  static async bulkUpdateStock(updates) {
    const results = [];
    const errors = [];

    for (const update of updates) {
      try {
        const product = await Product.findById(update.productId);
        
        if (!product) {
          errors.push(`Product ${update.productId} not found`);
          continue;
        }

        const success = product.updateVariantStock(
          update.size,
          update.color,
          update.stock
        );

        if (success) {
          await product.save();
          results.push({
            productId: product._id,
            productName: product.name,
            size: update.size,
            color: update.color,
            newStock: update.stock,
            success: true
          });
        } else {
          errors.push(`Variant not found for ${product.name}`);
        }
      } catch (error) {
        errors.push(`Error updating ${update.productId}: ${error.message}`);
      }
    }

    return {
      success: errors.length === 0,
      results,
      errors
    };
  }

  /**
   * Get stock history/audit trail (placeholder for future implementation)
   * This would require a separate StockHistory model
   */
  static async getStockHistory(productId, options = {}) {
    // TODO: Implement stock history tracking
    // This would require creating a StockHistory model to track all stock changes
    return {
      message: 'Stock history tracking not yet implemented',
      productId
    };
  }
}

module.exports = StockManager;
