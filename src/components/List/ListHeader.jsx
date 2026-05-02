import { useState, useRef, useEffect } from 'react'
import { Trash2 } from 'lucide-react'
import IconButton from '../ui/IconButton'
import useBoardStore from '../../store/useBoardStore'

export default function ListHeader({ list, dragHandleProps }) {
  const renameList = useBoardStore((s) => s.renameList)
  const deleteList = useBoardStore((s) => s.deleteList)
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(list.title)
  const inputRef = useRef(null)

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [editing])

  const handleBlur = () => {
    const trimmed = title.trim()
    if (trimmed && trimmed !== list.title) renameList(list.id, trimmed)
    else setTitle(list.title)
    setEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') inputRef.current?.blur()
    if (e.key === 'Escape') { setTitle(list.title); setEditing(false) }
  }

  return (
    <div className="flex items-center justify-between px-2 pt-2 pb-1 group/header">
      <div
        {...dragHandleProps}
        className="flex-1 cursor-grab active:cursor-grabbing"
      >
        {editing ? (
          <input
            ref={inputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-full rounded px-1 py-0.5 text-sm font-semibold text-gray-800 bg-white outline-none focus:ring-2 focus:ring-blue-400"
          />
        ) : (
          <h3
            onClick={() => setEditing(true)}
            className="text-sm font-semibold text-gray-800 px-1 py-0.5 rounded hover:bg-black/5 cursor-text truncate"
          >
            {list.title}
          </h3>
        )}
      </div>
      <IconButton
        onClick={() => deleteList(list.id)}
        title="Delete list"
        className="opacity-0 group-hover/header:opacity-100 hover:text-red-500 ml-1 shrink-0"
      >
        <Trash2 size={13} />
      </IconButton>
    </div>
  )
}
