// components/GoogleReviews/GoogleReviewsSection.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, ExternalLink, Users, MessageCircle, Loader2 } from 'lucide-react';

// Configuration
const GOOGLE_CONFIG = {
  placeId: 'ChIJY61e6rrr5o0RIhZeFBx_muY',
  businessName: 'GetAway Vibe',
  reviewUrl: 'https://www.google.com/search?q=GetAway+Vibe&stick=H4sIAAAAAAAA_-NgU1I1qLBISTVLTUpKTE00TU1MMTO2MqhINbNMNE8zTDY0MU01NDMyWsTK455a4lieWKkQlpmUCgC9AljPOAAAAA&hl=en-GB#lrd=0x8dd8eababe1ed63:0x26e97f1c5c85a21,3'
};

// Enhanced Review Interface
interface Review {
  id: string;
  author_name: string;
  rating: number;
  text: string;
  time: string;
  relative_time_description?: string;
  profile_photo_url?: string;
  initials?: string;
  bgColor?: string;
}

// Star Rating Component
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

// Generate initials and background color for avatars
const generateAvatar = (name: string, index: number) => {
  const colors = [
    'bg-purple-500', 'bg-green-500', 'bg-red-500', 
    'bg-blue-500', 'bg-yellow-500', 'bg-indigo-500', 
    'bg-pink-500', 'bg-teal-500'
  ];
  
  const initials = name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
    
  return {
    initials,
    bgColor: colors[index % colors.length]
  };
};

// Individual Review Card Component
const ReviewCard = ({ review, index }: { review: Review; index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = review.text.length > 150;
  const displayText = isExpanded || !shouldTruncate 
    ? review.text 
    : `${review.text.slice(0, 150)}...`;

  // Generate avatar if no profile photo
  const avatar = generateAvatar(review.author_name, index);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      {/* Review Header */}
      <div className="flex items-start space-x-4 mb-4">
        {review.profile_photo_url ? (
          <Image
            src={review.profile_photo_url}
            alt={review.author_name}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        ) : (
          <div className={`w-10 h-10 rounded-full ${avatar.bgColor} flex items-center justify-center text-white font-semibold text-sm`}>
            {avatar.initials}
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900">{review.author_name}</h4>
            <StarRating rating={review.rating} />
          </div>
          <p className="text-sm text-gray-500">
            {review.relative_time_description || new Date(review.time).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Review Text */}
      <p className="text-gray-700 leading-relaxed mb-3">
        {displayText}
      </p>

      {/* Read More/Less Button */}
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
        >
          {isExpanded ? 'Read Less' : 'Read More'}
        </button>
      )}
    </div>
  );
};

// Leave Review Button Component
const LeaveReviewButton = ({ variant = 'primary' }: { variant?: 'primary' | 'secondary' }) => {
  const handleReviewClick = () => {
    window.open(GOOGLE_CONFIG.reviewUrl, '_blank', 'noopener,noreferrer');
  };

  const baseClasses = "inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105";
  const variantClasses = variant === 'primary' 
    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"
    : "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50";

  return (
    <button
      onClick={handleReviewClick}
      className={`${baseClasses} ${variantClasses}`}
    >
      <Star className="w-5 h-5 mr-2" />
      Leave a Google Review
      <ExternalLink className="w-4 h-4 ml-2" />
    </button>
  );
};

// API Functions
const fetchGoogleReviews = async (): Promise<Review[]> => {
  try {
    // Option 1: Using Google Places API (requires API key)
    const response = await fetch(`/api/google-reviews?placeId=${GOOGLE_CONFIG.placeId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }
    
    const data = await response.json();
    
    // Filter for 5-star reviews only and get latest 5
    const fiveStarReviews = data.reviews
      ?.filter((review: Review) => review.rating === 5)
      ?.slice(0, 5) || [];
    
    return fiveStarReviews;
  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    
    // Fallback to hardcoded reviews if API fails
    return getFallbackReviews();
  }
};

// Fallback reviews (your current hardcoded data)
const getFallbackReviews = (): Review[] => {
  return [
    {
      id: "1",
      author_name: "Priya Sharma",
      rating: 5,
      text: "Absolutely amazing service! GetAway Vibe planned our Rajasthan trip perfectly. Every detail was taken care of and the local experiences were authentic and memorable. Highly recommended!",
      time: "2024-01-15",
      initials: "PS",
      bgColor: "bg-purple-500"
    },
    {
      id: "2",
      author_name: "Rajesh Kumar",
      rating: 5,
      text: "Outstanding travel planning and execution. The team went above and beyond to ensure our family vacation was perfect. Great value for money and excellent customer service throughout.",
      time: "2024-01-10",
      initials: "RK",
      bgColor: "bg-green-500"
    },
    {
      id: "3",
      author_name: "Sarah Wilson",
      rating: 5,
      text: "Best travel agency in Jaipur! They organized our Golden Triangle tour flawlessly. Professional, reliable, and truly caring about customer satisfaction. Will definitely book again!",
      time: "2024-01-05",
      initials: "SW",
      bgColor: "bg-red-500"
    },
    {
      id: "4",
      author_name: "Amit Patel",
      rating: 5,
      text: "Exceptional service and attention to detail. GetAway Vibe made our honeymoon trip to Kerala absolutely magical. Everything was perfectly organized and the experience was unforgettable.",
      time: "2023-12-28",
      initials: "AP",
      bgColor: "bg-purple-600"
    },
    {
      id: "5",
      author_name: "Lisa Johnson",
      rating: 5,
      text: "Incredible travel experience! The team provided excellent recommendations and took care of every aspect of our India tour. Professional, friendly, and highly knowledgeable. Five stars!",
      time: "2023-12-20",
      initials: "LJ",
      bgColor: "bg-green-600"
    }
  ];
};

// Main Google Reviews Section Component
const GoogleReviewsSection = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch reviews on component mount
  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const fetchedReviews = await fetchGoogleReviews();
        setReviews(fetchedReviews);
      } catch (err) {
        setError('Failed to load reviews');
        // Still show fallback reviews on error
        setReviews(getFallbackReviews());
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 5.0;
  const totalReviews = reviews.length;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our Travelers Say
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            Real reviews from real travelers who chose GetAway Vibe for their dream vacations
          </p>
          
          {/* Overall Rating Display */}
          <div className="flex items-center justify-center space-x-6 mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <StarRating rating={Math.floor(averageRating)} />
                <span className="ml-2 text-2xl font-bold text-gray-900">
                  {averageRating.toFixed(1)}
                </span>
              </div>
              <p className="text-gray-600">Based on {totalReviews} reviews</p>
            </div>
            
            <div className="hidden sm:block w-px h-12 bg-gray-300"></div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-blue-600 mr-2" />
                <span className="text-2xl font-bold text-gray-900">500+</span>
              </div>
              <p className="text-gray-600">Happy Travelers</p>
            </div>
          </div>

          {/* Google Reviews Badge */}
          <div className="inline-flex items-center bg-white rounded-full px-6 py-3 shadow-md mb-8">
            <div className="w-6 h-6 mr-3 bg-gradient-to-r from-blue-500 via-red-500 via-yellow-500 to-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">G</span>
            </div>
            <span className="font-semibold text-gray-900">Verified Google Reviews</span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading reviews...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
              <p className="text-yellow-800 text-sm">
                {error}. Showing recent reviews.
              </p>
            </div>
          </div>
        )}

        {/* Reviews Grid */}
        {!loading && reviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {reviews.map((review, index) => (
              <ReviewCard key={review.id} review={review} index={index} />
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <MessageCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Share Your Experience
            </h3>
            <p className="text-gray-600 mb-6">
              Had an amazing trip with us? We'd love to hear about your experience! 
              Your review helps other travelers discover the magic of travel with GetAway Vibe.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <LeaveReviewButton variant="primary" />
              <a 
                href="/contact" 
                className="inline-flex items-center px-6 py-3 rounded-lg font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
              >
                Plan Your Trip
              </a>
            </div>
          </div>
        </div>

        {/* View All Reviews Link */}
        <div className="text-center mt-8">
          <button
            onClick={() => window.open(GOOGLE_CONFIG.reviewUrl, '_blank')}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
          >
            View All Reviews on Google →
          </button>
        </div>
      </div>
    </section>
  );
};

export default GoogleReviewsSection;