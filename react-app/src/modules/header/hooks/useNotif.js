import React from 'react'

export default function useNotif() {
  const [notifications, setNotifications] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)

  const fetchNotifications = React.useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Mock fetch
      await new Promise((resolve) => setTimeout(resolve, 350))
      setNotifications([
        { id: 1, title: 'New comment on your post', time: '2 mins ago', unread: true },
        { id: 2, title: 'You have a new follower', time: '10 mins ago', unread: true },
        { id: 3, title: 'Server downtime scheduled', time: '1 hour ago', unread: false },
      ])
    } catch {
      setError('Failed to load notifications')
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const unreadCount = notifications.filter((n) => n.unread).length

  return { notifications, loading, error, unreadCount, refresh: fetchNotifications }
}
