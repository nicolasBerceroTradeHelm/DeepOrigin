export const testConfig = {
  testData: {
    newProduct: {
      title: "Test Product",
      description: "A test product for API testing",
      price: 99.99,
      discountPercentage: 10.5,
      rating: 4.5,
      stock: 100,
      brand: "Test Brand",
      category: "electronics",
      thumbnail: "https://via.placeholder.com/150",
      images: [
        "https://via.placeholder.com/150",
        "https://via.placeholder.com/200"
      ]
    }
  },
  api: {
    timeout: 10000,
    retries: 3
  },
  thresholds: {
    responseTime: 5000,
    concurrentRequests: 3
  }
};