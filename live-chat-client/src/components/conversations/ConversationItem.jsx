import { getAvatarGradient } from '../../utils/avatarColor';

function ConversationItem({
  name,
  lastMessage,
  timestamp,
  onClick,
  isActive,
  unread
}) {
  const gradient = getAvatarGradient(name || '');

  return (
    <div
      onClick={onClick}
      className={`
        animate-slide-in
        flex items-center gap-3 px-4 py-3
        cursor-pointer transition-all duration-200
        border-l-2
        ${isActive
          ? 'bg-accent-light border-l-accent'
          : 'border-l-transparent hover:bg-panel-hover hover:border-l-accent/30'}
      `}
    >
      {/* Avatar */}
      <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center font-semibold text-sm text-white flex-shrink-0`}>
        {name ? name.charAt(0).toUpperCase() : '?'}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <p className={`text-sm truncate ${unread ? 'font-bold text-primary' : 'font-semibold text-primary'}`}>
            {name}
          </p>
          <p className={`text-[11px] flex-shrink-0 ml-2 ${unread ? 'text-accent font-semibold' : 'text-secondary'}`}>
            {timestamp}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className={`text-xs truncate ${unread ? 'font-medium text-primary' : 'text-secondary'}`}>
            {lastMessage}
          </p>
          {unread && (
            <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0 ml-2" />
          )}
        </div>
      </div>
    </div>
  )
}

export default ConversationItem
