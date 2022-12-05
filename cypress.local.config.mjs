import { defineConfig } from "cypress";
import CypressOTP from "cypress-otp";
import * as dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  viewportWidth: 1280,
  viewportHeight: 1020,
  defaultCommandTimeout: 10000,
  video: false,
  chromeWebSecurity: false,
  env: {
    LOGIN_URL: "https://login.slsy.io/login",
    USER_EMAIL: process.env.LOCAL_USER_EMAIL,
    USER_PASSWORD: process.env.LOCAL_USER_PASSWORD,
    TWO_FA_VERIFICATION_CODE: process.env.LOCAL_TWO_FA_VERIFICATION_CODE,
    DATE_FORMAT: "MM/DD/YYYY",
  },
  e2e: {
    baseUrl: "https://app.slsy.io",
    experimentalSessionAndOrigin: true,
    setupNodeEvents(on, config) {
      on("task", {
        generateOTP: CypressOTP,
      });
      // implement node event listeners here
    },
  },
});
