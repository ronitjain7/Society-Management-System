const express = require('express');
const router = express.Router();
const { registerResident, loginResident, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerResident); // Consider adding protect/authorize('Admin') later
router.post('/login', loginResident);
router.get('/profile', protect, getMe);

module.exports = router;
