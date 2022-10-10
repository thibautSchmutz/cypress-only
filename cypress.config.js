const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportWidth: 1280,
  viewportHeight: 1020,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
