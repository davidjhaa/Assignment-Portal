"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const adminRouter = express_1.default.Router();
adminRouter.post('/register', adminController_1.registerAdmin);
adminRouter.post('/login', adminController_1.loginAdmin);
adminRouter.get('/assignments', authMiddleware_1.authenticate, adminController_1.getAssignments);
adminRouter.post('/assignments/:id/accept', authMiddleware_1.authenticate, adminController_1.acceptAssignment);
adminRouter.post('/assignments/:id/reject', authMiddleware_1.authenticate, adminController_1.rejectAssignment);
exports.default = adminRouter;
