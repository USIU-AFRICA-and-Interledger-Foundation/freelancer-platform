const jwt = require('jsonwebtoken');

function auth(required = true) {
    return function authMiddleware(req, res, next) {
        const header = req.headers.authorization || '';
        const [scheme, token] = header.split(' ');

        if (!token) {
            if (!required) {
                return next();
            }
            return res.status(401).json({ message: 'Authentication required' });
        }

        if (!/^Bearer$/i.test(scheme)) {
            return res.status(400).json({ message: 'Invalid authorization format' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            req.user = { id: decoded.id, role: decoded.role };
            return next();
        } catch (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
    };
}

function requireRole(...roles) {
    return function roleMiddleware(req, res, next) {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        return next();
    };
}

module.exports = {
    auth,
    requireRole
};

