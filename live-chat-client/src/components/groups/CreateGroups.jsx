import { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import axios from 'axios'
import { getAvatarGradient } from '../../utils/avatarColor'

const GROUP_COLORS = [
  { label: 'Indigo', from: '#6366f1', to: '#818cf8' },
  { label: 'Violet', from: '#7c3aed', to: '#a78bfa' },
  { label: 'Blue',   from: '#3b82f6', to: '#60a5fa' },
  { label: 'Emerald',from: '#10b981', to: '#34d399' },
  { label: 'Amber',  from: '#f59e0b', to: '#fbbf24' },
  { label: 'Rose',   from: '#f43f5e', to: '#fb7185' },
];

function CreateGroups({ open, onClose, onCreate }) {
  const [groupName, setGroupName] = useState('')
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [selectedUsers, setSelectedUsers] = useState([])
  const [selectedColor, setSelectedColor] = useState(0)
  const userData = JSON.parse(localStorage.getItem("userInfo"));

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
    setSelectedColor(0)
    onClose()
  }

  if (!open) return null

  const color = GROUP_COLORS[selectedColor];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* Stronger backdrop blur */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal with scale-in animation */}
      <div className="animate-scale-in relative bg-container rounded-2xl shadow-2xl w-[420px] p-6 z-10 ring-1 ring-border-subtle">
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
          {/* Group avatar preview + color picker */}
          <div className="flex items-center gap-4 mb-1">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-md"
              style={{ background: `linear-gradient(135deg, ${color.from} 0%, ${color.to} 100%)` }}
            >
              {groupName ? groupName.charAt(0).toUpperCase() : '?'}
            </div>
            <div className="flex-1">
              <p className="text-xs text-secondary mb-1.5">Group icon color</p>
              <div className="flex gap-2">
                {GROUP_COLORS.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(i)}
                    title={c.label}
                    className={`w-5 h-5 rounded-full transition-all ${
                      selectedColor === i ? 'ring-2 ring-offset-1 ring-accent scale-110' : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{ background: `linear-gradient(135deg, ${c.from}, ${c.to})` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Group Name */}
          <div className="flex items-center bg-input rounded-xl px-3 py-2.5 ring-1 ring-transparent focus-within:ring-accent focus-glow transition-all">
            <input
              type="text"
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="flex-1 bg-transparent outline-none text-primary placeholder:text-secondary text-sm"
            />
          </div>

          {/* Search users — shows dropdown with avatars */}
          <div className="flex items-center bg-input rounded-xl px-3 py-2.5 ring-1 ring-transparent focus-within:ring-accent focus-glow transition-all">
            <input
              type="text"
              placeholder="Add users to group"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-primary placeholder:text-secondary text-sm"
            />
          </div>

          {/* Selected Users Chips with avatar */}
          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map(u => {
                const gradient = getAvatarGradient(u.name);
                return (
                  <div key={u._id} className="flex items-center gap-1.5 bg-accent-light text-accent text-xs px-2 py-1 rounded-full border border-accent/20">
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0`}>
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <span>{u.name}</span>
                    <button onClick={() => handleRemoveUser(u._id)} className="hover:text-red-500 transition-colors ml-0.5">
                      <CloseIcon sx={{ fontSize: 11 }} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* User autocomplete dropdown */}
          {users.length > 0 && (
            <div className="max-h-40 overflow-y-auto flex flex-col gap-0.5 rounded-xl ring-1 ring-border-subtle bg-container p-1">
              {(() => {
                // Build Set once for O(1) lookup instead of O(n) find inside map
                const selectedIds = new Set(selectedUsers.map(s => s._id));
                return users.slice(0, 5).map(u => {
                  const gradient = getAvatarGradient(u.name);
                  const isSelected = selectedIds.has(u._id);
                  return (
                    <div
                      key={u._id}
                      onClick={() => handleSelectUser(u)}
                      className={`p-2 rounded-lg cursor-pointer flex items-center gap-3 transition-colors ${
                        isSelected ? 'bg-accent-light opacity-60 cursor-default' : 'hover:bg-panel-hover'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-sm font-bold text-white flex-shrink-0`}>
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-primary truncate">{u.name}</p>
                        <p className="text-xs text-secondary truncate">{u.email}</p>
                      </div>
                      {isSelected && <span className="text-[10px] text-accent font-semibold">Added</span>}
                    </div>
                  );
                });
              })()}
            </div>
          )}

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
