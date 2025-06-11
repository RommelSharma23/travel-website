// src/app/themes/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { MapPin, Clock, Users, Star, Search, ArrowRight, Heart } from 'lucide-react';

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
}

export default function ThemesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryDestinations, setCategoryDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [destinationsLoading, setDestinationsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setError(null);
      
      // Fetch categories with destination counts
      const { data: categoriesData, error: categoriesError } = await supabase
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
        .order('sort_order');

      if (categoriesError) throw categoriesError;

      // Get destination counts for each category
      const categoriesWithCounts = await Promise.all(
        (categoriesData || []).map(async (category) => {
          const { count } = await supabase
            .from('destinations')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', category.id)
            .eq('is_active', true);

          return {
            ...category,
            destination_count: count || 0
          };
        })
      );

      setCategories(categoriesWithCounts);
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryDestinations = async (categoryId: string) => {
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
          rating,
          price
        `)
        .eq('category_id', categoryId)
        .eq('is_active', true)
        .limit(6);

      if (error) throw error;
      setCategoryDestinations(data || []);
    } catch (err: any) {
      console.error('Error fetching category destinations:', err);
    } finally {
      setDestinationsLoading(false);
    }
  };

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    fetchCategoryDestinations(category.id);
  };

  const getImageUrl = (destination: Destination) => {
    return destination.hero_image || 
           `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format`;
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading travel themes...</p>
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
            🎯 {categories.length} Unique Travel Themes to Explore
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
                onClick={() => setSearchTerm('')}
                className="px-4 py-3 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredCategories.map((category, index) => (
            <div 
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden cursor-pointer"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
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
                  {category.destination_count} destinations
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

        {filteredCategories.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No themes found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search terms</p>
            <button 
              onClick={() => setSearchTerm('')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition-colors duration-200"
            >
              Show All Themes
            </button>
          </div>
        )}
      </section>

      {/* Selected Category Details Modal/Section */}
      {selectedCategory && (
        <section className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div 
              className="p-8 text-center relative"
              style={{ backgroundColor: selectedCategory.color + '15' }}
            >
              <button
                onClick={() => setSelectedCategory(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
              
              <div 
                className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl shadow-lg"
                style={{ backgroundColor: selectedCategory.color }}
              >
                <span className="text-white">{selectedCategory.icon}</span>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {selectedCategory.name} Travel
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {selectedCategory.description}
              </p>
            </div>

            {/* Destinations Preview */}
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Popular {selectedCategory.name} Destinations
                </h3>
                <Link 
                  href={`/destinations?category=${selectedCategory.slug}`}
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {destinationsLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-600">Loading destinations...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryDestinations.map((destination) => (
                    <div 
                      key={destination.id}
                      className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="relative h-32">
                        <img
                          src={getImageUrl(destination)}
                          alt={destination.name}
                          className="w-full h-full object-cover"
                        />
                        {destination.rating && (
                          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-xs font-medium">{destination.rating}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4">
                        <h4 className="font-bold text-gray-800 mb-1">{destination.name}</h4>
                        <p className="text-sm text-gray-500 mb-2">{destination.country}</p>
                        <p className="text-xs text-gray-600 line-clamp-2">{destination.description}</p>
                        {destination.price && (
                          <div className="mt-2 text-sm font-medium text-blue-600">
                            From ${destination.price}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!destinationsLoading && categoryDestinations.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No destinations found for this theme yet.</p>
                  <p className="text-sm mt-1">Check back soon for new additions!</p>
                </div>
              )}
            </div>
          </div>
        </section>
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