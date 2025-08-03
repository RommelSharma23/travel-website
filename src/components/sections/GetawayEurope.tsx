// src/components/sections/GetawayEurope.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { MapPin, Heart, Calendar } from 'lucide-react';
import Image from 'next/image';

interface Destination {
  id: number;
  name: string;
  country: string;
  slug: string;
  description: string;
  hero_image: string;
}

// Loading Skeleton for European destination cards
const EuropeSkeleton = ({ index }: { index: number }) => (
  <motion.div
    className="bg-white rounded-xl overflow-hidden shadow-lg"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
  >
    <div className="relative h-72 bg-gradient-to-br from-emerald-200 to-blue-300 animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-400/50 to-transparent" />
      <div className="absolute top-4 left-4">
        <div className="h-6 bg-white/40 rounded-full w-16 animate-pulse" />
      </div>
      <div className="absolute bottom-4 left-4 space-y-2">
        <div className="h-5 bg-white/60 rounded w-28 animate-pulse" />
        <div className="h-4 bg-white/40 rounded w-20 animate-pulse" />
      </div>
      <div className="absolute top-4 right-4">
        <div className="h-8 w-8 bg-white/40 rounded-full animate-pulse" />
      </div>
    </div>
    <div className="p-6 space-y-4">
      <div className="h-6 bg-gray-200 rounded animate-pulse" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse" />
      </div>
      <div className="flex space-x-2">
        <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse" />
        <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse" />
      </div>
      <div className="h-12 bg-gray-200 rounded animate-pulse" />
    </div>
  </motion.div>
);

interface GetawayEuropeProps {
  onOpenContactForm: (destinationName: string) => void;
}

export const GetawayEurope = ({ onOpenContactForm }: GetawayEuropeProps) => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  // Europe destinations: Italy, Greece, Switzerland, Spain
  const europeSlugs = ['italy', 'greece', 'switzerland', 'spain'];

  const fetchEuropeDestinations = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('destinations')
        .select('id, name, country, slug, description, hero_image')
        .in('slug', europeSlugs)
        .eq('status', 'published')
        .limit(4);

      if (error) throw error;
      
      const sortedData = europeSlugs.map(slug => 
        data?.find(dest => dest.slug === slug)
      ).filter(Boolean) as Destination[];
      
      setDestinations(sortedData);
    } catch (error) {
      console.error('Error fetching Europe destinations:', error);
    } finally {
      setLoading(false);
    }
  }, [europeSlugs]);

  useEffect(() => {
    fetchEuropeDestinations();
  }, [fetchEuropeDestinations]);

  // European themes and colors
  const europeanThemes = ['Romantic', 'Historic', 'Alpine', 'Cultural'];

  return (
    <motion.section 
      ref={ref}
      className="py-20 bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-50 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Parallax background elements with European flair */}
      <div className="absolute inset-0 opacity-8">
        <div className="absolute top-10 right-20 w-80 h-80 bg-emerald-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0s', animationDuration: '4s' }} />
        <div className="absolute bottom-10 left-20 w-64 h-64 bg-blue-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s', animationDuration: '5s' }} />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-indigo-400 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s', animationDuration: '6s' }} />
      </div>

      <div className="container-width section-padding relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-6 w-6 text-red-500 fill-current mr-2" />
            <span className="text-emerald-600 font-semibold text-lg">European Escapes</span>
            <Heart className="h-6 w-6 text-red-500 fill-current ml-2" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Getaway <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">Europe</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Experience the charm, elegance, and timeless beauty of European destinations
          </p>
        </motion.div>

        {/* 4 European destination cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <EuropeSkeleton key={index} index={index} />
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
                <div className="relative h-72 overflow-hidden">
                  <Image
                    src={destination.hero_image || getEuropeanImage(destination.slug)}
                    alt={`${destination.name} - ${destination.country}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    quality={85}
                  />
                  
                  {/* Enhanced European-style gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-transparent to-blue-600/20" />
                  
                  {/* European theme badge */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-white/25 backdrop-blur-md rounded-full px-3 py-1 border border-white/30">
                      <span className="text-xs text-white font-semibold tracking-wide">
                        {europeanThemes[index % europeanThemes.length]}
                      </span>
                    </div>
                  </div>
                  
                  {/* Best time to visit */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-emerald-500 text-white rounded-full p-2 shadow-lg">
                      <Calendar className="h-4 w-4" />
                    </div>
                  </div>
                  
                  {/* Destination info overlay */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-1 text-sm opacity-90">
                        <MapPin className="h-3 w-3" />
                        <span className="font-medium">{destination.country}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs opacity-80">From</div>
                        <div className="font-bold text-lg">₹65,000</div>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold drop-shadow-lg">{destination.name}</h3>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed text-sm">
                    {destination.description}
                  </p>
                  
                  {/* European features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">
                      Cultural Heritage
                    </span>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                      Art & Museums
                    </span>
                  </div>
                  
                  {/* European experience highlights */}
                  <div className="mb-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span>🏰 Historic Sites</span>
                      <span>🍷 Local Cuisine</span>
                    </div>
                  </div>
                  
                  {/* Get Quote button that opens contact form with destination pre-filled */}
                  <button 
                    onClick={() => onOpenContactForm(destination.name)}
                    className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white py-3 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 group-hover:shadow-lg font-medium"
                  >
                    <span>Get Quote</span>
                  </button>
                </div>

                {/* European elegance accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-blue-400 to-indigo-400"></div>
              </motion.div>
            ))
          )}
        </div>

        {/* European travel inspiration - Only "Plan Custom Tour" button */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="bg-gradient-to-r from-emerald-600/10 via-white/50 to-blue-600/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto border border-emerald-200 shadow-xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              European Grand Tour Packages
            </h3>
            <p className="text-gray-600 mb-6">
              Explore multiple European countries in one unforgettable journey. 
              From Mediterranean shores to Alpine peaks, create memories that last a lifetime.
            </p>
            <div className="flex justify-center">
              <button 
                onClick={() => onOpenContactForm('European Grand Tour')}
                className="bg-white text-emerald-600 border-2 border-emerald-600 hover:bg-emerald-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300"
              >
                Plan Custom Tour
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

// Helper function for European destination images
const getEuropeanImage = (slug: string): string => {
  const imageMap: { [key: string]: string } = {
    'italy': 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&h=600&fit=crop&auto=format', // Venice canals
    'greece': 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop&auto=format', // Santorini
    'switzerland': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format', // Swiss Alps
    'spain': 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=800&h=600&fit=crop&auto=format' // Barcelona/Spain
  };
  return imageMap[slug] || 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&h=600&fit=crop&auto=format';
};