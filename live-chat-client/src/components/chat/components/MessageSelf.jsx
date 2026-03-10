function MessageSelf({ text, time }) {
  return (
    <div className="animate-msg flex justify-end px-4 mb-1">
      <div className="max-w-[70%] bg-msg-self text-msg-self-text rounded-2xl rounded-br-sm px-4 py-2.5 shadow-sm">
        <p className="text-sm leading-relaxed">{text}</p>
        <p className="text-[11px] opacity-70 text-right mt-1">{time}</p>
      </div>
    </div>
  )
}

export default MessageSelf
