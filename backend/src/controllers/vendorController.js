const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get vendor profile
// @route   GET /api/vendors/profile
// @access  Private (Vendor)
const getVendorProfile = async (req, res) => {
    try {
        const vendor = await prisma.vendor.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                name: true,
                phone: true,
                shopName: true,
                serviceTypes: true,
                currentLocation: true,
                isVerified: true,
                documents: true,
                bankInfo: true,
            },
        });
        if (vendor) {
            res.json(vendor);
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
        const updatedVendor = await prisma.vendor.update({
            where: { id: req.user.id },
            data: {
                name,
                shopName,
                serviceTypes, // ensure frontend sends array
                bankInfo
            },
            select: {
                id: true,
                name: true,
                shopName: true,
                serviceTypes: true
            }
        });
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
    // location stored as "lat,long" string for simple matching
    // In real app, use PostGIS
    const location = `${lat},${long}`;

    try {
        const updatedVendor = await prisma.vendor.update({
            where: { id: req.user.id },
            data: {
                currentLocation: location,
                isActive: true // Assume updating location means they are active/online
            },
        });
        res.json({ message: 'Location updated', location: updatedVendor.currentLocation });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Upload KYC documents
// @route   POST /api/vendors/kyc
// @access  Private (Vendor)
const uploadKYC = async (req, res) => {
    // req.files will hold the files
    // Strategy: update the vendor 'documents' json field

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
    }

    try {
        const filePaths = {};
        // Map uploaded files to simple paths
        Object.keys(req.files).forEach(key => {
            filePaths[key] = req.files[key][0].path;
        });

        // Merge with existing docs or overwrite? Let's overwrite / merge
        // First get current
        const vendor = await prisma.vendor.findUnique({ where: { id: req.user.id } });

        // Use Type assertion or check if it's object
        let currentDocs = vendor.documents || {};
        if (typeof currentDocs !== 'object') currentDocs = {};

        const newDocs = { ...currentDocs, ...filePaths };

        const updated = await prisma.vendor.update({
            where: { id: req.user.id },
            data: {
                documents: newDocs,
                isVerified: false // Reset verification on new upload? logic dependent.
            }
        });

        res.json({ message: 'Documents uploaded', documents: updated.documents });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get All Vendors (Admin) or Nearby (User - to be moved to ServiceRequest?)
// For now, let's keep basic Management here.

module.exports = {
    getVendorProfile,
    updateVendorProfile,
    updateLocation,
    uploadKYC
};
