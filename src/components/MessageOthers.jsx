function MessageOthers({ name, text, time }) {
  return (
    <div className="flex justify-start w-full mb-3">

      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-white mr-2">
        {name.charAt(0)}
      </div>

      <div className="
        bg-panel-hover
        px-4 py-2
        rounded-2xl rounded-tl-sm
        max-w-[65%]
        shadow-sm
        transition-colors
      ">
        <p className="text-sm font-semibold text-primary">
          {name}
        </p>

        <p className="text-sm text-primary">
          {text}
        </p>

        <p className="text-[11px] text-secondary text-right mt-1">
          {time}
        </p>
      </div>

    </div>
  )
}

export default MessageOthers
