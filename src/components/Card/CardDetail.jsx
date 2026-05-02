import { useState, useRef, useEffect } from 'react'
import { X, Trash2 } from 'lucide-react'
import useBoardStore from '../../store/useBoardStore'

export default function CardDetail({ cardId, listId, onClose }) {
  const card = useBoardStore((s) => s.cards[cardId])
  const updateCard = useBoardStore((s) => s.updateCard)
  const deleteCard = useBoardStore((s) => s.deleteCard)

  const [title, setTitle] = useState(card?.title ?? '')
  const [description, setDescription] = useState(card?.description ?? '')
  const titleRef = useRef(null)

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  if (!card) return null

  const handleTitleBlur = () => {
    const trimmed = title.trim()
    if (trimmed && trimmed !== card.title) updateCard(cardId, { title: trimmed })
    else setTitle(card.title)
  }

  const handleDescriptionBlur = () => {
    if (description !== card.description) updateCard(cardId, { description })
  }

  const handleDelete = () => {
    deleteCard(listId, cardId)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/50"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="flex items-start justify-between px-5 pt-5 pb-2 gap-3">
          <input
            ref={titleRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={(e) => { if (e.key === 'Enter') titleRef.current?.blur() }}
            className="flex-1 text-lg font-semibold text-gray-800 bg-transparent rounded px-1 -mx-1 outline-none hover:bg-gray-100 focus:bg-gray-100 focus:ring-2 focus:ring-blue-400 leading-snug"
          />
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer mt-0.5"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 pb-5">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 mt-3">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleDescriptionBlur}
            placeholder="Add a more detailed description…"
            rows={5}
            className="w-full rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 focus:bg-white outline-none focus:ring-2 focus:ring-blue-400 resize-none transition-colors"
          />

          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <Trash2 size={14} />
              Delete card
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
