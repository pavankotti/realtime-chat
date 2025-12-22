import express from "express";
import { loginController, registerController, fetchAllUsersController } from "../Controllers/userController.js";
import { protect } from "../Middleware/authMiddleware.js";
const router = express.Router();

router.post('/login', loginController)
router.post('/register', registerController)
router.get('/fetchUsers', protect, fetchAllUsersController)

export default router;