const express = require('express');
const router = express.Router();
const { registerUser, loginUser, registerVendor, loginVendor, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register/user', registerUser);
router.post('/login/user', loginUser);
router.post('/register/vendor', registerVendor);
router.post('/login/vendor', loginVendor);
router.get('/profile', protect, getUserProfile);

module.exports = router;
