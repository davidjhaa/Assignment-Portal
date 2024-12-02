"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const adminRouter_1 = __importDefault(require("./router/adminRouter"));
const userRouter_1 = __importDefault(require("./router/userRouter"));
dotenv_1.default.config();
const dbLink = process.env.MONGODB_URI;
if (!dbLink) {
    throw new Error('MongoDB connection string is not defined in the environment variables');
}
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
// Root Endpoint
app.get("/", (req, res) => res.send("Express on Vercel"));
// Start the Server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
// MongoDB connection
mongoose_1.default
    .connect(dbLink)
    .then(() => {
    console.log("MongoDB connected successfully");
})
    .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});
// Routers
app.use("/user", userRouter_1.default);
app.use("/admin", adminRouter_1.default);
