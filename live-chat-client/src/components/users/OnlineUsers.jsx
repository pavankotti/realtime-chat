function OnlineUsers({ users, onUserClick }) {
  return (
    <div className="bg-panel rounded-2xl shadow p-3 overflow-hidden transition-colors">

      <p className="text-xs text-secondary mb-2">Online</p>

      <div className="flex gap-4 overflow-x-auto no-scrollbar max-w-full">

        {users.map((user, index) => (
          <div
            onClick={() => onUserClick(user)}
            key={user._id || user.id || index}
            className="flex flex-col items-center min-w-16 shrink-0"
          >
            <div className="relative cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center font-semibold text-white">
                {user.name.charAt(0)}
              </div>

              <span className="
                absolute bottom-0 right-0
                w-3 h-3
                bg-green-500
                border-2 border-panel
                rounded-full
                transition-colors
              " />
            </div>

            <p className="text-xs mt-1 truncate max-w-14 text-primary">
              {user.name}
            </p>
          </div>
        ))}

      </div>
    </div>
  )
}

export default OnlineUsers
