import express from 'express';
import { registerAdmin, loginAdmin, getAssignments, acceptAssignment, rejectAssignment } from '../controllers/adminController';
import { authenticate } from '../middlewares/authMiddleware';

const adminRouter = express.Router();

adminRouter.post('/register', registerAdmin);
adminRouter.post('/login', loginAdmin);
adminRouter.get('/assignments', authenticate, getAssignments);
adminRouter.post('/assignments/:id/accept', authenticate, acceptAssignment);
adminRouter.post('/assignments/:id/reject', authenticate, rejectAssignment);

export default adminRouter;
