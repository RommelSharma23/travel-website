// app/destinations/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase'; 
import ContactModal from '@/components/ui/ContactModal';
// import Image from 'next/image'; // Temporarily using regular img tags
import { MapPin, Clock, Users, Star, Search, Filter } from 'lucide-react';

interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  image?: string;
  hero_image?: string;
  duration?: string;
  price?: number;
  rating?: number;
  reviews_count?: number;
  category?: string;
  slug?: string;
  has_packages?: boolean;
}

export default function DestinationsPage() {
  const router = useRouter();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Contact Modal State
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

  useEffect(() => {
    fetchDestinations();
  }, []);

  useEffect(() => {
    filterDestinations();
  }, [destinations, searchTerm, selectedCategory]);

  const fetchDestinations = async () => {
    try {
      setError(null);
      
      // First get all destinations
      const { data: destinations, error: destError } = await supabase
        .from('destinations')
        .select('*')
        .order('name');

      if (destError) throw destError;

      // Then check which ones have packages
      const { data: packagesData, error: packagesError } = await supabase
        .from('tour_packages')
        .select('destination_id')
        .eq('is_active', true);

      if (packagesError) throw packagesError;

      // Create set of destination IDs that have packages
      const destinationsWithPackages = new Set(packagesData?.map(p => p.destination_id) || []);

      // Add has_packages flag to each destination
      const transformedData = destinations?.map(dest => ({
        ...dest,
        has_packages: destinationsWithPackages.has(dest.id)
      })) || [];
      
      setDestinations(transformedData);
    } catch (err: any) {
      console.error('Error fetching destinations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterDestinations = () => {
    let filtered = destinations;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(dest =>
        dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(dest => 
        dest.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredDestinations(filtered);
  };

  const getUniqueCategories = () => {
    const categories = destinations
      .map(dest => dest.category)
      .filter(Boolean)
      .filter((category, index, self) => self.indexOf(category) === index);
    return ['all', ...categories];
  };

  const getImageUrl = (destination: Destination) => {
    // If destination has an image, use it
    if (destination.hero_image) return destination.hero_image;
    if (destination.image) return destination.image;
    
    // Fallback images based on destination name
    const destinationName = destination.name.toLowerCase();
    
    if (destinationName.includes('bali')) {
      return 'https://images.unsplash.com/photo-1537953773345-5b2b3b6e4346?w=800&h=600&fit=crop';
    }
    if (destinationName.includes('marrakech') || destinationName.includes('morocco')) {
      return 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800&h=600&fit=crop';
    }
    if (destinationName.includes('paris')) {
      return 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&h=600&fit=crop';
    }
    if (destinationName.includes('tokyo') || destinationName.includes('japan')) {
      return 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop';
    }
    if (destinationName.includes('egypt') || destinationName.includes('cairo')) {
      return 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800&h=600&fit=crop';
    }
    
    // Generic travel fallback
    return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop';
  };

  // Handle Explore Packages button click
  const handleExplorePackages = (destination: Destination) => {
    const slug = destination.slug || destination.name.toLowerCase().replace(/\s+/g, '-');
    router.push(`/destinations/${slug}`);
  };

  // Handle Contact Now button click
  const handleContactNow = (destination: Destination) => {
    setSelectedDestination(destination);
    setShowContactModal(true);
  };

  // Close contact modal
  const handleCloseContactModal = () => {
    setShowContactModal(false);
    setSelectedDestination(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Discovering amazing destinations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={fetchDestinations}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Discover Your Next Adventure
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Explore breathtaking destinations around the world and create memories that last a lifetime
          </p>
          <div className="text-sm text-blue-200">
            ✨ {destinations.length} Amazing Destinations Waiting For You
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 -mt-10 relative z-10">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search destinations, countries, or experiences..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
              />
            </div>
            
            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white min-w-48"
              >
                {getUniqueCategories().map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Results Count */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-8">
          <p className="text-gray-600">
            {filteredDestinations.length === destinations.length 
              ? `Showing all ${destinations.length} destinations`
              : `Found ${filteredDestinations.length} of ${destinations.length} destinations`
            }
          </p>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="container mx-auto px-4 pb-16">
        {filteredDestinations.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No destinations found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search terms or filters</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredDestinations.map((destination, index) => (
              <div 
                key={destination.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getImageUrl(destination)}
                    alt={destination.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Category Badge */}
                  {destination.category && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                        {destination.category}
                      </span>
                    </div>
                  )}

                  {/* Rating */}
                  {destination.rating && (
                    <div className="absolute top-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs font-medium">{destination.rating}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
                        {destination.name}
                      </h3>
                      <div className="flex items-center text-gray-500 text-sm mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        {destination.country}
                      </div>
                    </div>
                    {destination.price && (
                      <div className="text-right">
                        <div className="text-sm text-gray-500">From</div>
                        <div className="text-lg font-bold text-blue-600">
                          ${destination.price}
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {destination.description}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    {destination.duration && (
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {destination.duration}
                      </div>
                    )}
                    {destination.reviews_count && (
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {destination.reviews_count} reviews
                      </div>
                    )}
                  </div>

                  {/* CTA Button - Conditional Logic */}
                  {destination.has_packages ? (
                    <button 
                      onClick={() => handleExplorePackages(destination)}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 transform group-hover:scale-105"
                    >
                      Explore Packages
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleContactNow(destination)}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 transform group-hover:scale-105"
                    >
                      Contact Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Contact Modal */}
      <ContactModal
        isOpen={showContactModal}
        onClose={handleCloseContactModal}
        source={`Destination Page - ${selectedDestination?.name || 'Unknown'}`}
      />

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