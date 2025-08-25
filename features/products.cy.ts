import {
    testConfig,
    makeApiRequest,
    validateProductStructure,
    validateProductsListResponse,
    type Product,
    type ProductsListResponse
} from '../cypress/support/test-config';

describe('DummyJSON Products API', () => {
    // Load test data from fixtures
    let testData: any;
    let environments: any;

    before(() => {
        cy.fixture('test-data').then((data) => {
            testData = data;
        });
        cy.fixture('environments').then((env) => {
            environments = env;
        });
    });

    it('should fetch all products', () => {
        makeApiRequest({
            method: 'GET',
            url: testConfig.endpoints.products,
        }).then((response) => {
            validateProductsListResponse(response);
            
            // Additional validations
            if (response.body.products.length > 0) {
                validateProductStructure(response.body.products[0]);
            }
        });
    });

    it('should fetch a single product by ID', () => {
        makeApiRequest({
            method: 'GET',
            url: testConfig.endpoints.productById(testConfig.testData.validProductId),
        }).then((response) => {
            expect(response.status).to.equal(testConfig.expectedStatusCodes.success);
            expect(response.body).to.have.property('id', testConfig.testData.validProductId);
            validateProductStructure(response.body, ['id', 'title', 'description', 'price']);
        });
    });

    it('should search products via query parameter', () => {
        makeApiRequest({
            method: 'GET',
            url: testConfig.endpoints.search,
            qs: { q: testConfig.testData.searchQuery },
        }).then((response) => {
            validateProductsListResponse(response);
            
            // Verify search results contain the query term
            if (response.body.products.length > 0) {
                const hasMatchingProducts = response.body.products.some((product: Product) => 
                    product.title.toLowerCase().includes(testConfig.testData.searchQuery.toLowerCase()) ||
                    product.description.toLowerCase().includes(testConfig.testData.searchQuery.toLowerCase())
                );
                expect(hasMatchingProducts).to.be.true;
            }
        });
    });

    it('should add a new product (mock)', () => {
        cy.request({
            method: 'POST',
            url: testConfig.endpoints.add,
            body: testConfig.testData.newProduct,
            headers: { 'Content-Type': 'application/json' },
        }).then((response) => {
            expect(response.status).to.equal(testConfig.expectedStatusCodes.created);
            
            // Verify the response contains the submitted data
            expect(response.body).to.include({
                title: testConfig.testData.newProduct.title,
                price: testConfig.testData.newProduct.price,
                description: testConfig.testData.newProduct.description,
            });
            
            expect(response.body).to.have.property('id').that.is.a('number');
            validateProductStructure(response.body);
        });
    });

    it('should update an existing product (mock)', () => {
        makeApiRequest({
            method: 'PUT',
            url: testConfig.endpoints.update(testConfig.testData.validProductId),
            body: testConfig.testData.updateData,
            headers: { 'Content-Type': 'application/json' },
        }).then((response) => {
            expect(response.status).to.equal(testConfig.expectedStatusCodes.success);
            expect(response.body).to.have.property('title', testConfig.testData.updateData.title);
            expect(response.body).to.have.property('id', testConfig.testData.validProductId);
            validateProductStructure(response.body);
        });
    });

    it('should delete a product (mock)', () => {
        makeApiRequest({
            method: 'DELETE',
            url: testConfig.endpoints.delete(testConfig.testData.validProductId),
        }).then((response) => {
            expect(response.status).to.equal(testConfig.expectedStatusCodes.success);
            expect(response.body).to.include.keys('id', 'isDeleted', 'deletedOn');
            expect(response.body).to.have.property('id', testConfig.testData.validProductId);
            expect(response.body.isDeleted).to.be.true;
            expect(response.body.deletedOn).to.be.a('string');
        });
    });

    describe('Parameterized Tests', () => {
        testConfig.testData.testProductIds.forEach(productId => {
            it(`should fetch product with ID ${productId}`, () => {
                makeApiRequest({
                    method: 'GET',
                    url: testConfig.endpoints.productById(productId),
                }).then((response) => {
                    expect(response.status).to.equal(testConfig.expectedStatusCodes.success);
                    expect(response.body).to.have.property('id', productId);
                    validateProductStructure(response.body);
                });
            });
        });

        testConfig.testData.searchQueries.forEach(query => {
            it(`should search for products with query: "${query}"`, () => {
                makeApiRequest({
                    method: 'GET',
                    url: testConfig.endpoints.search,
                    qs: { q: query },
                }).then((response) => {
                    validateProductsListResponse(response);
                });
            });
        });
    });

    describe('Fixture-based Tests', () => {
        it('should test products from fixture data', function () {
            // Using function() instead of arrow function to access this.testData
            cy.fixture('test-data').then((data) => {
                data.testProducts.forEach((product: Product) => {
                    if (product.id) {
                        cy.request({
                            method: 'GET',
                            url: testConfig.endpoints.productById(product.id),
                        }).then((response) => {
                            expect(response.status).to.equal(testConfig.expectedStatusCodes.success);
                            validateProductStructure(response.body);
                        });
                    }
                });
            });
        });

        it('should test search queries from fixture', () => {
            cy.fixture('test-data').then((data) => {
                data.searchQueries.forEach((searchTest: any) => {
                    cy.request({
                        method: 'GET',
                        url: testConfig.endpoints.search,
                        qs: { q: searchTest.query },
                    }).then((response) => {
                        validateProductsListResponse(response);
                        expect(response.body.products.length).to.be.at.least(searchTest.expectedMinResults);
                    });
                });
            });
        });
    });

    // Edge cases and error handling
    describe('Error Handling', () => {
        it('should handle non-existent product ID gracefully', () => {
            cy.fixture('test-data').then((data) => {
                makeApiRequest({
                    method: 'GET',
                    url: testConfig.endpoints.productById(data.invalidData.nonExistentProductId),
                }).then((response) => {
                    expect(response.status).to.equal(testConfig.expectedStatusCodes.notFound);
                });
            });
        });

        it('should handle empty search query', () => {
            makeApiRequest({
                method: 'GET',
                url: testConfig.endpoints.search,
                qs: { q: '' },
            }).then((response) => {
                expect(response.status).to.equal(testConfig.expectedStatusCodes.success);
                expect(response.body).to.have.property('products');
            });
        });

        it('should handle invalid product ID formats', () => {
            cy.fixture('test-data').then((data) => {
                makeApiRequest({
                    method: 'GET',
                    url: testConfig.endpoints.productById(data.invalidData.invalidProductId),
                }).then((response) => {
                    expect([testConfig.expectedStatusCodes.notFound, testConfig.expectedStatusCodes.badRequest])
                        .to.include(response.status);
                });
            });
        });
    });
});
