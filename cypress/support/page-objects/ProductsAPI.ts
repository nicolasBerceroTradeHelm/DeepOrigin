// cypress/support/page-objects/ProductsAPI.ts

export class ProductsAPI {
    private baseEndpoints = {
        products: '/products',
        productById: (id: number) => `/products/${id}`,
        search: '/products/search',
        add: '/products/add',
        update: (id: number) => `/products/${id}`,
        delete: (id: number) => `/products/${id}`
    };

    // Get all products
    getAllProducts(options?: Partial<Cypress.RequestOptions>) {
        return cy.apiRequest('GET', this.baseEndpoints.products, undefined, options);
    }

    // Get product by ID
    getProductById(id: number, options?: Partial<Cypress.RequestOptions>) {
        return cy.apiRequest('GET', this.baseEndpoints.productById(id), undefined, options);
    }

    // Search products
    searchProducts(query: string, options?: Partial<Cypress.RequestOptions>) {
        return cy.apiRequest('GET', this.baseEndpoints.search, undefined, {
            qs: { q: query },
            ...options
        });
    }

    // Add new product
    addProduct(product: any, options?: Partial<Cypress.RequestOptions>) {
        return cy.apiRequest('POST', this.baseEndpoints.add, product, options);
    }

    // Update product
    updateProduct(id: number, updateData: any, options?: Partial<Cypress.RequestOptions>) {
        return cy.apiRequest('PUT', this.baseEndpoints.update(id), updateData, options);
    }

    // Delete product
    deleteProduct(id: number, options?: Partial<Cypress.RequestOptions>) {
        return cy.apiRequest('DELETE', this.baseEndpoints.delete(id), undefined, options);
    }

    // Bulk operations
    getMultipleProducts(ids: number[]) {
        const requests = ids.map(id => this.getProductById(id));
        return Promise.all(requests);
    }

    // Validation helpers
    validateProductResponse(response: Cypress.Response<any>, expectedStatusCode: number = 200) {
        expect(response.status).to.equal(expectedStatusCode);
        if (response.status === 200) {
            cy.validateProduct(response.body);
        }
        return cy.wrap(response);
    }

    validateProductsListResponse(response: Cypress.Response<any>) {
        cy.validateProductsList(response);
        return cy.wrap(response);
    }
}
