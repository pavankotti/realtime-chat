import React from 'react'

function Welcome() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-panel gap-4">
      <div className="w-20 h-20 rounded-full bg-accent-light flex items-center justify-center">
        <span className="text-4xl">💬</span>
      </div>
      <div className="text-center">
        <h2 className="text-xl font-semibold text-primary mb-2">Welcome to LiveChat</h2>
        <p className="text-sm text-secondary text-center max-w-xs leading-relaxed">
          Select a conversation to start chatting, or search for someone new to connect with.
        </p>
      </div>
    </div>
  )
}

export default Welcome