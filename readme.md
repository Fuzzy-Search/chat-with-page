## Chat with page

---

## 🌟 Introduction
Welcome Developers and Contributors! This README is designed to provide a structured guide to help you dive into this project seamlessly.

---

## 🚀 Getting Started – 3 steps

# MACOS/LINUX only! Windows coming soon

### ❗Pre-requisites❗
- Ensure you have [`pnpm`](https://pnpm.io/installation) or [`npm`](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) packages installed on the computer
- Ensure you have [`node.js`](https://nodejs.org/en/download) installed on your computer.

### 1. Installation and Running of the endponoint (internal requirement)
```bash
# go to api-endpoint folder
cd api-endpoint

# Install dependencies
pnpm install

# Start the development server
pnpm run dev
```

🌐 **API streaming server is ready**: This is a core of streaming outputs directly from LLM model into API based version!


#### 2. Chrome extension set up!
```bash
# go to chrome extension folder
cd chatwithpage-extension

# Install dependencies
pnpm install

# Get a build of the chrome extension ready
pnpm build
```
📂 **Output Directory**: All production files will be located in the `build` folder.



### 3.  🐪 Running Local Llama

#### Steps:
1. **Model Installation**: Go to [ollama.ai](https://ollama.ai/) and follow installation instructions.
2. **Run Model**: `ollama run mistral`
3. **Server Setup**: Install `litellm` via pip: `pip install litellm`
4. **Start Server**: 
   ```bash
   litellm --model ollama/mistral --api_base http://localhost:11434 --temperature 0.3 --max_tokens 2048
   ```


---

### 🖥 Installing extension in Chrome

1. **Navigate**: Go to `chrome://extensions`.
2. **Enable Developer Mode**.
3. **Load Extension**: Click "Load Unpacked" and navigate to `build/chrome-mv3-dev` or `build/chrome-mv3-prod`.

![Loading Extension](assets/image.png)

---

### 🤝 Contributing

#### Current To-Do List:
- Streamline local-stream repo.
- Ensure compatibility with Vercel AI and OpenAI npm modules.

---

### 💡 Tech Stack

This extension is proudly built with [Plasmo](https://docs.plasmo.com/).

---

📘 **Note**: Your collaboration is highly valued. Let's build something awesome together!

---

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Fuzzy-Search/chat-with-page&type=Date)](https://star-history.com/#Fuzzy-Search/chat-with-page&Date)
