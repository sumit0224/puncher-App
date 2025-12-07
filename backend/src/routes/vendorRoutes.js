const express = require('express');
const router = express.Router();
const {
    getVendorProfile,
    updateVendorProfile,
    updateLocation,
    uploadKYC,
} = require('../controllers/vendorController');
const { protect, vendorOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/profile', protect, vendorOnly, getVendorProfile);
router.put('/profile', protect, vendorOnly, updateVendorProfile);
router.put('/location', protect, vendorOnly, updateLocation);

// Upload KYC: Expects fields like 'aadhar', 'pan'
router.post(
    '/kyc',
    protect,
    vendorOnly,
    upload.fields([
        { name: 'aadhar', maxCount: 1 },
        { name: 'pan', maxCount: 1 },
        { name: 'dl', maxCount: 1 },
        { name: 'photo', maxCount: 1 },
    ]),
    uploadKYC
);

module.exports = router;
