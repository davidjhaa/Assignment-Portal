"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = (req, res, next) => {
    var _a;
    const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided.' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, 'secret');
        req.user = { id: decoded.userId, role: decoded.role };
        next();
    }
    catch (error) {
        res.status(400).json({ message: 'Invalid Token.' });
    }
};
exports.authenticate = authenticate;
