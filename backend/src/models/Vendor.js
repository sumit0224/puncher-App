const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    shopName: { type: String },
    passwordHash: { type: String },
    documents: { type: Object }, // Stores links to Aadhar, DL, PAN images
    bankInfo: { type: Object },
    serviceTypes: [{ type: String }], // Array of strings
    ratingAvg: { type: Number, default: 5.0 },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    currentLocation: { type: String }, // "lat,long"
}, { timestamps: true });

vendorSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
vendorSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Vendor', vendorSchema);
