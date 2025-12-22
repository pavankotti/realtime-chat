import MessageSelf from './MessageSelf';
import MessageOthers from './MessageOthers';

function MessageList({ messages, loading, userData }) {
    if (loading) {
        return <div className="flex justify-center items-center h-full text-secondary">Loading messages...</div>;
    }

    if (messages.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center h-full text-secondary opacity-50">
                <p className="text-2xl mb-2">👋</p>
                <p>No messages yet.</p>
                <p className="text-sm">Start the conversation!</p>
            </div>
        );
    }

    return (
        <div className="bg-panel rounded-2xl shadow p-4 flex-1 flex flex-col gap-4 overflow-y-auto no-scrollbar transition-colors">
            {messages.map((msg, index) => {
                const isSelf = msg.sender._id === userData._id;
                return isSelf ? (
                    <MessageSelf
                        key={index}
                        text={msg.content}
                        time={msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                    />
                ) : (
                    <MessageOthers
                        key={index}
                        name={msg.sender.name}
                        text={msg.content}
                        time={msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                    />
                );
            })}
        </div>
    );
}

export default MessageList;
