const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user/company from the token
            // We check both User and Company models since both can have tokens
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                req.company = await Company.findById(decoded.id).select('-password');
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Grant access to specific roles (e.g., companies)
const authorize = (...roles) => {
    return (req, res, next) => {
        // If it's a company-only route, check if req.company exists
        if (roles.includes('company') && !req.company) {
            return res.status(403).json({ message: `Role not authorized to access this route` });
        }
        // If it's a user-only route, check if req.user exists
        if (roles.includes('user') && !req.user) {
            return res.status(403).json({ message: `Role not authorized to access this route` });
        }
        next();
    };
};

module.exports = { protect, authorize };
