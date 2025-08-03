// app/api/google-reviews/route.ts

import { NextRequest, NextResponse } from 'next/server';

// Environment variables (add these to your .env.local)
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const placeId = searchParams.get('placeId');

    if (!placeId) {
      return NextResponse.json(
        { error: 'Place ID is required' },
        { status: 400 }
      );
    }

    if (!GOOGLE_PLACES_API_KEY) {
      console.warn('Google Places API key not configured, using fallback reviews');
      return NextResponse.json({
        reviews: getFallbackReviews(),
        source: 'fallback'
      });
    }

    // Fetch place details including reviews from Google Places API
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${GOOGLE_PLACES_API_KEY}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Google API request failed: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Google API error: ${data.status}`);
    }

    // Process and filter the reviews
    const processedReviews = data.result.reviews?.map((review: any, index: number) => ({
      id: `google_${review.time}_${index}`,
      author_name: review.author_name,
      rating: review.rating,
      text: review.text,
      time: new Date(review.time * 1000).toISOString().split('T')[0], // Convert timestamp
      relative_time_description: review.relative_time_description,
      profile_photo_url: review.profile_photo_url,
    })) || [];

    // Filter for 5-star reviews and get latest 5
    const fiveStarReviews = processedReviews
      .filter((review: any) => review.rating === 5)
      .slice(0, 5);

    return NextResponse.json({
      reviews: fiveStarReviews,
      total_rating: data.result.rating,
      total_reviews: data.result.user_ratings_total,
      source: 'google_api'
    });

  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    
    // Return fallback reviews on error
    return NextResponse.json({
      reviews: getFallbackReviews(),
      source: 'fallback',
      error: 'API temporarily unavailable'
    });
  }
}

// Fallback reviews function
function getFallbackReviews() {
  return [
    {
      id: "fallback_1",
      author_name: "Ashwarya Kanawat",
      rating: 5,
      text: "Just wanted to say a big thank you for organizing two fantastic trips for us – Vietnam and Goa. Both were perfectly planned, stress-free, and full of great memories. We truly appreciate your professionalism and attention to detail.Looking forward to more wonderful trips with you in the future!",
      time: "2024-01-15",
      relative_time_description: "2 weeks ago"
    },
    {
      id: "fallback_2", 
      author_name: "Akshay Agarwal",
      rating: 5,
      text: "We had an amazing experience traveling with GetawayVibe! From start to finish, everything was handled smoothly and professionally. The team made sure our entire trip went off without a hitch and delivered exactly what was promised. Their attention to detail and customer service made our vacation stress-free and truly enjoyable. Highly recommend them for anyone looking for a hassle-free travel experience!",
      time: "2024-01-10",
      relative_time_description: "3 weeks ago"
    },
    {
      id: "fallback_3",
      author_name: "Mudit Goyal", 
      rating: 5,
      text: "Just returned from an unforgettable trip to Vietnam, and I couldn’t be more thankful to my friend Gaurav and his travel company Getaway Vibes for organizing such a seamless and memorable experience.",
      time: "2024-01-05",
      relative_time_description: "1 month ago"
    },
    {
      id: "fallback_4",
      author_name: "Asteek Dubey",
      rating: 5,
      text: "One point solution. In my case, they were very good at what they do.",
      time: "2023-12-28",
      relative_time_description: "1 month ago"
    },
    {
      id: "fallback_5",
      author_name: "Nazneen Eider",
      rating: 5,
      text: "Went on a family trip through GetAway Vibe. Everything was perfect - right from bookings to travel itinerary, accomodations and timely updates.Would love to travel with them more often !",
      time: "2023-12-20",
      relative_time_description: "2 months ago"
    }
  ];
}