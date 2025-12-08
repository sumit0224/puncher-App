const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, unique: true },
    passwordHash: { type: String, required: true },
    location: { type: String },
    ratingAvg: { type: Number, default: 5.0 },
    walletBalance: { type: Number, default: 0.0 },
}, { timestamps: true });

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
