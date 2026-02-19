import React from 'react'

import useQuickLinksStore from '../../stores/quickLinks.store'

import QuickLinkFormModal from './QuickLinkFormModal'
import QuickLinksRow from './QuickLinksRow'

export default function SettingsQuickLinks() {
  const {
    quickLinks: storeQuickLinks,
    addQuickLink,
    removeQuickLink,
    moveUpQuickLink,
    moveDownQuickLink,
  } = useQuickLinksStore()

  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [editingLink, setEditingLink] = React.useState(null)

  function openCreate() {
    setEditingLink(null)
    setIsFormOpen(true)
  }

  function openEdit(link) {
    setEditingLink(link)
    setIsFormOpen(true)
  }

  return (
    <div className="settings-quick-links">
      <h3 className="settings-quick-links__title">Quick Links </h3>
      <small className="settings-quick-links__description">
        Manage your quick links here. You can add, edit, delete and reorder them as you like.
      </small>
      <div className="p-4">
        {storeQuickLinks.map((link, index) => (
          <QuickLinksRow
            key={link.id}
            id={link.id}
            name={link.name}
            icon={link.icon}
            isFirst={index === 0}
            isLast={index === storeQuickLinks.length - 1}
            removeQuickLink={removeQuickLink}
            moveUpQuickLink={moveUpQuickLink}
            moveDownQuickLink={moveDownQuickLink}
            onEdit={() => {
              openEdit(link)
            }}
          />
        ))}
        <button className="mt-2 p-2 bg-blue-500 text-white rounded" onClick={() => openCreate()}>
          Add Quick Link
        </button>
      </div>
      {isFormOpen && (
        <QuickLinkFormModal
          id={editingLink?.id}
          name={editingLink?.name}
          icon={editingLink?.icon}
          url={editingLink?.url}
          onClose={() => setIsFormOpen(false)}
          onSave={(link) => {
            if (editingLink) {
              // Update existing link
              removeQuickLink(editingLink.id)
              addQuickLink(link)
              return
            }
            addQuickLink({ ...link, id: Date.now() })
          }}
        />
      )}
    </div>
  )
}
