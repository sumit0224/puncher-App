const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/token');

const prisma = new PrismaClient();
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

        const existingUser = await prisma.user.findFirst({
            where: { OR: [{ phone: normalizedPhone }, { email: normalizedEmail }] },
        });

        if (existingUser) {
            return res.status(409).json({ message: 'User with this phone or email already exists' });
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await prisma.user.create({
            data: {
                name: name.trim(),
                phone: normalizedPhone,
                email: normalizedEmail,
                passwordHash,
            },
            select: {
                id: true,
                name: true,
                phone: true,
                email: true,
            },
        });

        const token = generateToken(user.id, 'user');

        return res.status(201).json({
            id: user.id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            token,
        });
    } catch (error) {
        if (error?.code === 'P2002') {
            const conflictField = error?.meta?.target?.join(', ') || 'field';
            return res.status(409).json({ message: `Unique constraint failed: ${conflictField}` });
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

        const user = await prisma.user.findUnique({
            where: { phone },
            select: { id: true, name: true, phone: true, email: true, passwordHash: true },
        });

        if (user && (await bcrypt.compare(password, user.passwordHash))) {
            const token = generateToken(user.id, 'user');
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
        return res.status(500).json({ message: 'Server error' });
    }
};

const registerVendor = async (req, res) => {
    try {
        const { name, phone, shopName, password } = req.body;

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

        const existingVendor = await prisma.vendor.findUnique({
            where: { phone: normalizedPhone },
        }).catch(() => null);

        if (existingVendor) {
            return res.status(409).json({ message: 'Vendor with this phone already exists' });
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        const vendor = await prisma.vendor.create({
            data: {
                name: name.trim(),
                phone: normalizedPhone,
                shopName: shopName.trim(),
                passwordHash,
            },
            select: {
                id: true,
                name: true,
                phone: true,
                shopName: true,
            },
        });

        const token = generateToken(vendor.id, 'vendor');

        return res.status(201).json({
            id: vendor.id,
            name: vendor.name,
            phone: vendor.phone,
            shopName: vendor.shopName,
            token,
        });
    } catch (error) {
        if (error?.code === 'P2002') {
            const conflictField = error?.meta?.target?.join(', ') || 'field';
            return res.status(409).json({ message: `Unique constraint failed: ${conflictField}` });
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

        const vendor = await prisma.vendor.findUnique({
            where: { phone },
            select: { id: true, name: true, phone: true, shopName: true, passwordHash: true },
        });

        if (vendor && (await bcrypt.compare(password, vendor.passwordHash))) {
            const token = generateToken(vendor.id, 'vendor');
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
        return res.status(500).json({ message: 'Server error' });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                createdAt: true,
            },
        });

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { registerUser, loginUser, registerVendor, loginVendor, getUserProfile };
