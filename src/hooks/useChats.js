import { useEffect, useState } from 'react'

const KEY = 'oest.chats.v1'
const empty = { chats: [], activeId: null }
const load = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || empty } catch { return empty }
}

/**
 * Conversation list kept in this browser's localStorage (not MongoDB).
 * Each conversation owns a sessionId; reopening it reuses that id so n8n's
 * MongoDB chat memory continues the same thread.
 */
export function useChats() {
  const [s, setS] = useState(load)
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(s)) } catch { /* storage full or blocked */ }
  }, [s])

  const patch = (id, fn) => setS((p) => ({ ...p, chats: p.chats.map((c) => (c.id === id ? fn(c) : c)) }))

  return {
    chats: s.chats,
    active: s.chats.find((c) => c.id === s.activeId) || null,
    newChat: () => setS((p) => ({ ...p, activeId: null })),
    select: (id) => setS((p) => ({ ...p, activeId: id })),
    create: (firstText) => {
      const chat = { id: crypto.randomUUID(), sessionId: crypto.randomUUID(), title: firstText.slice(0, 40), messages: [] }
      setS((p) => ({ chats: [chat, ...p.chats], activeId: chat.id }))
      return chat
    },
    rename: (id, title) => patch(id, (c) => ({ ...c, title: title.trim() || c.title })),
    remove: (id) => setS((p) => ({ chats: p.chats.filter((c) => c.id !== id), activeId: p.activeId === id ? null : p.activeId })),
    addMessage: (id, m) => patch(id, (c) => ({ ...c, messages: [...c.messages, m] })),
    clearAll: () => setS(empty),
  }
}
