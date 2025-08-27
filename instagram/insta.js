const express = require("express");
const wdio = require("webdriverio");

const app = express();
app.use(express.json()); // for parsing application/json

// This will hold our active Appium session client
let client;

// Appium connection options
const opts = {
  path: "/",
  port: 4723,
  capabilities: {
    platformName: "Android",
    "appium:deviceName": "192.168.1.35:5555", // Replace with your device name/ID
    "appium:platformVersion": "12", // Replace with your Android version
    "appium:automationName": "UiAutomator2",
    "appium:noReset": true, // Keeps the app data between sessions
    "appium:newCommandTimeout": 300, // Increase timeout to keep session alive
  },
};

/**
 * Initializes the Appium client and launches Instagram.
 * This function is called once when the server starts.
 */
async function initializeAndLaunchApp() {
  try {
    console.log("Initializing Appium session...");
    client = await wdio.remote(opts);
    console.log("Session created successfully.");

    await client.startActivity(
      "com.instagram.android",
      ".activity.MainTabActivity"
    );
    console.log("Instagram app launched and is ready.");
  } catch (err) {
    console.error(
      "[FATAL] Could not initialize Appium client or launch Instagram.",
      err
    );
    process.exit(1);
  }
}

// API endpoint to send a message
app.post("/data", async (req, res) => {
  const { username, message } = req.body;
  if (!client) {
    return res.status(503).json({
      success: false,
      message: "Appium client is not initialized. Server might be starting up.",
    });
  }

  if (!username || !message) {
    return res.status(400).json({
      success: false,
      message: "Username and message are required",
    });
  }

  try {
    console.log("--- New Request Received ---");
    // Click Search tab
    const searchTab = await client.$(
      'android=new UiSelector().resourceId("com.instagram.android:id/search_tab")'
    );
    await searchTab.waitForDisplayed({ timeout: 1000 });
    await searchTab.click();
    console.log("Step 2: Search tab clicked");

    // Type username in search box
    let searchBox = await client.$(
      'android=new UiSelector().resourceId("com.instagram.android:id/action_bar_search_edit_text")'
    );
    if (!(await searchBox.isExisting())) {
      searchBox = await client.$(
        'android=new UiSelector().className("android.widget.EditText").textContains("Search")'
      );
    }
    await searchBox.waitForDisplayed({ timeout: 1000 });
    await searchBox.click();
    await searchBox.setValue(username);
    console.log("Step 3: Username typed");

    // Click on user from search result
    const userResult = await client.$(
      'android=new UiSelector().resourceId("com.instagram.android:id/row_search_user_info_container")'
    );
    await userResult.waitForDisplayed({ timeout: 1000 });
    await userResult.click();
    console.log("Step 4: User profile opened");

    // Click Message button
    const messageBtn = await client.$(
      'android=new UiSelector().resourceId("com.instagram.android:id/button_container")'
    );
    await messageBtn.waitForDisplayed({ timeout: 1000 });
    await messageBtn.click();
    console.log("Step 5: Message button clicked");

    // Type message
    const messageBox = await client.$(
      'android=new UiSelector().resourceId("com.instagram.android:id/row_thread_composer_edittext")'
    );
    await messageBox.waitForDisplayed({ timeout: 1000 });
    await messageBox.click();
    await messageBox.setValue(message);
    console.log("Step 6: Message typed");

    // Click Send
    const sendBtn = await client.$(
      'android=new UiSelector().resourceId("com.instagram.android:id/row_thread_composer_send_button_background")'
    );
    await sendBtn.waitForDisplayed({ timeout: 1000 });
    await sendBtn.click();
    console.log("Step 7: Message sent");

    // Send the response immediately after the message is sent
    res.json({
      success: true,
      message:
        "Message sent. The app is now navigating back to the home screen.",
    });
    console.log("--- Response Sent ---");

    // The rest of the process runs asynchronously without blocking the response
    console.log("Resuming cleanup process...");
    try {
      // Clean up process runs after the response
      for (let i = 0; i < 4; i++) {
        await client.back();
        console.log(`Cleanup: Back pressed (${i + 1}/4)`);
      }
      const homeBtn = await client.$(
        'android=new UiSelector().resourceId("com.instagram.android:id/feed_tab")'
      );
      await homeBtn.waitForDisplayed({ timeout: 1000 });
      await homeBtn.click();
      console.log("Cleanup: Returned to Home");
    } catch (cleanupErr) {
      console.error(
        "[ERROR] An error occurred during the cleanup flow.",
        cleanupErr
      );
    }
  } catch (err) {
    console.error("[ERROR] An error occurred during the automation flow.", err);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "An error occurred during the process.",
      });
    }
  }
});

// Start the server and initialize the Appium client
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
  initializeAndLaunchApp();
});

// Gracefully close the Appium session on server shutdown (e.g., Ctrl+C)
process.on("SIGINT", async () => {
  console.log("\nShutting down server...");
  if (client) {
    try {
      console.log("Deleting Appium session...");
      await client.deleteSession();
      console.log("Session deleted.");
    } catch (err) {
      console.error("Error deleting Appium session:", err);
    }
  }
  process.exit(0);
});
