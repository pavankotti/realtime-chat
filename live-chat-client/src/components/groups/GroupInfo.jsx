import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import DeleteIcon from '@mui/icons-material/Delete'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { getAvatarGradient } from '../../utils/avatarColor'

function GroupInfo({ open, onClose, chat, userData, onUpdateGroup }) {
    const [search, setSearch] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [leaveConfirm, setLeaveConfirm] = useState(false)

    const isGroupAdmin = chat.groupAdmin?._id === userData._id;

    // Get online user IDs from Redux store
    const onlineUserIds = useSelector(state => state.liveUser.onlineUsers);

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            setSearchResults([]);
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${userData.token}`,
                },
            };
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/user/fetchUsers?search=${query}`,
                config
            );
            setLoading(false);
            setSearchResults(data);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    const handleAddUser = async (userToAdd) => {
        if (chat.users.find((u) => u._id === userToAdd._id)) {
            alert("User already in group!");
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userData.token}`,
                },
            };
            const { data } = await axios.put(
                `${import.meta.env.VITE_API_URL}/api/chat/groupadd`,
                {
                    chatId: chat._id,
                    userId: userToAdd._id,
                },
                config
            );
            onUpdateGroup(data);
            setSearch("");
            setSearchResults([]);
        } catch (error) {
            console.log(error);
        }
    }

    const handleRemoveUser = async (userToRemove) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userData.token}`,
                },
            };
            const { data } = await axios.put(
                `${import.meta.env.VITE_API_URL}/api/chat/groupremove`,
                {
                    chatId: chat._id,
                    userId: userToRemove._id,
                },
                config
            );
            // If admin removed themselves, they might lose access. 
            // Logic handled by parent or route but updated chat object will reflect changes.
            onUpdateGroup(data);
        } catch (error) {
            console.log(error);
        }
    }

    const groupGradient = getAvatarGradient(chat.chatName || '');

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="xs"
            PaperProps={{
                sx: {
                    borderRadius: '16px',
                    backgroundColor: 'var(--bg-container)',
                    backgroundImage: 'none',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
                    animation: 'scaleIn 0.2s ease-out both',
                }
            }}
        >
            <DialogTitle sx={{ backgroundColor: 'var(--bg-panel)', borderBottom: '1px solid var(--border-subtle)', py: 1.5, px: 2 }}>
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-primary text-base">{chat.chatName}</span>
                    <IconButton onClick={onClose} size="small" sx={{ color: 'var(--text-icon)' }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </div>
            </DialogTitle>
            <DialogContent sx={{ backgroundColor: 'var(--bg-container)', p: 2 }}>
                <div className="flex flex-col gap-4 pt-2">
                    {/* Header Info */}
                    <div className="flex flex-col items-center pb-4 border-b border-border-subtle">
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${groupGradient} flex items-center justify-center text-white text-2xl font-bold mb-2`}>
                            {chat.chatName.charAt(0).toUpperCase()}
                        </div>
                        <p className="font-semibold text-primary">{chat.chatName}</p>
                        <p className="text-secondary text-sm">Group · {chat.users.length} Members</p>
                    </div>

                    {/* Add User Section (Admin Only) */}
                    {isGroupAdmin && (
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center bg-input rounded-xl px-3 py-2.5 ring-1 ring-transparent focus-within:ring-accent focus-glow transition-all gap-2">
                                <PersonAddIcon sx={{ color: 'var(--text-secondary)', fontSize: 18 }} />
                                <input
                                    placeholder="Add user to group"
                                    className="flex-1 bg-transparent outline-none text-primary placeholder:text-secondary text-sm"
                                    value={search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </div>
                            {/* Search Results */}
                            {loading ? (
                                <div className='text-xs text-center text-secondary py-2'>Searching...</div>
                            ) : (
                                searchResults?.slice(0, 4).map(user => {
                                    const userGradient = getAvatarGradient(user.name);
                                    return (
                                        <div key={user._id} onClick={() => handleAddUser(user)} className="flex items-center justify-between p-2 hover:bg-panel-hover rounded-xl cursor-pointer transition-colors">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${userGradient} flex items-center justify-center text-white text-xs font-bold`}>
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className='flex flex-col'>
                                                    <span className="text-sm font-semibold text-primary">{user.name}</span>
                                                    <span className="text-xs text-secondary">{user.email}</span>
                                                </div>
                                            </div>
                                            <span className="text-accent font-semibold text-xs">ADD</span>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}

                    {/* Member List */}
                    <div className="flex-1 overflow-y-auto flex flex-col gap-1">
                        <h3 className="font-semibold text-[11px] text-secondary uppercase tracking-wider mb-1">Members</h3>
                        {(() => {
                            // Build a Set of online IDs once for O(1) lookups
                            const onlineSet = new Set(onlineUserIds.map(id => String(id)));
                            return chat.users.map(user => {
                                const memberGradient = getAvatarGradient(user.name);
                                const isAdmin = chat.groupAdmin._id === user._id;
                                const isOnline = onlineSet.has(String(user._id));
                                return (
                                    <div key={user._id} className="flex items-center justify-between p-2 rounded-xl hover:bg-panel-hover transition-colors">
                                        <div className="flex items-center gap-2">
                                            {/* Avatar with online/offline status dot */}
                                            <div className="relative flex-shrink-0">
                                                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${memberGradient} flex items-center justify-center text-white text-xs font-bold`}>
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-container ${isOnline ? 'bg-emerald-400' : 'bg-secondary/40'}`} />
                                            </div>
                                            <div className='flex flex-col'>
                                                <span className="text-sm font-semibold text-primary flex items-center gap-1">
                                                    {user.name}
                                                    {user._id === userData._id && <span className="text-secondary font-normal text-xs">(You)</span>}
                                                    {/* Admin crown icon */}
                                                    {isAdmin && (
                                                        <WorkspacePremiumIcon sx={{ fontSize: 13, color: '#f59e0b' }} />
                                                    )}
                                                </span>
                                                <span className="text-xs text-secondary flex items-center gap-1">
                                                    {isAdmin ? (
                                                        <span className="text-amber-500 font-medium">Admin</span>
                                                    ) : "Member"}
                                                    <span className="opacity-50">·</span>
                                                    <span className={isOnline ? 'text-emerald-500' : 'text-secondary/60'}>
                                                        {isOnline ? 'Online' : 'Offline'}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>

                                        {isGroupAdmin && user._id !== userData._id && (
                                            <IconButton onClick={() => handleRemoveUser(user)} size="small" sx={{ color: '#f87171', '&:hover': { backgroundColor: 'rgba(248,113,113,0.1)' } }}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        )}
                                    </div>
                                );
                            });
                        })()}
                    </div>

                    {/* Leave Group — danger button with confirmation step */}
                    <div className="flex justify-end pt-2 border-t border-border-subtle">
                        {!leaveConfirm ? (
                            <button
                                onClick={() => setLeaveConfirm(true)}
                                className="flex items-center gap-2 text-red-400 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium"
                            >
                                <ExitToAppIcon fontSize="small" />
                                Leave Group
                            </button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-secondary">Are you sure?</span>
                                <button
                                    onClick={() => setLeaveConfirm(false)}
                                    className="text-xs text-secondary hover:text-primary px-2 py-1 rounded transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => { setLeaveConfirm(false); handleRemoveUser(userData); }}
                                    className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                                >
                                    <ExitToAppIcon sx={{ fontSize: 14 }} />
                                    Yes, Leave
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default GroupInfo
