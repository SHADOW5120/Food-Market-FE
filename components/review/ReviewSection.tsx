'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { ProductReviewsData, Review, CreateReviewPayload, UpdateReviewPayload } from '@/lib/types';
import { getProductReviews, createReview, updateReview, deleteReview, markReviewHelpful } from '@/lib/api';
import { RatingStars } from './RatingStars';
import { RatingBreakdown } from './RatingBreakdown';
import { ReviewList } from './ReviewList';
import { ReviewForm } from './ReviewForm';
import { Button } from '@/components/ui/Button';

interface ReviewSectionProps {
  productId: string;
  className?: string;
}

export function ReviewSection({ productId, className = '' }: ReviewSectionProps) {
  const { user } = useAuth();
  const [reviewsData, setReviewsData] = useState<ProductReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = async (page = 1, append = false) => {
    try {
      const response = await getProductReviews(productId, page, 10);
      if (response.success && response.data) {
        if (append && reviewsData) {
          setReviewsData({
            ...response.data,
            reviews: [...reviewsData.reviews, ...response.data.reviews],
          });
        } else {
          setReviewsData(response.data);
        }
        setHasMore(response.data.reviews.length === 10);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReview = async (reviewData: CreateReviewPayload) => {
    setSubmitting(true);
    try {
      const response = await createReview(reviewData);
      if (response.success && response.data) {
        // Add the new review to the list
        setReviewsData(prev => prev ? {
          ...prev,
          reviews: [response.data!, ...prev.reviews],
          totalReviews: prev.totalReviews + 1,
          canReview: false,
          userReview: response.data,
        } : null);

        setShowReviewForm(false);
        // Show success message (you could add a toast notification here)
      }
    } catch (error) {
      console.error('Failed to create review:', error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateReview = async (reviewData: UpdateReviewPayload) => {
    if (!editingReview) return;

    setSubmitting(true);
    try {
      const response = await updateReview(editingReview.id, reviewData);
      if (response.success && response.data) {
        // Update the review in the list
        setReviewsData(prev => prev ? {
          ...prev,
          reviews: prev.reviews.map(review =>
            review.id === editingReview.id ? response.data! : review
          ),
          userReview: response.data,
        } : null);

        setEditingReview(null);
        setShowReviewForm(false);
      }
    } catch (error) {
      console.error('Failed to update review:', error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const response = await deleteReview(reviewId);
      if (response.success) {
        setReviewsData(prev => prev ? {
          ...prev,
          reviews: prev.reviews.filter(review => review.id !== reviewId),
          totalReviews: prev.totalReviews - 1,
          canReview: true,
          userReview: undefined,
        } : null);
      }
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  const handleMarkHelpful = async (reviewId: string) => {
    try {
      const response = await markReviewHelpful(reviewId);
      if (response.success) {
        setReviewsData(prev => prev ? {
          ...prev,
          reviews: prev.reviews.map(review =>
            review.id === reviewId
              ? { ...review, helpful: review.helpful + 1 }
              : review
          ),
        } : null);
      }
    } catch (error) {
      console.error('Failed to mark review as helpful:', error);
    }
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const handleCancelForm = () => {
    setShowReviewForm(false);
    setEditingReview(null);
  };

  const handleLoadMore = () => {
    loadReviews(currentPage + 1, true);
  };

  if (loading) {
    return (
      <div className={`space-y-8 ${className}`}>
        <div className="text-center">
          <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-32 mx-auto animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-24 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!reviewsData) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-6xl mb-4">❌</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to load reviews</h3>
        <p className="text-gray-600">Please try again later.</p>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Reviews</h2>
        <div className="flex items-center justify-center gap-4">
          <RatingStars rating={reviewsData.averageRating} size="lg" />
          <span className="text-lg text-gray-600">
            Based on {reviewsData.totalReviews} review{reviewsData.totalReviews !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Rating Summary & Breakdown */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Breakdown</h3>
            <RatingBreakdown
              breakdown={reviewsData.ratingBreakdown}
              totalReviews={reviewsData.totalReviews}
            />
          </div>

          {/* Write Review Button */}
          {user && reviewsData.canReview && !showReviewForm && (
            <div className="mt-6">
              <Button
                onClick={() => setShowReviewForm(true)}
                className="w-full"
              >
                Write a Review
              </Button>
            </div>
          )}

          {user && reviewsData.userReview && !showReviewForm && (
            <div className="mt-6">
              <Button
                onClick={() => handleEditReview(reviewsData.userReview!)}
                variant="outline"
                className="w-full"
              >
                Edit Your Review
              </Button>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2">
          {showReviewForm ? (
            <ReviewForm
              productId={productId}
              onSubmit={editingReview ? handleUpdateReview : handleCreateReview}
              onCancel={handleCancelForm}
              initialData={editingReview ? {
                rating: editingReview.rating,
                title: editingReview.title,
                content: editingReview.content,
                images: editingReview.images?.map(url => new File([], url)) || [],
              } : undefined}
              isEditing={!!editingReview}
            />
          ) : (
            <ReviewList
              reviews={reviewsData.reviews}
              currentUserId={user?.id}
              onEditReview={handleEditReview}
              onDeleteReview={handleDeleteReview}
              onMarkHelpful={handleMarkHelpful}
              hasMore={hasMore}
              onLoadMore={handleLoadMore}
            />
          )}
        </div>
      </div>
    </div>
  );
}