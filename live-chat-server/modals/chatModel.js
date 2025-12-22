import mongoose from "mongoose";

const chatSchema = mongoose.Schema({
    chatName: {
        type: String
    },
    isGroupChat: {
        type: Boolean
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
}, {
    timestamps: true
})

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;