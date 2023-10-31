## Welcome Developers and Contributors

### Getting Started

To set up the development environment, install the dependencies and start the development server:

```bash
pnpm install
# ->
pnpm run dev
```

Launch your preferred browser and load the development build suitable for your context. For instance, if you're developing for Chrome using manifest v3, navigate to: `build/chrome-mv3-dev`.

### Understanding the Extension

To help you understand the workings of the extension, we are working on:

- A detailed video walkthrough
- A comprehensive diagrammatic representation
- A textual explanation of the process

### Building for Production

To create a production build of the extension, run:

```bash
pnpm build
```

The production-ready files will be located in the "build" folder.

### Loading the Extension in Chrome

To load the extension in Chrome, navigate to chrome://extensions and enable Developer Mode.

![Alt text](image.png)

Click on "Load Unpacked" and navigate to your extension's build/chrome-mv3-dev (or build/chrome-mv3-prod) directory.

### Contributing to chrome-search

We welcome contributions! Here's our current to-do list:

- Replace local-stream repo with a more compact Node.js implementation of the streaming, ensuring compatibility with Vercel AI and OpenAI npm modules.

### Built with Plasmo

This extension is built with Plasmo. Learn more about it [here](https://docs.plasmo.com/).
