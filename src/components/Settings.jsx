import { useEffect, useState } from 'react'
import { X, Sun, Moon, Server, Mail, Trash2 } from 'lucide-react'
import { backend, checkConnection } from '../services/n8n.js'

const STATUS = {
  checking: ['Checking…', 'text-slate-500'],
  demo: ['Demo mode: no webhook URL configured', 'text-amber-600 dark:text-amber-400'],
  online: ['Reachable', 'text-emerald-600 dark:text-emerald-400'],
  offline: ['Unreachable: is n8n running?', 'text-red-600 dark:text-red-400'],
}

// const STATUS = {
//   checking: ['Checking…', 'text-gmail-grayText dark:text-[#9AA0A6]'],
//   demo: ['Demo mode: no webhook URL configured', 'text-gmail-yellowText dark:text-[#FDD663]'],
//   online: ['Reachable', 'text-gmail-greenText dark:text-[#81C995]'],
//   offline: ['Unreachable: is n8n running?', 'text-gmail-redText dark:text-[#F28B82]'],
// }


function Section({ icon: Icon, title, children }) {
  return (
    <section className="rounded-2xl bg-gmail-grayBg p-4 dark:bg-white/5">
      <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold"><Icon size={16} className="text-brand-500" />{title}</h3>
      {children}
    </section>
  )
}

export default function Settings({ theme, setTheme, onClear, onClose }) {
  const [status, setStatus] = useState('checking')
  const [confirm, setConfirm] = useState(false)
  const check = () => { setStatus('checking'); checkConnection().then(setStatus) }
  useEffect(() => { check() }, [])
  const [label, color] = STATUS[status]

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose} onKeyDown={(e) => e.key === 'Escape' && onClose()}>
      <div role="dialog" aria-modal="true" aria-label="Settings" onClick={(e) => e.stopPropagation()}
        className="max-h-full w-full max-w-md space-y-3 overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl dark:bg-[#2d2e31]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button onClick={onClose} aria-label="Close settings" autoFocus className="grid h-8 w-8 place-items-center rounded-lg hover:bg-brand-50 dark:hover:bg-white/10"><X size={18} /></button>
        </div>

        <Section icon={theme === 'dark' ? Moon : Sun} title="Appearance">
          <div className="flex gap-2">
            {['light', 'dark'].map((t) => (
              <button key={t} onClick={() => setTheme(t)} aria-pressed={theme === t}
                className={`flex-1 rounded-xl py-2 text-sm font-medium capitalize ${theme === t ? 'bg-brand-600 text-white' : 'bg-white ring-1 ring-black/10 dark:bg-white/5 dark:ring-white/10'}`}>{t}</button>
            ))}
          </div>
        </Section>

        <Section icon={Server} title="Backend connection">
          <p className={`text-sm ${color}`} role="status">{label}</p>
          {backend.url && <p className="mt-1 break-all text-xs text-slate-500">{backend.url}</p>}
          <button onClick={check} className="mt-2 text-sm font-medium text-brand-600 hover:underline dark:text-brand-300">Check again</button>
        </Section>

        <Section icon={Mail} title="Gmail accounts">
          <p className="text-sm text-slate-600 dark:text-slate-300">Accounts are connected through OAuth credentials inside n8n. This list will appear here once the workflow reports them; nothing is simulated.</p>
        </Section>

        <Section icon={Trash2} title="Chat history">
          <p className="mb-2 text-sm text-slate-600 dark:text-slate-300">Removes the conversation list from this browser. Memory stored in MongoDB is not touched.</p>
          {confirm ? (
            <div className="flex gap-2">
              <button onClick={() => { onClear(); setConfirm(false) }} className="rounded-xl bg-[#6d3fd1] px-3 py-1.5 text-sm font-medium text-white">Yes, clear history</button>
              <button onClick={() => setConfirm(false)} className="rounded-xl px-3 py-1.5 text-sm ring-1 ring-black/10 dark:ring-white/10">Cancel</button>
            </div>
          ) : (
            <button onClick={() => setConfirm(true)} className="rounded-xl px-3 py-1.5 text-sm font-medium text-red-500 ring-1 ring-blue-500 dark:ring-red-500/30">Clear local history</button>
          )}
        </Section>
      </div>
    </div>
  )
}
