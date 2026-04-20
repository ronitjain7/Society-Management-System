const express = require('express');
const router = express.Router();
const { getResidents, getResidentById, updateResident, deleteResident } = require('../controllers/residentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, authorize('Admin'), getResidents);

router.route('/:id')
  .get(protect, getResidentById)
  .put(protect, authorize('Admin'), updateResident)
  .delete(protect, authorize('Admin'), deleteResident);

module.exports = router;
