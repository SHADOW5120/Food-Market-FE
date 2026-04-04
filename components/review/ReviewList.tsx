'use client';

import { useState } from 'react';
import { Review } from '@/lib/types';
import { ReviewCard } from './ReviewCard';
import { Button } from '@/components/ui/Button';

interface ReviewListProps {
  reviews: Review[];
  currentUserId?: string;
  onEditReview?: (review: Review) => void;
  onDeleteReview?: (reviewId: string) => void;
  onMarkHelpful?: (reviewId: string) => void;
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  loadingMore?: boolean;
  className?: string;
}

export function ReviewList({
  reviews,
  currentUserId,
  onEditReview,
  onDeleteReview,
  onMarkHelpful,
  loading = false,
  hasMore = false,
  onLoadMore,
  loadingMore = false,
  className = '',
}: ReviewListProps) {
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No reviews yet</h3>
        <p className="text-gray-600">Be the first to share your experience with this product!</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Sort Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Reviews ({reviews.length})
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        {sortedReviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            isOwnReview={currentUserId === review.user.id}
            onEdit={onEditReview}
            onDelete={onDeleteReview}
            onMarkHelpful={onMarkHelpful}
          />
        ))}
      </div>

      {/* Load More */}
      {hasMore && onLoadMore && (
        <div className="text-center pt-4">
          <Button
            onClick={onLoadMore}
            loading={loadingMore}
            variant="outline"
          >
            Load More Reviews
          </Button>
        </div>
      )}
    </div>
  );
}