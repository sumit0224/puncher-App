const Vendor = require('../models/Vendor');

// @desc    Get vendor profile
// @route   GET /api/vendors/profile
// @access  Private (Vendor)
const getVendorProfile = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.user.id).select('-passwordHash');
        if (vendor) {
            res.json({
                id: vendor.id,
                name: vendor.name,
                phone: vendor.phone,
                shopName: vendor.shopName,
                serviceTypes: vendor.serviceTypes,
                currentLocation: vendor.currentLocation,
                isVerified: vendor.isVerified,
                documents: vendor.documents,
                bankInfo: vendor.bankInfo,
            });
        } else {
            res.status(404).json({ message: 'Vendor not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update vendor profile (incl. simple fields)
// @route   PUT /api/vendors/profile
// @access  Private (Vendor)
const updateVendorProfile = async (req, res) => {
    const { name, shopName, serviceTypes, bankInfo } = req.body;

    try {
        const updatedVendor = await Vendor.findByIdAndUpdate(
            req.user.id,
            {
                name,
                shopName,
                serviceTypes, // ensure frontend sends array
                bankInfo
            },
            { new: true, select: 'id name shopName serviceTypes' }
        );
        res.json(updatedVendor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update vendor location
// @route   PUT /api/vendors/location
// @access  Private (Vendor)
const updateLocation = async (req, res) => {
    const { lat, long } = req.body;
    // location stored as "lat,long" string
    const location = `${lat},${long}`;

    try {
        const updatedVendor = await Vendor.findByIdAndUpdate(
            req.user.id,
            {
                currentLocation: location,
                isActive: true
            },
            { new: true }
        );
        res.json({ message: 'Location updated', location: updatedVendor.currentLocation });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Upload KYC documents
// @route   POST /api/vendors/kyc
// @access  Private (Vendor)
const uploadKYC = async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
    }

    try {
        const filePaths = {};
        Object.keys(req.files).forEach(key => {
            filePaths[key] = req.files[key][0].path;
        });

        const vendor = await Vendor.findById(req.user.id);

        let currentDocs = vendor.documents || {};
        const newDocs = { ...currentDocs, ...filePaths };

        const updated = await Vendor.findByIdAndUpdate(
            req.user.id,
            {
                documents: newDocs,
                isVerified: false
            },
            { new: true }
        );

        res.json({ message: 'Documents uploaded', documents: updated.documents });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


// @desc    Toggle vendor status (Online/Offline)
// @route   PUT /api/vendors/status
// @access  Private (Vendor)
const toggleStatus = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.user.id);
        if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

        vendor.isActive = !vendor.isActive;
        await vendor.save();

        res.json({ isActive: vendor.isActive });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getVendorProfile,
    updateVendorProfile,
    updateLocation,
    uploadKYC,
    toggleStatus
};
