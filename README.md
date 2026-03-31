# 📱 Responsive Deck

[![Built with WXT](https://img.shields.io/badge/Built_with-WXT-1B1B1F?logo=wxt)](https://wxt.dev)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**A lightning-fast, browser-native developer tool for testing responsive web layouts.** Responsive Deck allows frontend engineers to preview local (e.g., `localhost:3000`) and live websites across multiple device viewports simultaneously—without the bloat of heavy Electron-based desktop apps.

![Responsive Deck Demo](./public/demo.gif)

---

## ✨ Features

- **Multi-Viewport Grid:** View your layout on Mobile, Tablet, and Desktop simultaneously.
- **Synchronized Scrolling:** Scroll on one device, and all other devices scroll perfectly in sync.
- **Security Bypass:** Successfully renders highly secure websites (like GitHub) that normally block `iframes` via strict `X-Frame-Options` or `Content-Security-Policy`.
- **Zero Bloat:** Runs entirely within your browser natively. No heavy Node/Electron backends eating your RAM.
- **One-Click "Current Tab" Testing:** Click the extension popup to instantly throw your current active tab into the responsive dashboard.

---

## 🏗️ Architecture Overview

<!-- Building a responsive checker as a browser extension (instead of a desktop app) presents severe browser-security challenges. Responsive Deck solves these using advanced Manifest V3 capabilities: -->

### 1. The `X-Frame-Options` Bypass (declarativeNetRequest)

Most modern websites forbid being embedded in `iframes` to prevent clickjacking.
Responsive Deck utilizes Chrome's `declarativeNetRequest` API at the Service Worker level. When the dashboard requests a URL, the background worker intercepts the network response and dynamically strips the `X-Frame-Options` and `Content-Security-Policy` headers _only_ for **sub-frames** originating from the extension. This safely allows external sites to render inside the tool's dashboard.

### 2. The Same-Origin Policy (SOP) Bypass for Sync Scrolling

Because the tool embeds cross-origin websites, the main React application cannot read the `window.scrollY` of the iframes (blocked by SOP).
To achieve **Synchronized Scrolling**, this extension injects a **Content Script** inside the sandboxed iframes. The Content Script reads the local scroll events and uses `window.postMessage` to communicate securely through the iframe boundary to the React parent, which then distributes the scroll coordinates to the other devices.

### 3. The Dashboard Approach (Options UI)

To keep the tool lightweight and non-intrusive, Responsive Deck renders its `iframes` inside a dedicated, isolated Extension Dashboard (using the `Options UI` API). This ensures your current active tab's behavior remains completely untouched. Moving forward, this isolated UI paves the way for advanced features, including injecting a fully-fledged DevTools panel directly into the dashboard for a native developer experience.

---

## 🔒 Privacy & Security First

Responsive Deck was built with a paranoid focus on security. It is purely a local developer tool that I have been using locally before I decided to wrap it with WXT framework and publish it in regards of helping other developers. **It does not collect, store, or transmit any personal data, analytics, or browsing history to external servers.** Any data required to make the extension function (such as using `browser.storage.local` to pass your active tab's URL to the dashboard) is kept strictly on your local machine and is **wiped immediately** the moment you close the dashboard. You can audit the source code here to verify this.

---

## ⚠️ Known Limitations & The `iframe` Trade-off

Because Responsive Deck is a lightweight browser extension and not a heavyweight Electron app, it utilizes native `iframes` rather than isolated `<webview>` instances.

Consequently, highly secure sites utilizing aggressive Cloudflare bot-protection may occasionally refuse to render or require human verification. This is an accepted architectural trade-off to keep the tool lightning-fast, secure, and native to your browser.

---

## 🗺️ The "70%" MVP & Roadmap

As the very first product I am launching, I intentionally focused on a minimalist, highly polished core. This MVP is designed to cover about 70% of a frontend developer's day-to-day responsive testing needs.

<!-- I am actively planning advanced features for future releases (such as injecting a dedicated DevTools panel directly into the dashboard). You can view the exact upcoming feature pipeline on our **[GitHub Projects Kanban Board](#)**. -->

---

## 🛠️ Tech Stack

- **Framework:** [WXT](https://wxt.dev/) (Next-gen framework for browser extensions)
- **UI Library:** React 19
- **Styling:** Tailwind CSS
- **State Management:** Zustand (Global State)
- **Background:** Manifest V3 Service Workers

---

## 🚀 Local Development

Want to contribute or run the tool locally? It's incredibly easy to set up.

1. **Clone the repository:**

   ```bash
   cd responsive-deck
   ```

2. **Run automatically with WXT:**

   ```bash
   npm install
   npm run dev
   ```

   _This will automatically launch and open a sandboxed instance of Chrome with the extension tied to it and Hot Module Replacement (HMR) enabled._

## 🤝 Curated Contributions

While the source code is 100% open-source for you to audit, fork, and learn from, I am currently maintaining a Curated Contribution Model to ensure the tool doesn't suffer from feature bloat.

I am absolutely open to community help, but to respect everyone's time:

- Please do not submit unannounced Pull Requests.
- If you would like to contribute, please check the Roadmap Kanban Board to see what is currently needed.
- Open an Issue or Discussion first with your proposal so we can align on the vision before you write any code.

## 📝 License

Distributed under the MIT License.

## ‼️ Privacy Policy

[Privacy Policy](https://itsmemuqorrobin.github.io/Responsive-Deck/privacy-policy/)
