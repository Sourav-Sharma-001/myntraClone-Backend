const jwt = require("jsonwebtoken");

const ensureAuthenticated = (req, res, next) => {
    const authHeader = req.headers?.authorization;
    console.log(authHeader)

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ message: "Unauthorized, JWT token required" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Unauthorized, JWT token is invalid or expired" });
    }
};

module.exports = ensureAuthenticated;
