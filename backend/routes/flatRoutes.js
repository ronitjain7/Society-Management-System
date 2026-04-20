const express = require('express');
const router = express.Router();
const { getFlats, createFlat, getFlatById, getPublicFlats } = require('../controllers/flatController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/public')
  .get(getPublicFlats);

router.route('/')
  .get(protect, authorize('Admin'), getFlats)
  .post(protect, authorize('Admin'), createFlat);

router.route('/:id')
  .get(protect, getFlatById);

module.exports = router;
