# ⚡ PocketMind — AI Study Assistant for Engineering Students

> Upload your notes or question bank PDF and chat with your content — powered by AI.

![PocketMind Banner](https://img.shields.io/badge/PocketMind-Live-F59E0B?style=for-the-badge&logo=lightning&logoColor=black)
![Status](https://img.shields.io/badge/Status-Production-4CAF82?style=for-the-badge)
![Cost](https://img.shields.io/badge/Hosting_Cost-₹0-blue?style=for-the-badge)
![Made With](https://img.shields.io/badge/Made_With-HTML_CSS_JS-orange?style=for-the-badge)

**Live Demo → [atharva-gore22.github.io/pocketmind](https://atharva-gore22.github.io/pocketmind)**

---

## 🎯 The Problem

Engineering students in India start studying 2–3 days before exams. Notes are scattered across PDFs, WhatsApp forwards, and photos. There's no fast way to ask questions from your own content.

PocketMind solves this — upload your notes or QB, ask anything, get instant answers grounded in *your* material.

---

## ✨ Features

- 📄 **PDF Upload** — Upload your notes or question bank, AI reads and understands it
- 🤖 **AI Chat** — Ask questions, get step-by-step answers from your own content
- 🧠 **Conversation Memory** — Remembers context across the full chat session
- 🔒 **Secure Backend** — API key hidden via Cloudflare Workers, never exposed to browser
- 📱 **Mobile Responsive** — Works on phone with hamburger sidebar navigation
- ⚡ **Fast** — Powered by Groq's ultra-fast inference engine
- 🆓 **Free to Use** — No login, no payment, just open and study

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | HTML, CSS, Vanilla JS | UI, chat interface, PDF handling |
| AI Model | Llama 3.3 70B via Groq | Answering questions from notes |
| Backend | Cloudflare Workers | Secure API proxy, hides credentials |
| PDF Reading | PDF.js (CDN) | Extracts text from uploaded PDFs |
| Hosting | GitHub Pages | Free global hosting |

---

## 🏗 Architecture

```
User (Browser)
     │
     ▼
GitHub Pages          ← Serves frontend files
     │
     ▼
Cloudflare Worker     ← Adds secret API key, handles CORS
     │
     ▼
Groq API              ← Runs Llama 3.3 70B, returns AI response
     │
     ▼
User sees answer
```

**Why Cloudflare Workers?**
The API key lives only in Cloudflare's environment secrets — never in the browser, never in GitHub. Anyone can open the app without needing their own API key.

---

## 🚀 How to Use

1. Open **[pocketmind](https://atharva-gore22.github.io/pocketmind)** in your browser
2. Click **Choose PDF** and upload your notes or question bank
3. Type your question in the chat box
4. Get instant, structured answers from your own content

No login. No setup. No API key needed.

---

## 💻 Run Locally

```bash
# Clone the repo
git clone https://github.com/atharva-gore22/pocketmind.git

# Open the project
cd pocketmind

# Open index.html with Live Server in VS Code
# OR just open index.html directly in Chrome
```

To use with your own API key locally:
1. Get a free API key from [console.groq.com](https://console.groq.com)
2. Replace the `API_URL` in `app.js` with your Groq key directly for local testing

---

## 📁 Project Structure

```
pocketmind/
├── index.html        # App structure — sidebar + chat layout
├── style.css         # Dark theme, amber accents, mobile responsive
├── app.js            # All logic — PDF reading, AI calls, chat UI
└── README.md         # This file
```

---

## 🔑 How the Backend Works

```javascript
// Cloudflare Worker — the secure backend
export default {
  async fetch(request, env) {
    // Receives request from browser (no API key)
    // Adds env.GROQ_API_KEY from Cloudflare secrets
    // Forwards to Groq API
    // Returns response to browser
  }
}
```

The secret key is stored in Cloudflare's environment — not in any file you can see.

---

## 🎓 What I Learned Building This

- How to integrate AI APIs into a real web application
- RAG (Retrieval Augmented Generation) — grounding AI responses in uploaded documents  
- Cloudflare Workers as a serverless backend to secure API credentials
- PDF text extraction using PDF.js in the browser
- Mobile-first responsive design with CSS flexbox
- Git workflow — branching, committing, pushing, resolving conflicts
- Full deployment pipeline: GitHub → GitHub Pages (frontend) + Cloudflare (backend)

---

## 🗺 Roadmap

- [ ] Quiz Mode — AI generates MCQs from uploaded notes
- [ ] Topic Summarizer — one-click summary of any PDF
- [ ] Multiple PDF support — switch between subjects
- [ ] Save chat history across sessions
- [ ] Dark/Light mode toggle
- [ ] Hindi/Marathi language support

---

## 👨‍💻 Built By

**Atharva Gore**
First Year Engineering Student — PVGCOETM, Pune
[GitHub](https://github.com/atharva-gore22) · [LinkedIn](https://linkedin.com/in/atharva-gore)

---

## 📄 License

MIT License — free to use, modify, and build on.

---


