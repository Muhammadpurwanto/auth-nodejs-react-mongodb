import { Router } from "express";
import { registerUser, loginUser, getUserProfile, getAllUsers } from "../controllers/authController";
import { protect } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddleware";

const router: Router = Router();

// Register route
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.get("/users", protect, authorizeRoles("admin"), getAllUsers);

export default router;