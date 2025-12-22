import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import IconButton from '@mui/material/IconButton'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode';
import SearchIcon from '@mui/icons-material/Search'
import ConversationItem from './ConversationItem'
import OnlineUsers from './OnlineUsers'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../features/themeSlice'

function Sidebar({ conversations, onSelectConversation, activeConversation, onCreateGroup }) {

  const lightTheme = useSelector(state => state.themeToggle.isLight)
  const dispatch = useDispatch()

  const onlineUsers = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' },
    { id: 4, name: 'David' },
    { id: 5, name: 'Eva' },
    { id: 6, name: 'Alice' },
    { id: 7, name: 'Bob' },
    { id: 8, name: 'Charlie' },
    { id: 9, name: 'David' },
    { id: 10, name: 'Eva' },
  ]

  const handleOnlineUserClick = (user) => {
    const existing = conversations.find(
      c => !c.isGroup && c.name === user.name
    )

    if (existing) {
      onSelectConversation(existing)
    } else {
      const newConversation = {
        id: Date.now(),
        name: user.name,
        lastMessage: '',
        timestamp: 'now',
        isGroup: false
      }

      onSelectConversation(newConversation)
    }
  }


  return (
    <div className="flex flex-col flex-1 gap-4 overflow-hidden h-full">

      <div className="hidden md:flex bg-panel rounded-2xl shadow p-3 justify-between items-center transition-colors">
        <IconButton>
          <AccountCircleIcon />
        </IconButton>
        <div className="flex gap-1">
          <IconButton onClick={() => { }}>
            <PersonAddIcon />
          </IconButton>
          <IconButton onClick={() => { }}>
            <GroupAddIcon />
          </IconButton>
          <IconButton onClick={onCreateGroup}>
            <AddCircleIcon />
          </IconButton>
          <IconButton onClick={() => dispatch(toggleTheme())}>
            {lightTheme && <DarkModeIcon />}
            {!lightTheme && <LightModeIcon />}
          </IconButton>
        </div>
      </div>

      <div className="bg-panel rounded-2xl shadow p-3 flex items-center transition-colors">
        <SearchIcon />
        <input
          placeholder="Search"
          className="ml-2 w-full outline-none bg-transparent text-primary placeholder:text-secondary"
        />
      </div>

      <OnlineUsers users={onlineUsers} onUserClick={handleOnlineUserClick} />

      <div className="bg-panel rounded-2xl shadow p-2 flex-1 overflow-y-auto no-scrollbar transition-colors">
        {conversations.map((c) => (
          <ConversationItem
            key={c.id}
            {...c}
            isActive={activeConversation?.id === c.id}
            onClick={() => onSelectConversation(c)}
          />
        ))}
      </div>

    </div>
  )
}

export default Sidebar
