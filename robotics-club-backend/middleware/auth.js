// Production logging utility
const log = {
    info: (component, message) => console.log(`[INFO] [${component}] ${message}`),
    warn: (component, message) => console.warn(`[WARN] [${component}] ${message}`),
    error: (component, message) => console.error(`[ERROR] [${component}] ${message}`),
    request: (method, path, userId) => console.log(`[REQUEST] [${method}] ${path} - User: ${userId || 'anonymous'}`)
};

const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

// JWT Authentication Middleware
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        log.warn('AUTH', 'Missing token in request');
        return res.status(401).json({ message: 'Access token required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get full user info from database
        const user = await UserModel.findById(decoded._id).select('-password');
        
        if (!user) {
            log.warn('AUTH', 'Invalid token - user not found');
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Attach user info to request
        req.user = user;
        log.info('AUTH', `Authenticated: ${user.email} (${user.role})`);
        next();
    } catch (error) {
        log.warn('AUTH', 'Token verification failed');
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

// Role-based authorization middleware
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            log.warn('AUTH', 'Unauthorized access attempt - no user');
            return res.status(401).json({ message: 'Authentication required' });
        }

        if (!roles.includes(req.user.role)) {
            log.warn('AUTH', `Forbidden: ${req.user.email} tried to access resource requiring ${roles.join(', ')}`);
            return res.status(403).json({ message: 'Insufficient permissions' });
        }

        next();
    };
};

module.exports = {
    authenticateToken,
    requireRole
};

