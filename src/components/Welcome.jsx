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
      <img src="/live-chat.png" className="w-65 mb-6" />

      <p className="text-secondary text-sm text-center max-w-sm">
        View and text directly to people present in the chat Rooms.
      </p>


    </div>
  )
}

export default Welcome