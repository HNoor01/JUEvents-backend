const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    // Extract the token from the Authorization header
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token

    try {
        // Verify the token and extract the payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret');
        req.user = decoded; // Attach user info to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error('Authentication error:', err.message);
        res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports = authenticate;
