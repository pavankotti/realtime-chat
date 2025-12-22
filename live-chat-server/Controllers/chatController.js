import expressAsyncHandler from "express-async-handler";
import chatModel from "../modals/chatModel.js";
import UserModel from "../modals/userModel.js";

export const accessChat = expressAsyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        console.log("UserId param not sent with request");
        return res.sendStatus(400);
    }

    var isChat = await chatModel.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
    })
        .populate("users", "-password")
        .populate("latestMessage");

    isChat = await UserModel.populate(isChat, {
        path: "latestMessage.sender",
        select: "name email",
    });

    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        };

        try {
            const createdChat = await chatModel.create(chatData);
            const FullChat = await chatModel.findOne({ _id: createdChat._id }).populate(
                "users",
                "-password"
            );
            res.status(200).json(FullChat);
        } catch (error) {
            console.log("Error in accessChat:", error.message);
            res.status(400);
            throw new Error(error.message);
        }
    }
});

export const fetchChats = expressAsyncHandler(async (req, res) => {
    try {
        console.log("Fetch Chats for User:", req.user._id);
        chatModel.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await UserModel.populate(results, {
                    path: "latestMessage.sender",
                    select: "name email",
                });
                res.status(200).send(results);
            });
    } catch (error) {
        console.log("Error in fetchChats:", error.message);
        res.status(400);
        throw new Error(error.message);
    }
});

export const createGroupChat = expressAsyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please Fill all the fields" });
    }

    var users = JSON.parse(req.body.users);

    if (users.length < 2) {
        return res
            .status(400)
            .send("More than 2 users are required to form a group chat");
    }

    users.push(req.user);

    try {
        const groupChat = await chatModel.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });

        const fullGroupChat = await chatModel.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

export const renameGroup = expressAsyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;

    const updatedChat = await chatModel.findByIdAndUpdate(
        chatId,
        {
            chatName: chatName,
        },
        {
            new: true,
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!updatedChat) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(updatedChat);
    }
});

export const removeFromGroup = expressAsyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    // check if the requester is admin or removing themselves? 
    // For now simple implementation:
    const removed = await chatModel.findByIdAndUpdate(
        chatId,
        {
            $pull: { users: userId },
        },
        {
            new: true,
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!removed) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(removed);
    }
});

export const addToGroup = expressAsyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    const added = await chatModel.findByIdAndUpdate(
        chatId,
        {
            $push: { users: userId },
        },
        {
            new: true,
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!added) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(added);
    }
});

export const deleteChat = expressAsyncHandler(async (req, res) => {
    const { chatId } = req.body;
    const userId = req.user._id;

    const chat = await chatModel.findById(chatId);

    if (!chat) {
        res.status(404);
        throw new Error("Chat Not Found");
    }

    if (chat.isGroupChat) {
        // Leave Group
        const removed = await chatModel.findByIdAndUpdate(
            chatId,
            {
                $pull: { users: userId },
            },
            {
                new: true,
            }
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        if (!removed) {
            res.status(404);
            throw new Error("Chat Not Found");
        } else {
            res.json(removed);
        }
    } else {
        // Delete Chat (DM)
        if (!chat.users.map(u => u.toString()).includes(userId.toString())) {
            res.status(403);
            throw new Error("Not authorized to delete this chat");
        }

        await chatModel.findByIdAndDelete(chatId);
        res.json({ message: "Chat Deleted Successfully", _id: chatId });
    }
});
