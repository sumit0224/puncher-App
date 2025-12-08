const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/token');
const User = require('../models/User');
const Vendor = require('../models/Vendor');

const SALT_ROUNDS = 10;

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone) => /^\d{7,15}$/.test(phone);
const validatePassword = (pw) => typeof pw === 'string' && pw.length >= 8;

const registerUser = async (req, res) => {
    try {
        const { name, phone, password, email } = req.body;

        if (!name || !phone || !password || !email) {
            return res.status(422).json({ message: 'All fields are required' });
        }

        if (!validateEmail(email)) {
            return res.status(422).json({ message: 'Invalid email format' });
        }
        if (!validatePhone(phone)) {
            return res.status(422).json({ message: 'Invalid phone format' });
        }
        if (!validatePassword(password)) {
            return res.status(422).json({ message: 'Password must be at least 8 characters' });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPhone = phone.trim();

        const existingUser = await User.findOne({
            $or: [{ phone: normalizedPhone }, { email: normalizedEmail }]
        });

        if (existingUser) {
            return res.status(409).json({ message: 'User with this phone or email already exists' });
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await User.create({
            name: name.trim(),
            phone: normalizedPhone,
            email: normalizedEmail,
            passwordHash,
        });

        const token = generateToken(user._id, 'user');

        return res.status(201).json({
            id: user.id, // virtual
            name: user.name,
            phone: user.phone,
            email: user.email,
            token,
        });
    } catch (error) {
        console.error('Register User Error:', error);
        if (error.code === 11000) { // MongoDB duplicate key error
            return res.status(409).json({ message: 'Unique constraint failed' });
        }
        return res.status(500).json({ message: 'Server error' });
    }
};

const loginUser = async (req, res) => {
    try {
        const { phone, password } = req.body;

        if (!phone || !password) {
            return res.status(422).json({ message: 'Phone and password are required' });
        }

        const user = await User.findOne({ phone });

        if (user && (await bcrypt.compare(password, user.passwordHash))) {
            const token = generateToken(user._id, 'user');
            return res.json({
                id: user.id,
                name: user.name,
                phone: user.phone,
                email: user.email,
                token,
            });
        }

        return res.status(401).json({ message: 'Invalid phone or password' });
    } catch (error) {
        console.error('Login User Error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const registerVendor = async (req, res) => {
    try {
        const { name, phone, shopName, password, serviceTypes } = req.body;

        if (!name || !phone || !shopName || !password) {
            return res.status(422).json({ message: 'All fields are required' });
        }

        if (!validatePhone(phone)) {
            return res.status(422).json({ message: 'Invalid phone format' });
        }
        if (!validatePassword(password)) {
            return res.status(422).json({ message: 'Password must be at least 8 characters' });
        }

        const normalizedPhone = phone.trim();

        const existingVendor = await Vendor.findOne({ phone: normalizedPhone });

        if (existingVendor) {
            return res.status(409).json({ message: 'Vendor with this phone already exists' });
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        // Defaulting serviceTypes if not provided for MVP friendliness
        const services = serviceTypes || ['Puncture', 'Towing', 'Mechanic'];

        const vendor = await Vendor.create({
            name: name.trim(),
            phone: normalizedPhone,
            shopName: shopName.trim(),
            passwordHash,
            serviceTypes: services,
            isVerified: true, // Auto-verify for MVP
            isActive: false // Vendor must still go online manually
        });

        const token = generateToken(vendor._id, 'vendor');

        return res.status(201).json({
            id: vendor.id,
            name: vendor.name,
            phone: vendor.phone,
            shopName: vendor.shopName,
            token,
        });
    } catch (error) {
        console.error('Register Vendor Error:', error);
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Unique constraint failed' });
        }
        return res.status(500).json({ message: 'Server error' });
    }
};

const loginVendor = async (req, res) => {
    try {
        const { phone, password } = req.body;

        if (!phone || !password) {
            return res.status(422).json({ message: 'Phone and password are required' });
        }

        const vendor = await Vendor.findOne({ phone });

        if (vendor && (await bcrypt.compare(password, vendor.passwordHash))) {
            const token = generateToken(vendor._id, 'vendor');
            return res.json({
                id: vendor.id,
                name: vendor.name,
                phone: vendor.phone,
                shopName: vendor.shopName,
                token,
            });
        }

        return res.status(401).json({ message: 'Invalid phone or password' });
    } catch (error) {
        console.error('Login Vendor Error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            res.json({
                id: user.id,
                name: user.name,
                phone: user.phone,
                email: user.email,
                createdAt: user.createdAt,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { registerUser, loginUser, registerVendor, loginVendor, getUserProfile };
