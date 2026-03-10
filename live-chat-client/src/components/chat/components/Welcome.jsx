import React from 'react'

function Welcome() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-panel gap-5 select-none">
      {/* Decorative background circles */}
      <div className="relative flex items-center justify-center">
        <div className="absolute w-40 h-40 rounded-full bg-accent/5 animate-pulse" />
        <div className="absolute w-24 h-24 rounded-full bg-accent/10" />
        <div className="w-20 h-20 rounded-full bg-accent-light flex items-center justify-center relative z-10">
          <span className="text-5xl leading-none">💬</span>
        </div>
      </div>

      <div className="text-center px-6">
        <h2 className="text-xl font-bold text-primary mb-2">Welcome to LiveChat</h2>
        <p className="text-sm text-secondary text-center max-w-xs leading-relaxed">
          Pick a conversation from the sidebar to start chatting, or search for someone new to connect with.
        </p>
      </div>

      <div className="flex items-center gap-2 mt-1 text-xs text-secondary/60">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        End-to-end messaging
        <span className="w-1 h-1 rounded-full bg-secondary/30" />
        <span className="w-1.5 h-1.5 rounded-full bg-accent/60" />
        Real-time delivery
      </div>
    </div>
  )
}

export default Welcome