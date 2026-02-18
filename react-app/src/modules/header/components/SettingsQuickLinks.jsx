export default function SettingsQuickLinks() {
  const quickLinks = [
    { id: 1, name: 'Profile', icon: 'account_circle' },
    { id: 2, name: 'Help', icon: 'help' },
    { id: 3, name: 'Report', icon: 'report' },
    { id: 4, name: 'Logout', icon: 'logout' },
  ]

  return (
    <div className="settings-quick-links">
      {quickLinks.map((link) => (
        <div key={link.id} className="settings-quick-link">
          <span className="material-symbols-outlined">{link.icon}</span>
          <span>{link.name}</span>
        </div>
      ))}
    </div>
  )
}
