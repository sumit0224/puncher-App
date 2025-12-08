const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    shopName: { type: String },
    passwordHash: { type: String },
    documents: { type: Object },
    bankInfo: { type: Object },
    serviceTypes: [{ type: String }],
    ratingAvg: { type: Number, default: 5.0 },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    currentLocation: { type: String },
}, { timestamps: true });

vendorSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
vendorSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Vendor', vendorSchema);
