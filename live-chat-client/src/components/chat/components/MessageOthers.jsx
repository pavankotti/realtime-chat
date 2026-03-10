import { getAvatarGradient } from '../../../utils/avatarColor';

function MessageOthers({ name, text, time }) {
  const gradient = getAvatarGradient(name || '');

  return (
    <div className="flex justify-start px-4 mb-1 gap-2">
      <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-1`}>
        {name ? name.charAt(0).toUpperCase() : '?'}
      </div>
      <div className="max-w-[70%] bg-msg-other text-msg-other-text rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-sm border border-border-subtle">
        <p className="text-[11px] font-semibold text-accent mb-1">{name}</p>
        <p className="text-sm leading-relaxed">{text}</p>
        <p className="text-[11px] text-secondary mt-1">{time}</p>
      </div>
    </div>
  )
}

export default MessageOthers
