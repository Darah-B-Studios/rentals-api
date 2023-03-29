import { IReviewRepository } from "../../data/repositories/contracts/ireview.repository";
import { Review } from "../../data/entities/review";
import { IReview } from "../models/review";

export class ReviewUseCase {
    /**
     *
     */
    constructor(private readonly reviewRepository: IReviewRepository) {}

    async createReview(review: IReview): Promise<Review> {
        // const existingReview = await this.reviewRepository.findByName(review.name);
    
        // if (existingReview) {
        //   throw new Error('Review already exists');
        // }
    
        // const _review = new Review({review}); 
        //because it's already done in the Repository
        return this.reviewRepository.create(review);
      }
    
      async getAll(): Promise<Review[]> {
        return this.reviewRepository.getAll();
      }

      async getReviewById(id: string): Promise<Review | null> {
        return this.reviewRepository.findById(id);
      }
    
      async updateReview(review: IReview): Promise<Review> {
        return this.reviewRepository.update(review);
      }
    
      async deleteReview(id: string): Promise<void> {
        return this.reviewRepository.delete(id);
      }
}
