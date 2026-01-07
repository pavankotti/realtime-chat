import expressAsyncHandler from "express-async-handler";
import chatModel from "../modals/chatModel.js";
import UserModel from "../modals/userModel.js";

// ------------------------------------------
// Controller: Access Existing Chat or Create New One
// Route: POST /api/chat
// ------------------------------------------
export const accessChat = expressAsyncHandler(async (req, res) => {
    const { userId } = req.body;

    // Check if userid is sent in request body
    if (!userId) {
        console.log("UserId param not sent with request");
        return res.sendStatus(400);
    }

    // 1. Check if chat exists with this user
    // Query for a one-on-one chat (isGroupChat: false)
    // where both the current user (req.user._id) and the target user (userId) are participants.
    var isChat = await chatModel.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } }, // Current user is a participant
            { users: { $elemMatch: { $eq: userId } } },       // Target user is a participant
        ],
    })
        .populate("users", "-password") // Replace User IDs with User Objects (hide password)
        .populate("latestMessage");     // Populate the latest message object

    // 2. Deep populate sender details inside latestMessage
    // After populating latestMessage, its 'sender' field still contains an ID.
    // This step populates the 'sender' field within the 'latestMessage' object with actual user details.
    isChat = await UserModel.populate(isChat, {
        path: "latestMessage.sender",
        select: "name email", // Select only name and email for the sender
    });

    // 3. If Chat exists, return it
    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        // 4. Create new Chat
        // If no existing chat is found, create a new one-on-one chat.
        var chatData = {
            chatName: "sender", // Default chat name for direct messages
            isGroupChat: false,
            users: [req.user._id, userId], // Include both users in the chat
        };

        try {
            const createdChat = await chatModel.create(chatData); // Create the new chat document
            // Find the newly created chat and populate its 'users' field
            const FullChat = await chatModel.findOne({ _id: createdChat._id }).populate(
                "users",
                "-password" // Populate users and hide their passwords
            );
            res.status(200).json(FullChat); // Return the full, populated chat object
        } catch (error) {
            console.log("Error in accessChat:", error.message);
            res.status(400);
            throw new Error(error.message);
        }
    }
});

// ------------------------------------------
// Controller: Fetch All Chats for User
// Route: GET /api/chat
// ------------------------------------------
export const fetchChats = expressAsyncHandler(async (req, res) => {
    try {
        console.log("Fetch Chats for User:", req.user._id);

        // Find chats where current user is a member
        // Query for all chats where the current user's ID is present in the 'users' array.
        chatModel.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")         // Populate all user objects in the chat, excluding passwords
            .populate("groupAdmin", "-password")    // Populate the group admin user object, excluding password
            .populate("latestMessage")              // Populate the latest message object
            .sort({ updatedAt: -1 })                // Sort chats by the most recently updated first
            .then(async (results) => {
                // Deep populate sender details within the latestMessage of each chat
                results = await UserModel.populate(results, {
                    path: "latestMessage.sender",   // Target the 'sender' field inside 'latestMessage'
                    select: "name email",           // Select only name and email for the sender
                });
                res.status(200).send(results);      // Send the fully populated chat results
            });
    } catch (error) {
        console.log("Error in fetchChats:", error.message);
        res.status(400);
        throw new Error(error.message);
    }
});

// ------------------------------------------
// Controller: Create Group Chat
// Route: POST /api/chat/group
// ------------------------------------------
export const createGroupChat = expressAsyncHandler(async (req, res) => {
    // Validate request body: ensure users array and chat name are provided
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please Fill all the feilds" });
    }

    // Parse the stringified users array from the request body
    var users = JSON.parse(req.body.users);

    // Ensure there are at least 3 participants (including the creator) for a group chat
    if (users.length < 2) {
        return res
            .status(400)
            .send("More than 2 users are required to form a group chat");
    }

    // Add the current user (who is creating the group) to the users array
    users.push(req.user);

    try {
        // Create the new group chat document
        const groupChat = await chatModel.create({
            chatName: req.body.name,        // Set the chat name
            users: users,                   // Assign the array of user IDs
            isGroupChat: true,              // Mark as a group chat
            groupAdmin: req.user,           // Set the current user as the group admin
        });

        // Retrieve the newly created group chat and populate its user and admin fields
        const fullGroupChat = await chatModel.findOne({ _id: groupChat._id })
            .populate("users", "-password")         // Populate all user objects, excluding passwords
            .populate("groupAdmin", "-password");   // Populate the group admin, excluding password

        res.status(200).json(fullGroupChat); // Return the fully populated group chat object
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

// ------------------------------------------
// Controller: Rename Group Chat
// Route: PUT /api/chat/rename
// ------------------------------------------
export const renameGroup = expressAsyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;

    // Find the chat by ID and update its name
    const updatedChat = await chatModel.findByIdAndUpdate(
        chatId,
        {
            chatName: chatName, // Set the new chat name
        },
        {
            new: true, // Return the updated document
        }
    )
        .populate("users", "-password")         // Populate all user objects, excluding passwords
        .populate("groupAdmin", "-password");   // Populate the group admin, excluding password

    // Check if the chat was found and updated
    if (!updatedChat) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(updatedChat); // Return the updated and populated chat object
    }
});

// ------------------------------------------
// Controller: Remove User from Group Chat
// Route: PUT /api/chat/groupremove
// ------------------------------------------
export const removeFromGroup = expressAsyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    // check if the requester is admin or removing themselves? 
    // For now simple implementation:
    // Find the chat by ID and remove the specified user from the 'users' array
    const removed = await chatModel.findByIdAndUpdate(
        chatId,
        {
            $pull: { users: userId }, // Remove the userId from the 'users' array
        },
        {
            new: true, // Return the updated document
        }
    )
        .populate("users", "-password")         // Populate all user objects, excluding passwords
        .populate("groupAdmin", "-password");   // Populate the group admin, excluding password

    // Check if the chat was found and updated
    if (!removed) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(removed); // Return the updated and populated chat object
    }
});

// ------------------------------------------
// Controller: Add User to Group Chat
// Route: PUT /api/chat/groupadd
// ------------------------------------------
export const addToGroup = expressAsyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    // Find the chat by ID and add the specified user to the 'users' array
    const added = await chatModel.findByIdAndUpdate(
        chatId,
        { $push: { users: userId } }, // This line is missing in your snippet
        { new: true }
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
