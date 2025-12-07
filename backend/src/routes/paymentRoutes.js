const express = require('express');
const router = express.Router();
const { createOrder, paymentCallback } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/order', protect, createOrder);
router.post('/callback', paymentCallback);

module.exports = router;
