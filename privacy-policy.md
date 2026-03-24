---
layout: page
title: "Privacy Policy"
permalink: /privacy-policy/
---

# Privacy Policy for Responsive Deck

**Last Updated:** March 2026

Responsive Deck is a locally-run developer tool built to assist frontend engineers in testing responsive layouts. We believe in absolute data privacy and transparency.

**1. Data Collection and Usage**
Responsive Deck **does not** collect, transmit, distribute, or sell any personal user data, browsing history, or analytics to external servers or third parties.

**2. Local Storage**
The extension requests the `storage` permission strictly to function. When a user clicks "Go with current URL", the active tab's URL is temporarily saved to your browser's local hard drive (`browser.storage.local`) so it can be passed to the extension's dashboard.

- **Data Wiping:** This stored URL is immediately and permanently deleted from your local storage the exact moment the dashboard tab is closed or disconnected.

**3. Network Interception (declarativeNetRequest)**
The extension uses the `declarativeNetRequest` API to strip `X-Frame-Options` and `Content-Security-Policy` headers. This is done **strictly locally** within your browser to allow cross-origin websites to render inside the tool's `iframes`. We do not log, monitor, or transmit any of your network traffic.

**4. Contact**
If you have any questions or concerns, please open an issue on our public GitHub repository: https://github.com/itsmemuqorrobin/Responsive-Deck or direct contact me at developer.muqorrobin@gmail.com
