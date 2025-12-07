const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get top level stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getStats = async (req, res) => {
    try {
        const totalUsers = await prisma.user.count();
        const totalVendors = await prisma.vendor.count();
        const activeVendors = await prisma.vendor.count({ where: { isActive: true } });
        const pendingVendors = await prisma.vendor.count({ where: { isVerified: false } });
        const totalJobs = await prisma.job.count();
        const completedJobs = await prisma.job.count({ where: { status: 'COMPLETED' } });

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

        const vendors = await prisma.vendor.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });
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
        const vendor = await prisma.vendor.update({
            where: { id: parseInt(id) },
            data: { isVerified }
        });
        res.json(vendor);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getStats, getVendors, verifyVendor };
