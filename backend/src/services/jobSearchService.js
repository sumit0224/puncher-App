const Job = require('../models/Job');
const Vendor = require('../models/Vendor');
const { getIO } = require('../socket');
const { INITIAL_RADIUS, EXPANSION_STEP, EXPANSION_INTERVAL, TOTAL_TIMEOUT } = require('../config/config');

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const initiateJobSearch = async (jobId) => {
    attemptSearch(jobId, 0);
};

const attemptSearch = async (jobId, loopCount) => {
    try {
        const job = await Job.findById(jobId);

        // Stop if job is no longer REQUESTED (accepted/cancelled) or timed out
        if (!job || job.status !== 'REQUESTED') return;

        // Check for timeout
        const now = new Date();
        if (now > job.expiresAt) {
            job.status = 'TIMED_OUT';
            await job.save();
            const io = getIO();
            if (job.userId) {
                // Assuming userId was populated or we have the ID. Model has userId as ObjectId.
                // We emit to user room
                io.to(`user_${job.userId.toString()}`).emit('job_status_update', job);
            }
            return;
        }

        // Calculate Radius
        const currentRadius = INITIAL_RADIUS + (loopCount * EXPANSION_STEP);
        console.log(`[Job ${jobId}] Search Loop ${loopCount}, Radius: ${currentRadius}km`);

        // Find Vendors
        // Note: For production, use geospatial queries (find({ location: { $near: ... } }))
        // For MVP with "lat,long" string, we fetch all online/verified/matching service and filter.
        const [jobLat, jobLong] = job.location.split(',').map(Number);

        const candidateVendors = await Vendor.find({
            isActive: true,
            isVerified: true,
            serviceTypes: job.serviceType,
            _id: { $nin: job.notifiedVendorIds } // Exclude already notified
        });

        const newVendorsToNotify = candidateVendors.filter(v => {
            if (!v.currentLocation) return false;
            const [vLat, vLong] = v.currentLocation.split(',').map(Number);
            const dist = calculateDistance(jobLat, jobLong, vLat, vLong);
            return dist <= currentRadius;
        });

        if (newVendorsToNotify.length > 0) {
            const io = getIO();
            const newVendorIds = [];

            newVendorsToNotify.forEach(vendor => {
                io.to(`vendor_${vendor.id}`).emit('new_job_request', job);
                newVendorIds.push(vendor._id);
            });

            // Update Job with newly notified vendors
            await Job.findByIdAndUpdate(jobId, {
                $push: { notifiedVendorIds: { $each: newVendorIds } }
            });
            console.log(`[Job ${jobId}] Notified ${newVendorsToNotify.length} new vendors.`);
        } else {
            console.log(`[Job ${jobId}] No new vendors found in this step.`);
        }

        // Schedule next expansion
        setTimeout(() => {
            attemptSearch(jobId, loopCount + 1);
        }, EXPANSION_INTERVAL);

    } catch (error) {
        console.error(`Error in job search loop for job ${jobId}`, error);
    }
};

module.exports = { initiateJobSearch };
