import React from 'react'
import { useState } from 'react'

import useQuickLinksStore from '../../stores/quickLinks.store'

export default function QuickLinkFormModal({ id, name, icon, url, onClose, onSave }) {
  const [linkName, setLinkName] = useState(name || '')
  const [linkIcon, setLinkIcon] = useState(icon || 'link')
  const [linkUrl, setLinkUrl] = useState(url || '')
  const { listIcons } = useQuickLinksStore()

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ id, name: linkName, icon: linkIcon, url: linkUrl })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
      style={{ background: 'var(--overlay-color)' }}
    >
      <div
        className="rounded-md p-6 w-full max-w-md"
        style={{
          background: 'var(--surface-color)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-color)',
        }}
      >
        <h2 className="text-xl font-semibold mb-4">{id ? 'Edit Quick Link' : 'Add Quick Link'}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="link-name"
              className="block text-sm font-medium"
              style={{ color: 'var(--muted-color)' }}
            >
              Name
            </label>
            <input
              id="link-name"
              type="text"
              value={linkName}
              onChange={(e) => setLinkName(e.target.value)}
              className="mt-1 block w-full rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label
              htmlFor="link-icon"
              className="block text-sm font-medium"
              style={{ color: 'var(--muted-color)' }}
            >
              Icon
            </label>

            <div className="mt-1 flex items-center gap-2">
              <span className="material-symbols-outlined" aria-hidden>
                {linkIcon}
              </span>

              <select
                id="link-icon"
                value={linkIcon}
                onChange={(e) => setLinkIcon(e.target.value)}
                className="block w-full rounded-md p-2"
              >
                {listIcons.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label
              htmlFor="link-url"
              className="block text-sm font-medium"
              style={{ color: 'var(--muted-color)' }}
            >
              URL
            </label>
            <input
              id="link-url"
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="mt-1 block w-full rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md"
              style={{
                background: 'var(--accent-color)',
                color: 'var(--text-color)',
                border: '1px solid var(--border-color)',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md"
              style={{
                background: 'var(--primary-color)',
                color: 'var(--danger-contrast-color)',
                border: '1px solid var(--primary-color)',
              }}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
