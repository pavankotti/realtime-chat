import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import DeleteIcon from '@mui/icons-material/Delete'
import axios from 'axios'
import { useSelector } from 'react-redux'

function GroupInfo({ open, onClose, chat, userData, onUpdateGroup }) {
    const [search, setSearch] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [loading, setLoading] = useState(false)

    const isGroupAdmin = chat.groupAdmin?._id === userData._id;

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

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle className="flex justify-between items-center bg-gray-100 dark:bg-gray-800">
                <span className="font-bold text-primary">{chat.chatName}</span>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent className="bg-panel min-h-[400px] flex flex-col gap-4 pt-4">

                {/* Header Info */}
                <div className="flex flex-col items-center pb-4 border-b border-subtle">
                    <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white text-2xl font-bold mb-2">
                        {chat.chatName.charAt(0).toUpperCase()}
                    </div>
                    <p className="text-secondary text-sm">Group • {chat.users.length} Members</p>
                </div>

                {/* Add User Section (Admin Only) */}
                {isGroupAdmin && (
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center bg-input rounded-xl px-3 py-2 border border-subtle">
                            <PersonAddIcon className="text-secondary mr-2" />
                            <input
                                placeholder="Add user to group"
                                className="flex-1 bg-transparent outline-none text-primary placeholder:text-secondary"
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
                        {/* Search Results */}
                        {loading ? <div className='text-xs text-center text-secondary'>Loading...</div> : (
                            searchResults?.slice(0, 4).map(user => (
                                <div key={user._id} onClick={() => handleAddUser(user)} className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white text-xs">{user.name.charAt(0)}</div>
                                        <div className='flex flex-col'>
                                            <span className="text-sm font-semibold">{user.name}</span>
                                            <span className="text-xs text-secondary">{user.email}</span>
                                        </div>
                                    </div>
                                    <div className="text-green-600 font-bold text-xs">ADD</div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Member List */}
                <div className="flex-1 overflow-y-auto flex flex-col gap-2 mt-2">
                    <h3 className="font-semibold text-sm text-secondary uppercase">Members</h3>
                    {chat.users.map(user => (
                        <div key={user._id} className="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                            <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs ${chat.groupAdmin._id === user._id ? 'bg-orange-500' : 'bg-gray-400'}`}>
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className='flex flex-col'>
                                    <span className="text-sm font-semibold text-primary">
                                        {user.name} {user._id === userData._id && "(You)"}
                                    </span>
                                    <span className="text-xs text-secondary">
                                        {chat.groupAdmin._id === user._id ? "Admin" : "Member"}
                                    </span>
                                </div>
                            </div>

                            {isGroupAdmin && user._id !== userData._id && (
                                <IconButton onClick={() => handleRemoveUser(user)} color="error" size="small">
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex justify-end pt-2 border-t border-subtle">
                    <button onClick={() => handleRemoveUser(userData)} className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-3 py-1 rounded">
                        <ExitToAppIcon fontSize="small" />
                        Leave Group
                    </button>
                </div>

            </DialogContent>
        </Dialog>
    )
}

export default GroupInfo
