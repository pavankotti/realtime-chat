import { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import axios from 'axios'
import { getAvatarGradient } from '../../utils/avatarColor'

function CreateGroups({ open, onClose, onCreate }) {
  const [groupName, setGroupName] = useState('')
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [selectedUsers, setSelectedUsers] = useState([])
  const userData = JSON.parse(localStorage.getItem("userInfo"));

  // Fetch users for adding to group
  // Simple fetch on search change or mount logic can be added here
  // For simplicity, let's just use the search from sidebar logic? 
  // Ideally this component should be self-contained.
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      setUsers([]);
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userData?.token}`,
        },
      };
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/fetchUsers?search=${query}`,
        config
      );
      setUsers(data);
    } catch (error) {
      console.log("Error fetching users", error);
    }
  };

  const handleSelectUser = (user) => {
    if (selectedUsers.find(u => u._id === user._id)) return;
    setSelectedUsers([...selectedUsers, user]);
  }

  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter(u => u._id !== userId));
  }

  const handleCreate = () => {
    if (!groupName.trim() || selectedUsers.length < 2) return;
    // Pass users array. Backend expects JSON string of array.
    onCreate(groupName, JSON.stringify(selectedUsers.map(u => u._id)));
    setGroupName('')
    setSelectedUsers([])
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-container rounded-2xl shadow-2xl w-[400px] p-6 z-10 ring-1 ring-border-subtle">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <GroupsOutlinedIcon sx={{ color: 'var(--accent)', fontSize: 22 }} />
            <h2 className="font-semibold text-lg text-primary">Create Group</h2>
          </div>
          <IconButton onClick={onClose} size="small" sx={{ color: 'var(--text-icon)' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center bg-input rounded-xl px-3 py-2.5 ring-1 ring-transparent focus-within:ring-accent transition-all">
            <input
              type="text"
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="flex-1 bg-transparent outline-none text-primary placeholder:text-secondary text-sm"
            />
          </div>

          <div className="flex items-center bg-input rounded-xl px-3 py-2.5 ring-1 ring-transparent focus-within:ring-accent transition-all">
            <input
              type="text"
              placeholder="Add users to group"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-primary placeholder:text-secondary text-sm"
            />
          </div>

          {/* Selected Users Chips */}
          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map(u => {
                const gradient = getAvatarGradient(u.name);
                return (
                  <div key={u._id} className={`bg-accent-light text-accent text-xs px-3 py-1 rounded-full flex items-center gap-1.5 border border-accent/20`}>
                    {u.name}
                    <button onClick={() => handleRemoveUser(u._id)} className="hover:text-red-500 transition-colors">
                      <CloseIcon sx={{ fontSize: 12 }} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* User Search Results */}
          <div className="max-h-40 overflow-y-auto flex flex-col gap-1">
            {users.slice(0, 4).map(u => {
              const gradient = getAvatarGradient(u.name);
              return (
                <div key={u._id} onClick={() => handleSelectUser(u)} className="p-2 rounded-xl hover:bg-panel-hover cursor-pointer flex items-center gap-3 transition-colors">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-sm font-bold text-white`}>
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary">{u.name}</p>
                    <p className="text-xs text-secondary">{u.email}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end mt-1">
            <button
              onClick={handleCreate}
              disabled={!groupName.trim() || selectedUsers.length < 2}
              className="btn-primary !w-auto px-6 py-2 text-sm rounded-xl"
            >
              Create Group
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateGroups
