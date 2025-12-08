const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
    serviceType: { type: String, required: true },
    priceEstimate: { type: Number },
    finalPrice: { type: Number },
    status: {
        type: String,
        enum: ['REQUESTED', 'ASSIGNED', 'ON_WAY', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
        default: 'REQUESTED'
    },
    location: { type: String, required: true }, // "lat,long"
}, { timestamps: true });

jobSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
jobSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Job', jobSchema);
