const jwt = require('jsonwebtoken');

exports.authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        console.log(`token :`, token)
        if (!token) {
            res.status(401);
            return next(new Error("Authentication token missing. Please log in again."));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();
    } catch (err) {
        console.error("JWT Auth Error:", err.message);
        res.status(401);
        next(new Error("Invalid or expired token. Please log in again."));
    }
};
