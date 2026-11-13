import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import {
  Send, Copy, Check, RotateCcw, Paperclip, X, Inbox, FileText, Search, PenLine, Mail,
  File as FileIcon, Image as ImageIcon,
} from 'lucide-react'
import Mascot from './Mascot.jsx'
import { MAX_FILES, MAX_MB, formatSize, kindOf, validate } from '../utils/files.js'

// Gmail label pairs: light background + dark text, with the lighter Google tints in dark mode.
const TONES = {
  red: 'bg-gmail-redBg text-gmail-redText dark:ring-white/10 dark:bg-[#6d3fd1]/15',
  yellow: 'bg-gmail-yellowBg text-gmail-yellowText dark:ring-white/10 dark:bg-[#6d3fd1]/15',
  green: 'bg-gmail-greenBg text-gmail-greenText dark:ring-white/10 dark:bg-[#6d3fd1]/15',
}
const DOT_COLORS = ['#D93025', '#F29900', '#188038']

// Starters fill the composer (they never auto-send), so you can edit before anything runs.
const STARTERS = [
  { icon: Inbox, tone: 'red', title: 'Unread emails', desc: 'See what’s new and what needs you', prompt: 'Check my unread emails.' },
  { icon: FileText, tone: 'yellow', title: 'Summarize today', desc: 'Highlights from today’s important mail', prompt: 'Summarize the important emails I received today.' },
  { icon: Search, tone: 'green', title: 'Find an email', desc: 'Search your inbox in plain English', prompt: 'Find the email John sent me yesterday.' },
  { icon: PenLine, tone: 'red', title: 'Draft a reply', desc: 'I’ll write it, you approve it', prompt: 'Draft a professional reply to my lecturer. Show me the draft before sending.' },
  { icon: Send, tone: 'yellow', title: 'Send an email', desc: 'Draft first, send only when you say so', prompt: 'Draft an email to my colleague about tomorrow’s meeting. Do not send it until I confirm.' },
  { icon: Mail, tone: 'green', title: 'All accounts', desc: 'Check every connected Gmail', prompt: 'Check both my Gmail accounts for important messages.' },
]

const bubbleBase = 'rounded-2xl rounded-tl-md bg-white shadow-sm ring-1 ring-[#DADCE0] dark:bg-white/5 dark:ring-white/10'

function FileChip({ f, onRemove }) {
  const tone = kindOf(f)
  const Icon = tone === 'red' ? FileText : tone === 'green' ? ImageIcon : FileIcon
  return (
    <span className="inline-flex max-w-[15rem] items-center gap-2 rounded-xl bg-gmail-grayBg py-1 pl-1 pr-2 text-xs text-gmail-charcoal dark:bg-[#3c4043] dark:text-[#e8eaed]">
      <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${TONES[tone]}`}><Icon size={15} /></span>
      <span className="min-w-0">
        <span className="block truncate font-medium">{f.name}</span>
        <span className="block text-[11px] opacity-70">{formatSize(f.size)}</span>
      </span>
      {onRemove && (
        <button type="button" onClick={onRemove} aria-label={`Remove ${f.name}`} className="grid h-5 w-5 shrink-0 place-items-center rounded-full hover:bg-black/10 dark:hover:bg-white/10">
          <X size={12} />
        </button>
      )}
    </span>
  )
}

function Welcome({ pick }) {
  return (
    <div className="flex flex-col items-center pt-4 text-center sm:pt-10">
      <Mascot size={110} />
      <h1 className="mt-4 text-2xl font-semibold">Your AI does the work.</h1>
      <p className="mt-1 text-sm text-gmail-grayText dark:text-[#9AA0A6]">Choose what you’d like help with, or type your own request.</p>
      <div className="mt-6 grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
        {STARTERS.map((s) => (
          <button key={s.title} onClick={() => pick(s.prompt)} className="flex flex-col items-center gap-1.5 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#DADCE0] transition hover:shadow-md hover:ring-brand-300 dark:bg-white/5 dark:ring-white/10">
            <span className={`grid h-9 w-9 place-items-center rounded-full ${TONES[s.tone]}`}><s.icon size={18} /></span>
            <span className="text-sm font-semibold">{s.title}</span>
            <span className="text-xs text-gmail-grayText dark:text-[#9AA0A6]">{s.desc}</span>
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
      <div className="flex flex-col items-end gap-1.5">
        {m.files?.length > 0 && (
          <div className="flex max-w-[85%] flex-wrap justify-end gap-1.5 sm:max-w-[75%]">
            {m.files.map((f, i) => <FileChip key={i} f={f} />)}
          </div>
        )}
        {m.content && (
          <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-brand-500 px-4 py-2.5 text-white shadow-sm sm:max-w-[75%]">{m.content}</div>
        )}
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
        <button onClick={copy} aria-label="Copy message"
          className={`mt-1 flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs focus:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 ${copied ? 'text-gmail-greenText dark:text-[#81C995]' : 'text-gmail-grayText hover:text-brand-600 dark:text-[#9AA0A6]'}`}>
          {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  )
}

export default function Chat({ chat, busy, error, draft, setDraft, files, setFiles, onSend, onRetry }) {
  const endRef = useRef(null)
  const taRef = useRef(null)
  const fileRef = useRef(null)
  const [drag, setDrag] = useState(false)
  const [notice, setNotice] = useState('')
  const messages = chat?.messages ?? []
  let lastReply = -1
  messages.forEach((m, i) => { if (m.role === 'assistant') lastReply = i })
  const canSend = !busy && (draft.trim() || files.length > 0)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }) }, [messages.length, busy, error])
  useEffect(() => {
    const el = taRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 180) + 'px'
  }, [draft])

  const addFiles = (list) => {
    const { accepted, rejected } = validate(files, Array.from(list))
    if (accepted.length) setFiles([...files, ...accepted])
    if (rejected.length) { setNotice(rejected.join('. ')); setTimeout(() => setNotice(''), 5000) }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); onSend(draft) }
  }
  const onPaste = (e) => {
    if (e.clipboardData.files.length) { e.preventDefault(); addFiles(e.clipboardData.files) }
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
                {DOT_COLORS.map((c, i) => <span key={c} className="h-2 w-2 animate-bounce rounded-full" style={{ background: c, animationDelay: `${i * 150}ms` }} />)}
              </div>
            </div>
          )}

          {error && (
            <div role="alert" className="flex items-center justify-between gap-3 rounded-2xl bg-gmail-redBg px-4 py-3 text-sm text-gmail-redText ring-1 ring-gmail-red/30 dark:bg-[#F28B82]/10 dark:text-[#F28B82] dark:ring-[#F28B82]/30">
              <span>{error.message}</span>
              <button onClick={onRetry} className="flex shrink-0 items-center gap-1 rounded-lg bg-white px-3 py-1.5 font-medium text-gmail-charcoal shadow-sm dark:bg-white/10 dark:text-[#e8eaed]"><RotateCcw size={14} /> Retry</button>
            </div>
          )}
          <div ref={endRef} />
        </div>
      </div>

      <div className="px-4 pb-4 pt-2">
        <div className="mx-auto max-w-3xl">
          {notice && (
            <p role="status" className="mb-2 rounded-xl bg-gmail-yellowBg px-3 py-1.5 text-xs text-gmail-yellowText dark:bg-[#FDD663]/10 dark:text-[#FDD663]">{notice}</p>
          )}
          <div
            onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
            onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDrag(false) }}
            onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files) }}
            className={`rounded-3xl bg-white p-2 shadow-lg shadow-black/5 focus-within:ring-2 focus-within:ring-brand-400 dark:bg-white/5 ${drag ? 'ring-2 ring-brand-500' : 'ring-1 ring-[#DADCE0] dark:ring-white/10'}`}
          >
            {files.length > 0 && (
              <div className="flex flex-wrap gap-1.5 px-2 pb-1 pt-1">
                {files.map((f, i) => <FileChip key={f.name + f.size} f={f} onRemove={() => setFiles(files.filter((_, j) => j !== i))} />)}
              </div>
            )}
            <div className="flex items-end gap-1">
              <button type="button" onClick={() => fileRef.current?.click()} aria-label="Attach files"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-gmail-grayText hover:bg-gmail-grayBg dark:text-[#9AA0A6] dark:hover:bg-white/10">
                <Paperclip size={19} />
              </button>
              <textarea
                ref={taRef} rows={1} value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={onKeyDown} onPaste={onPaste}
                placeholder="Ask Oest about your inbox…" aria-label="Message"
                className="max-h-44 flex-1 resize-none bg-transparent px-2 py-2.5 outline-none placeholder:text-gmail-grayText dark:placeholder:text-[#9AA0A6]"
              />
              <button onClick={() => onSend(draft)} disabled={!canSend} aria-label="Send message"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-500 text-white transition enabled:hover:bg-brand-600 disabled:opacity-40">
                <Send size={18} />
              </button>
            </div>
            <input ref={fileRef} type="file" multiple hidden onChange={(e) => { addFiles(e.target.files); e.target.value = '' }} />
          </div>
          <p className="mt-2 text-center text-xs text-gmail-grayText dark:text-[#9AA0A6]">
            Enter to send, Shift+Enter for a new line. Attach up to {MAX_FILES} files, {MAX_MB} MB each.
          </p>
        </div>
      </div>
    </>
  )
}