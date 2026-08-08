const { defineConfig } = require("cypress");

module.exports = defineConfig({
  video: true,
  screenshotOnRunFailure: true,
  // Required to reach into Stripe Checkout's nested cross-origin iframe
  // (js.stripe.com) that renders the actual card form.
  chromeWebSecurity: false,

  screenshotsFolder: "cypress/screenshots",
  videosFolder: "cypress/videos",
  downloadsFolder: "cypress/downloads",

  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    reportDir: "cypress/reports",
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
    reportPageTitle: "VALR.PRO E2E Bug Report",
  },

  viewportWidth: 1440,
  viewportHeight: 900,

  defaultCommandTimeout: 10000,
  pageLoadTimeout: 60000,

  e2e: {
    baseUrl: "https://stage-veteran.valr.me",

    setupNodeEvents(on, config) {
      require("cypress-mochawesome-reporter/plugin")(on);
      on("task", {
        log(message) {
          console.log(message);
          return null;
        },
      });
      return config;
    },
  },
});
