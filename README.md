# Oest Assistant

React + Vite + Tailwind front end for an existing n8n Gmail AI agent. The agent, Gmail tools and MongoDB memory stay in n8n.

## Run locally
```bash
npm install
cp .env.example .env     # then edit the webhook id
npm run dev              # http://localhost:5173
```
With `VITE_N8N_WEBHOOK_URL` empty the app runs in labelled **demo mode**.

## Connect to n8n
1. In the workflow use the **Chat Trigger** node, turn on *Make Chat Publicly Available*, and **activate** the workflow.
2. Copy the production URL (`http://localhost:5678/webhook/<id>/chat`) and put `/n8n/webhook/<id>/chat` in `VITE_N8N_WEBHOOK_URL`. In dev, Vite proxies `/n8n` to `N8N_BASE_URL`, so no CORS setup is needed.
3. Request sent: `{"action":"sendMessage","sessionId":"<uuid>","chatInput":"<text>"}`.
   Reply read from `output`, `text`, `message` or `response` (see `src/services/n8n.js`; adjust `pickText` if yours differs).
4. Set the Mongo Chat Memory node's session key to the Chat Trigger's `sessionId`. Each conversation here has its own `sessionId`, and reopening it reuses that id.

## Sending and deleting emails
The UI cannot enforce confirmation; the agent must. Add to the agent's system prompt: *"Never send or delete an email until the user has seen the final draft or target and explicitly confirms. Only say an email was sent after the Gmail tool succeeds."*

## Deploy later
`npm run build` outputs `dist/` for Netlify, Vercel or Cloudflare Pages. Do not expose a Gmail-capable webhook publicly: put an authenticated HTTPS proxy in front of n8n (it checks the user's login, forwards to n8n, and sets CORS for your domain only), then set `VITE_N8N_WEBHOOK_URL` to the proxy. Anything prefixed `VITE_` is visible in the browser, so never put secrets in it.

## Structure
`src/services/n8n.js` (only file that knows n8n), `src/hooks/useChats.js` (local conversation list), `src/components/` (Sidebar, Chat, Settings, Mascot).
Conversation list lives in browser localStorage, not MongoDB.
