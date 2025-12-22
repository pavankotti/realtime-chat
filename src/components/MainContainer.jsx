import Sidebar from './Sidebar'
import ChatArea from './ChatArea'
import { useState } from 'react'
import CreateGroups from './CreateGroups'
import NavigationRail from './NavigationRail'

function MainContainer() {

  const [activeConversation, setActiveConversation] = useState(null)
  const [conversations, setConversations] = useState([
    { id: 1, name: 'User1', lastMessage: '#Test message from User1', timestamp: 'today' },
    { id: 2, name: 'User2', lastMessage: '#Test message from User2', timestamp: 'today' },
    { id: 3, name: 'User3', lastMessage: '#Test message from User3', timestamp: 'today' }
  ])

  const [showCreateGroup, setShowCreateGroup] = useState(false)

  const handleCreateGroup = (groupName) => {
    const newGroup = {
      id: Date.now(),
      name: groupName,
      lastMessage: 'Group created',
      timestamp: 'now',
      isGroup: true
    }

    setConversations(prev => [newGroup, ...prev])
    setActiveConversation(newGroup)
  }

  return (
    <div className='flex gap-4 w-full h-full overflow-hidden'>

      <div className={`flex gap-4 h-full ${activeConversation ? 'hidden md:flex md:w-[35%] lg:w-[30%]' : 'w-full md:w-[35%] lg:w-[30%]'}`}>
        <div className="md:hidden h-full">
          <NavigationRail onCreateGroup={() => setShowCreateGroup(true)} />
        </div>
        <Sidebar
          conversations={conversations}
          onSelectConversation={setActiveConversation}
          activeConversation={activeConversation}
          onCreateGroup={() => setShowCreateGroup(true)}
        />
      </div>

      <div className={`${activeConversation ? 'flex w-full' : 'hidden'} md:flex md:flex-1 h-full`}>
        <ChatArea
          conversation={activeConversation}
          onBack={() => setActiveConversation(null)}
        />
      </div>

      <CreateGroups
        open={showCreateGroup}
        onClose={() => setShowCreateGroup(false)}
        onCreate={handleCreateGroup}
      />
    </div>
  )
}

export default MainContainer
