/**
 * Single integration point with the n8n workflow.
 *
 * Text only  -> POST JSON:
 *   { "action": "sendMessage", "sessionId": "<uuid>", "chatInput": "<text>" }
 * With files -> POST multipart/form-data with the same three fields plus each file
 *   under the field name "files" (what n8n's Chat Trigger expects; override with VITE_N8N_FILE_FIELD).
 *
 * Response (JSON): { "output" | "text" | "message" | "response": "..." },
 *   or an array whose first item has one of those fields, or a plain string.
 */
const URL = (import.meta.env.VITE_N8N_WEBHOOK_URL || '').trim()
const FILE_FIELD = (import.meta.env.VITE_N8N_FILE_FIELD || 'files').trim()

export const backend = { configured: Boolean(URL), url: URL }

const pickText = (d) => {
  if (Array.isArray(d)) d = d[0]
  if (typeof d === 'string') return d
  return d?.output ?? d?.text ?? d?.message ?? d?.response ?? d?.data?.output ?? null
}

export async function sendMessage({ sessionId, text, files = [], signal }) {
  if (!URL) {
    await new Promise((r) => setTimeout(r, 900))
    const note = files.length ? `\n\nAttached (not uploaded in demo mode): ${files.map((f) => f.name).join(', ')}` : ''
    return `**Demo mode.** No \`VITE_N8N_WEBHOOK_URL\` is set, so this is a placeholder reply and no email was read or sent.\n\nYou said: “${text}”${note}`
  }

  const init = { method: 'POST', signal }
  if (files.length) {
    const fd = new FormData()
    fd.append('action', 'sendMessage')
    fd.append('sessionId', sessionId)
    fd.append('chatInput', text)
    files.forEach((f) => fd.append(FILE_FIELD, f, f.name))
    init.body = fd // the browser sets the multipart boundary itself: no Content-Type header here
  } else {
    init.headers = { 'Content-Type': 'application/json' }
    init.body = JSON.stringify({ action: 'sendMessage', sessionId, chatInput: text })
  }

  let res
  try {
    res = await fetch(URL, init)
  } catch {
    throw new Error('Can’t reach the n8n workflow. Check that n8n is running and the URL/CORS settings are correct.')
  }
  if (!res.ok) throw new Error(`n8n responded with an error (HTTP ${res.status}). Check that the workflow is active${files.length ? ' and that file uploads are allowed on the Chat Trigger' : ''}.`)
  const raw = await res.text()
  let data = raw
  try { data = JSON.parse(raw) } catch { /* plain text reply */ }
  const out = pickText(data)
  if (!out) throw new Error('n8n replied, but no text field was found. Adjust pickText() in src/services/n8n.js.')
  return out
}

/** 'demo' | 'online' | 'offline' */
export async function checkConnection() {
  if (!URL) return 'demo'
  try {
    await fetch(URL, { method: 'OPTIONS' })
    return 'online'
  } catch {
    return 'offline'
  }
}