# 🤖 Android Automation with Appium (Testing Only)

> ⚠️ **Disclaimer**  
> This repository is for **testing and educational purposes only**.  
> - Not intended for commercial or production use.  
> - Automating apps (YouTube, Instagram, Contacts, etc.) can lead to **account bans or restrictions**.  
> - The purpose is to learn **Appium + WebDriverIO automation on Android**.  
> - Do **not** use for spamming or bulk messaging.  

---

## 📖 Overview

This repo collects **Android automation examples** using **Appium** + **Node.js**.  

It includes ready-to-use scripts for:  
- 🎵 **YouTube Song Automation** → Search & play songs  
- 💬 **Instagram Messaging Automation** → Send DMs to users  
- 📇 **Contacts / Other App Automation** → Future examples  

Each automation runs as an **Express.js server** so you can trigger actions via simple HTTP requests (Postman, curl, or Node fetch).

---

## 🛠️ Common Setup

All automations in this repo share the same **base environment**.

### 1️⃣ Pull Appium Docker Image
```bash
docker pull appium/appium:v2.19.0-p3
```

### 2️⃣ Run Appium in Docker
```bash
docker run -d --name appium \
 -p 4723:4723 \
 --privileged \
 appium/appium:v2.19.0-p3
```

### 3️⃣ Connect Your Android Device via Wi-Fi (ADB over TCP/IP)
```bash
docker exec -it appium bash

adb connect YOUR_DEVICE_IP:5555
adb devices
```

> ⚠️ If you see `unauthorized`:  
> - Ensure PC & phone are on the **same Wi-Fi**  
> - Accept the **ADB debugging popup** on your phone  
> - Reconnect if needed  

---

## 📂 Usage Instructions

Each automation example in this repo comes with a `server.js` file.  

👉 To run:  

1. Copy the desired example code (e.g., `youtube/server.js` or `instagram/server.js`)  
2. Paste it into your local `server.js` file  
3. Install dependencies:
   ```bash
   npm install express webdriverio
   ```
4. Run the server:
   ```bash
   node server.js
   ```
5. Use **HTTP requests** to trigger actions.  

---

## 🚀 Automation Examples

### 🎵 YouTube Song Automation
- Search for a song  
- Auto-play the first result  
- Parse metadata (title, channel, views, duration, etc.)  

➡️ [See YouTube Automation README](./youtube/README.md)

---

### 💬 Instagram Messaging Automation
- Search for a user  
- Send a direct message  

➡️ [See Instagram Automation README](./instagram/README.md)

---

### 📇 Contacts & More
- Coming soon: automate contacts, messaging apps, and other Android use cases.

---

## ⚙️ Behind the Scenes

- **Dockerized Appium** → Handles automation server  
- **ADB over TCP/IP** → Connects your phone wirelessly  
- **WebDriverIO + Express.js** → Provides APIs (`/play`, `/data`, etc.)  
- **Appium Inspector (optional)** → Inspect Android UI elements  

---

## ✅ Summary

- One repo for **all Android automation examples**  
- Run **Appium in Docker** → No messy installs  
- Connect device via **ADB Wi-Fi**  
- Copy any example into `server.js` and run with Node.js  
- Control apps (YouTube, Instagram, Contacts, etc.) using **HTTP APIs**  

> 🚨 **Reminder**: This is only for **learning & testing automation**, not for production or spamming.  
