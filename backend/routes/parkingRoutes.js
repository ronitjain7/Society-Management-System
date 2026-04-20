const express = require('express');
const router = express.Router();
const { assignParking, getParkingStatus } = require('../controllers/parkingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getParkingStatus);
router.post('/assign', protect, authorize('Admin'), assignParking);

module.exports = router;
