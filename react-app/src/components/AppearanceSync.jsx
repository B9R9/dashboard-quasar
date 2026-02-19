import { useEffect } from 'react'

import useAppearanceStore from '../stores/appearance.store'

export default function AppearanceSync() {
  const { font, fontOptions } = useAppearanceStore()

  useEffect(() => {
    const selectedFont = fontOptions.find((option) => option.id === font)
    if (!selectedFont) return

    document.documentElement.style.setProperty('--font-ui', selectedFont.css)
  }, [font, fontOptions])

  return null
}
