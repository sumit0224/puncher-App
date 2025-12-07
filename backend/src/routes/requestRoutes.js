const express = require('express');
const router = express.Router();
const { createRequest, acceptRequest, updateStatus, getUserRequests, getVendorJobs } = require('../controllers/requestController');
const { protect, vendorOnly } = require('../middleware/authMiddleware');

router.post('/', protect, createRequest);
router.post('/:id/accept', protect, vendorOnly, acceptRequest);
router.put('/:id/status', protect, vendorOnly, updateStatus);
router.get('/user', protect, getUserRequests);
router.get('/vendor', protect, vendorOnly, getVendorJobs);

module.exports = router;
