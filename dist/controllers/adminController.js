"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectAssignment = exports.acceptAssignment = exports.getAssignments = exports.loginAdmin = exports.registerAdmin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const assignment_1 = __importDefault(require("../models/assignment"));
// Register Admin
const registerAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    try {
        // Check if email already exists
        const existingAdmin = yield user_1.default.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin with this email already exists.' });
        }
        // Hash password
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        // Create admin user
        const admin = new user_1.default({ username, email, password: hashedPassword, role: 'admin' });
        yield admin.save();
        res.status(201).json({ message: 'Admin registered successfully.' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.registerAdmin = registerAdmin;
// Login Admin
const loginAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Check if admin exists
        const admin = yield user_1.default.findOne({ email, role: 'admin' });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found.' });
        }
        // Compare passwords
        const isPasswordValid = yield bcryptjs_1.default.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        // Generate JWT
        const token = jsonwebtoken_1.default.sign({ userId: admin._id, role: admin.role }, 'secret', { expiresIn: '1h' });
        res.status(200).json({ token, adminId: admin._id });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.loginAdmin = loginAdmin;
// Get Assignments Tagged to Admin
const getAssignments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminId = req.user.id; // Authenticated admin's ID
    try {
        const assignments = yield assignment_1.default.find({ adminId }).populate('userId', 'username email');
        res.status(200).json(assignments);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getAssignments = getAssignments;
// Accept Assignment
const acceptAssignment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const assignment = yield assignment_1.default.findById(id);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found.' });
        }
        // Ensure only the tagged admin can accept
        if (assignment.adminId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized action.' });
        }
        assignment.status = 'accepted';
        yield assignment.save();
        res.status(200).json({ message: 'Assignment accepted successfully.' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.acceptAssignment = acceptAssignment;
// Reject Assignment
const rejectAssignment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Assignment ID
    try {
        const assignment = yield assignment_1.default.findById(id);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found.' });
        }
        // Ensure only the tagged admin can reject
        if (assignment.adminId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized action.' });
        }
        assignment.status = 'rejected';
        yield assignment.save();
        res.status(200).json({ message: 'Assignment rejected successfully.' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.rejectAssignment = rejectAssignment;
