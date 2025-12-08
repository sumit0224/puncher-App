const Payment = require('../models/Payment');

// @desc    Create Payment Order (Razorpay Stub)
// @route   POST /api/payments/order
// @access  Private (User)
const createOrder = async (req, res) => {
    const { jobId, amount, method } = req.body;

    try {
        // In real app: call Razorpay API to create order_id
        const orderId = `order_${Date.now()}_stub`; // Mock ID

        // Create Payment record
        const payment = await Payment.create({
            jobId,
            userId: req.user.id,
            amount,
            method: method || 'ONLINE',
            status: 'PENDING'
        });

        res.json({
            paymentId: payment.id,
            orderId: orderId,
            amount: amount, // check if mongoose stores as number
            currency: 'INR',
            key: 'TEST_KEY'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Payment Webhook / Success Callback
// @route   POST /api/payments/callback
// @access  Public (called by Payment Gateway)
const paymentCallback = async (req, res) => {
    const { orderId, paymentId, status, jobId } = req.body; // Mock payload

    try {
        // In real app, verify signature

        // Assuming 1:1 job:payment. JobID might need to be cast to ObjectId if stored as Ref, 
        // but here we might have stored it as string/Ref. 
        // If Payment.jobId is ObjectId, we need to query by it.
        // Assuming jobId passed in body is the string representation.

        const payment = await Payment.findOneAndUpdate(
            { jobId: jobId },
            {
                status: status === 'success' ? 'COMPLETED' : 'FAILED'
            },
            { new: true }
        );

        if (status === 'success') {
            // Update Job to completed? Or keep it separate?
        }

        res.json({ status: 'ok' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createOrder, paymentCallback };
