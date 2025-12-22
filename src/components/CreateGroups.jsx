import { useState } from 'react'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'

function CreateGroups({ open, onClose, onCreate }) {
  const [groupName, setGroupName] = useState('')

  if (!open) return null

  const handleCreate = () => {
    if (!groupName.trim()) return
    onCreate(groupName)
    setGroupName('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div className="
        relative
        bg-panel
        rounded-2xl
        shadow-xl
        w-[320px]
        p-5
        z-10
        transition-colors
      ">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg text-primary">Create Group</h2>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>

        <div className="flex items-center bg-input rounded-xl px-3 py-2 border border-subtle">
          <input
            type="text"
            placeholder="Group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="flex-1 bg-transparent outline-none text-primary placeholder:text-secondary"
          />

          <IconButton
            onClick={handleCreate}
            disabled={!groupName.trim()}
          >
            <CheckIcon className="text-green-600" />
          </IconButton>
        </div>
      </div>
    </div>
  )
}

export default CreateGroups
