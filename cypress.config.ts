import { defineConfig } from "cypress";

export default defineConfig({
  env: {
    localhost_url: "http://localhost:3000",
    yggio_url: "https://staging.yggio.net",
    username: "ek223ur",
    password: "test123",
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
