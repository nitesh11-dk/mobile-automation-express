const express = require("express");
const wdio = require("webdriverio");

const app = express();
app.use(express.json());

const opts = {
  path: "/",
  port: 4723,
  capabilities: {
    platformName: "Android",
    "appium:deviceName": "192.168.1.35:5555",
    "appium:platformVersion": "12",
    "appium:automationName": "UiAutomator2",
    "appium:noReset": true,
  },
};

function parseSongDetails(desc) {
  const parts = desc.split(" - ").map((p) => p.trim());
  return {
    title: parts[0] || "Unknown",
    duration: parts[1] || "Unknown",
    channel: parts[3] || "Unknown",
    views: parts[4] || "Unknown",
    uploaded: parts[5] || "Unknown",
    raw: desc,
  };
}

// Global client pre-warmed
let client;
let isFirstRequest = true;

async function prewarmClient() {
  client = await wdio.remote(opts);
  await client.startActivity(
    "com.gold.android.youtube",
    "com.google.android.youtube.app.honeycomb.Shell$HomeActivity"
  );
  console.log("✅ YouTube app pre-launched and ready");
}

async function playSongFast(songName) {
  try {
    // Click Search icon
    const searchIcon = await client.$(
      'android=new UiSelector().description("Search")'
    );
    await searchIcon.waitForDisplayed({ timeout: 5000 });
    await searchIcon.click();

    // Type song
    const searchBox = await client.$(
      'android=new UiSelector().resourceId("com.gold.android.youtube:id/search_edit_text")'
    );
    await searchBox.waitForDisplayed({ timeout: 5000 });
    await searchBox.setValue(songName);
    await client.pressKeyCode(66); // Enter

    // First result
    const firstResult = await client.$(
      'android=new UiSelector().className("android.view.ViewGroup").clickable(true).index(0)'
    );
    await firstResult.waitForDisplayed({ timeout: 5000 });
    const desc = await firstResult.getAttribute("contentDescription");
    const parsed = parseSongDetails(desc);

    // Fire song play in background
    (async () => {
      try {
        await firstResult.click().catch(() => {});
        const scrim = await client.$(
          'android=new UiSelector().resourceId("com.gold.android.youtube:id/cinematic_scrim")'
        );
        await scrim.waitForDisplayed({ timeout: 2000 }).catch(() => {});
        await scrim.click().catch(() => {});
      } catch (e) {
        console.error("Background playback error", e);
      }
    })();

    return { requested: songName, ...parsed, status: "Playing in background" };
  } catch (err) {
    return { requested: songName, error: err.message };
  }
}

async function playSong(songName) {
  if (!client) {
    return { error: "Appium client not ready" };
  }

  try {
    if (isFirstRequest) {
      isFirstRequest = false; // Mark first request done
      return await playSongFast(songName);
    } else {
      // Subsequent requests
      const searchIcon = await client.$(
        'android=new UiSelector().description("Search")'
      );
      await searchIcon.waitForDisplayed({ timeout: 5000 });
      await searchIcon.click();

      const searchBox = await client.$(
        'android=new UiSelector().resourceId("com.gold.android.youtube:id/search_edit_text")'
      );
      await searchBox.waitForDisplayed({ timeout: 5000 });
      await searchBox.setValue(songName);

      await client.pressKeyCode(66); // Enter

      const firstResult = await client.$(
        'android=new UiSelector().className("android.view.ViewGroup").clickable(true).index(0)'
      );
      await firstResult.waitForDisplayed({ timeout: 5000 });
      const desc = await firstResult.getAttribute("contentDescription");
      const parsed = parseSongDetails(desc); // ✅ Parse here

      await firstResult.click();

      const scrim = await client.$(
        'android=new UiSelector().resourceId("com.gold.android.youtube:id/cinematic_scrim")'
      );
      await scrim.waitForDisplayed({ timeout: 3000 }).catch(() => {});
      await scrim.click().catch(() => {});

      return {
        requested: songName,
        ...parsed,
        status: "Playing in background (subsequent request)",
      };
    }
  } catch (err) {
    return { requested: songName, error: err.message };
  }
}

app.post("/play", async (req, res) => {
  const songName = req.body.name;
  if (!songName) {
    return res.status(400).json({ error: "Provide song name { name: '...' }" });
  }
  console.log(`🎵 Request received: ${songName}`);
  const details = await playSong(songName);
  res.json(details);
});

app.listen(3000, async () => {
  console.log("Server running on http://localhost:3000");
  await prewarmClient(); // Pre-launch YouTube app
});
