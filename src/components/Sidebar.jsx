import { useState } from 'react'
import { Plus, Pencil, Trash2, Check, X, Settings, MessageSquare } from 'lucide-react'
import Mascot from './Mascot.jsx'

const iconBtn = 'grid h-7 w-7 place-items-center rounded-md text-slate-500 hover:bg-brand-100 hover:text-brand-700 dark:hover:bg-white/10'

function Item({ chat, active, onSelect, onRename, onDelete }) {
  const [mode, setMode] = useState(null) // null | 'edit' | 'confirm'
  const [title, setTitle] = useState(chat.title)
  const commit = () => { onRename(chat.id, title); setMode(null) }

  if (mode === 'edit')
    return (
      <li className="px-1">
        <input
          autoFocus value={title} aria-label="Rename conversation"
          onChange={(e) => setTitle(e.target.value)} onBlur={commit}
          onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setMode(null) }}
          className="w-full rounded-lg border border-brand-300 bg-white px-2 py-1.5 text-sm outline-none dark:bg-white/10"
        />
      </li>
    )
  if (mode === 'confirm')
    return (
      <li className="flex items-center justify-between rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
        <span>Delete this chat?</span>
        <span className="flex gap-1">
          <button className={iconBtn} aria-label="Confirm delete" onClick={() => onDelete(chat.id)}><Check size={16} /></button>
          <button className={iconBtn} aria-label="Cancel" onClick={() => setMode(null)}><X size={16} /></button>
        </span>
      </li>
    )
  return (
    <li className={`group flex items-center rounded-xl pr-1 ${active ? 'bg-brand-100 dark:bg-brand-500/20' : 'hover:bg-brand-50 dark:hover:bg-white/5'}`}>
      <button onClick={() => onSelect(chat.id)} aria-current={active} className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2 text-left text-sm">
        <MessageSquare size={15} className="shrink-0 text-brand-500" />
        <span className="truncate">{chat.title}</span>
      </button>
      <span className="flex md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100">
        <button className={iconBtn} aria-label="Rename" onClick={() => { setTitle(chat.title); setMode('edit') }}><Pencil size={14} /></button>
        <button className={iconBtn} aria-label="Delete" onClick={() => setMode('confirm')}><Trash2 size={14} /></button>
      </span>
    </li>
  )
}

export default function Sidebar({ chats, activeId, open, onClose, onNew, onSelect, onRename, onDelete, onSettings }) {
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={onClose} aria-hidden="true" />}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/60 bg-white/85 backdrop-blur transition-transform md:static md:translate-x-0 dark:border-white/10 dark:bg-[#202124] ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center gap-2 px-4 pt-4">
          <Mascot size={34} />
          <span className="text-lg font-semibold">Oest Assistant</span>
        </div>
        <div className="p-4">
          <button onClick={onNew} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 py-2.5 font-medium text-white shadow-md shadow-brand-500/30 transition hover:brightness-110">
            <Plus size={18} /> New chat
          </button>
        </div>
        <p className="px-5 pb-1 text-xs text-slate-500 dark:text-slate-400">Saved on this device</p>
        <nav className="flex-1 overflow-y-auto px-3" aria-label="Conversations">
          {chats.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400">No conversations yet. Send your first message to start one.</p>
          ) : (
            <ul className="space-y-1">
              {chats.map((c) => (
                <Item key={c.id} chat={c} active={c.id === activeId} onSelect={(id) => { onSelect(id); onClose() }} onRename={onRename} onDelete={onDelete} />
              ))}
            </ul>
          )}
        </nav>
        <div className="border-t border-black/5 p-3 dark:border-white/10">
          <button onClick={onSettings} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-brand-50 dark:hover:bg-white/5">
            <Settings size={16} /> Settings
          </button>
        </div>
      </aside>
    </>
  )
}
