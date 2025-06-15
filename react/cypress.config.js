import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    defaultCommandTimeout: 1000,
    experimentalMemoryManagement: true,
    numTestsKeptInMemory: 1,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
