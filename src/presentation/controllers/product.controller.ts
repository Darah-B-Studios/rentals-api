import { Request, Response } from "express";
import {
  IProduct,
  IProductResponse,
  emptyProduct,
} from "../../domain/models/product";
import { ProductUseCase } from "../../domain/usecases/product.usecase";
import { ProductRepository } from "../../data/repositories/impl/product.repository";
import { ProductMapper } from "../mappers/mapper";
import { ProductRequestDto } from "../dtos/product-request.dto";
import { validate } from "class-validator";
import { displayValidationErrors } from "../../utils/displayValidationErrors";
import { NotFoundException } from "../../shared/exceptions/not-found.exception";

const productRepository = new ProductRepository();
const productUseCase = new ProductUseCase(productRepository);
const productMapper = new ProductMapper();

export class ProductsController {
  async createProduct(
    req: Request,
    res: Response<IProductResponse>
  ): Promise<void> {
    const dto = new ProductRequestDto(req.body);
    const validationErrors = await validate(dto);

    if (validationErrors.length > 0) {
      res.status(400).json({
        validationErrors: displayValidationErrors(validationErrors) as any,
        success: false,
        data: null,
        message: "Attention!",
      });
    } else {
      try {
        const productResponse = await productUseCase.createProduct(
          dto.toData()
        );

        res.status(201).json({
          data: productResponse.toJSON<IProduct>(),
          message: "Product created Successfully!",
          validationErrors: [],
          success: true,
        });
      } catch (error: any) {
        res.status(400).json({
          data: null,
          message: error.message,
          validationErrors: [],
          success: false,
        });
      }
    }
  }

  async getAll(req: Request, res: Response<any>): Promise<void> {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    try {
      const { rows, count } = await productUseCase.getAll(page, pageSize);
      const productsDTO = productMapper.toDTOs(rows);
      // total pages
      const totalPages = Math.ceil(count / pageSize);

      res.json({
        data: productsDTO,
        message: "Success",
        validationErrors: [],
        success: true,
        currentPage: page,
        totalPages,
      });
    } catch (error: any) {
      res.status(400).json({
        data: null,
        message: error.message,
        validationErrors: [error],
        success: false,
      });
    }
  }

  async getProductById(
    req: Request,
    res: Response<IProductResponse>
  ): Promise<void> {
    try {
      const id = req.params.id;

      const product = await productUseCase.getProductById(id);
      if (!product) {
        throw new NotFoundException("Product", id);
      }
      const productDTO = productMapper.toDTO(product);
      res.json({
        data: productDTO,
        message: "Success",
        validationErrors: [],
        success: true,
      });
    } catch (error: any) {
      res.status(400).json({
        data: null,
        message: error.message,
        validationErrors: [error],
        success: false,
      });
    }
  }

  async updateProduct(
    req: Request,
    res: Response<IProductResponse>
  ): Promise<void> {
    const dto = new ProductRequestDto(req.body);
    const validationErrors = await validate(dto);

    if (validationErrors.length > 0) {
      res.status(400).json({
        validationErrors: displayValidationErrors(validationErrors) as any,
        success: false,
        data: null,
        message: "Attention!",
      });
    } else {
      try {
        const id = req.params.id;

        const obj: IProduct = {
          ...emptyProduct,
          ...req.body,
          id: id,
        };
        const updatedProduct = await productUseCase.updateProduct(obj);
        const productDto = productMapper.toDTO(updatedProduct);

        res.json({
          data: productDto,
          message: "Product Updated Successfully!",
          validationErrors: [],
          success: true,
        });
      } catch (error: any) {
        res.status(400).json({
          data: null,
          message: error.message,
          validationErrors: [error],
          success: false,
        });
      }
    }
  }

  async deleteProduct(
    req: Request,
    res: Response<IProductResponse>
  ): Promise<void> {
    try {
      const id = req.params.id;

      await productUseCase.deleteProduct(id);

      res.status(204).json({
        message: `Operation successfully completed!`,
        validationErrors: [],
        success: true,
        data: null,
      });
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
        data: null,
        validationErrors: [error],
        success: true,
      });
    }
  }
}
