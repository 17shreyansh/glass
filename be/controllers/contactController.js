const Contact = require('../models/Contact');
const asyncHandler = require('express-async-handler');

// @desc    Subscribe to newsletter
// @route   POST /api/contacts/subscribe
// @access  Public
const subscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Email is required');
  }

  const existingContact = await Contact.findOne({ email });

  if (existingContact) {
    if (existingContact.status === 'subscribed') {
      res.status(400);
      throw new Error('Email already subscribed');
    }
    existingContact.status = 'subscribed';
    await existingContact.save();
    return res.json({ success: true, message: 'Successfully resubscribed!' });
  }

  const contact = await Contact.create({ email });

  res.status(201).json({
    success: true,
    message: 'Successfully subscribed to newsletter!',
    data: contact
  });
});

// @desc    Get all contacts (Admin)
// @route   GET /api/contacts
// @access  Private/Admin
const getAllContacts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const status = req.query.status;

  const query = {};
  if (status) query.status = status;

  const skip = (page - 1) * limit;

  const contacts = await Contact.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Contact.countDocuments(query);

  res.json({
    success: true,
    data: contacts,
    pagination: {
      page,
      pages: Math.ceil(total / limit),
      total,
      limit
    }
  });
});

// @desc    Delete contact (Admin)
// @route   DELETE /api/contacts/:id
// @access  Private/Admin
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res.status(404);
    throw new Error('Contact not found');
  }

  await contact.deleteOne();

  res.json({
    success: true,
    message: 'Contact deleted successfully'
  });
});

module.exports = {
  subscribe,
  getAllContacts,
  deleteContact
};
