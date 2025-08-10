// app/destinations/page.tsx - Performance Optimized Version

'use client';

import { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { supabase } from '../../lib/supabase';
import { MapPin, Clock, Users, Star, Search, Filter, Grid, List, SlidersHorizontal } from 'lucide-react';

// Lazy load the contact modal for better initial load performance
const ContactModal = dynamic(() => import('../../components/ui/ContactModal'), {
  ssr: false,
  loading: () => null
});

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

interface Destination {
  id: number;
  name: string;
  country: string;
  description?: string;
  hero_image?: string;
  gallery?: string[];
  featured?: boolean;
  created_at?: string;
  category_id?: number;
  slug?: string;
  status: string;
  published_at?: string;
  // Joined/computed fields
  category_name?: string;
  has_packages?: boolean;
  package_count?: number;
  min_price?: number;
  max_price?: number;
}

interface FilterOptions {
  search: string;
  category: string;
  priceRange: string;
  sortBy: string;
  featured: string;
}

// Skeleton component for loading states
const DestinationCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200"></div>
    <div className="p-6">
      <div className="h-4 bg-gray-200 rounded mb-3"></div>
      <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded mb-4 w-1/2"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
    </div>
  </div>
);

// Optimized image component with better fallbacks
const OptimizedDestinationImage = ({ destination, className }: { destination: Destination; className: string }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getImageUrl = useCallback((dest: Destination) => {
    if (dest.hero_image && !imageError) return dest.hero_image;
    
    // Enhanced fallback logic based on destination/country
    const name = dest.name.toLowerCase();
    const country = dest.country.toLowerCase();
    
    // India destinations
    if (country.includes('india')) {
      if (name.includes('goa')) {
        return 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=600&fit=crop&auto=format&q=75';
      }
      if (name.includes('kerala')) {
        return 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&h=600&fit=crop&auto=format&q=75';
      }
      if (name.includes('rajasthan') || name.includes('jaipur')) {
        return 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&h=600&fit=crop&auto=format&q=75';
      }
      if (name.includes('himachal') || name.includes('manali') || name.includes('shimla')) {
        return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format&q=75';
      }
      return 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=600&fit=crop&auto=format&q=75';
    }
    
    // International destinations
    if (country.includes('japan')) {
      return 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop&auto=format&q=75';
    }
    if (country.includes('france')) {
      return 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&h=600&fit=crop&auto=format&q=75';
    }
    if (country.includes('thailand')) {
      return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format&q=75';
    }
    
    // Generic travel fallback
    return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop&auto=format&q=75';
  }, [imageError]);

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}
      <Image
        src={getImageUrl(destination)}
        alt={destination.name}
        fill
        className="object-cover group-hover:scale-110 transition-transform duration-500"
        onError={() => setImageError(true)}
        onLoad={() => setIsLoading(false)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        priority={false} // Set to true for above-the-fold images
        quality={75}
      />
    </div>
  );
};

function DestinationsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState<FilterOptions>({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'all',
    priceRange: searchParams.get('priceRange') || 'all',
    sortBy: searchParams.get('sortBy') || 'name',
    featured: searchParams.get('featured') || 'all'
  });
  
  // Contact Modal State
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

  // Optimized fetch with single query
  const fetchData = useCallback(async () => {
    try {
      setError(null);
      
      // Fetch categories and destinations in parallel
      const [categoriesResult, destinationsResult] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase
          .from('destinations')
          .select(`
            *,
            categories:category_id (
              id,
              name,
              slug
            )
          `)
          .eq('status', 'published')
          .order('name')
      ]);

      if (categoriesResult.error) throw categoriesResult.error;
      if (destinationsResult.error) throw destinationsResult.error;

      setCategories(categoriesResult.data || []);

      // Get package data efficiently
      const destinationIds = destinationsResult.data?.map(d => d.id) || [];
      
      if (destinationIds.length > 0) {
        const { data: packageData, error: packageError } = await supabase
          .from('tour_packages')
          .select('destination_id, price_from, price_to')
          .eq('is_active', true)
          .in('destination_id', destinationIds);

        if (packageError) throw packageError;

        // Group packages by destination efficiently
        const packagesByDestination = (packageData || []).reduce((acc: any, pkg) => {
          if (!acc[pkg.destination_id]) {
            acc[pkg.destination_id] = [];
          }
          acc[pkg.destination_id].push(pkg);
          return acc;
        }, {});

        // Transform destinations data
        const transformedData = destinationsResult.data?.map(dest => {
          const packages = packagesByDestination[dest.id] || [];
          const prices = packages.map((pkg: any) => pkg.price_from).filter(Boolean);
          
          return {
            ...dest,
            category_name: dest.categories?.name || null,
            has_packages: packages.length > 0,
            package_count: packages.length,
            min_price: prices.length > 0 ? Math.min(...prices) : null,
            max_price: prices.length > 0 ? Math.max(...prices) : null,
            categories: undefined
          };
        }) || [];
        
        setDestinations(transformedData);
      } else {
        setDestinations([]);
      }
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Memoized filtering and sorting for better performance
  const filteredAndSortedDestinations = useMemo(() => {
    let filtered = destinations;

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(dest =>
        dest.name.toLowerCase().includes(searchLower) ||
        dest.country.toLowerCase().includes(searchLower) ||
        dest.description?.toLowerCase().includes(searchLower) ||
        dest.category_name?.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(dest => 
        dest.category_id?.toString() === filters.category
      );
    }

    // Featured filter
    if (filters.featured === 'featured') {
      filtered = filtered.filter(dest => dest.featured === true);
    } else if (filters.featured === 'regular') {
      filtered = filtered.filter(dest => dest.featured !== true);
    }

    // Price range filter
    if (filters.priceRange !== 'all' && filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(dest => {
        if (!dest.min_price) return false;
        if (max) {
          return dest.min_price >= min && dest.min_price <= max;
        }
        return dest.min_price >= min;
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'country':
          return a.country.localeCompare(b.country);
        case 'price-low':
          return (a.min_price || 0) - (b.min_price || 0);
        case 'price-high':
          return (b.min_price || 0) - (a.min_price || 0);
        case 'packages':
          return (b.package_count || 0) - (a.package_count || 0);
        case 'featured':
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        case 'newest':
          return new Date(b.published_at || b.created_at || '').getTime() - 
                 new Date(a.published_at || a.created_at || '').getTime();
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [destinations, filters]);

  // Memoized filter options
  const filterOptions = useMemo(() => {
    return {
      priceRanges: [
        { value: 'all', label: 'All Prices' },
        { value: '0-25000', label: 'Under ₹25,000' },
        { value: '25000-50000', label: '₹25,000 - ₹50,000' },
        { value: '50000-100000', label: '₹50,000 - ₹1,00,000' },
        { value: '100000-200000', label: '₹1,00,000 - ₹2,00,000' },
        { value: '200000', label: 'Above ₹2,00,000' }
      ],
      sortOptions: [
        { value: 'name', label: 'Name A-Z' },
        { value: 'country', label: 'Country A-Z' },
        { value: 'featured', label: 'Featured First' },
        { value: 'packages', label: 'Most Packages' },
        { value: 'price-low', label: 'Price: Low to High' },
        { value: 'price-high', label: 'Price: High to Low' },
        { value: 'newest', label: 'Recently Added' }
      ],
      featuredOptions: [
        { value: 'all', label: 'All Destinations' },
        { value: 'featured', label: 'Featured Only' },
        { value: 'regular', label: 'Regular Only' }
      ]
    };
  }, []);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.set(key, value);
      }
    });
    
    const newUrl = params.toString() ? `?${params.toString()}` : '/destinations';
    window.history.replaceState({}, '', newUrl);
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateFilter = useCallback((key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      category: 'all',
      priceRange: 'all',
      sortBy: 'name',
      featured: 'all'
    });
  }, []);

  const formatPrice = useCallback((min?: number | null, max?: number | null) => {
    if (!min) return 'Contact for pricing';
    if (!max || min === max) return `From ₹${min.toLocaleString()}`;
    return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
  }, []);

  const handleExplorePackages = useCallback((destination: Destination) => {
    const slug = destination.slug || destination.name.toLowerCase().replace(/\s+/g, '-');
    router.push(`/destinations/${slug}`);
  }, [router]);

  const handleContactNow = useCallback((destination: Destination) => {
    setSelectedDestination(destination);
    setShowContactModal(true);
  }, []);

  const handleCloseContactModal = useCallback(() => {
    setShowContactModal(false);
    setSelectedDestination(null);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Hero Section Skeleton */}
        <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative container mx-auto px-4 py-20 text-center">
            <div className="h-16 bg-white/20 rounded-lg mb-6 animate-pulse"></div>
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
        <section className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <DestinationCardSkeleton key={index} />
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
            onClick={fetchData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const featuredCount = destinations.filter(d => d.featured).length;
  const packagesCount = destinations.filter(d => d.has_packages).length;

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
          <div className="flex flex-wrap justify-center gap-4 text-sm text-blue-200">
            <span>✨ {destinations.length} Amazing Destinations</span>
            <span>📦 {packagesCount} With Packages Available</span>
            <span>⭐ {featuredCount} Featured Destinations</span>
          </div>
        </div>
      </section>

      {/* Enhanced Search & Filter Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 -mt-10 relative z-10">
          {/* Main Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search destinations, countries, or experiences..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 border rounded-xl transition-colors duration-200 ${
                  showFilters 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filters
                {(filters.category !== 'all' || filters.priceRange !== 'all' || filters.featured !== 'all') && (
                  <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                    {[filters.category !== 'all', filters.priceRange !== 'all', filters.featured !== 'all'].filter(Boolean).length}
                  </span>
                )}
              </button>
              
              <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors duration-200`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors duration-200`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => updateFilter('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id.toString()}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => updateFilter('priceRange', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  {filterOptions.priceRanges.map(range => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Featured Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filters.featured}
                  onChange={(e) => updateFilter('featured', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  {filterOptions.featuredOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => updateFilter('sortBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  {filterOptions.sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Results Header */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <p className="text-gray-600">
            {filteredAndSortedDestinations.length === destinations.length 
              ? `Showing all ${destinations.length} destinations`
              : `Found ${filteredAndSortedDestinations.length} of ${destinations.length} destinations`
            }
          </p>
          
          {filteredAndSortedDestinations.length !== destinations.length && (
            <button 
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
      </section>

      {/* Destinations Display */}
      <section className="container mx-auto px-4 pb-16">
        {filteredAndSortedDestinations.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No destinations found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search terms or filters</p>
            <button 
              onClick={clearFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            : "space-y-6"
          }>
            {filteredAndSortedDestinations.map((destination, index) => (
              <div 
                key={destination.id}
                className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden animate-fade-in ${
                  viewMode === 'list' ? 'flex flex-col md:flex-row' : ''
                }`}
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                {/* Optimized Image */}
                <OptimizedDestinationImage
                  destination={destination}
                  className={viewMode === 'list' ? 'md:w-80 h-48 md:h-auto' : 'h-48'}
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                  {destination.featured && (
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Featured
                    </span>
                  )}
                  {destination.category_name && (
                    <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                      {destination.category_name}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
                          {destination.name}
                        </h3>
                        <div className="flex items-center text-gray-500 text-sm mt-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          {destination.country}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-sm text-gray-500">
                          {destination.package_count ? `${destination.package_count} package${destination.package_count !== 1 ? 's' : ''}` : 'Custom'}
                        </div>
                        <div className="text-sm font-bold text-blue-600">
                          {formatPrice(destination.min_price, destination.max_price)}
                        </div>
                      </div>
                    </div>

                    {destination.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {destination.description}
                      </p>
                    )}

                    {/* Meta Info */}
                  {/* CTA Button */}
                 {/* Meta Info - Removed "Added" date */}
<div className="flex items-center justify-between text-sm text-gray-500 mb-4">
  <div className="flex items-center gap-4">
   
  </div>
</div>
                  </div>

                  {/* CTA Button */}
                  <div className="mt-auto">
                    {destination.has_packages ? (
                      <button 
                        onClick={() => handleExplorePackages(destination)}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 transform group-hover:scale-105"
                      >
                        Explore {destination.package_count} Package{destination.package_count !== 1 ? 's' : ''}
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleContactNow(destination)}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 transform group-hover:scale-105"
                      >
                        Get Custom Quote
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

     {/* Contact Modal */}
{showContactModal && (
  <ContactModal
    isVisible={showContactModal}  // ✅ CORRECT PROP
    onClose={handleCloseContactModal}
    prefilledDestination={selectedDestination?.name || ''}  // ✅ CORRECT PROP
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

export default function DestinationsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading destinations...</p>
        </div>
      </div>
    }>
      <DestinationsPageContent />
    </Suspense>
  );
}