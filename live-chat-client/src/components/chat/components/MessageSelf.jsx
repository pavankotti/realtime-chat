function MessageSelf({ text, time }) {
  return (
    <div className="flex justify-end w-full mb-3">
      
      <div className="
        bg-green-400
        px-4 py-2
        rounded-2xl rounded-tr-sm
        max-w-[65%]
        shadow-sm
      ">
        <p className="text-sm text-white">
          {text}
        </p>

        <p className="text-[11px] text-white/80 text-right mt-1">
          {time}
        </p>
      </div>

    </div>
  )
}

export default MessageSelf
