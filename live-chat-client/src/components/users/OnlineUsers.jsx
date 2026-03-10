import { getAvatarGradient } from '../../utils/avatarColor';

function OnlineUsers({ users, onUserClick }) {
  return (
    <div className="px-4 py-3 border-b border-border-subtle">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary mb-2">
        Online
      </p>

      {users.length === 0 ? (
        <p className="text-xs text-secondary italic">No one online right now</p>
      ) : (
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {users.map((user, index) => {
            const gradient = getAvatarGradient(user.name || '');
            return (
              <div
                onClick={() => onUserClick(user)}
                key={user._id || user.id || index}
                className="flex flex-col items-center gap-1 cursor-pointer group flex-shrink-0"
              >
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-sm font-bold text-white`}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-panel rounded-full" />
                </div>
                <p className="text-[11px] text-secondary truncate max-w-[40px] group-hover:text-primary transition-colors">
                  {user.name}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  )
}

export default OnlineUsers
