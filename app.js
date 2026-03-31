// ============================================================
// POCKETMIND - app.js (Groq API)
// ============================================================

const API_KEY = "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";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

let notesContext = "";
let conversationHistory = [];

// ── DOM refs ──────────────────────────────────────────────
const fileInput    = document.getElementById("fileInput");
const fileStatus   = document.getElementById("fileStatus");
const chatMessages = document.getElementById("chatMessages");
const userInput    = document.getElementById("userInput");
const sendBtn      = document.getElementById("sendBtn");
const clearBtn     = document.getElementById("clearBtn");
const headerStatus = document.getElementById("headerStatus");

// ── PDF Upload ────────────────────────────────────────────
fileInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  fileStatus.textContent = "⏳ Reading PDF...";
  fileStatus.className = "file-status";

  try {
    const text = await extractTextFromPDF(file);
    notesContext = text;
    fileStatus.textContent = "✅ " + file.name;
    fileStatus.className = "file-status loaded";
    headerStatus.textContent = "📄 Notes loaded: " + file.name;
    addMessage("ai", "Your notes from *" + file.name + "* are loaded!\n\nWhat do you want to study first?");
  } catch (err) {
    fileStatus.textContent = "❌ Failed to read PDF";
    console.error(err);
  }
});

async function extractTextFromPDF(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async function (e) {
      try {
        const typedArray = new Uint8Array(e.target.result);
        const pdfjsLib = window["pdfjs-dist/build/pdf"];
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        let fullText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map((item) => item.str).join(" ");
          fullText += pageText + "\n";
        }

        resolve(fullText);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

// ── Send Message ──────────────────────────────────────────
sendBtn.addEventListener("click", handleSend);

userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
});

userInput.addEventListener("input", () => {
  userInput.style.height = "auto";
  userInput.style.height = userInput.scrollHeight + "px";
});

async function handleSend() {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage("user", message);
  userInput.value = "";
  userInput.style.height = "auto";
  sendBtn.disabled = true;

  const typingId = addTypingIndicator();

  try {
    const reply = await sendToGroq(message);
    removeTypingIndicator(typingId);
    addMessage("ai", reply);
  } catch (err) {
    removeTypingIndicator(typingId);
    addMessage("ai", "⚠️ Something went wrong: " + err.message);
    console.error(err);
  }

  sendBtn.disabled = false;
  userInput.focus();
}

// ── Groq API Call ─────────────────────────────────────────
async function sendToGroq(userMessage) {

  const systemText = `You are PocketMind, a smart AI study assistant built specifically for engineering students in India.
Your job is to help students understand their notes, prepare for exams, and clear their doubts quickly.
Be clear, concise, and student-friendly. Use bullet points and structure when helpful.
If the student seems stressed or is asking last-minute exam questions, be extra encouraging.
${notesContext
  ? "\nThe student has uploaded their notes. Always prioritize answering from these notes:\n\n---NOTES START---\n" + notesContext.slice(0, 14000) + "\n---NOTES END---"
  : "\nNo notes uploaded yet. Answer from your general engineering knowledge."}`;

  conversationHistory.push({ role: "user", content: userMessage });

  const messages = [
    { role: "system", content: systemText },
    ...conversationHistory.map((m) => ({
      role: m.role === "ai" ? "assistant" : "user",
      content: m.content,
    })),
  ];

  const payload = {
    model: "llama-3.3-70b-versatile",
    messages: messages,
    temperature: 0.7,
    max_tokens: 1024,
  };

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + API_KEY,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.error?.message || "API request failed");
  }

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || "No response received.";

  conversationHistory.push({ role: "ai", content: reply });

  if (conversationHistory.length > 20) {
    conversationHistory = conversationHistory.slice(-20);
  }

  return reply;
}

// ── UI Helpers ────────────────────────────────────────────
function addMessage(role, text) {
  const div = document.createElement("div");
  div.className = "message " + (role === "user" ? "user-message" : "ai-message");

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.innerHTML = formatText(text);

  div.appendChild(bubble);
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return div;
}

function addTypingIndicator() {
  const id = "typing-" + Date.now();
  const div = document.createElement("div");
  div.className = "message ai-message typing";
  div.id = id;
  div.innerHTML = `<div class="bubble">⚡ PocketMind is thinking...</div>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return id;
}

function removeTypingIndicator(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function formatText(text) {
  text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");
  text = text.replace(/^- (.+)/gm, "• $1");
  text = text.replace(/\n/g, "<br/>");
  return text;
}

// ── Clear Chat ────────────────────────────────────────────
clearBtn.addEventListener("click", () => {
  chatMessages.innerHTML = `
    <div class="message ai-message">
      <div class="bubble">
        Chat cleared! Upload new notes or ask me anything ⚡
      </div>
    </div>`;
  conversationHistory = [];
});