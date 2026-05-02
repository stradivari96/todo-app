import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Plus } from 'lucide-react'
import ListHeader from './ListHeader'
import Card from '../Card/Card'
import CardEditor from '../Card/CardEditor'
import useBoardStore from '../../store/useBoardStore'

export default function List({ listId }) {
  const list = useBoardStore((s) => s.lists.find((l) => l.id === listId))
  const addCard = useBoardStore((s) => s.addCard)
  const [addingCard, setAddingCard] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: listId, data: { type: 'list' } })

  const { setNodeRef: setDropRef } = useDroppable({ id: listId })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  if (!list) return null

  const setRef = (el) => {
    setSortableRef(el)
    setDropRef(el)
  }

  return (
    <div
      ref={setRef}
      style={style}
      className="flex flex-col bg-[#ebecf0] rounded-xl w-64 shrink-0 max-h-[calc(100vh-8rem)] shadow"
    >
      <ListHeader
        list={list}
        dragHandleProps={{ ...attributes, ...listeners }}
      />

      <div className="flex-1 overflow-y-auto py-1 min-h-[8px]">
        <SortableContext items={list.cardIds} strategy={verticalListSortingStrategy}>
          {list.cardIds.map((cardId) => (
            <Card key={cardId} id={cardId} listId={listId} />
          ))}
        </SortableContext>
      </div>

      <div className="px-2 pb-2 pt-1">
        {addingCard ? (
          <CardEditor
            onSave={(title) => { addCard(listId, title); setAddingCard(false) }}
            onCancel={() => setAddingCard(false)}
            placeholder="Enter a title for this card…"
          />
        ) : (
          <button
            type="button"
            onClick={() => setAddingCard(true)}
            className="flex items-center gap-1.5 w-full rounded px-2 py-1.5 text-sm text-gray-600 hover:bg-black/10 transition-colors cursor-pointer"
          >
            <Plus size={14} />
            Add a card
          </button>
        )}
      </div>
    </div>
  )
}
