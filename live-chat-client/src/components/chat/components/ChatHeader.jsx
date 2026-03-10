import { IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InfoIcon from '@mui/icons-material/Info';
import { getAvatarGradient } from '../../../utils/avatarColor';

function ChatHeader({ chatName, isGroupChat, onBack, onShowInfo, onDelete }) {
    const gradient = getAvatarGradient(chatName || '');

    return (
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border-subtle bg-panel">
            <div className="md:hidden">
                <IconButton onClick={onBack} size="small" sx={{ color: 'var(--text-icon)' }}>
                    <ArrowBackIcon fontSize="small" />
                </IconButton>
            </div>

            <div className="relative">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center font-bold text-white`}>
                    {chatName ? chatName.charAt(0).toUpperCase() : '?'}
                </div>
                {/* Pulsing online dot */}
                <span className="absolute bottom-0 right-0 online-dot w-2.5 h-2.5 bg-emerald-400 border-2 border-panel rounded-full" />
            </div>

            <div className="flex-1 min-w-0">
                <p className="font-semibold text-primary text-sm truncate">{chatName}</p>
                <p className="text-xs text-secondary flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    {isGroupChat ? "Group Chat" : "Online"}
                </p>
            </div>

            <div className="flex gap-0.5">
                {isGroupChat && (
                    <Tooltip title="Group Info" placement="bottom">
                        <IconButton onClick={onShowInfo} size="small" sx={{ color: 'var(--text-icon)', '&:hover': { color: 'var(--accent)' } }}>
                            <InfoIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
                <Tooltip title={isGroupChat ? "Leave Group" : "Delete Chat"} placement="bottom">
                    <IconButton onClick={onDelete} size="small" sx={{ color: 'var(--text-icon)', '&:hover': { color: '#f87171' } }}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </div>
        </div>
    );
}

export default ChatHeader;
