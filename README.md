# Cypress TypeScript API Testing Framework

This project demonstrates a highly parameterizable and maintainable Cypress TypeScript testing framework for API testing.

## 📁 Project Structure

```
├── cypress/
│   ├── fixtures/
│   │   ├── environments.json          # Environment-specific configuration
│   │   └── test-data.json            # Test data for data-driven testing
│   ├── support/
│   │   ├── page-objects/
│   │   │   └── ProductsAPI.ts        # Page Object for API operations
│   │   ├── commands.ts               # Custom Cypress commands
│   │   ├── test-config.ts           # Centralized test configuration
│   │   └── e2e.ts                   # Support file entry point
│   └── downloads/
├── features/
│   ├── products.cy.ts               # Basic parameterized tests
│   └── products-advanced.cy.ts     # Advanced testing patterns
├── cypress.config.ts                # Cypress configuration
├── package.json
└── tsconfig.json
```

## 🛠️ Configuration Options

### Environment Configuration (`cypress/fixtures/environments.json`)
```json
{
  "development": {
    "baseUrl": "https://dummyjson.com",
    "timeout": 10000,
    "retries": 2
  },
  "staging": {
    "baseUrl": "https://staging-api.example.com",
    "timeout": 15000,
    "retries": 3
  }
}
```

### Test Configuration (`cypress/support/test-config.ts`)
- **Endpoints**: Centralized API endpoint management
- **Test Data**: Default test data with proper typing
- **Status Codes**: Expected HTTP status codes
- **Helper Functions**: Reusable validation and request functions

### Test Data (`cypress/fixtures/test-data.json`)
- **Test Products**: Sample product data for testing
- **Search Queries**: Predefined search terms with expected results
- **Invalid Data**: Edge case test data for error handling

## 🧪 Usage Examples

### Basic Parameterized Test
```typescript
testConfig.testData.testProductIds.forEach(productId => {
    it(`should fetch product with ID ${productId}`, () => {
        makeApiRequest({
            method: 'GET',
            url: testConfig.endpoints.productById(productId),
        }).then((response) => {
            expect(response.status).to.equal(testConfig.expectedStatusCodes.success);
            validateProductStructure(response.body);
        });
    });
});
```

### Using Page Object Pattern
```typescript
const productsAPI = new ProductsAPI();

productsAPI.getAllProducts()
    .then((response) => {
        productsAPI.validateProductsListResponse(response);
    });
```

### Fixture-Based Testing
```typescript
cy.fixture('test-data').then((data) => {
    data.testProducts.forEach((product) => {
        // Use product data for testing
    });
});
```

### Custom Commands
```typescript
cy.apiRequest('GET', '/products')
    .then((response) => {
        cy.validateProductsList(response);
    });
```

## 🏃‍♂️ Running Tests

### Install Dependencies
```bash
npm install
```

### Run Tests
```bash
# Run all tests in headless mode
npx cypress run

# Open Cypress Test Runner
npx cypress open

# Run specific test file
npx cypress run --spec "features/products.cy.ts"

# Run with specific environment
npx cypress run --env environment=staging
```

### Environment Variables
```bash
# Set environment via command line
npx cypress run --env environment=production

# Or set in cypress.config.ts
env: {
  environment: "development"
}
```
