import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Check } from 'lucide-react'
import CardDetail from './CardDetail'
import useBoardStore from '../../store/useBoardStore'

export default function Card({ id, listId, isOverlay = false }) {
  const card = useBoardStore((s) => s.cards[id])
  const labels = useBoardStore((s) => s.labels)
  const showLabelText = useBoardStore((s) => s.showLabelText)
  const toggleLabelText = useBoardStore((s) => s.toggleLabelText)
  const toggleCardComplete = useBoardStore((s) => s.toggleCardComplete)
  const [detailOpen, setDetailOpen] = useState(false)

  const cardLabels = (card?.labelIds ?? []).map((lid) => labels[lid]).filter(Boolean)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, data: { type: 'card' } })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
    opacity: isDragging ? 0.4 : 1,
  }

  if (!card) return null

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={() => { if (!isOverlay) setDetailOpen(true) }}
        className={`group bg-white rounded-lg shadow-sm px-3 py-2 mx-2 mb-1.5 select-none
          ${isOverlay
            ? 'shadow-lg rotate-2 opacity-90 cursor-grabbing'
            : 'hover:bg-gray-50 cursor-grab active:cursor-grabbing'}`}
      >
        {cardLabels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-1.5">
            {cardLabels.map((label) => (
              <span
                key={label.id}
                title={label.name || undefined}
                onClick={(e) => { e.stopPropagation(); toggleLabelText() }}
                className={`block rounded-full cursor-pointer transition-all duration-150 ${
                  showLabelText
                    ? 'h-4 px-2 text-[10px] font-medium text-white leading-4 max-w-[120px] truncate'
                    : 'h-2 w-10'
                }`}
                style={{ backgroundColor: label.color }}
              >
                {showLabelText ? (label.name || '') : null}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-start">
          <div className={`shrink-0 overflow-hidden transition-[width] duration-150 ${card.completed ? 'w-5' : 'w-0 group-hover:w-5'}`}>
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); if (!isOverlay) toggleCardComplete(id) }}
              className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors duration-150
                ${card.completed
                  ? 'bg-green-500 border-green-500'
                  : 'border-gray-300 hover:border-green-500'}`}
            >
              {card.completed && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
            </button>
          </div>
          <p className={`text-sm break-words leading-snug min-w-0 flex-1 ${card.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
            {card.title}
          </p>
        </div>
        {card.description && (
          <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-snug">{card.description}</p>
        )}
      </div>

      {detailOpen && (
        <CardDetail cardId={id} listId={listId} onClose={() => setDetailOpen(false)} />
      )}
    </>
  )
}
