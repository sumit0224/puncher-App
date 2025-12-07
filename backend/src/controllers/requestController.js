const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { getIO } = require('../socket'); // We'll create this to access IO globally

// Simple distance calculation (Haversine not strictly needed for basic MVP lat/long diffs, but better)
// For MVP, helper function to find nearby vendors
const findNearbyVendors = async (lat, long, serviceType) => {
    // Fetch all active vendors with serviceType
    // In production: use PostGIS ST_DWithin
    const vendors = await prisma.vendor.findMany({
        where: {
            isActive: true,
            isVerified: true,
            serviceTypes: { has: serviceType }
        }
    });

    // Filter by distance (e.g., 10km)
    // This is computationally expensive in JS for many vendors, but fine for MVP
    return vendors.filter(v => {
        if (!v.currentLocation) return false;
        const [vLat, vLong] = v.currentLocation.split(',').map(Number);
        const dist = Math.sqrt(Math.pow(vLat - lat, 2) + Math.pow(vLong - long, 2));
        // simple euclidean approximation for MVP. 0.1 deg ~= 11km
        return dist < 0.1;
    });
};

// @desc    Create a service request
// @route   POST /api/requests
// @access  Private (User)
const createRequest = async (req, res) => {
    const { serviceType, location, priceEstimate } = req.body; // location: "lat,long"
    const userId = req.user.id;

    try {
        const [lat, long] = location.split(',').map(Number);

        const newJob = await prisma.job.create({
            data: {
                userId,
                serviceType,
                location,
                priceEstimate,
                status: 'REQUESTED'
            }
        });

        // Find matches
        const nearbyVendors = await findNearbyVendors(lat, long, serviceType);

        // Notify Vendors via Socket
        const io = getIO();
        nearbyVendors.forEach(vendor => {
            // Emit to specific vendor room (vendor_ID)
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
    const jobId = parseInt(req.params.id);
    const vendorId = req.user.id; // from token

    try {
        const job = await prisma.job.findUnique({ where: { id: jobId } });

        if (!job) return res.status(404).json({ message: 'Job not found' });
        if (job.status !== 'REQUESTED') return res.status(400).json({ message: 'Job already taken' });

        const updatedJob = await prisma.job.update({
            where: { id: jobId },
            data: {
                vendorId,
                status: 'ASSIGNED'
            },
            include: { user: true, vendor: true } // Include details for response
        });

        // Notify User
        const io = getIO();
        io.to(`user_${updatedJob.userId}`).emit('job_assigned', updatedJob);

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
    const jobId = parseInt(req.params.id);
    const { status } = req.body; // ON_WAY, ARRIVED, COMPLETED

    try {
        const updatedJob = await prisma.job.update({
            where: { id: jobId },
            data: { status }
        });

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
        const jobs = await prisma.job.findMany({
            where: { userId: req.user.id },
            include: { vendor: true },
            orderBy: { createdAt: 'desc' }
        });
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
        const jobs = await prisma.job.findMany({
            where: { vendorId: req.user.id },
            include: { user: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(jobs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createRequest, acceptRequest, updateStatus, getUserRequests, getVendorJobs };
