const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
    amount: { type: Number, required: true },
    method: { type: String, required: true }, // "CASH", "ONLINE"
    status: {
        type: String,
        enum: ['PENDING', 'COMPLETED', 'FAILED'],
        default: 'PENDING'
    }
}, { timestamps: true });

paymentSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
paymentSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Payment', paymentSchema);
