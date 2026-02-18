import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const defaultQuickLinks = [
  { id: 1, name: 'Profile', icon: 'account_circle' },
  { id: 2, name: 'Help', icon: 'help' },
  { id: 3, name: 'Report', icon: 'report' },
  { id: 4, name: 'Logout', icon: 'logout' },
]
const useQuickLinksStore = create(
  persist(
    (set) => ({
      quickLinks: defaultQuickLinks,
      addQuickLink: (link) => set((state) => ({ quickLinks: [...state.quickLinks, link] })),
      removeQuickLink: (index) =>
        set((state) => ({
          quickLinks: state.quickLinks.filter((_, i) => i !== index),
        })),
    }),
    {
      name: 'quick-links',
    },
  ),
)

export default useQuickLinksStore
