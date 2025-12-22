import { IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

function ChatInput({ newMessage, setNewMessage, sendMessage, handleKeyDown }) {
    return (
        <div className="flex items-center bg-panel rounded-2xl shadow p-3 transition-colors">
            <input
                placeholder="Type a message..."
                className="ml-2 w-full outline-none bg-transparent text-primary placeholder:text-secondary text-base"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <IconButton onClick={sendMessage}>
                <SendIcon sx={{ color: '#06daae' }} />
            </IconButton>
        </div>
    );
}

export default ChatInput;
