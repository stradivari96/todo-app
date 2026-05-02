import { useState, useEffect, useRef } from 'react'
import Button from '../ui/Button'

export default function CardEditor({ initialValue = '', onSave, onCancel, placeholder = 'Enter a title…' }) {
  const [value, setValue] = useState(initialValue)
  const textareaRef = useRef(null)

  useEffect(() => {
    textareaRef.current?.focus()
    textareaRef.current?.select()
  }, [])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    }
    if (e.key === 'Escape') {
      onCancel()
    }
  }

  const handleSave = () => {
    const trimmed = value.trim()
    if (trimmed) onSave(trimmed)
  }

  return (
    <div className="flex flex-col gap-2">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleSave}
        placeholder={placeholder}
        rows={3}
        className="w-full rounded px-2 py-1.5 text-sm text-gray-800 bg-white shadow resize-none outline-none focus:ring-2 focus:ring-blue-400"
      />
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={handleSave}
          disabled={!value.trim()}
          className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          Save
        </button>
        <Button variant="ghost" onClick={onCancel} className="text-gray-600">
          Cancel
        </Button>
      </div>
    </div>
  )
}
