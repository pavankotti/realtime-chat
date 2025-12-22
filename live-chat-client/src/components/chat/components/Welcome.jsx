import React from 'react'
import { useSelector } from 'react-redux'

function Welcome() {
  const isLight = useSelector(state => state.themeToggle.isLight)
  // console.log(isLight)
  return (
    <div className="
      flex flex-col flex-1
      items-center justify-center
      bg-panel 
      rounded-2xl
      shadow
      transition-colors
    ">
      <img src="/live-chat.png" alt="Welcome" className="w-72 mb-8 opacity-90 transition-opacity hover:opacity-100" />

      <h2 className="text-2xl font-bold text-primary mb-2">Welcome to Live Chat</h2>
      <p className="text-secondary text-base text-center max-w-md px-4 leading-relaxed">
        Select a conversation from the sidebar to start chatting, or create a new group to hang out with friends.
      </p>
    </div>
  )
}

export default Welcome