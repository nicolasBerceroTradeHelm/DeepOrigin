export class ProductsAPI {
    private baseUrl: string;

    constructor() {
        this.baseUrl = Cypress.config('baseUrl') || 'https://dummyjson.com';
    }

    getAllProducts(options?: { timeout?: number }) {
        return cy.request({
            method: 'GET',
            url: `${this.baseUrl}/products`,
            timeout: options?.timeout || 10000
        });
    }

    getProductById(id: number) {
        return cy.request({
            method: 'GET',
            url: `${this.baseUrl}/products/${id}`,
            failOnStatusCode: false
        });
    }

    searchProducts(query: string) {
        return cy.request({
            method: 'GET',
            url: `${this.baseUrl}/products/search?q=${encodeURIComponent(query)}`
        });
    }

    addProduct(product: any) {
        return cy.request({
            method: 'POST',
            url: `${this.baseUrl}/products/add`,
            body: product,
            failOnStatusCode: false
        });
    }

    updateProduct(id: number, updates: any) {
        return cy.request({
            method: 'PUT',
            url: `${this.baseUrl}/products/${id}`,
            body: updates,
            failOnStatusCode: false
        });
    }

    deleteProduct(id: number) {
        return cy.request({
            method: 'DELETE',
            url: `${this.baseUrl}/products/${id}`,
            failOnStatusCode: false
        });
    }

    validateProductsListResponse(response: any) {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('products');
        expect(response.body).to.have.property('total');
        expect(response.body).to.have.property('skip');
        expect(response.body).to.have.property('limit');
        expect(response.body.products).to.be.an('array');
    }

    validateProductResponse(response: any, expectedStatus: number = 200) {
        expect(response.status).to.equal(expectedStatus);
        
        if (expectedStatus === 200) {
            expect(response.body).to.have.property('id');
            expect(response.body).to.have.property('title');
            expect(response.body).to.have.property('price');
        }
    }
}