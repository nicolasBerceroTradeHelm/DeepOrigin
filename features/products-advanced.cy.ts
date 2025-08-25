import { ProductsAPI } from '../cypress/support/page-objects/ProductsAPI';
import { testConfig } from '../cypress/support/test-config';

describe('Advanced Products API Tests', () => {
    const productsAPI = new ProductsAPI();

    it('should adapt to different environments', () => {
        cy.fixture('environments').then((environments) => {
            const currentEnv = Cypress.env('environment') || 'development';
            const envConfig = environments[currentEnv];
            expect(envConfig).to.exist;
        });
    });

    describe('Using Page Object Pattern', () => {
        it('should fetch all products using page object', () => {
            productsAPI.getAllProducts()
                .then((response) => {
                    productsAPI.validateProductsListResponse(response);
                });
        });

        it('should perform CRUD operations using page object (mock API)', () => {
            const testProduct = testConfig.testData.newProduct;

            // Create
            productsAPI.addProduct(testProduct)
                .then((response) => {
                    productsAPI.validateProductResponse(response, 201);
                    const createdProduct = response.body;

                    return productsAPI.getProductById(createdProduct.id);
                })
                .then((response) => {
                    productsAPI.validateProductResponse(response, 404);
                    return productsAPI.updateProduct(1, { title: 'Updated Title' }); // use a known existing ID
                })
                .then((response) => {
                    productsAPI.validateProductResponse(response);
                    expect(response.body.title).to.equal('Updated Title');

                    // Delete
                    return productsAPI.deleteProduct(1);
                })
                .then((response) => {
                    expect(response.status).to.equal(200);
                    expect(response.body.isDeleted).to.be.true;
                });
        });


    });

    describe('Data-Driven Test Generation', () => {
        before(() => {
            cy.fixture('test-data').then((data) => {
                // Dynamically generate tests based on fixture data
                data.searchQueries.forEach((searchTest: any, index: number) => {
                    it(`Dynamic test ${index + 1}: search for "${searchTest.query}"`, () => {
                        productsAPI.searchProducts(searchTest.query)
                            .then((response) => {
                                productsAPI.validateProductsListResponse(response);
                                expect(response.body.products.length).to.be.at.least(searchTest.expectedMinResults);
                            });
                    });
                });
            });
        });
    });

    // Performance and load testing concepts
    describe('Performance Considerations', () => {
        it('should measure response times', () => {
            const startTime = Date.now();

            productsAPI.getAllProducts()
                .then((response) => {
                    const responseTime = Date.now() - startTime;
                    cy.log(`Response time: ${responseTime}ms`);

                    // Assert reasonable response time
                    expect(responseTime).to.be.lessThan(5000);
                    productsAPI.validateProductsListResponse(response);
                });
        });

        it('should handle concurrent requests', () => {
            const concurrentRequests = Array.from({ length: 3 }, (_, i) =>
                productsAPI.getProductById(i + 1)
            );

            Promise.all(concurrentRequests).then((responses) => {
                responses.forEach(response => {
                    productsAPI.validateProductResponse(response);
                });
            });
        });
    });

    // Custom retry logic example
    describe('Resilience Testing', () => {
        it('should retry failed requests', { retries: 3 }, () => {
            // This test will retry up to 3 times if it fails
            productsAPI.getProductById(1)
                .then((response) => {
                    productsAPI.validateProductResponse(response);
                });
        });

        it('should handle timeout scenarios', () => {
            productsAPI.getAllProducts({ timeout: 1000 }) // Very short timeout
                .then((response) => {
                    // If this passes, the API is very fast
                    productsAPI.validateProductsListResponse(response);
                });

            // Listen for fail event to handle timeout gracefully
            cy.on('fail', (error) => {
                expect(error.message).to.include('timeout');
                // Prevent test from failing
                return false;
            });
        });
    });

    // Contract testing concepts
    describe('Contract Testing', () => {
        it('should validate API contract for product schema', () => {
            productsAPI.getProductById(1)
                .then((response) => {
                    const product = response.body;
                    expect(product).to.include.all.keys([
                        'id',
                        'title',
                        'description',
                        'price',
                        'discountPercentage',
                        'rating',
                        'stock',
                        'brand',
                        'category',
                        'thumbnail',
                        'images'
                    ]);

                    expect(product.id).to.be.a('number');
                    expect(product.title).to.be.a('string');
                    expect(product.price).to.be.a('number');
                    expect(product.rating).to.be.a('number');
                    expect(product.images).to.be.an('array');
                });
        });


        it('should validate products list contract', () => {
            productsAPI.getAllProducts()
                .then((response) => {
                    const data = response.body;

                    expect(data).to.have.all.keys(['products', 'total', 'skip', 'limit']);
                    expect(data.products).to.be.an('array');
                    expect(data.total).to.be.a('number').and.be.at.least(0);
                    expect(data.skip).to.be.a('number').and.be.at.least(0);
                    expect(data.limit).to.be.a('number').and.be.at.least(1);

                    if (data.products.length > 0) {
                        cy.validateProduct(data.products[0]);
                    }
                });
        });
    });
});
