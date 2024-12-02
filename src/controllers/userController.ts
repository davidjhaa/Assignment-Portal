import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import Assignment from '../models/assignment';

// Register user
export const registerUser = async (req: any, res: any) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error:any) {
    res.status(400).json({ error: error.message });
  }
};

// Login user
export const loginUser = async (req: any, res: any) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, 'secret', { expiresIn: '1h' });
    res.status(200).json({ token, userId:user._id });
  } catch (error:any) {
    res.status(400).json({ error: error.message });
  }
};

// Upload assignment
export const uploadAssignment = async (req: any, res: any) => {
  const { task, adminId } = req.body;
  const userId = req.user.id;
  try {
    const assignment = new Assignment({ userId, adminId, task });
    await assignment.save();
    res.status(201).json({ message: 'Assignment uploaded successfully' });
  } catch (error:any) {
    res.status(400).json({ error: error.message });
  }
};

// Get all admins
export const getAdmins = async (req: any, res: any) => {
  try {
    const admins = await User.find({ role: 'admin' }, 'username email');
    res.status(200).json(admins);
  } catch (error:any) {
    res.status(400).json({ error: error.message });
  }
};
