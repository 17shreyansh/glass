const Return = require('../models/Return');
const Order = require('../models/Order');

// Get user returns
exports.getReturns = async (req, res) => {
  try {
    const returns = await Return.find({ user: req.user._id })
      .populate('order', 'orderNumber')
      .populate('product', 'name mainImage price')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: returns });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching returns' });
  }
};

// Create return request
exports.createReturn = async (req, res) => {
  try {
    const { orderId, productId, reason, description, refundAmount } = req.body;
    
    // Verify order belongs to user
    const order = await Order.findOne({ _id: orderId, user: req.user._id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const returnRequest = await Return.create({
      user: req.user._id,
      order: orderId,
      product: productId,
      reason,
      description,
      refundAmount
    });

    const populatedReturn = await Return.findById(returnRequest._id)
      .populate('order', 'orderNumber')
      .populate('product', 'name mainImage price');

    res.status(201).json({ success: true, data: populatedReturn });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update return status (admin only)
exports.updateReturnStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const updateData = { status, adminNotes };
    
    if (status === 'processing') {
      updateData.processedAt = new Date();
    } else if (status === 'completed') {
      updateData.completedAt = new Date();
    }

    const returnRequest = await Return.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('order', 'orderNumber')
     .populate('product', 'name mainImage price');

    if (!returnRequest) {
      return res.status(404).json({ message: 'Return request not found' });
    }

    res.json({ success: true, data: returnRequest });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};