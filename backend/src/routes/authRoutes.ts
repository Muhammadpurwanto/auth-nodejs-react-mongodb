import { Router } from "express";
import { registerUser } from "../controllers/authController";

const router: Router = Router();

// Register route
router.post("/register", registerUser);

export default router;