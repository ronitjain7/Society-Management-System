const express = require('express');
const router = express.Router();
const { getNotices, createNotice } = require('../controllers/noticeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getNotices)
  .post(protect, authorize('Admin'), createNotice);

module.exports = router;
