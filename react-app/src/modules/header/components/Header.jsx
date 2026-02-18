import React from 'react'
import '../header.css'

import useQuickLinksStore from '../../../stores/quickLinks.store'

import DateWidget from './DateWidget'
import NotificationPanel from './NotificationPanel'
import SettingsModal from './SettingsModal'
import WeatherWidget from './WeatherWidget'

import useHeaderPanels from '../hooks/useHeaderPanels'
import useMessage from '../hooks/useMessage'
import useNotif from '../hooks/useNotif'

export default function Header() {
  const { showNotif, showMessages, showSettings, openHeaderPanel, toggleHeaderPanel, closePanels } =
    useHeaderPanels()
  const {
    notifications,
    loading: notifLoading,
    error: notifError,
    unreadCount: notifUnreadCount,
    refresh: refreshNotifs,
  } = useNotif()
  const {
    messages,
    loading: messageLoading,
    error: messageError,
    unreadCount: messageUnreadCount,
    refresh: refreshMessages,
  } = useMessage()

  React.useEffect(() => {
    if (showNotif) {
      refreshNotifs()
    }
  }, [showNotif, refreshNotifs])

  React.useEffect(() => {
    if (showMessages) {
      refreshMessages()
    }
  }, [showMessages, refreshMessages])

  const { quickLinks } = useQuickLinksStore()

  return (
    <div className="flex flex-row items-center justify-between p-4 border-b w-full">
      <div className="flex flex-row items-center gap-4">
        <WeatherWidget />
        <DateWidget />
      </div>
      <h1 className="header-title">Dashboard</h1>
      <div className="flex flex-col items-end gap-2">
        <small className="text-[9px] text-gray-400 p-1">Quick Links</small>
        <div className="flex flex-row items-center gap-4">
          {quickLinks.map((link) => (
            <div key={link.id} className="quick-link">
              <span className="material-symbols-outlined" aria-hidden>
                {link.icon}
              </span>
              <span className="quick-link__tooltip">{link.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-row items-center gap-1">
        <div
          className="notif-wrapper"
          onMouseEnter={() => openHeaderPanel('notifications')}
          onClick={() => toggleHeaderPanel('notifications')}
        >
          <button className="header-icon-btn notif-btn w-10 h-10" aria-label="Notifications">
            <span className="material-symbols-outlined">notifications</span>
            {notifUnreadCount > 0 && <span className="notif-badge" aria-hidden />}
          </button>
          {showNotif && (
            <NotificationPanel
              title="Notifications"
              items={notifications}
              loading={notifLoading}
              error={notifError}
              onMouseLeave={closePanels}
            />
          )}
        </div>
        <div
          className="notif-wrapper"
          onMouseEnter={() => openHeaderPanel('messages')}
          onClick={() => toggleHeaderPanel('messages')}
        >
          <button className="header-icon-btn notif-btn w-10 h-10" aria-label="Messages">
            <span className="material-symbols-outlined">message</span>
            {messageUnreadCount > 0 && <span className="notif-badge" aria-hidden />}
          </button>
          {showMessages && (
            <NotificationPanel
              title="Messages"
              items={messages}
              loading={messageLoading}
              error={messageError}
              onMouseLeave={closePanels}
            />
          )}
        </div>
        <div className="settings-wrapper" onClick={() => toggleHeaderPanel('settings')}>
          <button className="header-icon-btn w-10 h-10" aria-label="Settings">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
      </div>
      {showSettings && <SettingsModal open={showSettings} onClose={closePanels} />}
    </div>
  )
}
