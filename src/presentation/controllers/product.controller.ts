import { Request, Response } from "express";
import {
  IProductResponse,
} from "../../domain/models/product";
import { ProductUseCase } from "../../domain/usecases/product.usecase";
import slugify from "slugify";
import { ProductRepository } from "../../data/repositories/impl/product.repository";
import { ProductMapper } from "../mappers/product-mapper";
import { ProductRequestDto } from "../dtos/product-request.dto";
import { validate } from "class-validator";
import { displayValidationErrors } from "../../utils/displayValidationErrors";
import { NotFoundException } from "../../shared/exceptions/not-found.exception";

const productRepository = new ProductRepository();
const productUseCase = new ProductUseCase(productRepository);
const productMapper = new ProductMapper();

export class ProductsController {
  async createProduct(req: Request, res: Response<IProductResponse>): Promise<void> {
    const dto = new ProductRequestDto(req.body);
    const validationErrors = await validate(dto);

    if (validationErrors.length > 0) {
      res.status(400).json({ 
        validationErrors: displayValidationErrors(validationErrors) as any,
        success: false,
        data: null,
        message: "Attention!"
      });
    }
    else {
      try {
        
        const productResponse = await productUseCase.createProduct(dto.toData());
        const productDTO = productMapper.toDTO(productResponse) //convert entity to DTO
  
        res.status(201).json({
          data: productResponse as any,
          message: "Product created Successfully!",
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

  async getAll(
    req: Request,
    res: Response<IProductResponse>
  ): Promise<void> {
    try {

      const categories = await productUseCase.getAll();
      res.json({
        data: categories as any,
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
      const productDTO = productMapper.toDTO(product)
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
    const dto = new ProductRequestDto(req.body)
    const validationErrors = await validate(dto);

    if (validationErrors.length > 0) {
      res.status(400).json({ 
        validationErrors: displayValidationErrors(validationErrors) as any,
        success: false,
        data: null,
        message: "Attention!"
      });
    }
    else {
      try {
        const id = req.params.id;
      
        const product = await productUseCase.getProductById(id);
        
        if (!product) {
          throw new NotFoundException("Product", id);
        }
  
        product.name = dto.name;
        product.description = dto.description;
        product.shortDescription = dto.shortDescription;
        product.categoryId = dto.categoryId;
        product.subCategoryId = dto.subCategoryId;
        product.quantity = dto.quantity;
        product.price = dto.price;
        product.slug =  slugify(product.name, {lower: true, replacement: "-"});
        product.updatedAt = new Date();
  
        const productDTO1 = productMapper.toDTO(product)
  
        const updatedProduct = await productUseCase.updateProduct(dto.toUpdateData(productDTO1));
        const productDTO2 = productMapper.toDTO(updatedProduct);
  
        res.json({
          data: productDTO2,
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

      const product = await productUseCase.getProductById(id);

      if (!product) {
          throw new NotFoundException("Product", id);
      }

      const productDTO = productMapper.toDTO(product)

      await productUseCase.deleteProduct(id);

      res.status(204).json({
        message: `${productDTO.name}`,
        validationErrors: [],
        success: true,
        data: null
      });
    } catch (error: any) {
      res
        .status(400)
        .json({
          message: error.message,
          data: null,
          validationErrors: [error],
          success: true,
        });
    }
  }
}
