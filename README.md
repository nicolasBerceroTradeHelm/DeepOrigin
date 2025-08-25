# DeepOrigin Cypress API Testing Suite

A comprehensive TypeScript-based Cypress testing suite for API testing using the DummyJSON Products API. This project demonstrates modern API testing patterns including parameterization, maintainability, and advanced testing concepts.

Autor: Nicolas Bercero

## 🚀 Features

- **Complete CRUD Operations Testing** - Create, Read, Update, Delete operations
- **Page Object Pattern** - Maintainable and reusable API interaction layer
- **Performance Testing** - Response time validation and monitoring
- **Contract Testing** - Schema validation for API responses
- **Sorting Validation** - Client-side sorting verification for API responses
- **TypeScript Support** - Full type safety and IntelliSense
- **Parameterized Tests** - Data-driven testing with fixture files

## 📁 Project Structure

```
DeepOrigin/
├── features/
│   └── products.cy.ts          # Main test suite
├── cypress/
│   ├── fixtures/
│   │   ├── environments.json   # Environment configurations (not actually used atm, example for irl)
│   │   └── test-data.json      # Test data for parameterized tests
│   └── support/
│       ├── page-objects/
│       │   └── ProductsAPI.ts  # API interaction layer
│       ├── commands.ts         # Custom Cypress commands
│       └── e2e.ts             # Support file setup
├── cypress.config.ts           # Cypress configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies and scripts
```

## 🛠️ Setup & Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DeepOrigin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run tests**
   ```bash
   # Run tests headlessly
   npx cypress run

   # Open Cypress UI
   npx cypress open
   ```

## 🧪 Test Coverage

### Basic API Operations
- ✅ Fetch all products with response validation
- ✅ Fetch single product by ID
- ✅ Search products with query parameters
- ✅ Create new product (mock API)
- ✅ Update existing product (mock API)
- ✅ Delete product (mock API)

### Advanced Testing Patterns
- ✅ **Sorting Tests**: Ascending/Descending title sorting with client-side validation
- ✅ **Performance Testing**: Response time measurement and thresholds
- ✅ **Contract Testing**: Schema validation for products and product lists
- ✅ **Page Object Pattern**: Centralized API interaction methods

## 🏗️ Key Components

### ProductsAPI Page Object
Located in `cypress/support/page-objects/ProductsAPI.ts`, this class provides:
- `getAllProducts()` - Fetch all products
- `getProductById(id)` - Fetch specific product
- `searchProducts(query)` - Search products
- `addProduct(product)` - Create new product
- `updateProduct(id, updates)` - Update existing product
- `deleteProduct(id)` - Delete product
- Validation methods for responses

### Test Data Management
- **Environment Configuration**: `cypress/fixtures/environments.json`
- **Test Data**: `cypress/fixtures/test-data.json`
- Supports multiple environments (development, staging, production) // this is an example for real life deployment

## 🔧 Configuration

### Cypress Configuration
- **Base URL**: `https://dummyjson.com`
- **Spec Pattern**: `features/**/*.cy.{js,ts}`
- **Support File**: `cypress/support/e2e.ts`
- **Video Recording**: Disabled
- **Screenshots**: Enabled on failure

## 🎯 Best Practices Demonstrated

1. **Maintainable Code Structure**
   - Page Object Pattern for API interactions
   - Separation of test data and test logic
   - Reusable validation methods

2. **Comprehensive Testing**
   - Happy path and edge case testing
   - Response validation and schema testing
   - Performance and contract testing

4. **Data-Driven Testing**
   - External fixture files for test data
   - Environment-specific configurations
   - Parameterized test execution
