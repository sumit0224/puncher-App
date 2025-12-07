const express = require('express');
const router = express.Router();
const { getStats, getVendors, verifyVendor } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// For MVP, just using protect. In real app, add adminOnly middleware
router.get('/stats', protect, adminOnly, getStats);
router.get('/vendors', protect, adminOnly, getVendors);
router.put('/vendors/:id/verify', protect, adminOnly, verifyVendor);

module.exports = router;
