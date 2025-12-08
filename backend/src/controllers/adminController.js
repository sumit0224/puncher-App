const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Job = require('../models/Job');

// @desc    Get top level stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalVendors = await Vendor.countDocuments();
        const activeVendors = await Vendor.countDocuments({ isActive: true });
        const pendingVendors = await Vendor.countDocuments({ isVerified: false });
        const totalJobs = await Job.countDocuments();
        const completedJobs = await Job.countDocuments({ status: 'COMPLETED' });

        res.json({
            users: totalUsers,
            vendors: {
                total: totalVendors,
                active: activeVendors,
                pending: pendingVendors
            },
            jobs: {
                total: totalJobs,
                completed: completedJobs
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all vendors (filter by status)
// @route   GET /api/admin/vendors?status=pending
// @access  Private (Admin)
const getVendors = async (req, res) => {
    const { status } = req.query;
    try {
        const where = {};
        if (status === 'pending') where.isVerified = false;
        if (status === 'verified') where.isVerified = true;

        const vendors = await Vendor.find(where).sort({ createdAt: -1 });
        res.json(vendors);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Verify/Approve Vendor
// @route   PUT /api/admin/vendors/:id/verify
// @access  Private (Admin)
const verifyVendor = async (req, res) => {
    const { id } = req.params;
    const { isVerified } = req.body; // true or false

    try {
        const vendor = await Vendor.findByIdAndUpdate(
            id,
            { isVerified },
            { new: true }
        );
        res.json(vendor);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getStats, getVendors, verifyVendor };
