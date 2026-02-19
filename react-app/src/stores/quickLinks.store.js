import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const defaultQuickLinks = [
  { id: 1, name: 'Profile', icon: 'account_circle', url: '/profile' },
  { id: 2, name: 'Help', icon: 'help', url: '/help' },
  { id: 3, name: 'Report', icon: 'report', url: '/report' },
  { id: 4, name: 'Logout', icon: 'logout', url: '/logout' },
]

const listIcons = [
  'dashboard',
  'analytics',
  'settings',
  'account_circle',
  'help',
  'report',
  'logout',
  'home',
  'work',
  'school',
  'shopping_cart',
  'favorite',
  'web',
]

const useQuickLinksStore = create(
  persist(
    (set) => ({
      quickLinks: defaultQuickLinks,
      listIcons: listIcons,
      addQuickLink: (link) => set((state) => ({ quickLinks: [...state.quickLinks, link] })),
      moveUpQuickLink: (id) =>
        set((state) => {
          const index = state.quickLinks.findIndex((link) => link.id === id)
          if (index > 0) {
            const newQuickLinks = [...state.quickLinks]
            ;[newQuickLinks[index - 1], newQuickLinks[index]] = [
              newQuickLinks[index],
              newQuickLinks[index - 1],
            ]
            return { quickLinks: newQuickLinks }
          }
          return {}
        }),
      moveDownQuickLink: (id) =>
        set((state) => {
          const index = state.quickLinks.findIndex((link) => link.id === id)
          if (index < state.quickLinks.length - 1) {
            const newQuickLinks = [...state.quickLinks]
            ;[newQuickLinks[index + 1], newQuickLinks[index]] = [
              newQuickLinks[index],
              newQuickLinks[index + 1],
            ]
            return { quickLinks: newQuickLinks }
          }
          return {}
        }),
      removeQuickLink: (id) =>
        set((state) => ({
          quickLinks: state.quickLinks.filter((link) => link.id !== id),
        })),
    }),
    {
      name: 'quick-links',
    },
  ),
)

export default useQuickLinksStore
