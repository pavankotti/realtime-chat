import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./Routes/userRoutes.js";
import chatRoutes from "./Routes/chatRoutes.js";
import messageRoutes from "./Routes/messageRoutes.js";
import cors from "cors";
import { Server } from "socket.io";
import { notFound, errorHandler } from "./Middleware/errorMiddleware.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
    } catch (error) {
        console.log("server is not connected to database", error.message);
        // process.exit(1);
    }
}

connectDB();

app.get("/", (req, res) => {
    res.send("Hello World! 123");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

import redis from "./Config/redisClient.js";

// No local map needed for online users, using Redis.

io.on("connection", (socket) => {
    console.log("Connected to socket.io");

    socket.on("setup", async (userData) => {
        if (userData && userData._id) {
            socket.join(userData._id);

            // Store socket->user mapping and add to set
            await redis.set(`socket:${socket.id}`, userData._id);
            await redis.sadd("online_users", userData._id);

            // Fetch all and broadcast
            const onlineParams = await redis.smembers("online_users");
            io.emit("online-users", onlineParams);

            console.log("User Joined (Redis):", userData._id);
            socket.emit("connected");
        }
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });

    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return;
            socket.in(user._id).emit("message received", newMessageRecieved);
        });
    });

    socket.on("new group", (newGroupRecieved) => {
        if (!newGroupRecieved.users) return;
        newGroupRecieved.users.forEach(user => {
            // Emit to all users in the group (including admin if we want, but admin creates it so usually has it)
            // Check if user._id is not the socket sender? 
            // Ideally we just emit to everyone.
            if (user._id == newGroupRecieved.groupAdmin._id) return;
            socket.in(user._id).emit("group recieved", newGroupRecieved);
        });
    });

    socket.on("disconnect", async () => {
        // Retrieve userId from socketId mapping
        const userId = await redis.get(`socket:${socket.id}`);

        if (userId) {
            await redis.del(`socket:${socket.id}`);
            await redis.srem("online_users", userId);

            const onlineParams = await redis.smembers("online_users");
            io.emit("online-users", onlineParams);
            console.log("USER DISCONNECTED (Redis):", userId);
        }
    });
});