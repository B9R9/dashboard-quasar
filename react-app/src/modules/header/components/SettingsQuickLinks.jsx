import useQuickLinksStore from '../../../stores/quickLinks.store'

import QuickLinksRow from './QuickLinksRow'

export default function SettingsQuickLinks() {
  const { quickLinks: storeQuickLinks } = useQuickLinksStore()

  return (
    <div className="settings-quick-links">
      <h3 className="settings-quick-links__title">Manage Quick Links</h3>

      {storeQuickLinks.map((link, index) => (
        <QuickLinksRow
          key={link.id}
          name={link.name}
          icon={link.icon}
          isFirst={index === 0}
          isLast={index === storeQuickLinks.length - 1}
        />
      ))}
    </div>
  )
}
