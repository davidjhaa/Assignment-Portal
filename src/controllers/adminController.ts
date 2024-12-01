import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import Assignment from '../models/assignment';

// Register Admin
export const registerAdmin = async (req: any, res: any) => {
  const { username, email, password } = req.body;
  try {
    // Check if email already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this email already exists.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const admin = new User({ username, email, password: hashedPassword, role: 'admin' });
    await admin.save();

    res.status(201).json({ message: 'Admin registered successfully.' });
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
};

// Login Admin
export const loginAdmin = async (req: any, res: any) => {
  const { email, password } = req.body;
  try {
    // Check if admin exists
    const admin = await User.findOne({ email, role: 'admin' });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found.' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Generate JWT
    const token = jwt.sign({ userId: admin._id, role: admin.role }, 'secret', { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
};

// Get Assignments Tagged to Admin
export const getAssignments = async (req: any, res: any) => {
  const adminId = req.user.id; // Authenticated admin's ID
  try {
    const assignments = await Assignment.find({ adminId }).populate('userId', 'username email');
    res.status(200).json(assignments);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
};

// Accept Assignment
export const acceptAssignment = async (req: any, res: any) => {
  const { id } = req.params; // Assignment ID
  try {
    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found.' });
    }

    // Ensure only the tagged admin can accept
    if (assignment.adminId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized action.' });
    }

    assignment.status = 'accepted';
    await assignment.save();

    res.status(200).json({ message: 'Assignment accepted successfully.' });
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
};

// Reject Assignment
export const rejectAssignment = async (req: any, res: any) => {
  const { id } = req.params; // Assignment ID
  try {
    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found.' });
    }

    // Ensure only the tagged admin can reject
    if (assignment.adminId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized action.' });
    }

    assignment.status = 'rejected';
    await assignment.save();

    res.status(200).json({ message: 'Assignment rejected successfully.' });
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
};
