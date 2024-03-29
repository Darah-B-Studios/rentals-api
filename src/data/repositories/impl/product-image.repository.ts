import { ProductImage } from "../../entities/product-image";
import { IProductImage } from "../../../domain/models/product-image";
import { NotFoundException } from "../../../shared/exceptions/not-found.exception";
import { IRepository } from "../contracts/repository.base";

export class ProductImageRepository
  implements IRepository<IProductImage, ProductImage>
{
  /**
   *
   */
  constructor() {}

  /**
   * Receives a ProductImage as parameter
   * @productImage
   * returns void
   */
  async create(productImage: IProductImage): Promise<ProductImage> {
    try {
      return await ProductImage.create<ProductImage>({ ...productImage });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a String as parameter
   * @id
   * returns ProductImage
   */
  async findById(id: string): Promise<ProductImage | null> {
    try {
      const productImageItem = await ProductImage.findByPk(id);

      if (!productImageItem) {
        throw new NotFoundException("ProductImage", id);
      }
      return productImageItem;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a String as parameter
   * @name
   * returns ProductImage
   */
  async findByName(name: string): Promise<ProductImage | null> {
    try {
      const productImageItem = await ProductImage.findOne({
        where: { productName: name },
      });
      return productImageItem;
    } catch (error) {
      throw error;
    }
  }

  /*
   * Returns an array of ProductImage
   */
  async getAll(
    page: number,
    pageSize: number
  ): Promise<{
    rows: ProductImage[];
    count: number;
  }> {
    const offset = (page - 1) * pageSize;
    try {
      const productImages = await ProductImage.findAndCountAll({
        limit: pageSize,
        offset,
      });
      return productImages;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a ProductImage as parameter
   * @productImage
   * returns void
   */
  async update(productImage: IProductImage): Promise<ProductImage> {
    const { id } = productImage;
    try {
      const productImageItem: any = await ProductImage.findByPk(id);

      console.log(productImage);
      if (!productImageItem) {
        throw new NotFoundException("ProductImage", id.toString());
      }

      return await productImageItem?.update({ ...productImage });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a string as parameter
   * @id
   * returns void
   */
  async delete(id: string): Promise<void> {
    try {
      const productImageItem = await ProductImage.findByPk(id);

      if (!productImageItem) {
        throw new NotFoundException("ProductImage", id);
      }

      await productImageItem?.destroy({
        force: true,
      });
    } catch (error) {
      throw error;
    }
  }
}
