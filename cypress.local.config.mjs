import { defineConfig } from "cypress";
import * as dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  viewportWidth: 1280,
  viewportHeight: 1020,
  defaultCommandTimeout: 10000,
  env: {
    LOGIN_URL: "https://login.slsy.io/login",
    USER_EMAIL: process.env.LOCAL_USER_EMAIL,
    USER_PASSWORD: process.env.LOCAL_USER_PASSWORD,
    DATE_FORMAT: "MM/DD/YYYY",
  },
  e2e: {
    baseUrl: "https://app.slsy.io",
    experimentalSessionAndOrigin: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
