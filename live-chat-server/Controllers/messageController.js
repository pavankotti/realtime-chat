import expressAsyncHandler from "express-async-handler";
import Message from "../modals/messageModel.js";
import UserModel from "../modals/userModel.js";
import Chat from "../modals/chatModel.js";

export const allMessages = expressAsyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name email")
            .populate("chat");

        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

export const sendMessage = expressAsyncHandler(async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }

    // Check if user is part of the chat
    const chat = await Chat.findById(chatId);
    if (!chat) {
        res.status(404);
        throw new Error("Chat not found");
    }

    const isUserInChat = chat.users.some(user => user.toString() === req.user._id.toString());
    if (!isUserInChat) {
        res.status(403);
        throw new Error("You are not a member of this chat");
    }

    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    };

    try {
        var message = await Message.create(newMessage);

        message = await message.populate("sender", "name");
        message = await message.populate("chat");
        message = await UserModel.populate(message, {
            path: "chat.users",
            select: "name email",
        });

        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});
export const markMessagesAsRead = expressAsyncHandler(async (req, res) => {
    const { chatId } = req.body;

    if (!chatId) {
        return res.sendStatus(400);
    }

    try {
        await Message.updateMany(
            { chat: chatId },
            { $addToSet: { readBy: req.user._id } }
        );
        res.status(200).send("Messages marked as read");
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});
