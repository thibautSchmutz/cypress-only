import { defineConfig } from "cypress";
import * as dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  viewportWidth: 1280,
  viewportHeight: 1020,
  defaultCommandTimeout: 10000,
  env: {
    LOGIN_URL: "https://develop.sip.test.slsy.io/login",
    USER_EMAIL: process.env.DEVELOP_USER_EMAIL,
    USER_PASSWORD: process.env.DEVELOP_USER_PASSWORD,
    DATE_FORMAT: "MM/DD/YYYY",
  },
  e2e: {
    baseUrl: "https://develop.app.test.slsy.io/",
    experimentalSessionAndOrigin: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
