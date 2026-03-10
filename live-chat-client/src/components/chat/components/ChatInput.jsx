import SendIcon from '@mui/icons-material/Send';

function ChatInput({ newMessage, setNewMessage, sendMessage, handleKeyDown }) {
    return (
        <div className="flex items-center gap-3 px-4 py-3 border-t border-border-subtle bg-panel">
            <div className="flex-1 flex items-center bg-input rounded-2xl px-4 py-2.5 ring-1 ring-transparent focus-within:ring-accent transition-all">
                <input
                    placeholder="Type a message..."
                    className="flex-1 text-sm bg-transparent outline-none text-primary placeholder:text-secondary"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>
            <button
                onClick={sendMessage}
                className="w-10 h-10 rounded-full bg-accent hover:bg-accent-hover flex items-center justify-center transition-all hover:scale-105 flex-shrink-0"
                style={{ boxShadow: '0 4px 12px rgba(99,102,241,0.35)' }}
            >
                <SendIcon sx={{ color: '#ffffff', fontSize: 18 }} />
            </button>
        </div>
    );
}

export default ChatInput;
