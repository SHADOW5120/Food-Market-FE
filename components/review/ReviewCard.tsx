'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Review } from '@/lib/types';
import { RatingStars } from './RatingStars';
import { Button } from '@/components/ui/Button';

interface ReviewCardProps {
  review: Review;
  isOwnReview?: boolean;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
  onMarkHelpful?: (reviewId: string) => void;
  className?: string;
}

export function ReviewCard({
  review,
  isOwnReview = false,
  onEdit,
  onDelete,
  onMarkHelpful,
  className = '',
}: ReviewCardProps) {
  const [showFullContent, setShowFullContent] = useState(false);
  const [isHelpfulLoading, setIsHelpfulLoading] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleMarkHelpful = async () => {
    if (!onMarkHelpful) return;

    setIsHelpfulLoading(true);
    try {
      await onMarkHelpful(review.id);
    } finally {
      setIsHelpfulLoading(false);
    }
  };

  const contentPreview = review.content.length > 200 ? review.content.slice(0, 200) + '...' : review.content;
  const shouldShowReadMore = review.content.length > 200;

  return (
    <div className={`bg-card rounded-lg shadow-sm border border-[color:hsl(var(--border))] border-[color:hsl(var(--border))] p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-muted rounded-full overflow-hidden flex-shrink-0">
            {review.user.avatar ? (
              <Image
                src={review.user.avatar}
                alt={review.user.username}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-primary font-semibold text-sm">
                  {review.user.username.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-foreground">{review.user.username}</h4>
              {review.isVerifiedPurchase && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success text-success">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified Purchase
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <RatingStars rating={review.rating} size="sm" />
              <span className="text-sm text-muted-foreground">{formatDate(review.createdAt)}</span>
            </div>
          </div>
        </div>

        {isOwnReview && (
          <div className="flex gap-2">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(review)}
                className="text-xs"
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(review.id)}
                className="text-xs text-destructive hover:text-destructive"
              >
                Delete
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Review Content */}
      <div className="mb-4">
        {review.title && (
          <h5 className="font-semibold text-foreground mb-2">{review.title}</h5>
        )}
        <p className="text-foreground leading-relaxed">
          {showFullContent ? review.content : contentPreview}
        </p>
        {shouldShowReadMore && (
          <button
            onClick={() => setShowFullContent(!showFullContent)}
            className="text-primary hover:text-primary text-sm font-medium mt-2"
          >
            {showFullContent ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Review Images */}
      {review.images && review.images.length > 0 && (
        <div className="mb-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {review.images.map((image, index) => (
              <div key={index} className="aspect-square relative rounded-lg overflow-hidden bg-muted">
                <Image
                  src={image}
                  alt={`Review image ${index + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform cursor-pointer"
                  sizes="(max-width: 640px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[color:hsl(var(--border))] border-[color:hsl(var(--border))]">
        <div className="flex items-center gap-4">
          {onMarkHelpful && (
            <button
              onClick={handleMarkHelpful}
              disabled={isHelpfulLoading}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              Helpful ({review.helpful})
            </button>
          )}
        </div>

        {review.updatedAt && review.updatedAt !== review.createdAt && (
          <span className="text-xs text-muted-foreground">
            Edited {formatDate(review.updatedAt)}
          </span>
        )}
      </div>
    </div>
  );
}


