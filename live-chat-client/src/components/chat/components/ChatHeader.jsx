import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InfoIcon from '@mui/icons-material/Info';

function ChatHeader({ chatName, isGroupChat, onBack, onShowInfo, onDelete }) {
    return (
        <div className="bg-panel rounded-2xl shadow p-2.5 flex items-center transition-colors">
            <div className="md:hidden mr-2">
                <IconButton onClick={onBack}>
                    <ArrowBackIcon />
                </IconButton>
            </div>

            <div className="w-10 h-10 rounded-full bg-[#06daae] flex items-center justify-center font-bold text-white tracking-wide">
                {chatName ? chatName.charAt(0).toUpperCase() : "?"}
            </div>

            <div className="ml-3 flex-1">
                <p className="font-semibold text-primary">{chatName}</p>
                <p className="text-sm text-secondary">
                    {isGroupChat ? "Group Chat" : "Click to view info"}
                </p>
            </div>

            <div className="flex">
                {isGroupChat && (
                    <IconButton onClick={onShowInfo}>
                        <InfoIcon />
                    </IconButton>
                )}
                <IconButton onClick={onDelete}>
                    <DeleteIcon />
                </IconButton>
            </div>
        </div>
    );
}

export default ChatHeader;
