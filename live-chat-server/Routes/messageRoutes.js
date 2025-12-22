import express from "express";
import { allMessages, sendMessage, markMessagesAsRead } from "../Controllers/messageController.js";
import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.route("/read").put(protect, markMessagesAsRead);
router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, sendMessage);

export default router;
