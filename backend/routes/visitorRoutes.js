const express = require('express');
const router = express.Router();
const { getVisitors, createVisitor, checkoutVisitor } = require('../controllers/visitorController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getVisitors)
  .post(protect, createVisitor);

router.put('/:id/checkout', protect, checkoutVisitor);

module.exports = router;
