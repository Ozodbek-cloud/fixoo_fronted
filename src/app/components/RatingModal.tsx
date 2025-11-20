'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  targetUserName: string;
  userType: 'client' | 'specialist'; // Who is being rated
  orderId: string;
}

export default function RatingModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  targetUserName, 
  userType,
  orderId 
}: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleStarClick = (starValue: number) => {
    setRating(starValue);
  };

  const handleStarHover = (starValue: number) => {
    setHoveredRating(starValue);
  };

  const handleMouseLeave = () => {
    setHoveredRating(0);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Iltimos, baho bering!');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(rating, comment.trim());
      // Reset form
      setRating(0);
      setComment('');
      onClose();
    } catch (error) {
      console.error('Rating submission failed:', error);
      alert('Baho yuborishda xatolik yuz berdi. Qaytadan urinib ko\'ring.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    const displayRating = hoveredRating || rating;

    for (let i = 1; i <= 5; i++) {
      const isFullStar = displayRating >= i;
      const isHalfStar = displayRating >= i - 0.5 && displayRating < i;

      stars.push(
        <div key={i} className="relative cursor-pointer">
          {/* Full star background */}
          <svg
            className={`w-8 h-8 ${isFullStar || isHalfStar ? 'text-yellow-400' : 'text-gray-300'} transition-colors duration-200`}
            fill="currentColor"
            viewBox="0 0 20 20"
            onClick={() => handleStarClick(i)}
            onMouseEnter={() => handleStarHover(i)}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>

          {/* Half star overlay */}
          {isHalfStar && (
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <svg
                className="w-8 h-8 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                onClick={() => handleStarClick(i - 0.5)}
                onMouseEnter={() => handleStarHover(i - 0.5)}
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          )}

          {/* Invisible half-star clickable areas */}
          <div 
            className="absolute inset-0 w-1/2 cursor-pointer"
            onClick={() => handleStarClick(i - 0.5)}
            onMouseEnter={() => handleStarHover(i - 0.5)}
          />
          <div 
            className="absolute inset-0 left-1/2 w-1/2 cursor-pointer"
            onClick={() => handleStarClick(i)}
            onMouseEnter={() => handleStarHover(i)}
          />
        </div>
      );
    }

    return stars;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                {userType === 'specialist' ? 'Ustani baholang' : 'Mijozni baholang'}
              </h2>
              <p className="text-teal-100 text-sm mt-1">
                {targetUserName} bilan ishlash tajribangizni baholang
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
              disabled={isSubmitting}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Rating Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Bahoni tanlang <span className="text-red-500">*</span>
            </label>
            <div 
              className="flex items-center space-x-1 mb-2"
              onMouseLeave={handleMouseLeave}
            >
              {renderStars()}
            </div>
            <div className="text-center">
              <span className="text-lg font-semibold text-gray-700">
                {(hoveredRating || rating).toFixed(1)} / 5.0
              </span>
            </div>
            {rating > 0 && (
              <div className="text-center mt-2">
                <span className="text-sm text-gray-500">
                  {rating === 5 ? 'A\'lo!' : 
                   rating >= 4 ? 'Juda yaxshi!' :
                   rating >= 3 ? 'Yaxshi!' :
                   rating >= 2 ? 'O\'rtacha!' : 'Yaxshilanishi kerak!'}
                </span>
              </div>
            )}
          </div>

          {/* Comment Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Izoh (ixtiyoriy)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={`${targetUserName} haqida fikr bildiring...`}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors resize-none"
              rows={4}
              maxLength={500}
              disabled={isSubmitting}
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {comment.length}/500
            </div>
          </div>

          {/* Order Info */}
          <div className="bg-gray-50 rounded-lg p-3 mb-6">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Buyurtma ID:</span> {orderId}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
              disabled={isSubmitting}
            >
              Bekor qilish
            </button>
            <button
              onClick={handleSubmit}
              disabled={rating === 0 || isSubmitting}
              className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Yuborilmoqda...
                </>
              ) : (
                'Yuborish'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 