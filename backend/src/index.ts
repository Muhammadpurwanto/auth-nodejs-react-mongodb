import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";

// Load env variables
dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// route
app.use("/api/auth", authRoutes);

// Run server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
