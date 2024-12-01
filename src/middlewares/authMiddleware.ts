import jwt from 'jsonwebtoken';

export const authenticate = (req: any, res: any, next: any) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No Token Provided.' });
  }

  try {
    const decoded = jwt.verify(token, 'secret') as { userId: string; role: string };
    req.user = { id: decoded.userId, role: decoded.role };
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid Token.' });
  }
};
