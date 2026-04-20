const express = require('express');
const router = express.Router();
const { getMaintenance, createBill, payBill, checkOverdue } = require('../controllers/maintenanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getMaintenance)
  .post(protect, authorize('Admin'), createBill);

router.post('/check-overdue', protect, authorize('Admin'), checkOverdue);
router.patch('/:id/pay', protect, payBill);

module.exports = router;
