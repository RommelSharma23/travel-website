// src/components/sections/MyIndia.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { MapPin, Heart, Mountain, Waves, Sun, Calendar } from 'lucide-react';
import Image from 'next/image';

interface Destination {
  id: number;
  name: string;
  country: string;
  slug: string;
  description: string;
  hero_image: string | null;
}

// Robust Image Component with Error Handling
interface RobustImageProps {
  src: string | null;
  fallbackSrc: string;
  alt: string;
  className?: string;
  destinationName?: string;
}

const RobustImage: React.FC<RobustImageProps> = ({ 
  src, 
  fallbackSrc, 
  alt, 
  className = '',
  destinationName = ''
}) => {
  const [imageSrc, setImageSrc] = useState<string>(src || fallbackSrc);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Reset when src changes
  useEffect(() => {
    const finalSrc = src && src !== 'NULL' && src.trim() !== '' ? src : fallbackSrc;
    setImageSrc(finalSrc);
    setHasError(false);
    setIsLoading(true);
    console.log(`🖼️ [${destinationName}] Using image:`, finalSrc);
  }, [src, fallbackSrc, destinationName]);

  const handleError = () => {
    console.log(`❌ [${destinationName}] Image failed:`, imageSrc);
    if (!hasError && imageSrc !== fallbackSrc) {
      setHasError(true);
      setImageSrc(fallbackSrc);
      console.log(`🔄 [${destinationName}] Switching to fallback:`, fallbackSrc);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
    console.log(`✅ [${destinationName}] Image loaded successfully:`, imageSrc);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-green-300 animate-pulse" />
      )}
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className="object-cover group-hover:scale-110 transition-transform duration-700"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
        quality={85}
        style={{ opacity: isLoading ? 0 : 1 }}
        onError={handleError}
        onLoad={handleLoad}
      />
      
      {/* Debug indicator - smaller and less intrusive */}
      <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-1 py-0.5 rounded z-20 font-mono">
        {hasError ? 'FB' : 'OK'}
      </div>
    </div>
  );
};

// Loading Skeleton for Indian destination cards (Europe-style)
const IndiaSkeleton = ({ index }: { index: number }) => (
  <motion.div
    className="bg-white rounded-xl overflow-hidden shadow-lg"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
  >
    <div className="relative h-72 bg-gradient-to-br from-orange-200 to-green-300 animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-t from-orange-400/50 to-transparent" />
      <div className="absolute top-4 left-4">
        <div className="h-6 bg-white/40 rounded-full w-24 animate-pulse" />
      </div>
      <div className="absolute bottom-4 left-4 space-y-2">
        <div className="h-5 bg-white/60 rounded w-28 animate-pulse" />
        <div className="h-4 bg-white/40 rounded w-32 animate-pulse" />
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
        <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse" />
        <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse" />
      </div>
      <div className="h-12 bg-gray-200 rounded animate-pulse" />
    </div>
  </motion.div>
);

interface MyIndiaProps {
  onOpenContactForm: (destinationName: string) => void;
}

export const MyIndia = ({ onOpenContactForm }: MyIndiaProps) => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  // Indian destinations: Rishikesh, Goa, Ladakh, Himachal
  const indiaSlugs = ['rishikesh-india', 'goa-india', 'ladakh-india', 'himachal-pradesh-india'];

  const fetchIndianDestinations = useCallback(async () => {
    try {
      console.log('🔍 Fetching Indian destinations...');
      
      const { data, error } = await supabase
        .from('destinations')
        .select('id, name, country, slug, description, hero_image')
        .in('slug', indiaSlugs)
        .eq('is_active', true)
        .limit(4);

      if (error) {
        console.error('❌ Supabase error:', error);
        throw error;
      }
      
      console.log('📊 Raw data from Supabase:', data);
      
      // Debug log to see what images we're getting
      console.log('=== INDIA DESTINATIONS DEBUG ===');
      data?.forEach(dest => {
        console.log(`${dest.name}:`, {
          slug: dest.slug,
          hero_image: dest.hero_image,
          hero_image_type: typeof dest.hero_image,
          hero_image_length: dest.hero_image?.length,
          contains_null: dest.hero_image?.includes('NULL'),
          is_valid_url: dest.hero_image?.startsWith('http'),
          is_null: dest.hero_image === null,
          is_empty: dest.hero_image === ''
        });
      });
      console.log('================================');
      
      // Sort by the order we want them displayed and add fallbacks for missing destinations
      const sortedData: Destination[] = [];
      
      indiaSlugs.forEach(slug => {
        const found = data?.find(dest => dest.slug === slug);
        if (found) {
          sortedData.push(found);
        } else {
          // Create a placeholder destination if not found in database
          console.log(`⚠️ Creating placeholder for missing destination: ${slug}`);
          sortedData.push(createPlaceholderDestination(slug));
        }
      });
      
      console.log('✅ Final destinations array:', sortedData);
      setDestinations(sortedData);
    } catch (error) {
      console.error('❌ Error fetching Indian destinations:', error);
      // Create placeholder destinations for all if database fails
      const placeholderDestinations = indiaSlugs.map(createPlaceholderDestination);
      setDestinations(placeholderDestinations);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIndianDestinations();
  }, [fetchIndianDestinations]);

  // Indian experience themes
  const indianThemes = ['Spiritual', 'Beach Bliss', 'High Altitude', 'Mountain Retreat'];
  const indianIcons = [Mountain, Waves, Mountain, Mountain];

  return (
    <motion.section 
      ref={ref}
      className="py-20 bg-gradient-to-br from-orange-50 via-green-50 to-blue-50 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Indian flag inspired parallax background */}
      <div className="absolute inset-0 opacity-8">
        <div className="absolute top-16 left-16 w-80 h-80 bg-orange-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0s', animationDuration: '6s' }} />
        <div className="absolute bottom-16 right-16 w-72 h-72 bg-green-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s', animationDuration: '8s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-400 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s', animationDuration: '10s' }} />
        
        {/* Indian pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 text-6xl">🕉️</div>
          <div className="absolute bottom-32 right-32 text-5xl">🏔️</div>
          <div className="absolute top-40 right-20 text-4xl">🌊</div>
          <div className="absolute bottom-20 left-32 text-5xl">🙏</div>
        </div>
      </div>

      <div className="container-width section-padding relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🇮🇳</span>
              <Heart className="h-6 w-6 text-orange-600 fill-current" />
              <span className="text-orange-600 font-bold text-lg tracking-wide">INCREDIBLE INDIA</span>
              <Heart className="h-6 w-6 text-orange-600 fill-current" />
              <span className="text-2xl">🇮🇳</span>
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-white to-green-600">India</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover the diverse beauty of India - from spiritual mountains to pristine beaches, every corner tells a story
          </p>
        </motion.div>

        {/* 4 Indian destination cards - Europe Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <IndiaSkeleton key={index} index={index} />
            ))
          ) : (
            destinations.map((destination, index) => {
              const IconComponent = indianIcons[index % indianIcons.length];
              const fallbackImage = getFallbackImage(destination.slug);
              
              console.log(`🎨 Rendering ${destination.name} card with:`, {
                hero_image: destination.hero_image,
                fallback: fallbackImage
              });
              
              return (
                <motion.div
                  key={destination.id}
                  className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3"
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.6, delay: index * 0.15 + 0.4 }}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Europe-style image container with exact same height */}
                  <div className="relative h-72 overflow-hidden">
                    <RobustImage
                      src={destination.hero_image}
                      fallbackSrc={fallbackImage}
                      alt={`${destination.name} - ${destination.country}`}
                      className="h-full"
                      destinationName={destination.name}
                    />
                    
                    {/* Enhanced Indian-style gradient overlays (Europe pattern) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                    <div className={`absolute inset-0 ${getIndianGradientOverlay(index)}`} />
                    
                    {/* Indian theme badge (Europe style - simplified) */}
                    <div className="absolute top-4 left-4">
                      <div className="bg-white/25 backdrop-blur-md rounded-full px-3 py-1 border border-white/30">
                        <span className="text-xs text-white font-semibold tracking-wide">
                          {indianThemes[index % indianThemes.length]}
                        </span>
                      </div>
                    </div>
                    
                    {/* Best time to visit (Europe style) */}
                    <div className="absolute top-4 right-4">
                      <div className={`${getSeasonColor(index)} text-white rounded-full p-2 shadow-lg`}>
                        <Calendar className="h-4 w-4" />
                      </div>
                    </div>
                    
                    {/* Destination info overlay (Europe style - cleaner) */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-1 text-sm opacity-90">
                          <MapPin className="h-3 w-3" />
                          <span className="font-medium">{getStateName(destination.slug)}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-xs opacity-80">From</div>
                          <div className="font-bold text-lg">{getIndianPrice(destination.slug)}</div>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold drop-shadow-lg">{destination.name}</h3>
                    </div>
                  </div>
                  
                  {/* Europe-style content section */}
                  <div className="p-6">
                    <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed text-sm">
                      {destination.description}
                    </p>
                    
                    {/* Indian experience features (Europe style - simpler) */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {getIndianFeatures(destination.slug).map((feature, idx) => (
                        <span key={idx} className={`${getIndianFeatureColor(index)} px-3 py-1 rounded-full text-xs font-medium`}>
                          {feature}
                        </span>
                      ))}
                    </div>
                    
                    {/* Indian experience highlights (Europe style) */}
                    <div className="mb-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>{getIndianExperienceIcon(destination.slug)} {getIndianExperience(destination.slug)}</span>
                        <span>🍛 Local Cuisine</span>
                      </div>
                    </div>
                    
                    {/* Get Quote button (Europe style) */}
                    <button 
                      onClick={() => onOpenContactForm(destination.name)}
                      className={`w-full ${getIndianButtonColor(index)} text-white py-3 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 group-hover:shadow-lg font-medium`}
                    >
                      <span>Get Quote</span>
                    </button>
                  </div>

                  {/* Indian tricolor accent (Europe style - top accent) */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 via-white to-green-400"></div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Incredible India inspiration (Europe style - simplified) */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="bg-gradient-to-r from-orange-600/10 via-white/50 to-green-600/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto border border-orange-200 shadow-xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Grand India Tour Packages
            </h3>
            <p className="text-gray-600 mb-6">
              Experience multiple Indian destinations in one unforgettable journey. 
              From the Himalayas to coastal paradises, discover the incredible diversity of India.
            </p>
            <div className="flex justify-center">
              <button 
                onClick={() => onOpenContactForm('Grand India Tour')}
                className="bg-white text-orange-600 border-2 border-orange-600 hover:bg-orange-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300"
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

// Helper function to create placeholder destinations when database data is missing
const createPlaceholderDestination = (slug: string): Destination => {
  const destinationData: { [key: string]: { name: string; description: string } } = {
    'rishikesh-india': {
      name: 'Rishikesh',
      description: 'The yoga capital of the world, nestled in the foothills of the Himalayas along the sacred Ganges River.'
    },
    'goa-india': {
      name: 'Goa',
      description: 'A tropical paradise with pristine beaches, Portuguese heritage, and vibrant nightlife on the western coast.'
    },
    'ladakh-india': {
      name: 'Ladakh',
      description: 'The land of high passes, offering breathtaking landscapes, Buddhist monasteries, and adventure at high altitude.'
    },
    'himachal-pradesh-india': {
      name: 'Himachal Pradesh',
      description: 'The land of gods, featuring snow-capped mountains, hill stations, and spiritual retreats in the Himalayas.'
    }
  };

  const data = destinationData[slug] || { name: 'India', description: 'Incredible India experience awaits you.' };

  return {
    id: Math.random(), // Temporary ID for placeholder
    name: data.name,
    country: 'India',
    slug,
    description: data.description,
    hero_image: null // Will use fallback
  };
};

// Enhanced fallback images with better quality Unsplash URLs
const getFallbackImage = (slug: string): string => {
  const imageMap: { [key: string]: string } = {
    'rishikesh-india': 'https://tfhkqqdlphfizikoxcqo.supabase.co/storage/v1/object/public/getaway-vibe/package-images/packages/rishikesh/Rishikesh.jpg',
    'goa-india': 'https://tfhkqqdlphfizikoxcqo.supabase.co/storage/v1/object/public/getaway-vibe/package-images/packages/goa/gallery/goa-gallery-170h-1754217246917.jpg',
    'ladakh-india': 'https://tfhkqqdlphfizikoxcqo.supabase.co/storage/v1/object/public/getaway-vibe/package-images/packages/ladakh/gallery/ladakh-gallery-6ifr-1754217297438.jpg',
    'himachal-pradesh-india': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format&q=80'
  };
  
  return imageMap[slug] || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=600&fit=crop&auto=format&q=80';
};

// Europe-style gradient overlays (adapted for Indian colors)
const getIndianGradientOverlay = (index: number): string => {
  const gradients = [
    'bg-gradient-to-br from-orange-600/20 via-transparent to-yellow-600/20',   // Rishikesh - sunrise colors
    'bg-gradient-to-br from-blue-600/20 via-transparent to-cyan-600/20',      // Goa - ocean colors  
    'bg-gradient-to-br from-blue-700/20 via-transparent to-purple-600/20',    // Ladakh - high altitude
    'bg-gradient-to-br from-green-600/20 via-transparent to-emerald-600/20'   // Himachal - mountain green
  ];
  return gradients[index % gradients.length];
};

const getSeasonColor = (index: number): string => {
  const colors = ['bg-orange-500', 'bg-blue-500', 'bg-purple-500', 'bg-green-500'];
  return colors[index % colors.length];
};

const getIndianButtonColor = (index: number): string => {
  const colors = [
    'bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700',
    'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700',
    'bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-800 hover:to-purple-800',
    'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
  ];
  return colors[index % colors.length];
};

const getIndianFeatureColor = (index: number): string => {
  const colors = [
    'bg-orange-100 text-orange-700',
    'bg-blue-100 text-blue-700',
    'bg-purple-100 text-purple-700',
    'bg-green-100 text-green-700'
  ];
  return colors[index % colors.length];
};

const getStateName = (slug: string): string => {
  const states: { [key: string]: string } = {
    'rishikesh-india': 'Uttarakhand',
    'goa-india': 'Goa',
    'ladakh-india': 'Ladakh, J&K',
    'himachal-pradesh-india': 'Himachal Pradesh'
  };
  return states[slug] || 'India';
};

const getIndianPrice = (slug: string): string => {
  const prices: { [key: string]: string } = {
    'rishikesh-india': '₹15,000',
    'goa-india': '₹25,000',
    'ladakh-india': '₹45,000',
    'himachal-pradesh-india': '₹35,000'
  };
  return prices[slug] || '₹25,000';
};

const getIndianFeatures = (slug: string): string[] => {
  const features: { [key: string]: string[] } = {
    'rishikesh-india': ['Yoga & Meditation', 'Adventure Sports'],
    'goa-india': ['Beach Paradise', 'Portuguese Heritage'],
    'ladakh-india': ['High Altitude', 'Buddhist Culture'],
    'himachal-pradesh-india': ['Hill Stations', 'Snow Mountains']
  };
  return features[slug] || ['Cultural Heritage', 'Natural Beauty'];
};

const getIndianExperience = (slug: string): string => {
  const experiences: { [key: string]: string } = {
    'rishikesh-india': 'Spiritual Journey',
    'goa-india': 'Beach & Culture',
    'ladakh-india': 'High Altitude Trek',
    'himachal-pradesh-india': 'Mountain Retreat'
  };
  return experiences[slug] || 'Indian Experience';
};

const getIndianExperienceIcon = (slug: string): string => {
  const icons: { [key: string]: string } = {
    'rishikesh-india': '🧘‍♂️',
    'goa-india': '🏖️',
    'ladakh-india': '🏔️',
    'himachal-pradesh-india': '⛰️'
  };
  return icons[slug] || '🇮🇳';
};