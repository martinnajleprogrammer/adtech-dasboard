import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const PORT = 3100;
const BASE_URL = `http://localhost:${PORT}`;
const isCI = !!process.env.CI;
export default defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  // `open: 'never'` keeps the terminal/job from blocking on the report server.
  // In CI the `github` reporter adds failure annotations to the PR.
  reporter: isCI
    ? [['github'], ['html', { open: 'never' }]]
    : [['html', { open: 'never' }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: BASE_URL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /*
   * Dedicated server for the tests, never reused, so the env below always applies.
   * Local: dev server (fast feedback). CI: production server (`next start`); the app is
   * built in a separate workflow step so a compile error shows up as "build failed".
   * To reproduce CI locally: `npm run build && CI=1 npm run test:e2e`.
   */
  webServer: {
    command: isCI ? `npm run start -- --port ${PORT}` : `npm run dev -- --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: false,
    timeout: 120_000, // dev compiles routes on first request
    env: {
      // Server-side only, read at runtime (the page is dynamic: it reads searchParams)
      E2E_FIXED_AUCTIONS: '1',
      LIVE_REFRESH_MS: '0',
    },
  },
});
