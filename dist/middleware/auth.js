"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireAdmin = requireAdmin;
const jwt_1 = require("../utils/jwt");
function requireAuth(req, res, next) {
    const token = req.cookies?.token || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : undefined);
    if (!token)
        return res.status(401).json({ message: 'Unauthorized' });
    try {
        const payload = (0, jwt_1.verifyToken)(token);
        req.user = payload;
        next();
    }
    catch {
        return res.status(401).json({ message: 'Invalid token' });
    }
}
function requireAdmin(req, res, next) {
    if (!req.user)
        return res.status(401).json({ message: 'Unauthorized' });
    if (req.user.role !== 'admin')
        return res.status(403).json({ message: 'Forbidden' });
    next();
}
