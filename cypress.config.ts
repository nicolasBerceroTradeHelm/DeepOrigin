const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://dummyjson.com",       
    specPattern: "features/**/*.cy.{js,ts}",
    supportFile: "cypress/support/e2e.ts",
    setupNodeEvents(on, config) {
      // implement node event listeners here if needed
    },
  },
  video: false,                            
  screenshotOnRunFailure: true             
});
