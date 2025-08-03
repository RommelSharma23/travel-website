// components/GoogleReviews/ReviewCTA.tsx
"use client";

import React from 'react';
import { Star, ExternalLink, ThumbsUp } from 'lucide-react';

const GOOGLE_REVIEW_URL = 'https://search.google.com/local/writereview?placeid=ChIJY61e6rrr5o0RIhZeFBx_muY';

// Component for Contact Page Success State
export const ContactSuccessReviewCTA = () => {
  const handleReviewClick = () => {
    window.open(GOOGLE_REVIEW_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="text-center py-8">
      <div className="bg-green-100 text-green-800 p-6 rounded-lg mb-6">
        <ThumbsUp className="w-8 h-8 mx-auto mb-3 text-green-600" />
        <h3 className="font-semibold mb-2 text-lg">Thank you for your inquiry!</h3>
        <p className="mb-4">We'll get back to you within 24 hours with a personalized quote.</p>
        
        {/* Review CTA */}
        <div className="mt-6 pt-4 border-t border-green-200">
          <p className="text-sm mb-4">
            🌟 <strong>Love our service?</strong> Help other travelers discover us by sharing your experience!
          </p>
          <button
            onClick={handleReviewClick}
            className="inline-flex items-center px-4 py-2 bg-white text-green-700 border border-green-300 rounded-lg hover:bg-green-50 transition-colors duration-200 font-medium"
          >
            <Star className="w-4 h-4 mr-2" />
            Leave a Google Review
            <ExternalLink className="w-3 h-3 ml-2" />
          </button>
        </div>
      </div>
      
      <button 
        onClick={() => window.location.reload()}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
      >
        Send Another Message
      </button>
    </div>
  );
};

// Simple Review Button Component
export const SimpleReviewButton = ({ className = "" }: { className?: string }) => {
  const handleReviewClick = () => {
    window.open(GOOGLE_REVIEW_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleReviewClick}
      className={`inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium ${className}`}
    >
      <Star className="w-4 h-4 mr-2" />
      Leave Google Review
      <ExternalLink className="w-3 h-3 ml-2" />
    </button>
  );
};

// Mini Reviews Display for Contact Page
export const MiniReviewsDisplay = () => {
  const miniReviews = [
    { name: "Priya S.", rating: 5, text: "Amazing service! Perfect trip planning." },
    { name: "Rajesh K.", rating: 5, text: "Outstanding execution. Highly recommended!" },
    { name: "Sarah W.", rating: 5, text: "Best travel agency in Jaipur!" }
  ];

  return (
    <div className="bg-blue-50 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Recent Reviews</h3>
        <div className="flex items-center">
          <div className="flex">
            {[1,2,3,4,5].map(star => (
              <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">5.0 (50+ reviews)</span>
        </div>
      </div>
      
      <div className="space-y-3 mb-4">
        {miniReviews.map((review, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {review.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-sm">{review.name}</span>
                <div className="flex">
                  {[1,2,3,4,5].map(star => (
                    <Star key={star} className="w-3 h-3 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-1">"{review.text}"</p>
            </div>
          </div>
        ))}
      </div>
      
      <SimpleReviewButton className="w-full justify-center" />
    </div>
  );
};