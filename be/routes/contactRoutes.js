const express = require('express');
const router = express.Router();
const {
  subscribe,
  getAllContacts,
  deleteContact
} = require('../controllers/contactController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.post('/subscribe', subscribe);
router.get('/', protect, isAdmin, getAllContacts);
router.delete('/:id', protect, isAdmin, deleteContact);

module.exports = router;
