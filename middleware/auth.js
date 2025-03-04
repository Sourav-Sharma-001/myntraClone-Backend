const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next) => {
    const authHeader = req.headers?.authorization;   

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: 'Unauthorized, JWT token required' });
    }

    const token = authHeader.split(' ')[1]; // Extract token

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded; // Store user info in request
        next(); // Move to next middleware
    } catch (err) {
        return res.status(403).json({ message: 'Unauthorized, JWT token is invalid or expired' });
    }
};

module.exports = ensureAuthenticated;
