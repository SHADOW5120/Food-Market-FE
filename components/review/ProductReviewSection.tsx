'use client';

import { useState, useEffect } from 'react';
import { reviewApi } from '@/lib/api';
import type { ProductReviewsData } from '@/lib/types';
import { ReviewList } from './ReviewList';
import { ReviewForm } from './ReviewForm';
import { RatingBreakdown } from './RatingBreakdown';
import { RatingStars } from './RatingStars';
import toast from 'react-hot-toast';

interface ProductReviewSectionProps {
  productId: string;
  onReviewAdded?: () => void;
}

export const ProductReviewSection: React.FC<ProductReviewSectionProps> = ({ productId, onReviewAdded }) => {
  const [data, setData] = useState<ProductReviewsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  const [page, setPage] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    loadReviewData();
  }, [productId, sortBy, page]);

  const loadReviewData = async () => {
    try {
      setIsLoading(true);
      const response = await reviewApi.getProductReviews(productId, page, 10, sortBy);
      if (response.success && response.data) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Failed to load reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewAdded = () => {
    setShowReviewForm(false);
    loadReviewData();
    onReviewAdded?.();
  };

  if (isLoading && !data) {
    return <div className="animate-pulse">Loading reviews...</div>;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Reviews Header */}
      <div className="border-b border-border pb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Customer Reviews</h2>
            <p className="text-muted-foreground text-sm mt-1">
              {data.totalReviews} review{data.totalReviews !== 1 ? 's' : ''}
            </p>
          </div>
          {data.canReview && (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
            >
              {showReviewForm ? 'Cancel' : 'Write a Review'}
            </button>
          )}
        </div>

        {/* Rating Summary */}
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold text-foreground">{data.averageRating.toFixed(1)}</div>
            <RatingStars rating={data.averageRating} size="md" />
            <p className="text-xs text-muted-foreground mt-1">{data.totalReviews} ratings</p>
          </div>

          {/* Rating Breakdown */}
          <RatingBreakdown breakdown={data.ratingBreakdown} totalReviews={data.totalReviews} />
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && data.canReview && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Share your experience</h3>
          <ReviewForm 
            productId={productId} 
            onSubmit={async (payload) => {
              try {
                await reviewApi.createReview(payload);
                handleReviewAdded();
              } catch (error) {
                console.error('Failed to submit review:', error);
                toast.error('Failed to submit review');
              }
            }}
            onCancel={() => setShowReviewForm(false)}
          />
        </div>
      )}

      {/* Sort Options */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Sort by:</span>
        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value as any);
            setPage(1);
          }}
          className="px-3 py-2 bg-muted border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest">Highest Rating</option>
          <option value="lowest">Lowest Rating</option>
        </select>
      </div>

      {/* Reviews List */}
      <ReviewList 
        reviews={data.reviews} 
        onDeleteReview={async (reviewId) => {
          try {
            await reviewApi.deleteReview(reviewId);
            loadReviewData();
          } catch (error) {
            console.error('Failed to delete review:', error);
            toast.error('Failed to delete review');
          }
        }}
        onMarkHelpful={async (reviewId) => {
          try {
            await reviewApi.markReviewHelpful(reviewId);
            loadReviewData();
          } catch (error) {
            console.error('Failed to mark review helpful:', error);
          }
        }}
      />

      {/* Pagination - if needed */}
      {data.totalReviews > 10 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-2 bg-muted border border-border rounded-lg text-foreground text-sm hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-muted-foreground">Page {page}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={!data.reviews || data.reviews.length < 10}
            className="px-3 py-2 bg-muted border border-border rounded-lg text-foreground text-sm hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
