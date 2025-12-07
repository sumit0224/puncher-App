const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Create Payment Order (Razorpay Stub)
// @route   POST /api/payments/order
// @access  Private (User)
const createOrder = async (req, res) => {
    const { jobId, amount, method } = req.body;

    try {
        // In real app: call Razorpay API to create order_id
        const orderId = `order_${Date.now()}_stub`; // Mock ID

        // Create Payment record
        const payment = await prisma.payment.create({
            data: {
                jobId,
                userId: req.user.id,
                amount,
                method: method || 'ONLINE',
                status: 'PENDING'
            }
        });

        res.json({
            paymentId: payment.id,
            orderId: orderId,
            amount: amount,
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

        const payment = await prisma.payment.update({
            where: { jobId: parseInt(jobId) }, // Assuming 1:1 job:payment
            data: {
                status: status === 'success' ? 'COMPLETED' : 'FAILED'
            }
        });

        if (status === 'success') {
            // Update Job to completed? Or keep it separate?
            // Usually payment happens after service
        }

        res.json({ status: 'ok' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createOrder, paymentCallback };
