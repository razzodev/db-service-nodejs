"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParam = void 0;
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateParam = (params) => {
    return (req, res, next) => {
        for (const param of params) {
            const thisParam = req.params[param];
            if (!thisParam) {
                res.status(400).json({ error: `missing param: ${param}` });
                return;
            }
        }
        next();
    };
};
exports.validateParam = validateParam;
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ message: 'Authorization header missing' });
        return;
    }
    const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
    if (!token) {
        res.status(401).json({ message: 'Token missing' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || ''); // Verify and decode token
        req.userId = decoded.userId;
        req.userRole = decoded.role; // Assuming your payload contains role
        next();
    }
    catch (error) {
        res.status(403).json({ message: 'Invalid token' });
        return;
    }
}
