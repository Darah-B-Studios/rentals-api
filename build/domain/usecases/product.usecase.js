"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductUseCase = void 0;
class ProductUseCase {
    productRepository;
    /**
     *
     */
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async createProduct(product) {
        const existingProduct = await this.productRepository.findByName(product.name);
        if (existingProduct) {
            throw new Error("Product already exists");
        }
        // const _product = new Product({product});
        //because it's already done in the Repository
        return this.productRepository.create(product);
    }
    async getAll(page, pageSize) {
        return this.productRepository.getAll(page, pageSize);
    }
    async getProductById(id) {
        return this.productRepository.findById(id);
    }
    async updateProduct(product) {
        return this.productRepository.update(product);
    }
    async deleteProduct(id) {
        return this.productRepository.delete(id);
    }
}
exports.ProductUseCase = ProductUseCase;
