import { Tabs, Tab, Badge } from '@mui/material';

function SidebarTabs({ tabValue, setTabValue, conversations, checkUnread }) {
    const unreadChats = conversations.filter(c => !c.isGroupChat && checkUnread(c)).length;
    const unreadGroups = conversations.filter(c => c.isGroupChat && checkUnread(c)).length;

    return (
        <div className="px-2">
            <Tabs
                value={tabValue}
                onChange={(e, val) => setTabValue(val)}
                variant="fullWidth"
                textColor="primary"
                indicatorColor="primary"
                sx={{
                    minHeight: '40px',
                    '& .MuiTab-root': { py: 1, minHeight: '40px', fontWeight: 'bold' }
                }}
            >
                <Tab label={
                    <Badge badgeContent={unreadChats} color="error">
                        <span className="px-2">Chats</span>
                    </Badge>
                } />
                <Tab label={
                    <Badge badgeContent={unreadGroups} color="error">
                        <span className="px-2">Groups</span>
                    </Badge>
                } />
            </Tabs>
        </div>
    );
}

export default SidebarTabs;
