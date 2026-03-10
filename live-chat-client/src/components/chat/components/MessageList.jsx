import MessageSelf from './MessageSelf';
import MessageOthers from './MessageOthers';

function MessageList({ messages, loading, userData }) {
    if (loading) {
        return <div className="flex justify-center items-center flex-1 text-secondary text-sm">Loading messages...</div>;
    }

    if (messages.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center flex-1 text-secondary gap-2">
                <p className="text-2xl">👋</p>
                <p className="text-sm font-medium">No messages yet.</p>
                <p className="text-xs text-secondary">Start the conversation!</p>
            </div>
        );
    }

    // Group messages by date for date separators
    const withDates = [];
    let lastDateStr = null;
    messages.forEach((msg, index) => {
        const date = msg.createdAt ? new Date(msg.createdAt) : null;
        if (date) {
            const dateStr = date.toDateString();
            if (dateStr !== lastDateStr) {
                lastDateStr = dateStr;
                const now = new Date();
                const yesterday = new Date();
                yesterday.setDate(now.getDate() - 1);
                let label;
                if (dateStr === now.toDateString()) label = "Today";
                else if (dateStr === yesterday.toDateString()) label = "Yesterday";
                else label = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
                withDates.push({ type: 'separator', label, key: 'sep-' + dateStr });
            }
        }
        withDates.push({ type: 'message', msg, index });
    });

    return (
        <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-0.5 bg-panel">
            {withDates.map((item) => {
                if (item.type === 'separator') {
                    return (
                        <div key={item.key} className="flex items-center justify-center my-3">
                            <span className="text-[11px] text-secondary bg-panel-hover px-3 py-1 rounded-full">
                                {item.label}
                            </span>
                        </div>
                    );
                }
                const { msg, index } = item;
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
