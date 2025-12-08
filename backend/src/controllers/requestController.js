const Job = require('../models/Job');
const Vendor = require('../models/Vendor');
const { getIO } = require('../socket');

// Simple distance calculation
const findNearbyVendors = async (lat, long, serviceType) => {
    const vendors = await Vendor.find({
        isActive: true,
        isVerified: true,
        serviceTypes: serviceType // mongoose checks if array contains value
    });

    return vendors.filter(v => {
        if (!v.currentLocation) return false;
        const [vLat, vLong] = v.currentLocation.split(',').map(Number);
        const dist = Math.sqrt(Math.pow(vLat - lat, 2) + Math.pow(vLong - long, 2));
        return dist < 0.1;
    });
};

// @desc    Create a service request
// @route   POST /api/requests
// @access  Private (User)
const createRequest = async (req, res) => {
    const { serviceType, location, priceEstimate } = req.body;
    const userId = req.user.id;

    try {
        const [lat, long] = location.split(',').map(Number);

        const newJob = await Job.create({
            userId,
            serviceType,
            location,
            priceEstimate,
            status: 'REQUESTED'
        });

        // Find matches
        const nearbyVendors = await findNearbyVendors(lat, long, serviceType);

        // Notify Vendors via Socket
        const io = getIO();
        nearbyVendors.forEach(vendor => {
            io.to(`vendor_${vendor.id}`).emit('new_job_request', newJob);
        });

        res.status(201).json({ job: newJob, nearbyCount: nearbyVendors.length });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Vendor accepts request
// @route   POST /api/requests/:id/accept
// @access  Private (Vendor)
const acceptRequest = async (req, res) => {
    const jobId = req.params.id; // String ID in mongoose
    const vendorId = req.user.id;

    try {
        const job = await Job.findById(jobId);

        if (!job) return res.status(404).json({ message: 'Job not found' });
        if (job.status !== 'REQUESTED') return res.status(400).json({ message: 'Job already taken' });

        const updatedJob = await Job.findByIdAndUpdate(
            jobId,
            {
                vendorId,
                status: 'ASSIGNED'
            },
            { new: true }
        ).populate('userId', 'name phone').populate('vendorId', 'name phone shopName');

        // Notify User
        const io = getIO();
        io.to(`user_${updatedJob.userId.id}`).emit('job_assigned', updatedJob);

        res.json(updatedJob);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update Job Status
// @route   PUT /api/requests/:id/status
// @access  Private (Vendor)
const updateStatus = async (req, res) => {
    const jobId = req.params.id;
    const { status } = req.body;

    try {
        const updatedJob = await Job.findByIdAndUpdate(
            jobId,
            { status },
            { new: true }
        );

        const io = getIO();
        io.to(`user_${updatedJob.userId}`).emit('job_status_update', updatedJob);

        res.json(updatedJob);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get user requests
// @route   GET /api/requests/user
// @access  Private (User)
const getUserRequests = async (req, res) => {
    try {
        const jobs = await Job.find({ userId: req.user.id })
            .populate('vendorId')
            .sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get vendor jobs (assigned)
// @route   GET /api/requests/vendor
// @access  Private (Vendor)
const getVendorJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ vendorId: req.user.id })
            .populate('userId')
            .sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createRequest, acceptRequest, updateStatus, getUserRequests, getVendorJobs };
