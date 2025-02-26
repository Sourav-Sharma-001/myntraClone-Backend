const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyTokenMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).send('Access denied. No token provided.');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).send('User not found');
        }

        req.user = user;
        req.token = token;
        next();
    } catch (err) {
        res.status(400).send('Invalid or expired token');
    }
};

module.exports = verifyTokenMiddleware;
