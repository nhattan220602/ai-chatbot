# AI Chatbot

A clean, responsive AI chatbot interface that allows users to engage in real-time, contextual conversations with image attachment support. This project was built to practice handling asynchronous multimodal API calls, conversation history management, and dynamic DOM manipulation in vanilla JavaScript.

## Live Demo
[View Live Project](https://nhattan220602.github.io/ai-chatbot/)

## Features
- **Multimodal Conversational AI:** Integrates with the Google Gemini 2.5 Flash API to handle text and base64-encoded image data concurrently in a single generation pipeline.
- **Context Preservation:** Dynamically tracks conversation history arrays (`chatHistory`) to allow continuous, multi-turn dialogue interactions between user and model roles.
- **Dynamic UX Adaptations:** Automatically monitors user input flow to auto-resize textareas, execute smooth window scrolling anchors, trigger custom async loading animations, and toggle interactive web component configurations (`Emoji Mart`).

## Built With
- **HTML5:** Semantic document markup embedded with inline SVG vector imagery.
- **CSS3:** Custom keyframe animations (`dotPulse`), flexible grid layouts, and clean responsive breakpoint scaling for mobile viewports.
- **JavaScript (ES6):** Native Async/Await Fetch API integrations, event state dispatch loops, structural sanitization patterns, and explicit text node sanitization (`textContent`).

## Setup & Installation
1. Clone the repository:
```bash
   git clone https://github.com/nhattan220602/ai-chatbot.git
```
2. Get a free API key from [Google AI Studio]

3. Create `src/config.js` (excluded from version control):
```js
   const API_KEY = 'YOUR_API_KEY_HERE';
```

4. Open `src/index.html` in your browser.

> **Note:** - The live demo is deployed via GitHub Actions, which securely injects the API key at build time using GitHub Secrets — the key is never stored in the repository. 

> - This project was engineered using a tutorial-driven development path combined with AI-assisted programming tools. This allowed for rapid prototyping, deep-dive debugging of the Gemini API, and hands-on practice with modern development workflows.