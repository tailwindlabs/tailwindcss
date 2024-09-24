import { defineConfig, devices } from '@playwright/test'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        // https://playwright.dev/docs/test-use-options#more-browser-and-context-options
        launchOptions: {
          // https://playwright.dev/docs/api/class-browsertype#browser-type-launch-option-firefox-user-prefs
          firefoxUserPrefs: {
            // By default, headless Firefox runs as though no pointers
            // capabilities are available.
            // https://github.com/microsoft/playwright/issues/7769#issuecomment-966098074
            //
            // This impacts our `hover` variant implementation which uses an
            // '(hover: hover)' media query to determine if hover is available.
            //
            // Available values for pointer capabilities:
            // NO_POINTER            = 0x00;
            // COARSE_POINTER        = 0x01;
            // FINE_POINTER          = 0x02;
            // HOVER_CAPABLE_POINTER = 0x04;
            //
            // Setting to 0x02 | 0x04 says the system supports a mouse
            'ui.primaryPointerCapabilities': 0x02 | 0x04,
            'ui.allPointerCapabilities': 0x02 | 0x04,
          },
        },
      },
    },

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

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
})
