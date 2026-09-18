import { defineConfig, devices } from "@playwright/test";

/** この環境には Chromium が同梱済み。パスは PLAYWRIGHT_CHROMIUM_PATH で差し替えられる。 */
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  reporter: process.env.CI ? [["list"]] : [["list"]],
  timeout: 60_000,
  use: {
    baseURL: "http://127.0.0.1:4321",
    launchOptions: executablePath ? { executablePath } : {},
  },
  webServer: {
    command: "node tests/static-server.mjs",
    url: "http://127.0.0.1:4321/",
    reuseExistingServer: true,
    timeout: 30_000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
