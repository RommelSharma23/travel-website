// app/packages/[slug]/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ContactModal from '@/components/ui/ContactModal';
import { 
  MapPin, Clock, Users, Star, ArrowLeft, Calendar, 
  CheckCircle, XCircle, DollarSign, Phone, Mail,
  Camera, ChevronLeft, ChevronRight
} from 'lucide-react';

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
  destination: {
    id: string;
    name: string;
    country: string;
    slug: string;
  };
  category: {
    name: string;
  };
}

interface PackageImage {
  id: number;
  image_url: string;
  image_type: 'hero' | 'gallery' | 'itinerary';
  alt_text?: string;
  day_number?: number;
  sort_order: number;
}

interface ItineraryDay {
  id: number;
  day_number: number;
  day_title: string;
  day_description?: string;
  activities?: string;
  sort_order: number;
}

export default function PackageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [packageData, setPackageData] = useState<Package | null>(null);
  const [images, setImages] = useState<PackageImage[]>([]);
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [heroImage, setHeroImage] = useState<string>('');
  const [galleryImages, setGalleryImages] = useState<PackageImage[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchPackageDetails();
    }
  }, [slug]);

  const fetchPackageDetails = async () => {
    try {
      setError(null);
      setLoading(true);

      // Fetch package with destination and category info
      const { data: packageData, error: packageError } = await supabase
        .from('tour_packages')
        .select(`
          *,
          destination:destinations(id, name, country, slug),
          category:categories(name)
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (packageError) throw new Error('Package not found');
      
      setPackageData(packageData);

      // Fetch package images
      const { data: imagesData, error: imagesError } = await supabase
        .from('package_images')
        .select('*')
        .eq('package_id', packageData.id)
        .eq('is_active', true)
        .order('image_type')
        .order('sort_order');

      if (imagesError) {
        console.warn('Error fetching images:', imagesError);
      } else {
        setImages(imagesData || []);
        
        // Separate hero and gallery images
        const hero = imagesData?.find(img => img.image_type === 'hero');
        const gallery = imagesData?.filter(img => img.image_type === 'gallery') || [];
        
        setHeroImage(hero?.image_url || getDefaultPackageImage());
        setGalleryImages(gallery);
      }

      // Fetch itinerary
      const { data: itineraryData, error: itineraryError } = await supabase
        .from('package_itinerary')
        .select('*')
        .eq('package_id', packageData.id)
        .order('day_number');

      if (itineraryError) {
        console.warn('Error fetching itinerary:', itineraryError);
      } else {
        setItinerary(itineraryData || []);
      }

    } catch (err: any) {
      console.error('Error fetching package details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getDefaultPackageImage = () => {
    return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=600&fit=crop';
  };

  const handleBackClick = () => {
    if (packageData?.destination?.slug) {
      router.push(`/destinations/${packageData.destination.slug}`);
    } else {
      router.back();
    }
  };

  const openGallery = (index: number = 0) => {
    setCurrentImageIndex(index);
    setShowGallery(true);
  };

  const closeGallery = () => {
    setShowGallery(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading package details...</p>
        </div>
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
              className="text-blue-600 hover:text-blue-800"
            >
              Destinations
            </button>
            <span className="text-gray-400">/</span>
            <button
              onClick={() => router.push(`/destinations/${packageData.destination.slug}`)}
              className="text-blue-600 hover:text-blue-800"
            >
              {packageData.destination.name}
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{packageData.title}</span>
          </div>
          <button
            onClick={handleBackClick}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 mt-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {packageData.destination.name}
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <section className="relative h-96 overflow-hidden">
        <img
          src={heroImage}
          alt={packageData.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <div className="text-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {packageData.reference_no}
                </span>
                {packageData.is_best_selling && (
                  <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    BEST SELLER
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-2">{packageData.title}</h1>
              <div className="flex items-center gap-4 text-lg">
                <div className="flex items-center gap-1">
                  <MapPin className="w-5 h-5" />
                  {packageData.destination.name}, {packageData.destination.country}
                </div>
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
                  className="relative h-20 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => openGallery(index)}
                >
                  <img
                    src={image.image_url}
                    alt={image.alt_text || `Gallery image ${index + 1}`}
                    className="w-full h-full object-cover"
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
              <p className="text-gray-600 leading-relaxed">
                {packageData.long_description || packageData.short_description}
              </p>
              
              {packageData.highlights && packageData.highlights.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Package Highlights</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {packageData.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600 text-sm">{highlight}</span>
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
                  {itinerary.map((day) => (
                    <div key={day.id} className="border-l-4 border-blue-600 pl-6 relative">
                      <div className="absolute -left-3 top-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{day.day_number}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          Day {day.day_number}: {day.day_title}
                        </h3>
                        {day.day_description && (
                          <p className="text-gray-600 mb-3">{day.day_description}</p>
                        )}
                        {day.activities && (
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">Activities:</h4>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Inclusions */}
                <div>
                  <h3 className="flex items-center gap-2 font-semibold text-green-700 mb-4">
                    <CheckCircle className="w-5 h-5" />
                    Included
                  </h3>
                  <ul className="space-y-2">
                    {packageData.inclusions?.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Exclusions */}
                <div>
                  <h3 className="flex items-center gap-2 font-semibold text-red-700 mb-4">
                    <XCircle className="w-5 h-5" />
                    Not Included
                  </h3>
                  <ul className="space-y-2">
                    {packageData.exclusions?.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Package Info & Pricing */}
          <div className="space-y-6">
            {/* Package Info Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-4">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {packageData.price_to > packageData.price_from ? (
                    <span>₹{(packageData.price_from * 83).toLocaleString()} - ₹{(packageData.price_to * 83).toLocaleString()}</span>
                  ) : (
                    <span>From ₹{(packageData.price_from * 83).toLocaleString()}</span>
                  )}
                </div>
                <p className="text-gray-500 text-sm">per person</p>
              </div>

              {/* Package Details */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Duration
                  </span>
                  <span className="font-medium">{packageData.duration_days}D / {packageData.duration_nights}N</span>
                </div>

                {packageData.max_group_size && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Group Size
                    </span>
                    <span className="font-medium">Max {packageData.max_group_size}</span>
                  </div>
                )}

                {packageData.difficulty_level && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Difficulty</span>
                    <span className="font-medium">{packageData.difficulty_level}</span>
                  </div>
                )}

                {packageData.category && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Category</span>
                    <span className="font-medium">{packageData.category.name}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => setShowContactModal(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200"
                >
                  Get Custom Quote
                </button>
                
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="tel:+1234567890"
                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                  >
                    <Phone className="w-4 h-4" />
                    Call
                  </a>
                  <a
                    href="mailto:info@travelcompany.com"
                    className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </a>
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  Free cancellation up to 24 hours before departure
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Modal */}
      {showGallery && galleryImages.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            <button
              onClick={closeGallery}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <XCircle className="w-8 h-8" />
            </button>
            
            <button
              onClick={prevImage}
              className="absolute left-4 text-white hover:text-gray-300 z-10"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-4 text-white hover:text-gray-300 z-10"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            <img
              src={galleryImages[currentImageIndex]?.image_url}
              alt={galleryImages[currentImageIndex]?.alt_text || 'Gallery image'}
              className="max-w-full max-h-full object-contain"
            />
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white">
              {currentImageIndex + 1} / {galleryImages.length}
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        source={`Package Detail - ${packageData.reference_no}`}
      />
    </div>
  );
}