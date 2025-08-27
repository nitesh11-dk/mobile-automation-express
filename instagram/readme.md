# 💬 Instagram Messaging Automation (Testing Only)

> ⚠️ **Disclaimer**  
> This automation is for **testing and learning only**.  
> - Automating Instagram may violate Meta’s terms.  
> - Can lead to **account restrictions or bans**.  
> - Do **not** use for spam or bulk messaging.  
> - Purpose: to explore **Appium + Node.js** automation.

---

## 📖 Overview

This example demonstrates how to automate **Instagram messaging** on Android.  
It uses **Appium (Dockerized)** + **WebDriverIO** + **Express.js API**.  

With this setup, you can:  
- Open Instagram  
- Navigate to a profile  
- Send a **Direct Message (DM)** via an API call  

---

## 🛠️ Prerequisites

- Android device with Instagram installed & logged in  
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

### 2️⃣ Use `app.js`
Each folder contains an **`app.js`** file with its own example.  
For Instagram automation, simply use the `app.js` provided in the **Instagram folder**.  
---

### 3️⃣ Run server
```bash
node server.js
```

---

### 4️⃣ Send API request
Use **curl / Postman / fetch**:

```bash
curl -X POST http://localhost:3000/send \
  -H "Content-Type: application/json" \
  -d '{"username":"example_user","message":"Hello from Appium!"}'
```

✅ Instagram will open, navigate, and attempt to send the message.

---
### 5️⃣ n8n Integration (Optional)
This repo also provides an **`n8n.json`** file with a pre-configured **HTTP Request tool**.  
- Import it into your **n8n instance**.  
- The tool is already set up to connect to this API.  
- Once imported,you can Connect this tool to Ai agent.  

---

## 🔍 Debugging & Tips

- Use **Appium Inspector** to find the correct element selectors (search bar, profile, DM button).  
- If device doesn’t connect:  
  - Re-run `adb connect <IP>:5555` inside Appium container  
  - Accept **USB debugging popup** on phone  
- Keep logs open to see **selector errors**.

---

## ✅ Summary

- Uses **pinned versions**:  
  - `@wdio/appium-service@9.19.1`  
  - `@wdio/cli@9.19.1`  
  - `webdriverio@9.19.1`  
  - `express@5.1.0`  
- Provides a simple **Express API** for sending Instagram messages  
- Works via **Dockerized Appium + WebDriverIO**  
- Requires **manual selector updates** from Appium Inspector  
- 🚨 Educational only — not safe for production or bulk use
