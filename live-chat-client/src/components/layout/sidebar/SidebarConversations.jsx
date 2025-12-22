import ConversationItem from '../../conversations/ConversationItem';

function SidebarConversations({
    search,
    users,
    conversations,
    tabValue,
    userData,
    activeConversation,
    onSelectConversation,
    handleUserClick,
    checkUnread
}) {

    if (search) {
        return (
            <div className="flex-1 overflow-y-auto no-scrollbar transition-colors">
                {users.map((user) => {
                    if (user._id === userData?._id) return null;
                    return (
                        <ConversationItem
                            key={user._id}
                            name={user.name}
                            lastMessage=""
                            timestamp=""
                            isActive={false}
                            onClick={() => handleUserClick(user)}
                        />
                    )
                })}
                {users.length === 0 && (
                    <div className='text-center text-secondary text-sm mt-10'>
                        No users found.
                    </div>
                )}
            </div>
        );
    }

    const filteredConversations = conversations
        .filter((chat) => tabValue === 0 ? !chat.isGroupChat : chat.isGroupChat)
        .sort((a, b) => {
            const dateA = a.latestMessage ? new Date(a.latestMessage.createdAt) : new Date(a.updatedAt);
            const dateB = b.latestMessage ? new Date(b.latestMessage.createdAt) : new Date(b.updatedAt);
            return dateB - dateA;
        });

    return (
        <div className="flex-1 overflow-y-auto no-scrollbar transition-colors">
            {filteredConversations.map((chat) => {
                let chatName = chat.chatName;
                if (!chat.isGroupChat) {
                    const otherUser = chat.users.find(u => u._id !== userData._id);
                    chatName = otherUser ? otherUser.name : "Unknown User";
                }

                const latestMsg = chat.latestMessage ? chat.latestMessage.content : (chat.isGroupChat ? "New Group" : "New Chat");

                // Date Formatting Logic
                let timeStamp = "";
                if (chat.latestMessage) {
                    const date = new Date(chat.latestMessage.createdAt);
                    const now = new Date();
                    const yesterday = new Date();
                    yesterday.setDate(now.getDate() - 1);

                    if (date.toDateString() === now.toDateString()) {
                        timeStamp = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    } else if (date.toDateString() === yesterday.toDateString()) {
                        timeStamp = "Yesterday " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    } else {
                        timeStamp = date.toLocaleDateString('en-US', { weekday: 'short' }) + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    }
                }

                const isUnread = checkUnread(chat);

                return (
                    <ConversationItem
                        key={chat._id}
                        name={chatName}
                        lastMessage={latestMsg}
                        timestamp={timeStamp}
                        unread={isUnread}
                        isActive={activeConversation?._id === chat._id}
                        onClick={() => onSelectConversation(chat)}
                    />
                )
            })}

            {filteredConversations.length === 0 && (
                <div className='text-center text-secondary text-sm mt-10'>
                    No {tabValue === 0 ? "chats" : "groups"} found.
                </div>
            )}
        </div>
    );
}

export default SidebarConversations;
