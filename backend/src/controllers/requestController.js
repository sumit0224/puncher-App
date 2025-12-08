const Job = require('../models/Job');
const Vendor = require('../models/Vendor');
const { getIO } = require('../socket');
const { initiateJobSearch } = require('../services/jobSearchService');
const { TOTAL_TIMEOUT } = require('../config/config');

// Helper for finding nearby vendors explicitly removed or moved to service. 
// However, the user might hit endpoints unrelated to search service?
// "findNearbyVendors" was internal to createRequest. It is now handled by initiateJobSearch.
// We can keep it or remove it. I will remove it as the logic moved to service.

const createRequest = async (req, res) => {
    const { serviceType, location, priceEstimate } = req.body;
    const userId = req.user.id;

    try {
        const expiresAt = new Date(Date.now() + TOTAL_TIMEOUT);

        const newJob = await Job.create({
            userId,
            serviceType,
            location,
            priceEstimate,
            status: 'REQUESTED',
            expiresAt,
            notifiedVendorIds: []
        });

        // Initiate Async Search
        initiateJobSearch(newJob.id);

        // Immediate response
        res.status(201).json({ job: newJob, message: 'Request started, searching for vendors...' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const acceptRequest = async (req, res) => {
    const jobId = req.params.id;
    const vendorId = req.user.id;

    try {
        // Atomic update: Only update if status is REQUESTED
        const updatedJob = await Job.findOneAndUpdate(
            { _id: jobId, status: 'REQUESTED' },
            {
                vendorId,
                status: 'ASSIGNED'
            },
            { new: true }
        ).populate('userId', 'name phone').populate('vendorId', 'name phone shopName');

        if (!updatedJob) {
            // Check why it failed
            const job = await Job.findById(jobId);
            if (!job) return res.status(404).json({ message: 'Job not found' });
            if (job.status !== 'REQUESTED') return res.status(400).json({ message: `Job already ${job.status}` });
            return res.status(400).json({ message: 'Unable to accept job' });
        }

        const io = getIO();
        io.to(`user_${updatedJob.userId.id}`).emit('job_assigned', updatedJob);

        res.json(updatedJob);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

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
