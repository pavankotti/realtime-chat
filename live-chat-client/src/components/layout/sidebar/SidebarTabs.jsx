import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';

function SidebarTabs({ tabValue, setTabValue, conversations, checkUnread }) {
    const unreadChats = conversations.filter(c => !c.isGroupChat && checkUnread(c)).length;
    const unreadGroups = conversations.filter(c => c.isGroupChat && checkUnread(c)).length;

    return (
        <div className="flex mx-4 mb-1 bg-panel-hover rounded-xl p-1">
            <button
                onClick={() => setTabValue(0)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    tabValue === 0
                        ? 'bg-panel text-primary shadow-sm'
                        : 'text-secondary hover:text-primary'
                }`}
            >
                <ChatBubbleOutlineIcon sx={{ fontSize: 15 }} />
                Chats
                {unreadChats > 0 && (
                    <span className="bg-red-500 text-white text-[10px] rounded-full px-1.5 leading-tight min-w-[18px] text-center">
                        {unreadChats}
                    </span>
                )}
            </button>
            <button
                onClick={() => setTabValue(1)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    tabValue === 1
                        ? 'bg-panel text-primary shadow-sm'
                        : 'text-secondary hover:text-primary'
                }`}
            >
                <GroupsOutlinedIcon sx={{ fontSize: 15 }} />
                Groups
                {unreadGroups > 0 && (
                    <span className="bg-red-500 text-white text-[10px] rounded-full px-1.5 leading-tight min-w-[18px] text-center">
                        {unreadGroups}
                    </span>
                )}
            </button>
        </div>
    );
}

export default SidebarTabs;
