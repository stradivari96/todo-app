import { useState } from 'react'
import { Check, Plus, Trash2 } from 'lucide-react'
import useBoardStore from '../../store/useBoardStore'

const PALETTE = [
  { color: '#ef4444', name: 'Red' },
  { color: '#f97316', name: 'Orange' },
  { color: '#eab308', name: 'Yellow' },
  { color: '#22c55e', name: 'Green' },
  { color: '#14b8a6', name: 'Teal' },
  { color: '#3b82f6', name: 'Blue' },
  { color: '#8b5cf6', name: 'Purple' },
  { color: '#ec4899', name: 'Pink' },
  { color: '#6b7280', name: 'Gray' },
]

export default function LabelPicker({ cardId }) {
  const labels = useBoardStore((s) => s.labels)
  const card = useBoardStore((s) => s.cards[cardId])
  const addLabel = useBoardStore((s) => s.addLabel)
  const updateLabel = useBoardStore((s) => s.updateLabel)
  const deleteLabel = useBoardStore((s) => s.deleteLabel)
  const toggleCardLabel = useBoardStore((s) => s.toggleCardLabel)

  const [creating, setCreating] = useState(false)
  const [newColor, setNewColor] = useState(PALETTE[0].color)
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')

  const cardLabelIds = card?.labelIds ?? []
  const labelList = Object.values(labels)

  const handleCreate = () => {
    if (!newName.trim() && !newColor) return
    addLabel(newColor, newName.trim())
    setNewName('')
    setNewColor(PALETTE[0].color)
    setCreating(false)
  }

  const startEdit = (label) => {
    setEditingId(label.id)
    setEditName(label.name)
  }

  const commitEdit = (labelId) => {
    updateLabel(labelId, { name: editName })
    setEditingId(null)
  }

  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Labels</p>

      <div className="flex flex-wrap gap-1.5">
        {labelList.map((label) => {
          const active = cardLabelIds.includes(label.id)
          return (
            <div key={label.id} className="relative group/label">
              {editingId === label.id ? (
                <input
                  autoFocus
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={() => commitEdit(label.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') commitEdit(label.id)
                    if (e.key === 'Escape') setEditingId(null)
                  }}
                  className="w-28 text-xs rounded-full px-3 py-1 border border-gray-300 outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Label name"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => toggleCardLabel(cardId, label.id)}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-white hover:brightness-95 transition-all cursor-pointer"
                  style={{ backgroundColor: label.color }}
                >
                  {label.name || <span className="opacity-60 italic">Unnamed</span>}
                  {active && <Check size={11} className="text-white shrink-0" />}
                </button>
              )}

              <div className="absolute -top-1.5 -right-1.5 hidden group-hover/label:flex gap-0.5">
                <button
                  type="button"
                  onClick={() => startEdit(label)}
                  className="w-4 h-4 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-gray-600 flex items-center justify-center shadow-sm cursor-pointer text-[9px] font-bold leading-none"
                >
                  ✎
                </button>
                <button
                  type="button"
                  onClick={() => deleteLabel(label.id)}
                  className="w-4 h-4 rounded-full bg-white border border-gray-200 text-gray-300 hover:text-red-400 flex items-center justify-center shadow-sm cursor-pointer"
                >
                  <Trash2 size={9} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {creating ? (
        <div className="mt-2 flex flex-col gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex flex-wrap gap-1.5">
            {PALETTE.map((p) => (
              <button
                key={p.color}
                type="button"
                onClick={() => setNewColor(p.color)}
                title={p.name}
                className="w-6 h-6 rounded-full transition-transform cursor-pointer"
                style={{
                  backgroundColor: p.color,
                  outline: newColor === p.color ? `2px solid ${p.color}` : 'none',
                  outlineOffset: '2px',
                }}
              />
            ))}
          </div>
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreate()
              if (e.key === 'Escape') setCreating(false)
            }}
            placeholder="Label name (optional)"
            className="text-sm rounded px-2 py-1.5 border border-gray-300 outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="flex gap-1">
            <button
              type="button"
              onClick={handleCreate}
              className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium cursor-pointer transition-colors"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setCreating(false)}
              className="px-3 py-1 rounded hover:bg-gray-200 text-gray-600 text-xs cursor-pointer transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="mt-2 flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
        >
          <Plus size={13} />
          Create label
        </button>
      )}
    </div>
  )
}
