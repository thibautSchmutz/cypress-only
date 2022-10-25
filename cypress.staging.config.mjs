import { defineConfig } from "cypress";

export default defineConfig({
  viewportWidth: 1280,
  viewportHeight: 1020,
  env: {
    USER_EMAIL: "staging@sellsy.com",
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
