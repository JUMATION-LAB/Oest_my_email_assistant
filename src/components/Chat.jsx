import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Send, Copy, Check, RotateCcw, Inbox, FileText, Search, PenLine, Mail } from 'lucide-react'
import Mascot from './Mascot.jsx'

// Starters fill the composer (they never auto-send), so you can edit before anything runs.
const STARTERS = [
  { icon: Inbox, title: 'Unread emails', desc: 'See what’s new and what needs you', prompt: 'Check my unread emails.' },
  { icon: FileText, title: 'Summarize today', desc: 'Highlights from today’s important mail', prompt: 'Summarize the important emails I received today.' },
  { icon: Search, title: 'Find an email', desc: 'Search your inbox in plain English', prompt: 'Find the email John sent me yesterday.' },
  { icon: PenLine, title: 'Draft a reply', desc: 'I’ll write it, you approve it', prompt: 'Draft a professional reply to my lecturer. Show me the draft before sending.' },
  { icon: Send, title: 'Send an email', desc: 'Draft first, send only when you say so', prompt: 'Draft an email to my colleague about tomorrow’s meeting. Do not send it until I confirm.' },
  { icon: Mail, title: 'All accounts', desc: 'Check every connected Gmail', prompt: 'Check both my Gmail accounts for important messages.' },
]

const bubbleBase = 'rounded-2xl rounded-tl-md bg-white shadow-sm ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10'

function Welcome({ pick }) {
  return (
    <div className="flex flex-col items-center pt-4 text-center sm:pt-10">
      <Mascot size={110} />
      <h1 className="mt-4 text-2xl font-semibold">Your AI does the work.</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Choose what you’d like help with, or type your own request.</p>
      <div className="mt-6 grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
        {STARTERS.map((s) => (
          <button key={s.title} onClick={() => pick(s.prompt)} className="flex flex-col items-center gap-1.5 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition hover:ring-brand-400 dark:bg-white/5 dark:ring-white/10">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-200"><s.icon size={18} /></span>
            <span className="text-sm font-semibold">{s.title}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{s.desc}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// live = this is the newest reply, so its mascot animates; older replies stay still.
function Bubble({ m, live }) {
  const [copied, setCopied] = useState(false)
  if (m.role === 'user')
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-gradient-to-br from-brand-500 to-brand-600 px-4 py-2.5 text-white shadow-sm sm:max-w-[75%]">{m.content}</div>
      </div>
    )
  const copy = async () => {
    try { await navigator.clipboard.writeText(m.content); setCopied(true); setTimeout(() => setCopied(false), 1500) } catch { /* clipboard blocked */ }
  }
  return (
    <div className="group flex items-start gap-2 sm:gap-3">
      <div className="mt-1 shrink-0"><Mascot size={36} animated={live} /></div>
      <div className="min-w-0 max-w-[calc(100%-3rem)]">
        <div className={`md break-words px-4 py-3 ${bubbleBase}`}>
          <ReactMarkdown components={{ a: ({ node, ...p }) => <a {...p} target="_blank" rel="noreferrer noopener" /> }}>{m.content}</ReactMarkdown>
        </div>
        <button onClick={copy} aria-label="Copy message" className="mt-1 flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs text-slate-500 hover:text-brand-600 focus:opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
          {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  )
}

export default function Chat({ chat, busy, error, draft, setDraft, onSend, onRetry }) {
  const endRef = useRef(null)
  const taRef = useRef(null)
  const messages = chat?.messages ?? []
  let lastReply = -1
  messages.forEach((m, i) => { if (m.role === 'assistant') lastReply = i })

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }) }, [messages.length, busy, error])
  useEffect(() => {
    const el = taRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 180) + 'px'
  }, [draft])

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); onSend(draft) }
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto px-4 py-6" role="log" aria-live="polite">
        <div className="mx-auto flex max-w-3xl flex-col gap-5">
          {messages.length === 0
            ? <Welcome pick={(p) => { setDraft(p); taRef.current?.focus() }} />
            : messages.map((m, i) => <Bubble key={m.id} m={m} live={i === lastReply && !busy} />)}

          {busy && (
            <div className="flex items-start gap-2 sm:gap-3" role="status" aria-label="Oest is typing">
              <div className="mt-1 shrink-0"><Mascot size={36} thinking /></div>
              <div className={`flex items-center gap-1.5 px-4 py-3.5 ${bubbleBase}`}>
                {[0, 150, 300].map((d) => <span key={d} className="h-2 w-2 animate-bounce rounded-full bg-brand-400" style={{ animationDelay: `${d}ms` }} />)}
              </div>
            </div>
          )}

          {error && (
            <div role="alert" className="flex items-center justify-between gap-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/30">
              <span>{error.message}</span>
              <button onClick={onRetry} className="flex shrink-0 items-center gap-1 rounded-lg bg-white px-3 py-1.5 font-medium shadow-sm dark:bg-white/10"><RotateCcw size={14} /> Retry</button>
            </div>
          )}
          <div ref={endRef} />
        </div>
      </div>

      <div className="px-4 pb-4 pt-2">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-end gap-2 rounded-3xl bg-white p-2 shadow-lg shadow-brand-500/10 ring-1 ring-black/5 focus-within:ring-2 focus-within:ring-brand-400 dark:bg-white/5 dark:ring-white/10">
            <textarea
              ref={taRef} rows={1} value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={onKeyDown}
              placeholder="Ask Oest about your inbox…" aria-label="Message"
              className="max-h-44 flex-1 resize-none bg-transparent px-3 py-2.5 outline-none placeholder:text-slate-400"
            />
            <button onClick={() => onSend(draft)} disabled={busy || !draft.trim()} aria-label="Send message"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white transition enabled:hover:scale-105 disabled:opacity-40">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}