function ConversationItem({
  name,
  lastMessage,
  timestamp,
  onClick,
  isActive,
  unread
}) {
  return (
    <div
      onClick={onClick}
      className={`
        grid grid-cols-[32px_minmax(0,1fr)_auto]
        grid-rows-[auto_auto]
        gap-x-3 gap-y-1
        p-3
        rounded-xl
        cursor-pointer
        transition-colors
        ${isActive ? 'bg-panel-active' : 'hover:bg-panel-hover'}
      `}
    >
      <div className="row-span-2 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center font-semibold text-white">
        {name ? name.charAt(0).toUpperCase() : "?"}
      </div>

      <p className={`truncate text-primary ${unread ? 'font-black' : 'font-semibold'}`}>
        {name}
      </p>

      <p className={`text-[10px] justify-self-end whitespace-nowrap ${unread ? 'text-green-600 font-bold' : 'text-secondary'}`}>
        {timestamp}
      </p>

      <p className={`col-start-2 col-end-4 text-sm truncate ${unread ? 'font-bold text-primary' : 'text-secondary'}`}>
        {lastMessage}
      </p>
    </div>
  )
}

export default ConversationItem
