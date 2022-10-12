const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportWidth: 1280,
  viewportHeight: 1020,
  env: {
    LOGIN_URL: "https://login.slsy.io/login",
    USER_EMAIL: "admin@sellsy.com",
    USER_PASSWORD: "admin",
  },
  e2e: {
    baseUrl: "https://app.slsy.io",
    experimentalSessionAndOrigin: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});