import { ProductImage } from "../../data/entities/product-image";
import { IRepository } from "../../data/repositories/contracts/repository.base";
import { IProductImage } from "../models/product-image";
import slugify from "slugify";
export class ProductImageUseCase {
  /**
   *
   */
  constructor(
    private readonly productImageRepository: IRepository<
      IProductImage,
      ProductImage
    >
  ) {}

  async createProductImage(productImage: IProductImage): Promise<ProductImage> {
    const existingProductImage = await this.productImageRepository.findByName(
      productImage.productName
    );

    if (existingProductImage) {
      throw new Error("ProductImage already exists");
    }

    // const _productImage = new ProductImage({productImage});
    //because it's already done in the Repository
    return this.productImageRepository.create(productImage);
  }

  async getAll(
    page: number,
    pageSize: number
  ): Promise<{ rows: ProductImage[]; count: number }> {
    return this.productImageRepository.getAll(page, pageSize);
  }

  async getProductImageById(id: string): Promise<ProductImage | null> {
    return this.productImageRepository.findById(id);
  }

  async updateProductImage(productImage: IProductImage): Promise<ProductImage> {
    return this.productImageRepository.update(productImage);
  }

  async deleteProductImage(id: string): Promise<void> {
    return this.productImageRepository.delete(id);
  }
}
