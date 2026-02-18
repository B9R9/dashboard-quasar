import useQuickLinksStore from '../../../stores/quickLinks.store'

export default function SettingsQuickLinks() {
  const { quickLinks: storeQuickLinks } = useQuickLinksStore()

  return (
    <div className="settings-quick-links">
      {storeQuickLinks.map((link) => (
        <div key={link.id} className="settings-quick-link">
          <span className="material-symbols-outlined">{link.icon}</span>
          <span>{link.name}</span>
        </div>
      ))}
    </div>
  )
}
