const Address = require('../models/Address');

// Get user addresses
exports.getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id });
    res.json({ success: true, data: addresses });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching addresses' });
  }
};

// Create new address
exports.createAddress = async (req, res) => {
  try {
    const address = await Address.create({
      ...req.body,
      user: req.user._id
    });
    res.status(201).json({ success: true, data: address });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update address
exports.updateAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    res.json({ success: true, data: address });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete address
exports.deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    res.json({ success: true, message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting address' });
  }
};