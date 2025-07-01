// app/themes/page.tsx - Performance Optimized Version

'use client';

import { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { MapPin, Clock, Users, Star, Search, ArrowRight, Heart, X } from 'lucide-react';

// Lazy load components for better performance
const CategoryModal = dynamic(() => Promise.resolve(CategoryModalComponent), {
  ssr: false,
  loading: () => null
});

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image_url?: string;
  color: string;
  is_active: boolean;
  sort_order: number;
  destination_count?: number;
  package_count?: number;
}

interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  hero_image?: string;
  rating?: number;
  price?: number;
  slug?: string;
}

// Skeleton component for loading states
const CategoryCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
    <div className="p-6 text-center">
      <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-gray-200"></div>
      <div className="h-6 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded mb-3 w-3/4 mx-auto"></div>
    </div>
    <div className="p-6 pt-0">
      <div className="h-16 bg-gray-200 rounded mb-4"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
    </div>
  </div>
);

const DestinationCardSkeleton = () => (
  <div className="bg-gray-50 rounded-xl overflow-hidden animate-pulse">
    <div className="h-32 bg-gray-200"></div>
    <div className="p-4">
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
);

// Optimized image component for destinations
const OptimizedDestinationImage = ({ destination, className }: { destination: Destination; className: string }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getImageUrl = useCallback((dest: Destination) => {
    if (dest.hero_image && !imageError) return dest.hero_image;
    
    // Enhanced fallback logic
    const name = dest.name.toLowerCase();
    const country = dest.country.toLowerCase();
    
    if (country.includes('india')) {
      if (name.includes('goa')) {
        return 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=300&fit=crop&auto=format&q=75';
      }
      if (name.includes('kerala')) {
        return 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&h=300&fit=crop&auto=format&q=75';
      }
      return 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=300&fit=crop&auto=format&q=75';
    }
    
    return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&auto=format&q=75';
  }, [imageError]);

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-xs">Loading...</div>
        </div>
      )}
      <Image
        src={getImageUrl(destination)}
        alt={destination.name}
        fill
        className="object-cover"
        onError={() => setImageError(true)}
        onLoad={() => setIsLoading(false)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        quality={75}
      />
    </div>
  );
};

// Category Modal Component
function CategoryModalComponent({ 
  category, 
  destinations, 
  loading, 
  onClose 
}: { 
  category: Category; 
  destinations: Destination[]; 
  loading: boolean; 
  onClose: () => void; 
}) {
  const router = useRouter();

  const handleDestinationClick = useCallback((destination: Destination) => {
    const slug = destination.slug || destination.name.toLowerCase().replace(/\s+/g, '-');
    router.push(`/destinations/${slug}`);
  }, [router]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div 
          className="p-8 text-center relative"
          style={{ backgroundColor: category.color + '15' }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-white/50 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div 
            className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl shadow-lg"
            style={{ backgroundColor: category.color }}
          >
            <span className="text-white">{category.icon}</span>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {category.name} Travel
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {category.description}
          </p>
        </div>

        {/* Destinations Preview */}
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              Popular {category.name} Destinations
            </h3>
            <Link 
              href={`/destinations?category=${category.id}`}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 transition-colors duration-200"
              onClick={() => setTimeout(onClose, 100)}
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <DestinationCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.map((destination) => (
                <div 
                  key={destination.id}
                  onClick={() => handleDestinationClick(destination)}
                  className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                >
                  <OptimizedDestinationImage
                    destination={destination}
                    className="h-32"
                  />
                  {destination.rating && (
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs font-medium">{destination.rating}</span>
                    </div>
                  )}
                  
                  <div className="p-4">
                    <h4 className="font-bold text-gray-800 mb-1 hover:text-blue-600 transition-colors duration-200">
                      {destination.name}
                    </h4>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <MapPin className="w-3 h-3 mr-1" />
                      {destination.country}
                    </div>
                    {destination.description && (
                      <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                        {destination.description}
                      </p>
                    )}
                    {destination.price && (
                      <div className="text-sm font-medium text-blue-600">
                        From ₹{destination.price.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && destinations.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-4">🏝️</div>
              <p className="text-lg font-medium mb-2">No destinations found for this theme yet.</p>
              <p className="text-sm">Check back soon for new additions!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ThemesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryDestinations, setCategoryDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [destinationsLoading, setDestinationsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  // Optimized data fetching with single query
  const fetchCategories = useCallback(async () => {
    try {
      setError(null);
      
      // Fetch categories and their destination counts in parallel
      const [categoriesResult, destinationCountsResult] = await Promise.all([
        supabase
          .from('categories')
          .select(`
            id,
            name,
            slug,
            description,
            icon,
            image_url,
            color,
            is_active,
            sort_order
          `)
          .eq('is_active', true)
          .order('sort_order'),
        
        supabase
          .from('destinations')
          .select('category_id')
          .eq('status', 'published') // Use correct status field
      ]);

      if (categoriesResult.error) throw categoriesResult.error;
      if (destinationCountsResult.error) throw destinationCountsResult.error;

      // Count destinations per category efficiently
      const destinationCounts = (destinationCountsResult.data || []).reduce((acc: any, dest) => {
        acc[dest.category_id] = (acc[dest.category_id] || 0) + 1;
        return acc;
      }, {});

      // Add counts to categories
      const categoriesWithCounts = (categoriesResult.data || []).map(category => ({
        ...category,
        destination_count: destinationCounts[category.id] || 0
      }));

      setCategories(categoriesWithCounts);
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Optimized destination fetching
  const fetchCategoryDestinations = useCallback(async (categoryId: string) => {
    try {
      setDestinationsLoading(true);
      
      const { data, error } = await supabase
        .from('destinations')
        .select(`
          id,
          name,
          country,
          description,
          hero_image,
          slug
        `)
        .eq('category_id', categoryId)
        .eq('status', 'published') // Use correct status field
        .limit(6)
        .order('name');

      if (error) throw error;
      
      // Add some sample pricing and ratings for demo
      const destinationsWithExtras = (data || []).map(dest => ({
        ...dest,
        rating: Math.random() > 0.5 ? Number((4 + Math.random()).toFixed(1)) : undefined,
        price: Math.random() > 0.3 ? Math.floor(25000 + Math.random() * 200000) : undefined
      }));
      
      setCategoryDestinations(destinationsWithExtras);
    } catch (err: any) {
      console.error('Error fetching category destinations:', err);
      setCategoryDestinations([]);
    } finally {
      setDestinationsLoading(false);
    }
  }, []);

  // Memoized filtered categories for better performance
  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories;
    
    const searchLower = searchTerm.toLowerCase();
    return categories.filter(category =>
      category.name.toLowerCase().includes(searchLower) ||
      category.description.toLowerCase().includes(searchLower)
    );
  }, [categories, searchTerm]);

  // Event handlers with useCallback
  const handleCategoryClick = useCallback((category: Category) => {
    setSelectedCategory(category);
    fetchCategoryDestinations(category.id);
  }, [fetchCategoryDestinations]);

  const handleCloseModal = useCallback(() => {
    setSelectedCategory(null);
    setCategoryDestinations([]);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  // Update URL when search changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) {
      params.set('search', searchTerm);
    }
    
    const newUrl = params.toString() ? `?${params.toString()}` : '/themes';
    window.history.replaceState({}, '', newUrl);
  }, [searchTerm]);

  // Handle escape key for modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedCategory) {
        handleCloseModal();
      }
    };

    if (selectedCategory) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [selectedCategory, handleCloseModal]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Hero Section Skeleton */}
        <section className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative container mx-auto px-4 py-20 text-center">
            <div className="h-16 bg-white/20 rounded-lg mb-6 animate-pulse max-w-2xl mx-auto"></div>
            <div className="h-8 bg-white/20 rounded-lg mb-8 max-w-3xl mx-auto animate-pulse"></div>
            <div className="h-4 bg-white/20 rounded-lg max-w-md mx-auto animate-pulse"></div>
          </div>
        </section>

        {/* Search Section Skeleton */}
        <section className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 -mt-10 relative z-10">
            <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
        </section>

        {/* Grid Skeleton */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <CategoryCardSkeleton key={index} />
            ))}
          </div>
        </section>
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
            onClick={fetchCategories}
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
      <section className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Travel Your Way
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Choose your perfect travel style and discover destinations that match your dreams
          </p>
          <div className="text-sm text-blue-200">
            🎯 {categories.length} Unique Travel Themes • {categories.reduce((sum, cat) => sum + (cat.destination_count || 0), 0)} Total Destinations
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 -mt-10 relative z-10">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search travel themes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
              />
            </div>
            
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="px-4 py-3 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                Clear Search
              </button>
            )}
          </div>
          
          {searchTerm && (
            <div className="mt-4 text-sm text-gray-600">
              {filteredCategories.length === categories.length 
                ? `Showing all ${categories.length} themes`
                : `Found ${filteredCategories.length} of ${categories.length} themes`
              }
            </div>
          )}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container mx-auto px-4 py-12">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No themes found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search terms</p>
            <button 
              onClick={clearSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition-colors duration-200"
            >
              Show All Themes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredCategories.map((category, index) => (
              <div 
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden cursor-pointer animate-fade-in"
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                {/* Header with Icon and Color */}
                <div 
                  className="p-6 text-center relative overflow-hidden"
                  style={{ backgroundColor: category.color + '15' }}
                >
                  <div 
                    className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: category.color }}
                  >
                    <span className="text-white">{category.icon}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                    {category.name}
                  </h3>
                  
                  <div className="flex items-center justify-center text-sm text-gray-500 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    {category.destination_count || 0} destination{(category.destination_count || 0) !== 1 ? 's' : ''}
                  </div>
                </div>

                {/* Description */}
                <div className="p-6 pt-0">
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {category.description}
                  </p>

                  {/* Action Button */}
                  <button 
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 transform group-hover:scale-105 flex items-center justify-center gap-2"
                  >
                    Explore {category.name}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Category Modal */}
      {selectedCategory && (
        <CategoryModal
          category={selectedCategory}
          destinations={categoryDestinations}
          loading={destinationsLoading}
          onClose={handleCloseModal}
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
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default function ThemesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading travel themes...</p>
        </div>
      </div>
    }>
      <ThemesPageContent />
    </Suspense>
  );
}