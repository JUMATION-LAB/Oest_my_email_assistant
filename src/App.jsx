import { useEffect, useState } from 'react'
import { Menu } from 'lucide-react'
import Sidebar from './components/Sidebar.jsx'
import Chat from './components/Chat.jsx'
import Settings from './components/Settings.jsx'
import { useChats } from './hooks/useChats.js'
import { sendMessage, backend } from './services/n8n.js'

const uid = () => crypto.randomUUID()
const initialTheme = () => {
  try { const t = localStorage.getItem('oest.theme'); if (t) return t } catch { /* ignore */ }
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function App() {
  const store = useChats()
  const { active } = store
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [draft, setDraft] = useState('')
  const [navOpen, setNavOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [theme, setTheme] = useState(initialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try { localStorage.setItem('oest.theme', theme) } catch { /* ignore */ }
  }, [theme])

  const send = async (text, retryChat) => {
    text = text.trim()
    if (!text || busy) return
    const chat = retryChat || active || store.create(text)
    if (!retryChat) { store.addMessage(chat.id, { id: uid(), role: 'user', content: text }); setDraft('') }
    setBusy(true); setError(null)
    try {
      const reply = await sendMessage({ sessionId: chat.sessionId, text })
      store.addMessage(chat.id, { id: uid(), role: 'assistant', content: reply })
    } catch (e) {
      setError({ chatId: chat.id, text, message: e.message })
    } finally {
      setBusy(false)
    }
  }

  const chatError = error && error.chatId === active?.id ? error : null

  return (
    <div className="flex h-dvh overflow-hidden">
      <Sidebar
        chats={store.chats} activeId={active?.id} open={navOpen} onClose={() => setNavOpen(false)}
        onNew={() => { store.newChat(); setNavOpen(false) }} onSelect={store.select}
        onRename={store.rename} onDelete={store.remove} onSettings={() => { setShowSettings(true); setNavOpen(false) }}
      />
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-2 px-3 py-2 md:hidden">
          <button onClick={() => setNavOpen(true)} aria-label="Open conversations" className="grid h-9 w-9 place-items-center rounded-xl bg-white shadow-sm dark:bg-white/10"><Menu size={18} /></button>
          <span className="font-semibold">Oest Assistant</span>
        </header>
        {!backend.configured && (
          <div role="status" className="mx-4 mt-2 rounded-xl bg-amber-50 px-4 py-2 text-center text-sm text-amber-800 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-500/30">
            Demo mode: replies are placeholders and no emails are touched. Set VITE_N8N_WEBHOOK_URL to connect.
          </div>
        )}
        <Chat chat={active} busy={busy} error={chatError} draft={draft} setDraft={setDraft}
          onSend={(t) => send(t)} onRetry={() => send(chatError.text, active)} />
      </main>
      {showSettings && <Settings theme={theme} setTheme={setTheme} onClear={store.clearAll} onClose={() => setShowSettings(false)} />}
    </div>
  )
}
