import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import List from '../List/List'
import Card from '../Card/Card'
import useBoardStore from '../../store/useBoardStore'

export default function Board() {
  const listOrder = useBoardStore((s) => s.listOrder)
  const lists = useBoardStore((s) => s.lists)
  const cards = useBoardStore((s) => s.cards)
  const addList = useBoardStore((s) => s.addList)
  const moveCardWithinList = useBoardStore((s) => s.moveCardWithinList)
  const moveCardBetweenLists = useBoardStore((s) => s.moveCardBetweenLists)
  const moveList = useBoardStore((s) => s.moveList)

  const [activeItem, setActiveItem] = useState(null)
  const [addingList, setAddingList] = useState(false)
  const [newListTitle, setNewListTitle] = useState('')

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const getListForCard = (cardId) => lists.find((l) => l.cardIds.includes(cardId))

  const handleDragStart = ({ active }) => {
    const isCard = cards[active.id] !== undefined
    setActiveItem({ id: active.id, type: isCard ? 'card' : 'list' })
  }

  const handleDragOver = ({ active, over }) => {
    if (!over) return
    if (activeItem?.type !== 'card') return

    const activeListId = getListForCard(active.id)?.id
    if (!activeListId) return

    const overList = lists.find((l) => l.id === over.id) ?? getListForCard(over.id)
    if (!overList || overList.id === activeListId) return

    const toIndex = overList.cardIds.includes(over.id)
      ? overList.cardIds.indexOf(over.id)
      : overList.cardIds.length

    moveCardBetweenLists(active.id, activeListId, overList.id, toIndex)
  }

  const handleDragEnd = ({ active, over }) => {
    setActiveItem(null)
    if (!over || active.id === over.id) return

    if (activeItem?.type === 'list') {
      const fromIndex = listOrder.indexOf(active.id)
      const toIndex = listOrder.indexOf(over.id)
      if (fromIndex !== -1 && toIndex !== -1) moveList(fromIndex, toIndex)
      return
    }

    if (activeItem?.type === 'card') {
      const activeList = getListForCard(active.id)
      const overList = lists.find((l) => l.id === over.id) ?? getListForCard(over.id)
      if (!activeList || !overList) return

      if (activeList.id === overList.id) {
        const fromIndex = activeList.cardIds.indexOf(active.id)
        const toIndex = activeList.cardIds.indexOf(over.id)
        if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
          moveCardWithinList(activeList.id, fromIndex, toIndex)
        }
      }
    }
  }

  const handleAddList = () => {
    const trimmed = newListTitle.trim()
    if (trimmed) {
      addList(trimmed)
      setNewListTitle('')
      setAddingList(false)
    }
  }

  const activeCard = activeItem?.type === 'card' ? cards[activeItem.id] : null
  const activeCardListId = activeCard ? getListForCard(activeItem.id)?.id : null

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex items-start gap-3 p-4 overflow-x-auto min-h-full pb-6">
        <SortableContext items={listOrder} strategy={horizontalListSortingStrategy}>
          {listOrder.map((listId) => (
            <List key={listId} listId={listId} />
          ))}
        </SortableContext>

        <div className="shrink-0 w-64">
          {addingList ? (
            <div className="bg-[#ebecf0] rounded-xl p-2 flex flex-col gap-2 shadow">
              <input
                autoFocus
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddList()
                  if (e.key === 'Escape') { setAddingList(false); setNewListTitle('') }
                }}
                placeholder="Enter list title…"
                className="rounded px-2 py-1.5 text-sm text-gray-800 bg-white outline-none focus:ring-2 focus:ring-blue-400 shadow"
              />
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleAddList}
                  disabled={!newListTitle.trim()}
                  className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Add list
                </button>
                <button
                  type="button"
                  onClick={() => { setAddingList(false); setNewListTitle('') }}
                  className="px-2 py-1.5 rounded hover:bg-black/10 text-gray-600 text-sm transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setAddingList(true)}
              className="flex items-center gap-2 w-full rounded-xl px-3 py-2.5 bg-white/20 hover:bg-white/30 text-white text-sm font-medium transition-colors cursor-pointer"
            >
              <Plus size={16} />
              Add another list
            </button>
          )}
        </div>
      </div>

      <DragOverlay>
        {activeCard && activeCardListId ? (
          <Card id={activeItem.id} listId={activeCardListId} isOverlay />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
