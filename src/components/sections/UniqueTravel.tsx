// src/components/sections/UniqueTravel.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { MapPin, Sparkles, Globe, Camera } from 'lucide-react';
import Image from 'next/image';

interface Destination {
  id: number;
  name: string;
  country: string;
  slug: string;
  description: string;
  hero_image: string;
}

// Loading Skeleton for unique destination cards
const UniqueSkeleton = ({ index }: { index: number }) => (
  <motion.div
    className="bg-white rounded-xl overflow-hidden shadow-lg"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
  >
    <div className="relative h-64 bg-gradient-to-br from-purple-200 to-pink-300 animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-t from-purple-400/50 to-transparent" />
      <div className="absolute top-4 left-4">
        <div className="h-6 bg-white/40 rounded-full w-20 animate-pulse" />
      </div>
      <div className="absolute bottom-4 left-4 space-y-2">
        <div className="h-5 bg-white/60 rounded w-32 animate-pulse" />
        <div className="h-4 bg-white/40 rounded w-24 animate-pulse" />
      </div>
      <div className="absolute top-4 right-4">
        <div className="h-8 w-8 bg-white/40 rounded-full animate-pulse" />
      </div>
    </div>
    <div className="p-6 space-y-4">
      <div className="h-6 bg-gray-200 rounded animate-pulse" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
      </div>
      <div className="flex space-x-2">
        <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse" />
        <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse" />
      </div>
      <div className="h-12 bg-gray-200 rounded animate-pulse" />
    </div>
  </motion.div>
);

interface UniqueTravelProps {
  onOpenContactForm: (destinationName: string) => void;
}

export const UniqueTravel = ({ onOpenContactForm }: UniqueTravelProps) => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  // Unique travel destinations: Australia, Singapore, Japan, South Africa
  const uniqueSlugs = ['australia', 'singapore', 'japan', 'south-africa'];

  const fetchUniqueDestinations = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('destinations')
        .select('id, name, country, slug, description, hero_image')
        .in('slug', uniqueSlugs)
        .eq('status', 'published')
        .limit(4);

      if (error) throw error;
      
      // Sort by the order we want them displayed
      const sortedData = uniqueSlugs.map(slug => 
        data?.find(dest => dest.slug === slug)
      ).filter(Boolean) as Destination[];
      
      setDestinations(sortedData);
    } catch (error) {
      console.error('Error fetching unique destinations:', error);
    } finally {
      setLoading(false);
    }
  }, [uniqueSlugs]);

  useEffect(() => {
    fetchUniqueDestinations();
  }, [fetchUniqueDestinations]);

  // Unique experience themes for each destination
  const uniqueThemes = ['Wildlife', 'Futuristic', 'Traditional', 'Safari'];

  return (
    <motion.section 
      ref={ref}
      className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Dynamic parallax background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0s', animationDuration: '8s' }} />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s', animationDuration: '10s' }} />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-orange-400 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s', animationDuration: '12s' }} />
        <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-cyan-400 rounded-full blur-xl animate-pulse" style={{ animationDelay: '6s', animationDuration: '14s' }} />
      </div>

      <div className="container-width section-padding relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-6 w-6 text-purple-600 mr-2" />
            <span className="text-purple-600 font-semibold text-lg tracking-wide">Extraordinary Experiences</span>
            <Sparkles className="h-6 w-6 text-purple-600 ml-2" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Unique <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600">Travel</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover extraordinary destinations that offer once-in-a-lifetime experiences and unforgettable adventures
          </p>
        </motion.div>

        {/* 4 unique destination cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <UniqueSkeleton key={index} index={index} />
            ))
          ) : (
            destinations.map((destination, index) => (
              <motion.div
                key={destination.id}
                className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3"
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: index * 0.15 + 0.4 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={destination.hero_image || getUniqueImage(destination.slug)}
                    alt={`${destination.name} - ${destination.country}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    quality={85}
                  />
                  
                  {/* Dynamic gradient overlays based on destination */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                  <div className={`absolute inset-0 bg-gradient-to-br ${getGradientColor(index)} opacity-30`} />
                  
                  {/* Unique experience badge */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-white/25 backdrop-blur-md rounded-full px-3 py-2 border border-white/30 flex items-center space-x-1">
                      <Sparkles className="h-3 w-3 text-white" />
                      <span className="text-xs text-white font-bold tracking-wide">
                        {uniqueThemes[index % uniqueThemes.length]}
                      </span>
                    </div>
                  </div>
                  
                  {/* Photo opportunity badge */}
                  <div className="absolute top-4 right-4">
                    <div className={`${getAccentColor(index)} text-white rounded-full p-2 shadow-lg`}>
                      <Camera className="h-4 w-4" />
                    </div>
                  </div>
                  
                  {/* Unique selling points */}
                  <div className="absolute top-16 right-4">
                    <div className="bg-yellow-400 text-yellow-900 rounded-full px-2 py-1 text-xs font-bold shadow-lg">
                      UNIQUE
                    </div>
                  </div>
                  
                  {/* Destination info overlay */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-1 text-sm opacity-90">
                        <Globe className="h-3 w-3" />
                        <span className="font-medium">{destination.country}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs opacity-80">From</div>
                        <div className="font-bold text-lg">{getPrice(destination.slug)}</div>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold drop-shadow-lg mb-1">{destination.name}</h3>
                    <p className="text-xs opacity-90">{getUniqueTagline(destination.slug)}</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed text-sm">
                    {destination.description}
                  </p>
                  
                  {/* Unique features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {getUniqueFeatures(destination.slug).map((feature, idx) => (
                      <span key={idx} className={`${getFeatureColor(index)} px-3 py-1 rounded-full text-xs font-medium`}>
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  {/* Experience highlights */}
                  <div className="mb-4 text-sm text-gray-500">
                    <div className="flex items-center justify-between">
                      <span>{getExperienceIcon(destination.slug)} {getExperience(destination.slug)}</span>
                      <span className="text-green-600 font-semibold">★ 4.9</span>
                    </div>
                  </div>
                  
                  {/* Get Quote button that opens contact form with destination pre-filled */}
                  <button 
                    onClick={() => onOpenContactForm(destination.name)}
                    className={`w-full ${getButtonColor(index)} text-white py-3 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 group-hover:shadow-lg font-medium`}
                  >
                    <span>Get Quote</span>
                  </button>
                </div>

                {/* Unique accent border */}
              
              </motion.div>
            ))
          )}
        </div>

        {/* Unique travel inspiration */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-orange-600/10 backdrop-blur-sm rounded-2xl p-8 max-w-3xl mx-auto border border-white/30 shadow-xl">
            <div className="flex items-center justify-center mb-4">
              <Globe className="h-8 w-8 text-purple-600 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">
                Adventure Beyond Boundaries
              </h3>
            </div>
            <p className="text-gray-600 mb-6 text-lg">
              These destinations offer experiences you can't find anywhere else on Earth. 
              From unique wildlife encounters to cutting-edge cities, create stories worth telling.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => onOpenContactForm('Unique Adventure Package')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                View All Unique Destinations
              </button>
              <button 
                onClick={() => onOpenContactForm('Custom Adventure Trip')}
                className="bg-white text-purple-600 border-2 border-purple-600 hover:bg-purple-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300"
              >
                Plan Adventure Trip
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

// Helper functions for dynamic content
const getUniqueImage = (slug: string): string => {
  const imageMap: { [key: string]: string } = {
    'australia': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format',
    'singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&h=600&fit=crop&auto=format',
    'japan': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop&auto=format',
    'south-africa': 'https://images.unsplash.com/photo-1484318571209-661cf29a69ea?w=800&h=600&fit=crop&auto=format'
  };
  return imageMap[slug] || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop&auto=format';
};

const getGradientColor = (index: number): string => {
  const gradients = [
    'from-orange-600/30 to-red-600/30',
    'from-cyan-600/30 to-blue-600/30', 
    'from-pink-600/30 to-purple-600/30',
    'from-green-600/30 to-emerald-600/30'
  ];
  return gradients[index % gradients.length];
};

const getAccentColor = (index: number): string => {
  const colors = ['bg-orange-500', 'bg-cyan-500', 'bg-pink-500', 'bg-green-500'];
  return colors[index % colors.length];
};

const getButtonColor = (index: number): string => {
  const colors = [
    'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700',
    'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700',
    'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700',
    'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
  ];
  return colors[index % colors.length];
};



const getFeatureColor = (index: number): string => {
  const colors = [
    'bg-orange-100 text-orange-700',
    'bg-cyan-100 text-cyan-700',
    'bg-pink-100 text-pink-700',
    'bg-green-100 text-green-700'
  ];
  return colors[index % colors.length];
};

const getPrice = (slug: string): string => {
  const prices: { [key: string]: string } = {
    'australia': '₹1,25,000',
    'singapore': '65,000',
    'japan': '₹85,000',
    'south-africa': '₹95,000'
  };
  return prices[slug] || '₹75,000';
};

const getUniqueTagline = (slug: string): string => {
  const taglines: { [key: string]: string } = {
    'australia': 'Land Down Under Adventures',
    'singapore': 'Garden City of Tomorrow',
    'japan': 'Where Tradition Meets Future',
    'south-africa': 'Rainbow Nation Safari'
  };
  return taglines[slug] || 'Unique Experience Awaits';
};

const getUniqueFeatures = (slug: string): string[] => {
  const features: { [key: string]: string[] } = {
    'australia': ['Great Barrier Reef', 'Wildlife Unique'],
    'singapore': ['Futuristic City', 'Family Fun'],
    'japan': ['Cultural Heritage', 'Modern Tech'],
    'south-africa': ['Big Five Safari', 'Wine Country']
  };
  return features[slug] || ['Unique Experience', 'Adventure'];
};

const getExperience = (slug: string): string => {
  const experiences: { [key: string]: string } = {
    'australia': 'Wildlife Encounters',
    'singapore': 'Urban Excellence',
    'japan': 'Cultural Immersion', 
    'south-africa': 'Safari Adventures'
  };
  return experiences[slug] || 'Unique Experience';
};

const getExperienceIcon = (slug: string): string => {
  const icons: { [key: string]: string } = {
    'australia': '🦘',
    'singapore': '🏙️',
    'japan': '🏯',
    'south-africa': '🦁'
  };
  return icons[slug] || '✨';
};