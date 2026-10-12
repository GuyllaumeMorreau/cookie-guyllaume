import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: process.env.GIFT_URL || "http://127.0.0.1:4173",
    browserName: "chromium",
    channel: process.env.PLAYWRIGHT_CHANNEL || "chrome",
    hasTouch: true,
  },
  webServer: process.env.GIFT_URL
    ? undefined
    : {
        command:
          "python3 -m http.server 4173 --bind 127.0.0.1 --directory dist",
        url: "http://127.0.0.1:4173",
      },
});
