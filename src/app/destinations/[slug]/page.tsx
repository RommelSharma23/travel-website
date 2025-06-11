// app/destinations/[slug]/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ContactModal from '@/components/ui/ContactModal';
import { MapPin, Clock, Users, Star, ArrowLeft, Crown, Calendar, DollarSign } from 'lucide-react';

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
}

export default function DestinationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [destination, setDestination] = useState<Destination | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [bestSellingPackages, setBestSellingPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchDestinationAndPackages();
    }
  }, [slug]);

  const fetchDestinationAndPackages = async () => {
    try {
      setError(null);
      setLoading(true);

      // Fetch destination by slug
      const { data: destinationData, error: destError } = await supabase
        .from('destinations')
        .select('*')
        .eq('slug', slug)
        .single();

      if (destError) {
        // Try fallback with name-based slug
        const formattedName = slug.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('destinations')
          .select('*')
          .ilike('name', `%${formattedName}%`)
          .single();

        if (fallbackError) throw new Error('Destination not found');
        setDestination(fallbackData);
      } else {
        setDestination(destinationData);
      }

      const destinationId = destinationData?.id || null;
      if (!destinationId) throw new Error('Destination not found');

      // Fetch packages for this destination
      const { data: packagesData, error: packagesError } = await supabase
        .from('tour_packages')
        .select(`
          *,
          category:categories(name)
        `)
        .eq('destination_id', destinationId)
        .eq('is_active', true)
        .order('is_best_selling', { ascending: false })
        .order('created_at', { ascending: false });

      if (packagesError) throw packagesError;

      // Get package hero images
      const packageIds = packagesData?.map(p => p.id) || [];
      const { data: imagesData, error: imagesError } = await supabase
        .from('package_images')
        .select('package_id, image_url')
        .in('package_id', packageIds)
        .eq('image_type', 'hero')
        .eq('is_active', true);

      if (imagesError) console.warn('Error fetching package images:', imagesError);

      // Create a map of package_id to hero_image
      const imageMap = new Map(imagesData?.map(img => [img.package_id, img.image_url]) || []);

      // Add hero images to packages
      const packagesWithImages = packagesData?.map(pkg => ({
        ...pkg,
        hero_image: imageMap.get(pkg.id)
      })) || [];

      setPackages(packagesWithImages);
      setBestSellingPackages(packagesWithImages.filter(pkg => pkg.is_best_selling).slice(0, 3));

    } catch (err: any) {
      console.error('Error fetching destination data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getDestinationImage = () => {
    if (destination?.hero_image) return destination.hero_image;
    
    // Fallback images based on destination name
    const destinationName = destination?.name?.toLowerCase() || '';
    
    if (destinationName.includes('bali')) {
      return 'https://images.unsplash.com/photo-1537953773345-5b2b3b6e4346?w=1200&h=600&fit=crop';
    }
    if (destinationName.includes('morocco') || destinationName.includes('marrakech')) {
      return 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=1200&h=600&fit=crop';
    }
    return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=600&fit=crop';
  };

  const getPackageImage = (pkg: Package) => {
    if (pkg.hero_image) return pkg.hero_image;
    return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop';
  };

  const handlePackageClick = (pkg: Package) => {
    // Navigate to package detail page (to be created later)
    router.push(`/packages/${pkg.slug}`);
  };

  const handleBackClick = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading destination details...</p>
        </div>
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
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Destinations
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <img
          src={getDestinationImage()}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{destination.name}</h1>
            <div className="flex items-center justify-center gap-2 text-xl">
              <MapPin className="w-5 h-5" />
              {destination.country}
            </div>
            {destination.rating && (
              <div className="flex items-center justify-center gap-2 mt-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span>{destination.rating}</span>
                <span className="text-gray-200">
                  ({destination.reviews_count} reviews)
                </span>
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
              {destination.long_description || destination.description}
            </p>
            
            {/* Quick Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
              {destination.best_time_to_visit && (
                <div className="text-center">
                  <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Best Time</p>
                  <p className="font-medium">{destination.best_time_to_visit}</p>
                </div>
              )}
              {destination.language && (
                <div className="text-center">
                  <p className="text-sm text-gray-500">Language</p>
                  <p className="font-medium">{destination.language}</p>
                </div>
              )}
              {destination.currency && (
                <div className="text-center">
                  <DollarSign className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Currency</p>
                  <p className="font-medium">{destination.currency}</p>
                </div>
              )}
              {destination.climate && (
                <div className="text-center">
                  <p className="text-sm text-gray-500">Climate</p>
                  <p className="font-medium">{destination.climate}</p>
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
            {bestSellingPackages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative">
                  <img
                    src={getPackageImage(pkg)}
                    alt={pkg.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      BEST SELLER
                    </span>
                  </div>
                  {pkg.category && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                        {pkg.category.name}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{pkg.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{pkg.short_description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{pkg.duration_days} days / {pkg.duration_nights} nights</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">From</p>
                      <p className="text-xl font-bold text-blue-600">
                        ${pkg.price_from}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handlePackageClick(pkg)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200"
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
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          All {destination.name} Packages
        </h2>
        
        {packages.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No packages available yet</h3>
            <p className="text-gray-600 mb-6">We're working on creating amazing packages for {destination.name}</p>
            <button 
              onClick={() => setShowContactModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition-colors duration-200"
            >
              Contact Us for Custom Package
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {packages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative">
                  <img
                    src={getPackageImage(pkg)}
                    alt={pkg.title}
                    className="w-full h-48 object-cover"
                  />
                  {pkg.is_best_selling && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        BEST SELLER
                      </span>
                    </div>
                  )}
                  {pkg.category && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                        {pkg.category.name}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-800 flex-1">{pkg.title}</h3>
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
                        ${pkg.price_from}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handlePackageClick(pkg)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200"
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
      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        source={`${destination.name} Destination Page`}
      />

      <style jsx>{`
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