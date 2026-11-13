/** 
 * Single integration point with the n8n workflow.
 *
 * Request  (POST, JSON), matches the n8n Chat Trigger format:
 *   { "action": "sendMessage", "sessionId": "<uuid>", "chatInput": "<text>" }
 * Response (JSON): any of
 *   { "output": "..." } | { "text": "..." } | { "message": "..." } | { "response": "..." }
 *   or an array whose first item has one of those fields, or a plain string.
 *
 * If your workflow uses different names, change them here only.
 */
const URL = (import.meta.env.VITE_N8N_WEBHOOK_URL || '').trim()

export const backend = { configured: Boolean(URL), url: URL }

const pickText = (d) => {
  if (Array.isArray(d)) d = d[0]
  if (typeof d === 'string') return d
  return d?.output ?? d?.text ?? d?.message ?? d?.response ?? d?.data?.output ?? null
}

export async function sendMessage({ sessionId, text, signal }) {
  if (!URL) {
    await new Promise((r) => setTimeout(r, 900))
    return `**Demo mode.** No \`VITE_N8N_WEBHOOK_URL\` is set, so this is a placeholder reply and no email was read or sent.\n\nYou said: “${text}”`
  }
  let res
  try {
    res = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'sendMessage', sessionId, chatInput: text }),
      signal,
    })
  } catch {
    throw new Error('Can’t reach the n8n workflow. Check that n8n is running and the URL/CORS settings are correct.')
  }
  if (!res.ok) throw new Error(`n8n responded with an error (HTTP ${res.status}). Check that the workflow is active.`)
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
