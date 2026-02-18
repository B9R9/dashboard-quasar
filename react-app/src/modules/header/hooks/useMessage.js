import React from 'react'

export default function useMessage() {
  const [messages, setMessages] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)

  const fetchMessages = React.useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Mock fetch
      await new Promise((resolve) => setTimeout(resolve, 400))
      setMessages([
        { id: 1, title: 'Support replied to your ticket', time: '3 mins ago', unread: true },
        { id: 2, title: 'Team meeting moved to 2PM', time: '35 mins ago', unread: false },
      ])
    } catch {
      setError('Failed to load messages')
      setMessages([])
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  const unreadCount = messages.filter((m) => m.unread).length

  return { messages, loading, error, unreadCount, refresh: fetchMessages }
}
