import { defineConfig } from "cypress";
import { rm } from "fs/promises";

export default defineConfig({
  env: {
    localhost_url: "http://localhost:3000",
    yggio_url: "https://staging.yggio.net",

    // Configure these in your local cypress.env.json.
    "tenant_username": "LNU_hyresgast_1",
    "tenant_password": "",
    "propertyowner_username": "lnu_fastighetsbolag_1",
    "propertyowner_password": "",
  },

  video: true,

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      require("cypress-terminal-report/src/installLogsPrinter")(on, {
        // printLogsToConsole: "onFail",
        printLogsToConsole: "always",
      });
      on("task", {
        async deleteDirectory(path) {
          if (!path.includes("cypress"))
            throw new Error(`Probably shouldn't delete path: ${path}`)
          await rm(path, {recursive: true, force: true});
          return null;  // Cypress requires returning null, not undefined.
        }
      });
    },
  },
});
