// cypress/support/test-config.ts

export interface Product {
    id?: number;
    title: string;
    price: number;
    description: string;
    category?: string;
    brand?: string;
}

export interface ProductsListResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

export interface TestConfig {
    endpoints: {
        products: string;
        productById: (id: number) => string;
        search: string;
        add: string;
        update: (id: number) => string;
        delete: (id: number) => string;
    };
    testData: {
        validProductId: number;
        searchQuery: string;
        newProduct: Product;
        updateData: Partial<Product>;
        testProductIds: number[];
        searchQueries: string[];
    };
    expectedStatusCodes: {
        success: number;
        created: number;
        notFound: number;
        badRequest: number;
    };
}

export const testConfig: TestConfig = {
    endpoints: {
        products: '/products',
        productById: (id: number) => `/products/${id}`,
        search: '/products/search',
        add: '/products/add',
        update: (id: number) => `/products/${id}`,
        delete: (id: number) => `/products/${id}`
    },
    testData: {
        validProductId: 1,
        searchQuery: 'phone',
        newProduct: {
            title: 'Test Product',
            price: 19.99,
            description: 'Cypress test product',
            category: 'electronics'
        },
        updateData: {
            title: 'Updated Title Cypress Test'
        },
        testProductIds: [1, 2, 3, 5, 10],
        searchQueries: ['phone', 'laptop', 'watch', 'shirt']
    },
    expectedStatusCodes: {
        success: 200,
        created: 201,
        notFound: 404,
        badRequest: 400
    }
};

// Helper functions
export const makeApiRequest = (options: Partial<Cypress.RequestOptions>) => {
    return cy.request({
        failOnStatusCode: false,
        ...options
    });
};

export const validateProductStructure = (
    product: any, 
    expectedFields: string[] = ['id', 'title', 'description', 'price']
) => {
    expectedFields.forEach(field => {
        expect(product).to.have.property(field);
    });
};

export const validateProductsListResponse = (response: any) => {
    expect(response.status).to.equal(testConfig.expectedStatusCodes.success);
    expect(response.body).to.have.all.keys('products', 'total', 'skip', 'limit');
    expect(response.body.products).to.be.an('array');
    expect(response.body.total).to.be.a('number');
};
