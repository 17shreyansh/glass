const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  reason: {
    type: String,
    required: true,
    enum: ['defective', 'wrong_size', 'wrong_item', 'not_as_described', 'damaged', 'other']
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['requested', 'approved', 'rejected', 'processing', 'completed'],
    default: 'requested'
  },
  refundAmount: {
    type: Number,
    required: true
  },
  images: [String],
  adminNotes: String,
  processedAt: Date,
  completedAt: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('Return', returnSchema);