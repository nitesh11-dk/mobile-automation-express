# 🎥 YouTube Automation (Testing Only)

> ⚠️ **Disclaimer**  
> This automation is for **testing and learning only**.  
> - Automating YouTube may violate Google’s terms.  
> - May lead to **account restrictions**.  
> - Do **not** use for spam or botting.  
> - Purpose: to explore **Appium + Node.js** automation.

---

## 📖 Overview

This project demonstrates how to automate **YouTube search & playback** on Android using:  
- **Appium (Dockerized)**  
- **WebDriverIO**  
- **Express.js API**

In this folder, two implementations are provided:  

1. **`app.js`** → baseline version (response time is higher).  
2. **`app.js-v1`** → optimized version (response time is faster).  

Choose whichever fits your needs.

---

## 🛠️ Prerequisites

- Android device with YouTube installed & logged in  
- Developer options + **USB Debugging enabled**  
- PC and phone on the **same Wi-Fi**  
- **Docker + Node.js** installed  

> See [Repo Setup Guide](../README.md#-common-setup) for full environment setup.

---

## 🚀 Usage

### 1️⃣ Install dependencies
```bash
npm install \
  @wdio/appium-service@^9.19.1 \
  @wdio/cli@^9.19.1 \
  webdriverio@^9.19.1 \
  express@^5.1.0
```

---

### 2️⃣ Run server

- **Normal version (`app.js`)**:
  ```bash
  node app.js
  ```

- **Faster version (`app.js-v1`)**:
  ```bash
  node app.js-v1
  ```

---

### 3️⃣ Send API request

Example: play a YouTube video  

```bash
curl -X POST http://localhost:3000/play \
  -H "Content-Type: application/json" \
  -d '{"songName":"lofi hip hop beats"}'
```

---
### 4️⃣ n8n Integration (Optional)
This repo also provides an **`n8n.json`** file with a pre-configured **HTTP Request tool**.  
- Import it into your **n8n instance**.  
- The tool is already set up to connect to this API.  
- Once imported,you can Connect this tool to Ai agent.  

---

## 🔍 Debugging & Tips

- Use **Appium Inspector** to find selectors (search bar, video tiles, play button).  
- If device doesn’t connect:  
  - Re-run `adb connect <IP>:5555` inside Appium container  
  - Accept **USB debugging popup** on phone  

---

## ✅ Summary

- Two YouTube implementations provided:  
  - `app.js` → normal, slower response  
  - `app.js-v1` → optimized, faster response  
- Dependencies are **pinned versions**:  
  - `@wdio/appium-service@9.19.1`  
  - `@wdio/cli@9.19.1`  
  - `webdriverio@9.19.1`  
  - `express@5.1.0`  
- Educational only — not safe for production or bulk use.
