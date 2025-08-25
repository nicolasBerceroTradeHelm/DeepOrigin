// cypress/support/commands.ts

// Custom commands for API testing
declare global {
    namespace Cypress {
        interface Chainable {
            /**
             * Custom command to make authenticated API requests
             * @example cy.apiRequest('GET', '/products')
             */
            apiRequest(method: string, url: string, body?: any, options?: Partial<Cypress.RequestOptions>): Chainable<Cypress.Response<any>>;
            
            /**
             * Custom command to validate product structure
             * @example cy.validateProduct(product)
             */
            validateProduct(product: any, expectedFields?: string[]): Chainable<void>;
            
            /**
             * Custom command to validate products list response
             * @example cy.validateProductsList(response)
             */
            validateProductsList(response: any): Chainable<void>;
        }
    }
}

Cypress.Commands.add('apiRequest', (method: string, url: string, body?: any, options: Partial<Cypress.RequestOptions> = {}) => {
    return cy.request({
        method,
        url,
        body,
        failOnStatusCode: false,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    });
});

Cypress.Commands.add('validateProduct', (product: any, expectedFields: string[] = ['id', 'title', 'description', 'price']) => {
    expectedFields.forEach(field => {
        expect(product).to.have.property(field);
    });
});

Cypress.Commands.add('validateProductsList', (response: any) => {
    expect(response.status).to.equal(200);
    expect(response.body).to.have.all.keys('products', 'total', 'skip', 'limit');
    expect(response.body.products).to.be.an('array');
    expect(response.body.total).to.be.a('number');
});

export {};
