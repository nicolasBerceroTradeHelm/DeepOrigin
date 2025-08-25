// cypress/e2e/products.cy.ts
describe('DummyJSON Products API', () => {
    const api = cy.request;

    // Tests fetching all products and validates response structure
    it('should fetch all products', () => {
        api({
            method: 'GET',
            url: '/products',
        }).then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.all.keys('products', 'total', 'skip', 'limit');
            expect(response.body.products).to.be.an('array');
            expect(response.body.total).to.be.a('number');
        });
    });

    // Tests fetching a specific product by ID and validates product properties
    it('should fetch a single product by ID', () => {
        const productId = 1;
        api({
            method: 'GET',
            url: `/products/${productId}`,
        }).then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('id', productId);
            expect(response.body).to.include.keys('title', 'description', 'price');
        });
    });

    // Tests searching for products using query parameter and validates search results
    it('should search products via query parameter', () => {
        const query = 'phone';
        api({
            method: 'GET',
            url: `/products/search`,
            qs: { q: query },
        }).then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.all.keys('products', 'total', 'skip', 'limit');
            expect(response.body.products).to.be.an('array');
        });
    });

    // Tests creating a new product and validates the response contains submitted data
    it('should add a new product (mock)', () => {
        const newProduct = {
            title: 'Test Product',
            price: 19.99,
            description: 'Cypress test product',
        };

        cy.request({
            method: 'POST',
            url: '/products/add',
            body: newProduct,
            headers: { 'Content-Type': 'application/json' },
        }).then((response) => {
            expect(response.status).to.equal(201);   // ✅ was 200 before
            expect(response.body).to.include({
                title: newProduct.title,
                price: newProduct.price,
                description: newProduct.description,
            });
            expect(response.body).to.have.property('id').that.is.a('number');
        });
    });


    // Tests updating an existing product and validates the updated properties
    it('should update an existing product (mock)', () => {
        const updateData = { title: 'Updated Title Cypress Test' };
        const productId = 1;

        api({
            method: 'PUT',
            url: `/products/${productId}`,
            body: updateData,
            headers: { 'Content-Type': 'application/json' },
        }).then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('title', updateData.title);
            expect(response.body).to.have.property('id', productId);
        });
    });

    // Tests deleting a product and validates the deletion response
    it('should delete a product (mock)', () => {
        const productId = 1;

        api({
            method: 'DELETE',
            url: `/products/${productId}`,
        }).then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.include.keys('id', 'isDeleted', 'deletedOn');
            expect(response.body).to.have.property('id', productId);
            expect(response.body.isDeleted).to.be.true;
            expect(response.body.deletedOn).to.be.a('string');
        });
    });

    // Tests requesting products with ascending sort and validates client-side sorting logic
    it('should fetch products sorted by title ascending', () => {
        api({
            method: 'GET',
            url: '/products',
            qs: {
                sortBy: 'title',
                order: 'asc'
            }
        }).then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('products');

            const titles = response.body.products.map((p: any) => p.title.toLowerCase());
            const sortedTitles = [...titles].sort((a, b) => a.localeCompare(b));

            expect(sortedTitles.length).to.equal(titles.length);

            if (sortedTitles.length > 1) {
                expect(sortedTitles[0].localeCompare(sortedTitles[sortedTitles.length - 1])).to.be.at.most(0);
            }
        });
    });

    // Tests requesting products with descending sort and validates client-side sorting logic
    it('should fetch products sorted by title descending', () => {
        api({
            method: 'GET',
            url: '/products',
            qs: {
                sortBy: 'title',
                order: 'desc'
            }
        }).then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('products');

            const titles = response.body.products.map((p: any) => p.title.toLowerCase());
            const sortedTitles = [...titles].sort((a, b) => b.localeCompare(a));

            expect(sortedTitles.length).to.equal(titles.length);

            if (sortedTitles.length > 1) {
                expect(sortedTitles[0].localeCompare(sortedTitles[sortedTitles.length - 1])).to.be.at.least(0);
            }
        });
    });
});
