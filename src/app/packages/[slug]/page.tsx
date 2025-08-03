// app/packages/[slug]/page.tsx - Performance Optimized Version

'use client';

import { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { 
  MapPin, Clock, Users, Star, ArrowLeft, Calendar, 
  CheckCircle, XCircle, DollarSign, Phone, Mail,
  Camera, ChevronLeft, ChevronRight, Eye, Share2
} from 'lucide-react';

// Lazy load components for better performance
const ContactModal = dynamic(() => import('@/components/ui/ContactModal'), {
  ssr: false,
  loading: () => null
});

const GalleryModal = dynamic(() => Promise.resolve(GalleryModalComponent), {
  ssr: false,
  loading: () => null
});

interface Package {
  id: number;
  reference_no: string;
  title: string;
  slug: string;
  short_description: string;
  long_description: string;
  duration_days: number;
  duration_nights: number;
  price_from: number;
  price_to: number;
  currency: string;
  inclusions: string[];
  exclusions: string[];
  highlights: string[];
  is_best_selling: boolean;
  is_featured: boolean;
  max_group_size?: number;
  min_age?: number;
  difficulty_level?: string;
  availability_status: string;
  is_active: boolean;
}

interface Destination {
  id: string;
  name: string;
  country: string;
  slug: string;
}

interface Category {
  id?: number;
  name: string;
  slug?: string;
}

interface PackageWithRelations extends Package {
  destination?: Destination | Destination[] | null;
  category?: Category | Category[] | null;
}

interface PackageImage {
  id: number;
  image_url: string;
  image_type: 'hero' | 'gallery' | 'itinerary';
  alt_text?: string;
  day_number?: number;
  sort_order: number;
  is_active: boolean;
}

interface ItineraryDay {
  id: number;
  day_number: number;
  day_title: string;
  day_description?: string;
  activities?: string;
  sort_order: number;
}

// Skeleton components for loading states
const HeroSkeleton = () => (
  <div className="relative h-96 bg-gray-200 animate-pulse">
    <div className="absolute inset-0 bg-black/20"></div>
    <div className="absolute inset-0 flex items-end">
      <div className="container mx-auto px-4 pb-8">
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="h-6 bg-white/20 rounded-full w-24"></div>
            <div className="h-6 bg-white/20 rounded-full w-32"></div>
          </div>
          <div className="h-12 bg-white/20 rounded-lg w-3/4"></div>
          <div className="h-6 bg-white/20 rounded-lg w-1/2"></div>
        </div>
      </div>
    </div>
  </div>
);

const ContentSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4 w-64"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6 w-48"></div>
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border-l-4 border-gray-200 pl-6">
                <div className="h-6 bg-gray-200 rounded mb-2 w-48"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
          <div className="h-12 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center py-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
          <div className="h-12 bg-gray-200 rounded mt-6"></div>
        </div>
      </div>
    </div>
  </div>
);

// Optimized image component
const OptimizedImage = ({ 
  src, 
  alt, 
  className,
  fill = false,
  width,
  height,
  priority = false,
  onClick
}: {
  src?: string;
  alt: string;
  className: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  onClick?: () => void;
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fallbackImage = useCallback(() => {
    const category = alt.toLowerCase();
    if (category.includes('adventure')) {
      return 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop&auto=format&q=75';
    }
    if (category.includes('luxury')) {
      return 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop&auto=format&q=75';
    }
    return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop&auto=format&q=75';
  }, [alt]);

  const imageProps = {
    src: (src && !imageError) ? src : fallbackImage(),
    alt,
    className: `${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`,
    onError: () => setImageError(true),
    onLoad: () => setIsLoading(false),
    quality: 75 as const,
    priority,
    onClick,
    ...(fill ? { fill: true } : { width, height })
  };

  return (
    <div className="relative">
      {isLoading && (
        <div className={`absolute inset-0 bg-gray-200 animate-pulse ${fill ? '' : `w-[${width}px] h-[${height}px]`}`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-gray-400 text-sm">Loading...</div>
          </div>
        </div>
      )}
      <Image {...imageProps} sizes={fill ? "100vw" : undefined} />
    </div>
  );
};

// Gallery Modal Component
function GalleryModalComponent({ 
  isOpen, 
  images, 
  currentIndex, 
  onClose, 
  onNext, 
  onPrev 
}: {
  isOpen: boolean;
  images: PackageImage[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          onPrev();
          break;
        case 'ArrowRight':
          onNext();
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen || images.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center">
      <div className="relative w-full h-full flex items-center justify-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
        >
          <XCircle className="w-6 h-6" />
        </button>
        
        {images.length > 1 && (
          <>
            <button
              onClick={onPrev}
              className="absolute left-4 text-white hover:text-gray-300 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button
              onClick={onNext}
              className="absolute right-4 text-white hover:text-gray-300 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        <div className="relative max-w-7xl max-h-full p-4">
          <OptimizedImage
            src={images[currentIndex]?.image_url}
            alt={images[currentIndex]?.alt_text || `Gallery image ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain"
            width={1200}
            height={800}
            priority
          />
        </div>
        
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}

function PackageDetailContent() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  // State
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [images, setImages] = useState<PackageImage[]>([]);
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  // Memoized computations
  const heroImage = useMemo(() => {
    const hero = images.find(img => img.image_type === 'hero' && img.is_active);
    return hero?.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=600&fit=crop&auto=format&q=80';
  }, [images]);

  const galleryImages = useMemo(() => 
    images.filter(img => img.image_type === 'gallery' && img.is_active), 
    [images]
  );

  const formattedPrice = useMemo(() => {
    if (!packageData) return '';
    
    const convertToINR = (price: number) => Math.round(price * 83);
    
    if (packageData.price_to > packageData.price_from) {
      return `₹${convertToINR(packageData.price_from).toLocaleString()} - ₹${convertToINR(packageData.price_to).toLocaleString()}`;
    }
    return `From ₹${convertToINR(packageData.price_from).toLocaleString()}`;
  }, [packageData]);

  // Optimized data fetching
  const fetchPackageDetails = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      console.log('🔍 PACKAGE: Fetching package by slug:', slug);

      // Fetch package with destination and category info
      const { data: packageData, error: packageError } = await supabase
        .from('tour_packages')
        .select(`
          *,
          destination:destinations(id, name, country, slug),
          category:categories(id, name, slug)
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (packageError) {
        console.error('❌ PACKAGE: Package not found:', packageError);
        throw new Error('Package not found');
      }

      console.log('✅ PACKAGE: Package data fetched successfully');

      // Transform the data
      const typedPackageData = packageData as unknown as PackageWithRelations;
      
      setPackageData(typedPackageData);
      
      // Handle destination data
      if (typedPackageData.destination) {
        const destData = Array.isArray(typedPackageData.destination) 
          ? typedPackageData.destination[0] 
          : typedPackageData.destination;
        setDestination(destData || null);
      }

      // Handle category data
      if (typedPackageData.category) {
        const catData = Array.isArray(typedPackageData.category) 
          ? typedPackageData.category[0] 
          : typedPackageData.category;
        setCategory(catData || null);
      }

      // Fetch additional data in parallel
      const [imagesResult, itineraryResult] = await Promise.all([
        // Fetch package images
        supabase
          .from('package_images')
          .select('*')
          .eq('package_id', typedPackageData.id)
          .eq('is_active', true)
          .order('image_type')
          .order('sort_order'),
        
        // Fetch itinerary
        supabase
          .from('package_itinerary')
          .select('*')
          .eq('package_id', typedPackageData.id)
          .order('day_number')
      ]);

      // Handle images
      if (imagesResult.error) {
        console.warn('⚠️ IMAGES: Error fetching images:', imagesResult.error);
      } else {
        setImages(imagesResult.data || []);
      }

      // Handle itinerary
      if (itineraryResult.error) {
        console.warn('⚠️ ITINERARY: Error fetching itinerary:', itineraryResult.error);
      } else {
        setItinerary(itineraryResult.data || []);
      }

    } catch (err: any) {
      console.error('💥 PACKAGE: Error in fetchPackageDetails:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  // Event handlers with useCallback
  const handleBackClick = useCallback(() => {
    if (destination?.slug) {
      router.push(`/destinations/${destination.slug}`);
    } else {
      router.back();
    }
  }, [router, destination]);

  const openGallery = useCallback((index: number = 0) => {
    setCurrentImageIndex(index);
    setShowGallery(true);
  }, []);

  const closeGallery = useCallback(() => {
    setShowGallery(false);
  }, []);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => 
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  }, [galleryImages.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  }, [galleryImages.length]);

  const handleContactModal = useCallback((show: boolean) => {
    setShowContactModal(show);
  }, []);

  // Effects
  useEffect(() => {
    if (slug) {
      fetchPackageDetails();
    }
  }, [slug, fetchPackageDetails]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb Skeleton */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-1"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-4 bg-gray-200 rounded w-1"></div>
              <div className="h-4 bg-gray-200 rounded w-48"></div>
            </div>
          </div>
        </div>

        <HeroSkeleton />
        <ContentSkeleton />
      </div>
    );
  }

  if (error || !packageData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Package Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The package you\'re looking for doesn\'t exist.'}</p>
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
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => router.push('/destinations')}
              className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              Destinations
            </button>
            <span className="text-gray-400">/</span>
            {destination && (
              <>
                <button
                  onClick={() => router.push(`/destinations/${destination.slug}`)}
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                >
                  {destination.name}
                </button>
                <span className="text-gray-400">/</span>
              </>
            )}
            <span className="text-gray-600">{packageData.title}</span>
          </div>
          <button
            onClick={handleBackClick}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 mt-2 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to {destination?.name || 'Previous Page'}
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <section className="relative h-96 overflow-hidden">
        <OptimizedImage
          src={heroImage}
          alt={packageData.title}
          className="object-cover"
          fill
          priority
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <div className="text-white">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {packageData.reference_no}
                </span>
                {packageData.is_best_selling && (
                  <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    🏆 BEST SELLER
                  </span>
                )}
                {packageData.is_featured && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    ⭐ FEATURED
                  </span>
                )}
                {category && (
                  <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                    {category.name}
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-2">{packageData.title}</h1>
              <div className="flex items-center gap-4 text-lg flex-wrap">
                {destination && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-5 h-5" />
                    {destination.name}, {destination.country}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Clock className="w-5 h-5" />
                  {packageData.duration_days} Days / {packageData.duration_nights} Nights
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery Preview */}
      {galleryImages.length > 0 && (
        <section className="bg-white py-6">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 mb-4">
              <Camera className="w-5 h-5 text-gray-600" />
              <span className="text-gray-600 font-medium">Photo Gallery ({galleryImages.length} photos)</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {galleryImages.slice(0, 6).map((image, index) => (
                <div
                  key={image.id}
                  className="relative h-20 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity group"
                  onClick={() => openGallery(index)}
                >
                  <OptimizedImage
                    src={image.image_url}
                    alt={image.alt_text || `Gallery image ${index + 1}`}
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    fill
                  />
                  {index === 5 && galleryImages.length > 6 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-bold">+{galleryImages.length - 6}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content - Two Column Layout */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Itinerary & Inclusions/Exclusions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Package Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Package</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {packageData.long_description || packageData.short_description}
              </p>
              
              {packageData.highlights && packageData.highlights.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Package Highlights</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {packageData.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Star className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Day-wise Itinerary */}
            {itinerary.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Day-wise Itinerary</h2>
                <div className="space-y-6">
                  {itinerary.map((day, index) => (
                    <div 
                      key={day.id} 
                      className="border-l-4 border-blue-600 pl-6 relative animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="absolute -left-3 top-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white text-xs font-bold">{day.day_number}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          Day {day.day_number}: {day.day_title}
                        </h3>
                        {day.day_description && (
                          <p className="text-gray-600 mb-3 leading-relaxed">{day.day_description}</p>
                        )}
                        {day.activities && (
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Activities:
                            </h4>
                            <p className="text-gray-600 text-sm">{day.activities}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inclusions & Exclusions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">What's Included</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Inclusions */}
                {packageData.inclusions && packageData.inclusions.length > 0 && (
                  <div>
                    <h3 className="flex items-center gap-2 font-semibold text-green-700 mb-4">
                      <CheckCircle className="w-5 h-5" />
                      Included
                    </h3>
                    <ul className="space-y-3">
                      {packageData.inclusions.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Exclusions */}
                {packageData.exclusions && packageData.exclusions.length > 0 && (
                  <div>
                    <h3 className="flex items-center gap-2 font-semibold text-red-700 mb-4">
                      <XCircle className="w-5 h-5" />
                      Not Included
                    </h3>
                    <ul className="space-y-3">
                      {packageData.exclusions.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Package Info & Pricing */}
          <div className="space-y-6">
            {/* Package Info Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-4">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {formattedPrice}
                </div>
                <p className="text-gray-500 text-sm">per person</p>
                {packageData.availability_status && (
                  <div className="mt-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      packageData.availability_status === 'Available' 
                        ? 'bg-green-100 text-green-800' 
                        : packageData.availability_status === 'Limited'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {packageData.availability_status}
                    </span>
                  </div>
                )}
              </div>

              {/* Package Details */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Duration
                  </span>
                  <span className="font-medium">{packageData.duration_days}D / {packageData.duration_nights}N</span>
                </div>

                {packageData.max_group_size && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Group Size
                    </span>
                    <span className="font-medium">Max {packageData.max_group_size}</span>
                  </div>
                )}

                {packageData.difficulty_level && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Difficulty</span>
                    <span className={`font-medium px-2 py-1 rounded text-xs ${
                      packageData.difficulty_level === 'Easy' ? 'bg-green-100 text-green-800' :
                      packageData.difficulty_level === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                      packageData.difficulty_level === 'Challenging' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {packageData.difficulty_level}
                    </span>
                  </div>
                )}

                {packageData.min_age && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Min Age</span>
                    <span className="font-medium">{packageData.min_age}+ years</span>
                  </div>
                )}

                {category && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Category</span>
                    <span className="font-medium">{category.name}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => handleContactModal(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
                >
                  Get Custom Quote
                </button>
                
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="tel:+919876543210"
                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                  >
                    <Phone className="w-4 h-4" />
                    Call
                  </a>
                  <a
                    href="mailto:info@getawayvibe.com"
                    className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </a>
                </div>

                {/* Share Button */}
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: packageData.title,
                        text: packageData.short_description,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      // You could add a toast notification here
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-all duration-200"
                >
                  <Share2 className="w-4 h-4" />
                  Share Package
                </button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500 mb-2">
                  🔒 Free cancellation up to 24 hours before departure
                </p>
                <p className="text-xs text-gray-500">
                  ⭐ Best price guarantee
                </p>
              </div>
            </div>

            {/* Package Stats */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Why Choose This Package?</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {packageData.duration_days}
                  </div>
                  <div className="text-sm text-gray-600">Days</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {packageData.highlights?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Highlights</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {itinerary.length}
                  </div>
                  <div className="text-sm text-gray-600">Activities</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {galleryImages.length}
                  </div>
                  <div className="text-sm text-gray-600">Photos</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Modal */}
      {showGallery && (
        <GalleryModal
          isOpen={showGallery}
          images={galleryImages}
          currentIndex={currentImageIndex}
          onClose={closeGallery}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <ContactModal
          isOpen={showContactModal}
          onClose={() => handleContactModal(false)}
          source={`Package Detail - ${packageData.reference_no}`}
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
      `}</style>
    </div>
  );
}

export default function PackageDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading package details...</p>
        </div>
      </div>
    }>
      <PackageDetailContent />
    </Suspense>
  );
}