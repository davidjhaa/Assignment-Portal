import express from 'express';
import { registerUser, loginUser, uploadAssignment, getAdmins } from '../controllers/userController';
import { authenticate } from '../middlewares/authMiddleware';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/upload', authenticate, uploadAssignment);
userRouter.get('/admins', authenticate, getAdmins);

export default userRouter;
