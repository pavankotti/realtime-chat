import { useEffect, useState } from 'react';
import axios from 'axios';
import Welcome from './components/Welcome';
import GroupInfo from '../groups/GroupInfo';
import ChatHeader from './components/ChatHeader';
import ChatInput from './components/ChatInput';
import MessageList from './components/MessageList';

function ChatArea({ conversation, onBack, userData, socket, onChatRead }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);

  // Mark messages as read when conversation opens
  useEffect(() => {
    if (!conversation) return;

    const markRead = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userData?.token}` }
        };
        await axios.put(`${import.meta.env.VITE_API_URL}/api/message/read`, { chatId: conversation._id }, config);
        if (onChatRead) onChatRead();
      } catch (error) {
        console.log("Error marking read:", error);
      }
    };
    markRead();
  }, [conversation?._id, userData?.token]);

  // Ensure we stay joined to the chat room even if socket reconnects
  useEffect(() => {
    if (socket && conversation) {
      socket.emit("join chat", conversation._id);

      const handleReconnect = () => {
        socket.emit("join chat", conversation._id);
      };

      socket.on("connect", handleReconnect);

      return () => {
        socket.off("connect", handleReconnect);
      }
    }
  }, [socket, conversation]);

  // Fetch messages
  useEffect(() => {
    if (!conversation) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userData?.token}`
          }
        };
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/message/${conversation._id}`, config);
        setMessages(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchMessages();
  }, [conversation, userData?.token]);

  // Listen for incoming messages
  useEffect(() => {
    if (socket) {
      const handleMessage = (newMessageRecieved) => {
        if (!conversation || conversation._id !== newMessageRecieved.chat._id) {
          // Notification logic could go here
        } else {
          setMessages((prev) => [...prev, newMessageRecieved]);
        }
      };

      socket.on("message received", handleMessage);

      // Cleanup listener
      return () => {
        socket.off("message received", handleMessage);
      };
    }
  }, [socket, conversation]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${userData?.token}`
        }
      };

      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/message`, {
        content: newMessage,
        chatId: conversation._id
      }, config);

      socket.emit("new message", data);
      setMessages([...messages, data]);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  }

  if (!conversation) {
    return (
      <Welcome />
    )
  }

  // Determine Chat Name
  let chatName = conversation.chatName;
  if (!conversation.isGroupChat && conversation.users) {
    const otherUser = conversation.users.find(u => u._id !== userData._id);
    if (otherUser) chatName = otherUser.name;
  }

  // Delete Chat or Leave Group
  const handleDeleteChat = async () => {
    if (!window.confirm(`Are you sure you want to ${conversation.isGroupChat ? "leave this group" : "delete this chat"}?`)) {
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userData?.token}`
        },
        data: {
          chatId: conversation._id
        }
      };



      await axios.put(`${import.meta.env.VITE_API_URL}/api/chat/remove`, { chatId: conversation._id }, {
        headers: { Authorization: `Bearer ${userData?.token}` }
      });

      // Notify parent to refresh or just go back
      onBack();
      // Ideally we should also refresh the sidebar list in parent, onBack might trigger a re-fetch or state update if implemented well. 
      // MainContainer handles this via 'refresh' prop or similar?
      // For now, onBack clears the view. A refresh of sidebar might be needed.
      window.location.reload(); // Temporary force refresh to update list
    } catch (error) {
      console.log("Error deleting chat:", error);
    }
  }

  return (
    <div className="flex flex-col flex-1 gap-4 h-full">

      <ChatHeader
        chatName={chatName}
        isGroupChat={conversation.isGroupChat}
        onBack={onBack}
        onDelete={handleDeleteChat}
        onShowInfo={() => setShowGroupInfo(true)}
      />

      <MessageList
        messages={messages}
        loading={loading}
        userData={userData}
      />

      <ChatInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        sendMessage={sendMessage}
        handleKeyDown={handleKeyDown}
      />

      {conversation.isGroupChat && (
        <GroupInfo
          open={showGroupInfo}
          onClose={() => setShowGroupInfo(false)}
          chat={conversation}
          userData={userData}
          onUpdateGroup={(updatedGroup) => {
            setShowGroupInfo(false);
          }}
        />
      )}
    </div>
  )
}

export default ChatArea
