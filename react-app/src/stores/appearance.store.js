import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const fontOptions = [
  { id: 'inter', label: 'Inter', css: "'Inter', sans-serif" },
  { id: 'jakarta', label: 'Plus Jakarta Sans', css: "'Plus Jakarta Sans', sans-serif" },
  { id: 'manrope', label: 'Manrope', css: "'Manrope', sans-serif" },
  { id: 'space-grotesk', label: 'Space Grotesk', css: "'Space Grotesk', sans-serif" },
]

export default create(
  persist(
    (set) => ({
      theme: 'light',
      font: 'space-grotesk',
      fontOptions: fontOptions,
      setTheme: (theme) => set({ theme }),
      setFont: (font) => set({ font }),
    }),
    {
      name: 'appearance',
    },
  ),
)
