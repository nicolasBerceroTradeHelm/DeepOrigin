import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "https://dummyjson.com",
    specPattern: [
      "features/**/*.cy.ts",
      "cypress/e2e/**/*.cy.ts"
    ],
    supportFile: "cypress/support/e2e.ts",
    fixturesFolder: "cypress/fixtures",
    screenshotsFolder: "cypress/screenshots",
    videosFolder: "cypress/videos",
    downloadsFolder: "cypress/downloads",
    
    // Environment variables
    env: {
      environment: "development"
    },
    
    // Test configuration
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,
    
    // Retry configuration
    retries: {
      runMode: 2,
      openMode: 0
    },
    
    setupNodeEvents(on, config) {
      // Load environment-specific config
      const environment = config.env.environment || 'development';
      
      // You can add custom plugins here
      // Example: cy-terminal-report, cypress-mochawesome-reporter, etc.
      
      return config;
    },
  },
  
  // Global settings
  video: false,
  screenshotOnRunFailure: true,
  chromeWebSecurity: false,
  
  component: {
    devServer: {
      framework: "react",
      bundler: "webpack",
    },
  },
});
