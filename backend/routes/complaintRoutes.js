const express = require('express');
const router = express.Router();
const { getComplaints, createComplaint, updateComplaintStatus } = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getComplaints)
  .post(protect, authorize('Owner', 'Tenant'), createComplaint);

router.route('/:id')
  .patch(protect, authorize('Admin'), updateComplaintStatus)
  .put(protect, authorize('Admin'), updateComplaintStatus);

module.exports = router;
