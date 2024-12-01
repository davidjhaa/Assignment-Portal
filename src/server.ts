import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import adminRouter from './router/adminRouter';
import userRouter from './router/userRouter';

dotenv.config(); 

const dbLink = process.env.MONGODB_URI as string;

if (!dbLink) {
  throw new Error('MongoDB connection string is not defined in the environment variables');
}

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

// Root Endpoint
app.get("/", (req: any, res: any) => res.send("Express on Vercel"));

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// MongoDB connection
mongoose
  .connect(dbLink)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Routers
app.use("/user", userRouter);
app.use("/admin", adminRouter);
