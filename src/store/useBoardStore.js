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
      labels: {},
      showLabelText: false,
      toggleLabelText: () => set((state) => ({ showLabelText: !state.showLabelText })),

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

      addLabel: (color, name = '') => {
        const id = generateId()
        set((state) => ({ labels: { ...state.labels, [id]: { id, color, name } } }))
      },

      updateLabel: (labelId, updates) => {
        set((state) => ({
          labels: { ...state.labels, [labelId]: { ...state.labels[labelId], ...updates } },
        }))
      },

      deleteLabel: (labelId) => {
        set((state) => {
          const newLabels = { ...state.labels }
          delete newLabels[labelId]
          const newCards = {}
          for (const [cid, card] of Object.entries(state.cards)) {
            newCards[cid] = card.labelIds?.includes(labelId)
              ? { ...card, labelIds: card.labelIds.filter((id) => id !== labelId) }
              : card
          }
          return { labels: newLabels, cards: newCards }
        })
      },

      toggleCardComplete: (cardId) => {
        set((state) => {
          const card = state.cards[cardId]
          if (!card) return state
          return { cards: { ...state.cards, [cardId]: { ...card, completed: !card.completed, updatedAt: Date.now() } } }
        })
      },

      toggleCardLabel: (cardId, labelId) => {
        set((state) => {
          const card = state.cards[cardId]
          if (!card) return state
          const labelIds = card.labelIds ?? []
          const next = labelIds.includes(labelId)
            ? labelIds.filter((id) => id !== labelId)
            : [...labelIds, labelId]
          return { cards: { ...state.cards, [cardId]: { ...card, labelIds: next } } }
        })
      },

      addCard: (listId, title) => {
        const id = generateId()
        const now = Date.now()
        set((state) => ({
          cards: { ...state.cards, [id]: { id, title, description: '', labelIds: [], createdAt: now, updatedAt: now } },
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
        labels: state.labels,
      }),
    }
  )
)

export default useBoardStore
