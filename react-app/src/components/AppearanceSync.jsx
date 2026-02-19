import { useEffect } from 'react'

import useAppearanceStore from '../stores/appearance.store'

export default function AppearanceSync() {
  const { theme, themeOptions, font, fontOptions } = useAppearanceStore()

  useEffect(() => {
    const selectedTheme = themeOptions.find((option) => option.id === theme)
    if (!selectedTheme) return

    Object.entries(selectedTheme.vars).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value)
    })
  }, [theme, themeOptions])

  useEffect(() => {
    const selectedFont = fontOptions.find((option) => option.id === font)
    if (!selectedFont) return

    document.documentElement.style.setProperty('--font-ui', selectedFont.css)
  }, [font, fontOptions])

  return null
}
