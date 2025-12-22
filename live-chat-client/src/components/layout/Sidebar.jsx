import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import OnlineUsers from '../users/OnlineUsers'
import SidebarHeader from './sidebar/SidebarHeader'
import SidebarSearch from './sidebar/SidebarSearch'
import SidebarTabs from './sidebar/SidebarTabs'
import SidebarConversations from './sidebar/SidebarConversations'

function Sidebar({ conversations, onSelectConversation, activeConversation, onCreateGroup }) {

  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState("");
  const [tabValue, setTabValue] = useState(0);

  const userData = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    if (!userData) {
      console.log("User not authenticated");
      navigate("/");
    }
  }, [userData, navigate]);

  // Fetch users (with optional search)
  useEffect(() => {
    if (!userData) return;

    const fetchUsers = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userData.token}`
          }
        };

        // Append search query if exists
        const url = search
          ? `${import.meta.env.VITE_API_URL}/api/user/fetchUsers?search=${search}`
          : `${import.meta.env.VITE_API_URL}/api/user/fetchUsers`;

        const { data } = await axios.get(url, config);
        setUsers(data);
      } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("userInfo");
          navigate("/");
        }
      }
    };
    fetchUsers();
  }, [userData?.token, navigate, search]);

  // Handle clicking a user -> Create/Access Chat
  const handleUserClick = async (user) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${userData?.token}`
        }
      };

      // POST to access/create chat
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/chat`,
        { userId: user._id },
        config
      );

      // Pass the FULL CHAT object to the parent
      onSelectConversation(data);
    } catch (error) {
      console.log("Error accessing chat:", error);
    }
  }

  const onlineUserIds = useSelector(state => state.liveUser.onlineUsers);

  // Filter fetched users to find who is online
  // Note: 'users' comes from fetchUsers API. 'onlineUserIds' comes from Socket/Redis.
  const activeOnlineUsers = users.filter(user => {
    // console.log("Checking user:", user.name, user._id, "Online IDs:", onlineUserIds);
    return onlineUserIds.includes(String(user._id));
  });
  // console.log("Active Online Users:", activeOnlineUsers);

  // Handle clicking an online user from the top bar
  const handleOnlineUserClick = (user) => {
    const existing = conversations.find(
      c => !c.isGroup && c.name === user.name
    )

    if (existing) {
      onSelectConversation(existing)
    } else {
      // Reuse handleUserClick logic or create new
      handleUserClick(user);
    }
  }

  const checkUnread = (chat) => {
    if (!chat.latestMessage) return false;
    // Handle population differences just in case (e.g. sender object vs id string)
    const senderId = chat.latestMessage.sender?._id || chat.latestMessage.sender;
    const isSender = senderId === userData?._id;
    return !isSender && chat.latestMessage.readBy && !chat.latestMessage.readBy.includes(userData?._id);
  }


  return (
    <div className="flex flex-col flex-1 gap-4 overflow-hidden h-full">

      <SidebarHeader userData={userData} onCreateGroup={onCreateGroup} />

      <SidebarSearch search={search} setSearch={setSearch} />

      <OnlineUsers users={activeOnlineUsers} onUserClick={handleOnlineUserClick} />

      <div className="bg-panel rounded-2xl shadow p-2 flex-1 flex flex-col overflow-hidden transition-colors">
        <SidebarTabs
          tabValue={tabValue}
          setTabValue={setTabValue}
          conversations={conversations}
          checkUnread={checkUnread}
        />

        <SidebarConversations
          search={search}
          users={users}
          conversations={conversations}
          tabValue={tabValue}
          userData={userData}
          activeConversation={activeConversation}
          onSelectConversation={onSelectConversation}
          handleUserClick={handleUserClick}
          checkUnread={checkUnread}
        />
      </div>
    </div>
  )
}

export default Sidebar
