import Sidebar from './Sidebar'
import ChatArea from '../chat/ChatArea'
import { useState, useEffect, useRef } from 'react'
import CreateGroups from '../groups/CreateGroups'
import NavigationRail from './NavigationRail'
import { useDispatch, useSelector } from 'react-redux';
import { setOnlineUsers } from '../../features/liveUserSlice';
import io from "socket.io-client";
import axios from 'axios';

const ENDPOINT = import.meta.env.VITE_API_URL;
var socket;

function MainContainer() {

  const [activeConversation, setActiveConversation] = useState(null)
  const [conversations, setConversations] = useState([])
  const [showCreateGroup, setShowCreateGroup] = useState(false)

  const dispatch = useDispatch();
  const userData = JSON.parse(localStorage.getItem("userInfo"));
  const socketRef = useRef();

  useEffect(() => {
    if (userData) {
      const fetchChats = async () => {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${userData.token}`
            }
          };
          const { data } = await axios.get(`${ENDPOINT}/api/chat`, config);
          setConversations(data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchChats();
    }
  }, [userData?.token]);

  useEffect(() => {
    if (userData) {
      socket = io(ENDPOINT);
      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("Socket Connected/Reconnected");
        socket.emit("setup", userData);
      });

      socket.on("online-users", (users) => {
        console.log("Online Users Update:", users);
        dispatch(setOnlineUsers(users));
      });

      const handleNewMessage = (newMessageRecieved) => {
        setConversations(prev => {
          const exists = prev.find(c => c._id === newMessageRecieved.chat._id);
          if (exists) {
            return prev.map(c =>
              c._id === newMessageRecieved.chat._id
                ? { ...c, latestMessage: newMessageRecieved }
                : c
            );
          } else {
            return prev;
          }
        });
      };

      const handleGroupRecieved = (newGroup) => {
        setConversations(prev => [newGroup, ...prev]);
      };

      socket.on("message received", handleNewMessage);
      socket.on("group recieved", handleGroupRecieved);

      return () => {
        socket.disconnect();
        socket.off("message received", handleNewMessage);
        socket.off("group recieved", handleGroupRecieved);
      };
    }
  }, [userData?.token]);

  const handleCreateGroup = async (groupName, usersJson) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      };

      const { data } = await axios.post(`${ENDPOINT}/api/chat/group`,{
          name: groupName,
          users: usersJson,
      },config);
      // Add new group to top of list
      setConversations([data, ...conversations]);
      setActiveConversation(data);

      // Emit to others
      if (socketRef.current) {
        socketRef.current.emit("new group", data);
      }

    } catch (error) {
      console.log("Failed to create group", error);
    }
  }

  return (
    <div className='flex gap-4 w-full h-full overflow-hidden'>

      <div className={`flex gap-4 h-full ${activeConversation ? 'hidden md:flex md:w-[35%] lg:w-[30%]' : 'w-full md:w-[35%] lg:w-[30%]'}`}>
        <div className="md:hidden h-full">
          <NavigationRail onCreateGroup={() => setShowCreateGroup(true)} />
        </div>
        <Sidebar
          conversations={conversations}
          onSelectConversation={setActiveConversation}
          activeConversation={activeConversation}
          onCreateGroup={() => setShowCreateGroup(true)}
        />
      </div>

      <div className={`${activeConversation ? 'flex w-full' : 'hidden'} md:flex md:flex-1 h-full`}>
        <ChatArea
          conversation={activeConversation}
          onBack={() => setActiveConversation(null)}
          userData={userData}
          socket={socket}
          onChatRead={() => {
            setConversations(prev => prev.map(c =>
              c._id === activeConversation._id && c.latestMessage ? {
                ...c,
                latestMessage: {
                  ...c.latestMessage,
                  readBy: [...(c.latestMessage.readBy || []), userData._id]
                }
              } : c
            ));
          }}
        />
      </div>

      <CreateGroups
        open={showCreateGroup}
        onClose={() => setShowCreateGroup(false)}
        onCreate={handleCreateGroup}
      />
    </div>
  )
}

export default MainContainer
