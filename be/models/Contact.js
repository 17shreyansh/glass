const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  status: {
    type: String,
    enum: ['subscribed', 'unsubscribed'],
    default: 'subscribed'
  }
}, {
  timestamps: true
});

contactSchema.index({ email: 1 }, { unique: true });

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
