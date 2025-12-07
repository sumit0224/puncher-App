const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'dev_secret_123', {
        expiresIn: '1d',
    });
};

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_123');
};

module.exports = { generateToken, verifyToken };
