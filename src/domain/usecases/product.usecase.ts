import { Product } from "../../data/entities/product";
import { IRepository } from "../../data/repositories/contracts/repository.base";
import { IProduct } from "../models/product";

export class ProductUseCase {
  /**
   *
   */
  constructor(private readonly productRepository: IRepository<IProduct, Product>) {}

  async createProduct(product: IProduct): Promise<Product> {
    const existingProduct = await this.productRepository.findByName(
      product.name
    );

    if (existingProduct) {
      throw new Error("Product already exists");
    }

    // const _product = new Product({product});
    //because it's already done in the Repository
    return this.productRepository.create(product);
  }

  async getAll(
    page: number,
    pageSize: number
  ): Promise<{ rows: Product[]; count: number }> {
    return this.productRepository.getAll(page, pageSize);
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.productRepository.findById(id);
  }

  async updateProduct(product: IProduct): Promise<Product> {
    return this.productRepository.update(product);
  }

  async deleteProduct(id: string): Promise<void> {
    return this.productRepository.delete(id);
  }
}
