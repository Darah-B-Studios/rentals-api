import { Request, Response } from "express";
import {
  IReview,
  IReviewResponse,
  emptyReview,
} from "../../domain/models/review";
import { ReviewUseCase } from "../../domain/usecases/review.usecase";
import { ReviewRepository } from "../../data/repositories/impl/review.repository";
import { ReviewMapper } from "../mappers/mapper";
import { ReviewRequestDto } from "../dtos/review-request.dto";
import { validate } from "class-validator";
import { displayValidationErrors } from "../../utils/displayValidationErrors";
import { NotFoundException } from "../../shared/exceptions/not-found.exception";

const reviewRepository = new ReviewRepository();
const reviewUseCase = new ReviewUseCase(reviewRepository);
const reviewMapper = new ReviewMapper();

export class ReviewsController {
  async createReview(
    req: Request,
    res: Response<IReviewResponse>
  ): Promise<void> {
    const dto = new ReviewRequestDto(req.body);
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
        const reviewResponse = await reviewUseCase.createReview(dto.toData());

        res.status(201).json({
          data: reviewResponse.toJSON<IReview>(),
          message: "Review created Successfully!",
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
      const { rows, count } = await reviewUseCase.getAll(page, pageSize);
      const reviewsDTO = reviewMapper.toDTOs(rows);

      // total pages
      const totalPages = Math.ceil(count / pageSize);

      res.json({
        data: reviewsDTO,
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

  async getReviewById(
    req: Request,
    res: Response<IReviewResponse>
  ): Promise<void> {
    try {
      const id = req.params.id;

      const review = await reviewUseCase.getReviewById(id);
      if (!review) {
        throw new NotFoundException("Review", id);
      }
      const reviewDTO = reviewMapper.toDTO(review);
      res.json({
        data: reviewDTO,
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

  async updateReview(
    req: Request,
    res: Response<IReviewResponse>
  ): Promise<void> {
    const dto = new ReviewRequestDto(req.body);
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

        const obj: IReview = {
          ...emptyReview,
          ...req.body,
          id: id,
        };
        const updatedReview = await reviewUseCase.updateReview(obj);
        const reviewDto = reviewMapper.toDTO(updatedReview);

        res.json({
          data: reviewDto,
          message: "Review Updated Successfully!",
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

  async deleteReview(
    req: Request,
    res: Response<IReviewResponse>
  ): Promise<void> {
    try {
      const id = req.params.id;

      await reviewUseCase.deleteReview(id);

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
