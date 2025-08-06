// src/components/sections/FeaturedList.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { MapPin, Star } from 'lucide-react';
import Image from 'next/image';

interface Destination {
  id: number;
  name: string;
  country: string;
  slug: string;
  description: string;
  hero_image: string;
}

// Loading Skeleton for destination cards
const DestinationSkeleton = ({ index }: { index: number }) => (
  <motion.div
    className="bg-white rounded-xl overflow-hidden shadow-lg"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
  >
    <div className="relative h-64 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-t from-gray-400/50 to-transparent" />
      <div className="absolute bottom-4 left-4 space-y-2">
        <div className="h-4 bg-white/40 rounded w-20 animate-pulse" />
        <div className="h-6 bg-white/60 rounded w-32 animate-pulse" />
      </div>
    </div>
    <div className="p-6 space-y-4">
      <div className="h-6 bg-gray-200 rounded animate-pulse" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
      </div>
      <div className="h-12 bg-gray-200 rounded animate-pulse" />
    </div>
  </motion.div>
);

interface FeaturedListProps {
  onOpenContactForm: (destinationName: string) => void;
}

export const FeaturedList = ({ onOpenContactForm }: FeaturedListProps) => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  // Featured destinations: Vietnam, Bali, Thailand, Dubai (4 cards in a row)
  const featuredSlugs = ['vietnam', 'bali-indonesia', 'thailand', 'dubai-uae'];

  // Pricing map for each destination
  const destinationPricing: { [key: string]: number } = {
    'vietnam': 28000,
    'bali-indonesia': 25000,
    'thailand': 20000,
    'dubai-uae': 45000
  };

  // Helper function to get price for a destination
  const getDestinationPrice = (slug: string): number => {
    return destinationPricing[slug] || 25000;
  };

  // Helper function to format price in Indian currency
  const formatPrice = (price: number): string => {
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`;
    } else if (price >= 1000) {
      return `₹${(price / 1000).toFixed(0)}K`;
    }
    return `₹${price.toLocaleString()}`;
  };

  // Use useCallback to fix ESLint exhaustive-deps warning
  const fetchFeaturedDestinations = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('destinations')
        .select('id, name, country, slug, description, hero_image')
        .in('slug', featuredSlugs)
        .eq('status', 'published')
        .limit(4);

      if (error) throw error;
      
      // Sort by the order we want them displayed
      const sortedData = featuredSlugs.map(slug => 
        data?.find(dest => dest.slug === slug)
      ).filter(Boolean) as Destination[];
      
      setDestinations(sortedData);
    } catch (error) {
      console.error('Error fetching featured destinations:', error);
    } finally {
      setLoading(false);
    }
  }, [featuredSlugs]);

  useEffect(() => {
    fetchFeaturedDestinations();
  }, [fetchFeaturedDestinations]);

  return (
    <motion.section 
      ref={ref}
      className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Parallax background elements for visual depth */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-48 h-48 bg-indigo-400 rounded-full blur-2xl animate-pulse" />
      </div>

      <div className="container-width section-padding relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-center justify-center mb-4">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="ml-2 text-gray-600 font-medium">Top Rated Destinations</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Destinations</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover our handpicked selection of breathtaking destinations that promise unforgettable experiences
          </p>
        </motion.div>

        {/* 4 cards in a row - responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <DestinationSkeleton key={index} index={index} />
            ))
          ) : (
            destinations.map((destination, index) => (
              <motion.div
                key={destination.id}
                className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: index * 0.15 + 0.4 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={destination.hero_image || getDefaultImage(destination.slug)}
                    alt={`${destination.name} - ${destination.country}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    quality={80}
                  />
                  
                  {/* Enhanced gradient overlays for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 opacity-60" />
                  
                  {/* Location badge */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                      <MapPin className="h-3 w-3 text-white" />
                      <span className="text-xs text-white font-medium">{destination.country}</span>
                    </div>
                  </div>
                  
                  {/* Destination name overlay with specific pricing */}
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold drop-shadow-lg mb-1">{destination.name}</h3>
                    <div className="flex items-center space-x-1 text-sm opacity-90">
                      <span>Starting from</span>
                      <span className="font-semibold text-lg">
                        {formatPrice(getDestinationPrice(destination.slug))}
                      </span>
                    </div>
                  </div>

                  {/* Rating badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-yellow-400 text-yellow-900 rounded-full px-2 py-1 flex items-center space-x-1 text-xs font-bold">
                      <Star className="h-3 w-3 fill-current" />
                      <span>4.8</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed text-sm">
                    {destination.description}
                  </p>
                  
                  {/* Quick info tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                      7-14 Days
                    </span>
                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-medium">
                      All Inclusive
                    </span>
                  </div>
                  
                  {/* Get Quote button that opens contact form with destination pre-filled */}
                  <button 
                    onClick={() => onOpenContactForm(destination.name)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 group-hover:shadow-lg font-medium"
                  >
                    <span>Get Quote</span>
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Get Free Consultation - opens contact form with general inquiry */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <p className="text-gray-600 mb-4">Can't decide? Let our travel experts help you!</p>
          <button 
            onClick={() => onOpenContactForm('')}
            className="bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Get Free Consultation
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
};

// Helper function for default images based on destination
const getDefaultImage = (slug: string): string => {
  const imageMap: { [key: string]: string } = {
    'vietnam': 'https://images.unsplash.com/photo-1559592413-7cec4d0d7d85?w=800&h=600&fit=crop&auto=format',
    'bali-indonesia': 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=600&fit=crop&auto=format',
    'thailand': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format',
    'dubai-uae': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop&auto=format'
  };
  return imageMap[slug] || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop&auto=format';
};