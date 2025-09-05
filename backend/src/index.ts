import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import Test from "./models/Test";

// Load env variables
dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("API is running 🚀 with ESM + TypeScript");
});

// Route test untuk insert data
app.get("/test", async (req, res) => {
  const doc = new Test({ name: "Hello MongoDB" });
  await doc.save();
  res.json(doc);
});

// Run server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
