import SendIcon from '@mui/icons-material/Send';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';

function ChatInput({ newMessage, setNewMessage, sendMessage, handleKeyDown }) {
    const hasText = newMessage.trim().length > 0;

    return (
        <div className="flex items-center gap-3 px-4 py-3 border-t border-border-subtle bg-panel">
            {/* Emoji button */}
            <button
                className="w-9 h-9 rounded-full flex items-center justify-center text-secondary hover:text-accent hover:bg-panel-hover transition-all flex-shrink-0"
                tabIndex={-1}
                title="Emoji (coming soon)"
            >
                <EmojiEmotionsOutlinedIcon sx={{ fontSize: 20 }} />
            </button>

            {/* Input wrapper */}
            <div className="flex-1 flex items-center bg-input rounded-2xl px-4 py-2.5 ring-1 ring-transparent focus-within:ring-accent focus-glow transition-all">
                <input
                    placeholder="Type a message..."
                    className="flex-1 text-sm bg-transparent outline-none text-primary placeholder:text-secondary"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>

            {/* Send button — solid accent only when text is present */}
            <button
                onClick={sendMessage}
                disabled={!hasText}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
                    hasText
                        ? 'bg-accent hover:bg-accent-hover hover:scale-105 shadow-[0_4px_12px_rgba(99,102,241,0.35)]'
                        : 'bg-panel-hover cursor-not-allowed'
                }`}
            >
                <SendIcon sx={{ color: hasText ? '#ffffff' : 'var(--text-icon)', fontSize: 18 }} />
            </button>
        </div>
    );
}

export default ChatInput;
