import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import Test from "./models/Test";
import User from "./models/User";

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

app.get("/create-user", async (req, res) => {
  try {
    const newUser = new User({
      name: "Test User",
      email: "test@example.com",
      password: "123456", // nanti akan di-hash di tahap berikutnya
    });
    await newUser.save();
    res.json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
});

// Run server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
