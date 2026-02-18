import { useEffect } from 'react'

import SettingsQuickLinks from './SettingsQuickLinks'

export default function SettingsModal({ open, onClose }) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return (
    <div className="settings-modal__backdrop" onClick={onClose}>
      <div className="settings-modal__card" onClick={(e) => e.stopPropagation()}>
        <h2 className="settings-modal__title">Settings</h2>
        <div className="settings-modal__content">
          <SettingsQuickLinks />
        </div>
      </div>
    </div>
  )
}
