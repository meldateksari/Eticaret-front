import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Review } from '../../models/review.model';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-reviews',
  standalone: true,
  templateUrl: './reviews.html',
  imports: [CommonModule, FormsModule],
})
export class Reviews implements OnInit {
  @Input({ required: true }) productId!: number;
  @Input({ required: true }) currentUserId?: number;

  reviews: Review[] = [];
  newRating: number = 5;
  newComment: string = '';

  ratingValues = [5, 4, 3, 2, 1];

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.reviewService.getReviewsByProduct(this.productId).subscribe({
      next: (res) => {
        this.reviews = res;
      },
      error: (err) => {
        console.error('Yorumlar yüklenemedi:', err);
      },
    });
  }

  submitReview(): void {
    const payload: Review = {
      productId: this.productId,
      userId: this.currentUserId,
      rating: this.newRating,
      comment: this.newComment,
    };

    this.reviewService.createReview(payload).subscribe(() => {
      this.newRating = 5;
      this.newComment = '';
      this.loadReviews();
    });
  }

  deleteReview(id: number): void {
    this.reviewService.deleteReview(id).subscribe(() => {
      this.loadReviews();
    });
  }

  averageRating(): number {
    if (!this.reviews.length) return 0;
    const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
    return +(total / this.reviews.length).toFixed(1);
  }

  ratingCount(rating: number): number {
    return this.reviews.filter((r) => r.rating === rating).length;
  }

  ratingPercent(rating: number): number {
    const count = this.ratingCount(rating);
    return this.reviews.length ? Math.round((count / this.reviews.length) * 100) : 0;
  }

  starsArray(n: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < n);
  }

  trackById(index: number, item: Review): number {
    return item.id;
  }
}
