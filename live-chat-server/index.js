import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./Routes/userRoutes.js";
import chatRoutes from "./Routes/chatRoutes.js";
import messageRoutes from "./Routes/messageRoutes.js";
import cors from "cors";
import { Server } from "socket.io";
import { notFound, errorHandler } from "./Middleware/errorMiddleware.js";
import redis from "./Config/redisClient.js";

// Load environment variables from .env file
dotenv.config();

// Initialize Express App
const app = express();
app.use(express.json()); // Allow JSON data in request body
app.use(cors()); // Allow Cross-Origin requests (Frontend <-> Backend)

// ------------------------------------------
// Database Connection
// ------------------------------------------
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
    } catch (error) {
        console.log("server is not connected to database", error.message);
    }
}
connectDB();

// ------------------------------------------
// API Routes
// ------------------------------------------
app.get("/", (req, res) => {
    res.send("API is Running...");
});

app.use("/api/user", userRoutes);    // Authentication & User Search
app.use("/api/chat", chatRoutes);    // Chat Creation & Fetching
app.use("/api/message", messageRoutes); // Sending & Fetching Messages

// Error Handling Middlewares (for clean error responses)
app.use(notFound);
app.use(errorHandler);

// ------------------------------------------
// Server Initialization
// ------------------------------------------
const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// ------------------------------------------
// Socket.IO Logic (Real-Time Layer)
// ------------------------------------------
const io = new Server(server, {
    cors: {
        origin: "*", // Allow any frontend to connect
    },
});

io.on("connection", (socket) => {
    console.log("Connected to socket.io");

    // Event: User comes online
    socket.on("setup", async (userData) => {
        if (userData && userData._id) {
            // 1. Join a room with their own ID (for personal notifications)
            socket.join(userData._id);

            // 2. Map Socket ID -> User ID in Redis (Speed: O(1))
            await redis.set(`socket:${socket.id}`, userData._id);

            // 3. Add User ID to "Online Users" Set (Unique List)
            await redis.sadd("online_users", userData._id);

            // 4. Fetch updated list and Broadcast to everyone
            const onlineParams = await redis.smembers("online_users");
            io.emit("online-users", onlineParams);

            console.log("User Joined (Redis):", userData._id);
            socket.emit("connected");
        }
    });

    // Event: Join a specific Chat Room
    socket.on("join chat", (room) => {
        socket.join(room); // Socket joins the "Room"
        console.log("User Joined Room: " + room);
    });

    // Event: Sending a Message
    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");

        // Broadcast to every OTHER user in the chat room
        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return; // Don't send to sender

            // Send to the user's personal room
            socket.in(user._id).emit("message received", newMessageRecieved);
        });
    });

    // Event: Creating a New Group
    socket.on("new group", (newGroupRecieved) => {
        if (!newGroupRecieved.users) return;
        newGroupRecieved.users.forEach(user => {
            // Notify everyone in the group except admin (who created it)
            if (user._id == newGroupRecieved.groupAdmin._id) return;
            socket.in(user._id).emit("group recieved", newGroupRecieved);
        });
    });

    // Event: Disconnect (Cleanup)
    socket.on("disconnect", async () => {
        // 1. Retrieve User ID from Socket Map
        const userId = await redis.get(`socket:${socket.id}`);

        if (userId) {
            // 2. Remove Redis entries
            await redis.del(`socket:${socket.id}`);
            await redis.srem("online_users", userId);

            // 3. Broadcast updated Online List
            const onlineParams = await redis.smembers("online_users");
            io.emit("online-users", onlineParams);
            console.log("USER DISCONNECTED (Redis):", userId);
        }
    });
});