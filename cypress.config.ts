const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://dummyjson.com",       
    specPattern: "features/**/*.cy.ts",     // Updated to match your test location
    supportFile: "cypress/support/e2e.ts"  // Enable support file for custom commands
  },
  video: false,                            
  screenshotOnRunFailure: true             
});
