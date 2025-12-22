import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'
import SendIcon from '@mui/icons-material/Send';
import MessageSelf from './MessageSelf';
import MessageOthers from './MessageOthers';
import Welcome from './Welcome';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function ChatArea({ conversation, onBack }) {
  if (!conversation) {
    return (
      <Welcome />
    )
  }

  return (
    <div className="flex flex-col flex-1 gap-4 h-full">

      <div className="bg-panel rounded-2xl shadow p-2.5 flex items-center transition-colors">
        <div className="md:hidden mr-2">
          <IconButton onClick={onBack}>
            <ArrowBackIcon />
          </IconButton>
        </div>

        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-semibold text-white">
          {conversation.name.charAt(0)}
        </div>

        <div className="ml-3 flex-1">
          <p className="font-semibold text-primary">{conversation.name}</p>
          <p className="text-sm text-secondary">Online</p>
        </div>

        <IconButton>
          <DeleteIcon />
        </IconButton>
      </div>

      <div className="bg-panel rounded-2xl shadow p-4 flex-1 flex flex-col gap-4 overflow-y-auto no-scrollbar transition-colors">
        <MessageOthers
          name="RandomUser"
          text="This is a Sample Message"
          time="12:00am"
        />

        <MessageSelf
          text="This is a Sample Message"
          time="12:01am"
        />

        <MessageOthers
          name="RandomUser"
          text="This is another Sample Message"
          time="12:02am"
        />
        <MessageSelf
          text="This is a Sample Message"
          time="12:01am"
        />

        <MessageOthers
          name="RandomUser"
          text="This is another Sample Message"
          time="12:02am"
        /><MessageSelf
          text="This is a Sample Message"
          time="12:01am"
        />

        <MessageOthers
          name="RandomUser"
          text="This is another Sample Message"
          time="12:02am"
        />
      </div>

      <div className="flex items-center bg-panel rounded-2xl shadow p-3 transition-colors">
        <input
          placeholder="Type here..."
          className="ml-2 w-full outline-none bg-transparent text-primary placeholder:text-secondary"
        />
        <IconButton>
          <SendIcon />
        </IconButton>
      </div>
    </div>
  )
}

export default ChatArea
