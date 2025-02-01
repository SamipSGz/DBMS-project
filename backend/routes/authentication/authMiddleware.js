// authMiddleware.js
const jwt = require('jsonwebtoken');

// Middleware to verify JWT and extract user data
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from the Authorization header

    if (!token) return res.sendStatus(401);  // No token provided, return 401 (Unauthorized)

    // Verify token with the secret key
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);  // Token is invalid or expired, return 403 (Forbidden)
        req.user = user;  // Attach the decoded user data to the request object
        next();  // Call the next middleware or route handler
    });
};

module.exports = authenticateToken;
