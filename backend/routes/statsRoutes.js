const express = require('express');
const router = express.Router();
const { getSummaryStats } = require('../controllers/statsController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/summary', protect, authorize('Admin'), getSummaryStats);

module.exports = router;
