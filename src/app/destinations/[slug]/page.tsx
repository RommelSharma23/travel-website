// app/destinations/[slug]/page.tsx - Performance Optimized Version

'use client';

import { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { supabase } from '../../../lib/supabase';
import { MapPin, Clock, Users, Star, ArrowLeft, Crown, Calendar, DollarSign, Eye, Tag } from 'lucide-react';

// Lazy load components for better performance
const ContactModal = dynamic(() => import('../../../components/ui/ContactModal'), {
  ssr: false,
  loading: () => null
});

interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  long_description?: string;
  hero_image?: string;
  gallery?: any;
  rating?: number;
  reviews_count?: number;
  best_time_to_visit?: string;
  language?: string;
  currency?: string;
  climate?: string;
  slug: string;
  status: string;
  category_id?: number;
  category_name?: string | null;
}

interface CategoryData {
  id?: number;
  name: string;
  slug?: string;
}

interface DestinationWithCategories extends Omit<Destination, 'category_name'> {
  categories?: CategoryData | CategoryData[] | null;
}

interface Package {
  id: number;
  reference_no: string;
  title: string;
  slug: string;
  short_description: string;
  duration_days: number;
  duration_nights: number;
  price_from: number;
  price_to: number;
  currency: string;
  is_best_selling: boolean;
  is_featured: boolean;
  highlights: string[];
  hero_image?: string;
  category?: {
    name: string;
  };
  availability_status: string;
  is_active: boolean;
}

interface PackageWithCategories extends Omit<Package, 'category'> {
  categories?: CategoryData | CategoryData[] | null;
}

// Skeleton components for loading states
const HeroSkeleton = () => (
  <div className="relative h-96 bg-gray-200 animate-pulse">
    <div className="absolute inset-0 bg-black/20"></div>
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center">
        <div className="h-12 bg-white/20 rounded-lg mb-4 w-80"></div>
        <div className="h-6 bg-white/20 rounded-lg w-40 mx-auto"></div>
      </div>
    </div>
  </div>
);

const DestinationInfoSkeleton = () => (
  <div className="max-w-4xl mx-auto">
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 animate-pulse">
      <div className="h-8 bg-gray-200 rounded mb-4 w-64"></div>
      <div className="space-y-3 mb-6">
        <div className="h-6 bg-gray-200 rounded"></div>
        <div className="h-6 bg-gray-200 rounded"></div>
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="text-center">
            <div className="w-6 h-6 bg-gray-200 rounded mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-1"></div>
            <div className="h-5 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const PackageCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200"></div>
    <div className="p-6">
      <div className="h-6 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
      <div className="flex justify-between mb-4">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="h-6 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="h-10 bg-gray-200 rounded"></div>
    </div>
  </div>
);

// Optimized image component for packages
const OptimizedPackageImage = ({ 
  src, 
  alt, 
  className,
  priority = false 
}: { 
  src?: string; 
  alt: string; 
  className: string;
  priority?: boolean;
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fallbackImage = useCallback(() => {
    const category = alt.toLowerCase();
    if (category.includes('adventure')) {
      return 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop&auto=format&q=75';
    }
    if (category.includes('luxury')) {
      return 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop&auto=format&q=75';
    }
    if (category.includes('family')) {
      return 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=300&fit=crop&auto=format&q=75';
    }
    return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop&auto=format&q=75';
  }, [alt]);

  return (
    <div className="relative w-full h-48">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}
      <Image
        src={(src && !imageError) ? src : fallbackImage()}
        alt={alt}
        fill
        className={`object-cover ${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={() => setImageError(true)}
        onLoad={() => setIsLoading(false)}
        priority={priority}
        quality={75}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
      />
    </div>
  );
};

function DestinationDetailContent() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  // State
  const [destination, setDestination] = useState<Destination | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);

  // Memoized computations
  const bestSellingPackages = useMemo(() => 
    packages.filter(pkg => pkg.is_best_selling && pkg.is_active).slice(0, 3), 
    [packages]
  );

  const featuredPackages = useMemo(() => 
    packages.filter(pkg => pkg.is_featured && pkg.is_active), 
    [packages]
  );

  const regularPackages = useMemo(() => 
    packages.filter(pkg => pkg.is_active), 
    [packages]
  );

  // Optimized data fetching
  const fetchDestinationAndPackages = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      console.log('🔍 DESTINATION: Fetching destination by slug:', slug);

      // Fetch destination by slug with category info
      const { data: destinationData, error: destError } = await supabase
        .from('destinations')
        .select(`
          *,
          categories:category_id (
            id,
            name,
            slug
          )
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (destError) {
        console.log('🔄 DESTINATION: Trying fallback search by name...');
        // Try fallback with name-based slug
        const formattedName = slug.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('destinations')
          .select(`
            *,
            categories:category_id (
              id,
              name,
              slug
            )
          `)
          .ilike('name', `%${formattedName}%`)
          .eq('status', 'published')
          .single();

        if (fallbackError) {
          console.error('❌ DESTINATION: Not found:', fallbackError);
          throw new Error('Destination not found');
        }
        
        const typedFallbackData = fallbackData as unknown as DestinationWithCategories;
        const transformedFallback: Destination = {
          ...typedFallbackData,
          category_name: typedFallbackData.categories 
            ? (Array.isArray(typedFallbackData.categories) 
                ? typedFallbackData.categories[0]?.name || null 
                : typedFallbackData.categories.name || null)
            : null
        };
        setDestination(transformedFallback);
      } else {
        const typedDestinationData = destinationData as DestinationWithCategories;
        const transformedDestination: Destination = {
          ...typedDestinationData,
          category_name: typedDestinationData.categories 
            ? (Array.isArray(typedDestinationData.categories) 
                ? typedDestinationData.categories[0]?.name || null 
                : typedDestinationData.categories.name || null)
            : null
        };
        setDestination(transformedDestination);
      }

      const destinationId = destinationData?.id || null;
      if (!destinationId) {
        throw new Error('Destination not found');
      }

      console.log('📦 DESTINATION: Fetching packages for destination ID:', destinationId);

      // Fetch packages for this destination with optimized query
      const { data: packagesData, error: packagesError } = await supabase
        .from('tour_packages')
        .select(`
          id,
          reference_no,
          title,
          slug,
          short_description,
          duration_days,
          duration_nights,
          price_from,
          price_to,
          currency,
          is_best_selling,
          is_featured,
          highlights,
          availability_status,
          is_active,
          category_id,
          categories:category_id (
            name
          )
        `)
        .eq('destination_id', destinationId)
        .eq('is_active', true)
        .order('is_best_selling', { ascending: false })
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (packagesError) {
        console.error('❌ PACKAGES: Error fetching packages:', packagesError);
        throw packagesError;
      }

      console.log(`✅ PACKAGES: Found ${packagesData?.length || 0} packages`);

      // Get package hero images efficiently
      const packageIds = packagesData?.map(p => p.id) || [];
      let imageMap = new Map();

      if (packageIds.length > 0) {
        const { data: imagesData, error: imagesError } = await supabase
          .from('package_images')
          .select('package_id, image_url')
          .in('package_id', packageIds)
          .eq('image_type', 'hero')
          .eq('is_active', true);

        if (imagesError) {
          console.warn('⚠️ IMAGES: Error fetching package images:', imagesError);
        } else {
          imageMap = new Map(imagesData?.map(img => [img.package_id, img.image_url]) || []);
        }
      }

      // Transform packages data
      const packagesWithImages = packagesData?.map(pkg => {
        // Type assertion with unknown first to handle Supabase response structure
        const typedPkg = pkg as unknown as PackageWithCategories;
        return {
          ...typedPkg,
          hero_image: imageMap.get(typedPkg.id),
          category: typedPkg.categories ? { 
            name: Array.isArray(typedPkg.categories) 
              ? typedPkg.categories[0]?.name || 'Unknown' 
              : typedPkg.categories.name || 'Unknown' 
          } : undefined
        };
      }) || [];

      setPackages(packagesWithImages);

    } catch (err: any) {
      console.error('💥 DESTINATION: Error in fetchDestinationAndPackages:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  // Optimized image handling
  const getDestinationImage = useCallback(() => {
    if (destination?.hero_image) return destination.hero_image;
    
    // Enhanced fallback images based on destination name and country
    const destinationName = destination?.name?.toLowerCase() || '';
    const country = destination?.country?.toLowerCase() || '';
    
    // India destinations
    if (country.includes('india')) {
      if (destinationName.includes('goa')) {
        return 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&h=600&fit=crop&auto=format&q=80';
      }
      if (destinationName.includes('kerala')) {
        return 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&h=600&fit=crop&auto=format&q=80';
      }
      if (destinationName.includes('rajasthan') || destinationName.includes('jaipur')) {
        return 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1200&h=600&fit=crop&auto=format&q=80';
      }
      return 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&h=600&fit=crop&auto=format&q=80';
    }
    
    // International destinations
    if (destinationName.includes('bali')) {
      return 'https://images.unsplash.com/photo-1537953773345-5b2b3b6e4346?w=1200&h=600&fit=crop&auto=format&q=80';
    }
    if (destinationName.includes('morocco') || destinationName.includes('marrakech')) {
      return 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=1200&h=600&fit=crop&auto=format&q=80';
    }
    if (destinationName.includes('paris') || country.includes('france')) {
      return 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=1200&h=600&fit=crop&auto=format&q=80';
    }
    if (destinationName.includes('tokyo') || country.includes('japan')) {
      return 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&h=600&fit=crop&auto=format&q=80';
    }
    
    return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=600&fit=crop&auto=format&q=80';
  }, [destination]);

  // Event handlers with useCallback
  const handlePackageClick = useCallback((pkg: Package) => {
    router.push(`/packages/${pkg.slug}`);
  }, [router]);

  const handleBackClick = useCallback(() => {
    router.back();
  }, [router]);

  const handleContactModal = useCallback((show: boolean) => {
    setShowContactModal(show);
  }, []);

  // Effects
  useEffect(() => {
    if (slug) {
      fetchDestinationAndPackages();
    }
  }, [slug, fetchDestinationAndPackages]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Back Button Skeleton */}
        <div className="container mx-auto px-4 pt-6">
          <div className="h-6 bg-gray-200 rounded w-40 animate-pulse"></div>
        </div>

        {/* Hero Skeleton */}
        <HeroSkeleton />

        {/* Destination Info Skeleton */}
        <section className="container mx-auto px-4 py-12">
          <DestinationInfoSkeleton />
        </section>

        {/* Packages Skeleton */}
        <section className="container mx-auto px-4 pb-16">
          <div className="h-8 bg-gray-200 rounded mb-8 w-64 mx-auto animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <PackageCardSkeleton key={i} />
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Destination Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The destination you\'re looking for doesn\'t exist.'}</p>
          <button 
            onClick={() => router.push('/destinations')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition-colors duration-200"
          >
            Back to Destinations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-6">
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Destinations
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <Image
          src={getDestinationImage()}
          alt={destination.name}
          fill
          className="object-cover"
          priority
          quality={80}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{destination.name}</h1>
            <div className="flex items-center justify-center gap-2 text-xl">
              <MapPin className="w-5 h-5" />
              {destination.country}
            </div>
            {destination.category_name && (
              <div className="mt-2">
                <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                  {destination.category_name}
                </span>
              </div>
            )}
            {destination.rating && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-lg font-medium">{destination.rating}</span>
                {destination.reviews_count && (
                  <span className="text-gray-200">
                    ({destination.reviews_count.toLocaleString()} reviews)
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Destination Info */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">About {destination.name}</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              {destination.long_description || destination.description || 
               `Discover the beauty and wonder of ${destination.name}, ${destination.country}. This amazing destination offers incredible experiences and unforgettable memories for travelers of all kinds.`}
            </p>
            
            {/* Quick Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
              {destination.best_time_to_visit && (
                <div className="text-center p-4 rounded-lg bg-blue-50">
                  <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 mb-1">Best Time</p>
                  <p className="font-medium text-gray-800">{destination.best_time_to_visit}</p>
                </div>
              )}
              {destination.language && (
                <div className="text-center p-4 rounded-lg bg-green-50">
                  <p className="text-sm text-gray-500 mb-1">Language</p>
                  <p className="font-medium text-gray-800">{destination.language}</p>
                </div>
              )}
              {destination.currency && (
                <div className="text-center p-4 rounded-lg bg-yellow-50">
                  <DollarSign className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 mb-1">Currency</p>
                  <p className="font-medium text-gray-800">{destination.currency}</p>
                </div>
              )}
              {destination.climate && (
                <div className="text-center p-4 rounded-lg bg-purple-50">
                  <p className="text-sm text-gray-500 mb-1">Climate</p>
                  <p className="font-medium text-gray-800">{destination.climate}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Best Selling Packages */}
      {bestSellingPackages.length > 0 && (
        <section className="container mx-auto px-4 pb-12">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Crown className="w-6 h-6 text-yellow-500" />
            <h2 className="text-3xl font-bold text-gray-800">Best Selling Packages</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {bestSellingPackages.map((pkg, index) => (
              <div 
                key={pkg.id} 
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => handlePackageClick(pkg)}
              >
                <div className="relative">
                  <OptimizedPackageImage
                    src={pkg.hero_image}
                    alt={pkg.title}
                    className="group-hover:scale-110 transition-transform duration-500"
                    priority={index < 3}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      🏆 BEST SELLER
                    </span>
                  </div>
                  {pkg.category && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                        {pkg.category.name}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                    {pkg.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{pkg.short_description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{pkg.duration_days} days / {pkg.duration_nights} nights</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">From</p>
                      <p className="text-xl font-bold text-blue-600">
                        ₹{pkg.price_from.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePackageClick(pkg);
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 transform group-hover:scale-105"
                  >
                    View Package Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Packages */}
      <section className="container mx-auto px-4 pb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            All {destination.name} Packages
          </h2>
          <div className="text-sm text-gray-600">
            {regularPackages.length} package{regularPackages.length !== 1 ? 's' : ''} available
          </div>
        </div>
        
        {regularPackages.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No packages available yet</h3>
            <p className="text-gray-600 mb-6">We're working on creating amazing packages for {destination.name}</p>
            <button 
              onClick={() => handleContactModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition-colors duration-200"
            >
              Contact Us for Custom Package
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {regularPackages.map((pkg, index) => (
              <div 
                key={pkg.id} 
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => handlePackageClick(pkg)}
              >
                <div className="relative">
                  <OptimizedPackageImage
                    src={pkg.hero_image}
                    alt={pkg.title}
                    className="group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {pkg.is_best_selling && (
                      <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        BEST SELLER
                      </span>
                    )}
                    {pkg.is_featured && (
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        FEATURED
                      </span>
                    )}
                  </div>
                  {pkg.category && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                        {pkg.category.name}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-800 flex-1 group-hover:text-blue-600 transition-colors duration-200">
                      {pkg.title}
                    </h3>
                    <span className="text-xs text-gray-500 ml-2">{pkg.reference_no}</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{pkg.short_description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{pkg.duration_days}D/{pkg.duration_nights}N</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">From</p>
                      <p className="text-lg font-bold text-blue-600">
                        ₹{pkg.price_from.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePackageClick(pkg);
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 transform group-hover:scale-105"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Contact Modal */}
      {showContactModal && (
   <ContactModal
  isVisible={showContactModal}
  onClose={() => setShowContactModal(false)}
  prefilledDestination={destination.name}
/>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default function DestinationDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading destination details...</p>
        </div>
      </div>
    }>
      <DestinationDetailContent />
    </Suspense>
  );
}