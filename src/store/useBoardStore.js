import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { arrayMove } from '@dnd-kit/sortable'
import { generateId } from '../utils/id'

const useBoardStore = create(
  persist(
    (set, get) => ({
      lists: [],
      cards: {},
      listOrder: [],

      addList: (title) => {
        const id = generateId()
        const now = Date.now()
        set((state) => ({
          lists: [...state.lists, { id, title, cardIds: [], createdAt: now }],
          listOrder: [...state.listOrder, id],
        }))
      },

      renameList: (listId, title) => {
        set((state) => ({
          lists: state.lists.map((l) => (l.id === listId ? { ...l, title } : l)),
        }))
      },

      deleteList: (listId) => {
        set((state) => {
          const list = state.lists.find((l) => l.id === listId)
          if (!list) return state
          const newCards = { ...state.cards }
          list.cardIds.forEach((cid) => delete newCards[cid])
          return {
            lists: state.lists.filter((l) => l.id !== listId),
            listOrder: state.listOrder.filter((id) => id !== listId),
            cards: newCards,
          }
        })
      },

      addCard: (listId, title) => {
        const id = generateId()
        const now = Date.now()
        set((state) => ({
          cards: { ...state.cards, [id]: { id, title, description: '', createdAt: now, updatedAt: now } },
          lists: state.lists.map((l) =>
            l.id === listId ? { ...l, cardIds: [...l.cardIds, id] } : l
          ),
        }))
      },

      updateCard: (cardId, updates) => {
        set((state) => ({
          cards: {
            ...state.cards,
            [cardId]: { ...state.cards[cardId], ...updates, updatedAt: Date.now() },
          },
        }))
      },

      deleteCard: (listId, cardId) => {
        set((state) => {
          const newCards = { ...state.cards }
          delete newCards[cardId]
          return {
            cards: newCards,
            lists: state.lists.map((l) =>
              l.id === listId ? { ...l, cardIds: l.cardIds.filter((id) => id !== cardId) } : l
            ),
          }
        })
      },

      moveCardWithinList: (listId, fromIndex, toIndex) => {
        set((state) => ({
          lists: state.lists.map((l) =>
            l.id === listId ? { ...l, cardIds: arrayMove(l.cardIds, fromIndex, toIndex) } : l
          ),
        }))
      },

      moveCardBetweenLists: (cardId, fromListId, toListId, toIndex) => {
        set((state) => {
          const fromList = state.lists.find((l) => l.id === fromListId)
          const toList = state.lists.find((l) => l.id === toListId)
          if (!fromList || !toList) return state

          const newFromCardIds = fromList.cardIds.filter((id) => id !== cardId)
          const newToCardIds = toList.cardIds.filter((id) => id !== cardId)
          newToCardIds.splice(toIndex, 0, cardId)

          return {
            lists: state.lists.map((l) => {
              if (l.id === fromListId) return { ...l, cardIds: newFromCardIds }
              if (l.id === toListId) return { ...l, cardIds: newToCardIds }
              return l
            }),
          }
        })
      },

      moveList: (fromIndex, toIndex) => {
        set((state) => ({
          listOrder: arrayMove(state.listOrder, fromIndex, toIndex),
        }))
      },
    }),
    {
      name: 'trello-board-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        lists: state.lists,
        cards: state.cards,
        listOrder: state.listOrder,
      }),
    }
  )
)

export default useBoardStore
