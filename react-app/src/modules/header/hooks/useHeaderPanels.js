import React from 'react'

export default function useHeaderPanels() {
  const [activePanel, setActivePanel] = React.useState(null)

  const showNotif = activePanel === 'notifications'
  const showMessages = activePanel === 'messages'

  function closePanels() {
    setActivePanel(null)
  }

  function openHeaderPanel(panel) {
    if (panel !== 'notifications' && panel !== 'messages') return
    setActivePanel(panel)
  }

  function toggleHeaderPanel(panel) {
    if (panel !== 'notifications' && panel !== 'messages') {
      closePanels()
      return
    }
    setActivePanel((prev) => (prev === panel ? null : panel))
  }

  return { activePanel, showNotif, showMessages, openHeaderPanel, toggleHeaderPanel, closePanels }
}
