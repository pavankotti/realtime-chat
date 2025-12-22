import { useState } from 'react'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import axios from 'axios'

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
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div className="
        relative
        bg-panel
        rounded-2xl
        shadow-xl
        w-[400px]
        p-5
        z-10
        transition-colors
      ">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg text-primary">Create Group</h2>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center bg-input rounded-xl px-3 py-2 border border-subtle">
            <input
              type="text"
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="flex-1 bg-transparent outline-none text-primary placeholder:text-secondary"
            />
          </div>

          <div className="flex items-center bg-input rounded-xl px-3 py-2 border border-subtle">
            <input
              type="text"
              placeholder="Add Users"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-primary placeholder:text-secondary"
            />
          </div>

          {/* Selected Users Chips */}
          <div className="flex flex-wrap gap-2">
            {selectedUsers.map(u => (
              <div key={u._id} className="bg-primary text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                {u.name}
                <CloseIcon fontSize="small" className="cursor-pointer" onClick={() => handleRemoveUser(u._id)} />
              </div>
            ))}
          </div>

          {/* User Search Results */}
          <div className="max-h-40 overflow-y-auto flex flex-col gap-1">
            {users.slice(0, 4).map(u => (
              <div key={u._id} onClick={() => handleSelectUser(u)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-2 text-sm font-bold text-white">
                  {u.name.charAt(0)}
                </div>
                <div >
                  <p className="text-sm font-bold text-primary">{u.name}</p>
                  <p className="text-xs text-secondary">{u.email}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-2">
            <button
              onClick={handleCreate}
              disabled={!groupName.trim() || selectedUsers.length < 2}
              className="bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
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
