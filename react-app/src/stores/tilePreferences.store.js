import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useTilePreferencesStore = create(
  persist(
    (set) => ({
      tileOrder: [],
      hiddenTileIds: [],
      syncTiles: (tileIds) =>
        set((state) => {
          const knownOrder = state.tileOrder.filter((id) => tileIds.includes(id))
          const newIds = tileIds.filter((id) => !knownOrder.includes(id))
          const nextOrder = [...knownOrder, ...newIds]
          const nextHidden = state.hiddenTileIds.filter((id) => tileIds.includes(id))

          return {
            tileOrder: nextOrder,
            hiddenTileIds: nextHidden,
          }
        }),
      moveUpTile: (id) =>
        set((state) => {
          const index = state.tileOrder.findIndex((tileId) => tileId === id)
          if (index <= 0) return {}

          const nextOrder = [...state.tileOrder]
          ;[nextOrder[index - 1], nextOrder[index]] = [nextOrder[index], nextOrder[index - 1]]

          return { tileOrder: nextOrder }
        }),
      moveDownTile: (id) =>
        set((state) => {
          const index = state.tileOrder.findIndex((tileId) => tileId === id)
          if (index < 0 || index >= state.tileOrder.length - 1) return {}

          const nextOrder = [...state.tileOrder]
          ;[nextOrder[index + 1], nextOrder[index]] = [nextOrder[index], nextOrder[index + 1]]

          return { tileOrder: nextOrder }
        }),
      toggleTileVisibility: (id) =>
        set((state) => {
          if (state.hiddenTileIds.includes(id)) {
            return { hiddenTileIds: state.hiddenTileIds.filter((tileId) => tileId !== id) }
          }
          return { hiddenTileIds: [...state.hiddenTileIds, id] }
        }),
    }),
    {
      name: 'tile-preferences',
    },
  ),
)

export default useTilePreferencesStore
