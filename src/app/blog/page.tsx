// app/blog/page.tsx - Performance Optimized Version

'use client';

import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import { Calendar, Clock, User, ArrowRight, Search, Filter, Eye, Tag, BookOpen, TrendingUp } from 'lucide-react';


interface BlogHeader {
  id: number;
  blog_name: string;
  sub_heading?: string;
  slug: string;
  excerpt?: string;
  featured_image?: string;
  category?: string;
  tags?: string[];
  author_name?: string;
  author_image?: string;
  published_at: string;
  view_count?: number;
  is_featured: boolean;
  reading_time?: number;
  status: string;
  created_at: string;
}

interface FilterOptions {
  search: string;
  category: string;
  sortBy: string;
}

// Skeleton components for loading states
const FeaturedBlogSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-pulse mb-16">
    <div className="relative h-96 lg:h-[500px] bg-gray-200">
      <div className="absolute top-6 left-6">
        <div className="bg-gray-300 h-8 w-32 rounded-full"></div>
      </div>
      <div className="absolute bottom-8 left-8 right-8">
        <div className="bg-gray-300 h-4 w-24 rounded-full mb-4"></div>
        <div className="bg-gray-300 h-12 w-3/4 rounded mb-4"></div>
        <div className="bg-gray-300 h-6 w-1/2 rounded mb-6"></div>
        <div className="flex gap-4">
          <div className="bg-gray-300 h-4 w-20 rounded"></div>
          <div className="bg-gray-300 h-4 w-24 rounded"></div>
          <div className="bg-gray-300 h-4 w-20 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

const BlogCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
    <div className="h-56 bg-gray-200"></div>
    <div className="p-6">
      <div className="h-6 bg-gray-200 rounded mb-3"></div>
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        <div className="h-6 bg-gray-200 rounded w-16"></div>
        <div className="h-6 bg-gray-200 rounded w-20"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-32"></div>
    </div>
  </div>
);

// Optimized image component for blog images
const OptimizedBlogImage = ({ 
  src, 
  alt, 
  className, 
  priority = false,
  fill = false,
  width,
  height
}: {
  src?: string;
  alt: string;
  className: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fallbackImage = useCallback(() => {
    const category = alt.toLowerCase();
    if (category.includes('travel')) {
      return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop&auto=format&q=75';
    }
    if (category.includes('destination')) {
      return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format&q=75';
    }
    if (category.includes('food')) {
      return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop&auto=format&q=75';
    }
    return 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop&auto=format&q=75';
  }, [alt]);

  const imageProps = {
    src: (src && !imageError) ? src : fallbackImage(),
    alt,
    className: `${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`,
    onError: () => setImageError(true),
    onLoad: () => setIsLoading(false),
    quality: 75 as const,
    priority,
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
      <Image
        {...imageProps}
        sizes={fill ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" : undefined}
      />
    </div>
  );
};

function BlogPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State
  const [blogHeaders, setBlogHeaders] = useState<BlogHeader[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>(['All']);
  
  // Filter state
  const [filters, setFilters] = useState<FilterOptions>({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'All',
    sortBy: searchParams.get('sortBy') || 'newest'
  });

  // Optimized data fetching
  const fetchBlogHeaders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 BLOG: Starting to fetch blog headers...');
      
      // Fetch published blog headers with optimized query
      const { data, error } = await supabase
        .from('blog_headers') // Using correct table name
        .select(`
          id,
          blog_name,
          sub_heading,
          slug,
          excerpt,
          featured_image,
          meta_title,
          meta_description,
          keywords,
          category,
          tags,
          related_destination_id,
          status,
          published_at,
          is_featured,
          author_name,
          author_bio,
          author_image,
          view_count,
          created_at,
          updated_at
        `)
        .eq('status', 'Published')
        .order('published_at', { ascending: false });

      console.log('📤 BLOG: Query result:', { data, error });

      if (error) {
        console.error('❌ BLOG: Query error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log(`✅ BLOG: Successfully fetched ${data?.length || 0} blog headers`);

      // Transform data to match interface (already matches mostly)
      const transformedData = (data || []).map(blog => ({
        ...blog,
        reading_time: blog.excerpt ? Math.max(1, Math.ceil(blog.excerpt.split(' ').length / 200)) : 1
      }));

      setBlogHeaders(transformedData);
      
      // Extract unique categories efficiently
      const uniqueCategories = ['All', ...new Set(data?.map(blog => blog.category).filter(Boolean))];
      setCategories(uniqueCategories);
      
      console.log('🎯 BLOG: Categories found:', uniqueCategories);
      
    } catch (error: any) {
      console.error('💥 BLOG: Error in fetchBlogHeaders:', error);
      console.error('💥 BLOG: Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      // Provide more helpful error messages
      if (error.message.includes('relation') || error.message.includes('does not exist')) {
        setError('Blog table not found. Please check if the blog_headers table exists in your database.');
      } else if (error.message.includes('permission')) {
        setError('Permission denied. Please check your database permissions for the blog_headers table.');
      } else {
        setError(`Failed to load blog posts: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Memoized filtered and sorted blogs
  const filteredAndSortedBlogs = useMemo(() => {
    let filtered = blogHeaders;

    // Category filter
    if (filters.category !== 'All') {
      filtered = filtered.filter(blog => blog.category === filters.category);
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(blog => 
        blog.blog_name.toLowerCase().includes(searchLower) ||
        blog.excerpt?.toLowerCase().includes(searchLower) ||
        blog.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
        blog.author_name?.toLowerCase().includes(searchLower) ||
        blog.category?.toLowerCase().includes(searchLower)
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
        case 'oldest':
          return new Date(a.published_at).getTime() - new Date(b.published_at).getTime();
        case 'popular':
          return (b.view_count || 0) - (a.view_count || 0);
        case 'title':
          return a.blog_name.localeCompare(b.blog_name);
        default:
          return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
      }
    });

    return filtered;
  }, [blogHeaders, filters]);

  // Split featured and regular blogs
  const featuredBlog = useMemo(() => 
    filteredAndSortedBlogs.find(blog => blog.is_featured), 
    [filteredAndSortedBlogs]
  );
  
  const regularBlogs = useMemo(() => 
    filteredAndSortedBlogs.filter(blog => !blog.is_featured), 
    [filteredAndSortedBlogs]
  );

  // Event handlers with useCallback
  const updateFilter = useCallback((key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      category: 'All',
      sortBy: 'newest'
    });
  }, []);

  const handleBlogClick = useCallback((blog: BlogHeader) => {
    router.push(`/blog/${blog.slug}`);
  }, [router]);

  // Utility functions
  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  const calculateReadTime = useCallback((excerpt?: string, readingTime?: number) => {
    if (readingTime) return `${readingTime} min read`;
    const wordCount = excerpt ? excerpt.split(' ').length : 100;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));
    return `${readTime} min read`;
  }, []);

  // Filter options
  const sortOptions = useMemo(() => [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'title', label: 'Title A-Z' }
  ], []);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'All' && value !== 'newest') {
        params.set(key, value);
      }
    });
    
    const newUrl = params.toString() ? `?${params.toString()}` : '/blog';
    window.history.replaceState({}, '', newUrl);
  }, [filters]);

  useEffect(() => {
    fetchBlogHeaders();
  }, [fetchBlogHeaders]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Skeleton */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="h-12 bg-gray-200 rounded-lg mb-6 max-w-md mx-auto animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded-lg mb-4 max-w-2xl mx-auto animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded-lg max-w-xl mx-auto animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filter Skeleton */}
          <div className="flex flex-col lg:flex-row gap-6 mb-10">
            <div className="flex-1 h-14 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="flex gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 w-20 bg-gray-200 rounded-xl animate-pulse"></div>
              ))}
            </div>
          </div>

          {/* Featured Blog Skeleton */}
          <FeaturedBlogSkeleton />

          {/* Blog Grid Skeleton */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={fetchBlogHeaders}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Travel Blog</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover inspiring travel stories, expert tips, and hidden gems from around the world. 
              Let our experiences guide your next adventure.
            </p>
            <div className="flex justify-center gap-6 mt-6 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                {blogHeaders.length} Stories
              </span>
              <span className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                {blogHeaders.reduce((sum, blog) => sum + (blog.view_count || 0), 0).toLocaleString()} Total Views
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Search and Filter */}
        <div className="flex flex-col lg:flex-row gap-6 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search travel stories, destinations, tips..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-lg"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => updateFilter('category', category)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    filters.category === category
                      ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            
            {/* Sort Filter */}
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700 font-semibold"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-8">
          <p className="text-gray-600">
            {filteredAndSortedBlogs.length === blogHeaders.length 
              ? `Showing all ${blogHeaders.length} stories`
              : `Found ${filteredAndSortedBlogs.length} of ${blogHeaders.length} stories`
            }
          </p>
          
          {filteredAndSortedBlogs.length !== blogHeaders.length && (
            <button 
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Featured Blog */}
        {featuredBlog && (
          <div className="mb-16">
            <div 
              className="bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer transform hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl group"
              onClick={() => handleBlogClick(featuredBlog)}
            >
              <div className="relative h-96 lg:h-[500px] overflow-hidden">
                <OptimizedBlogImage
                  src={featuredBlog.featured_image}
                  alt={featuredBlog.blog_name}
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  fill
                  priority
                />
                <div className="absolute top-6 left-6">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    ✨ Featured Story
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  {featuredBlog.category && (
                    <span className="inline-block bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                      {featuredBlog.category}
                    </span>
                  )}
                  <h2 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">{featuredBlog.blog_name}</h2>
                  {featuredBlog.sub_heading && (
                    <p className="text-xl text-gray-200 mb-6 max-w-3xl">{featuredBlog.sub_heading}</p>
                  )}
                  
                  <div className="flex items-center gap-6 text-sm flex-wrap">
                    {featuredBlog.author_name && (
                      <div className="flex items-center gap-3">
                        {featuredBlog.author_image && (
                          <OptimizedBlogImage
                            src={featuredBlog.author_image}
                            alt={featuredBlog.author_name}
                            className="rounded-full border-2 border-white"
                            width={32}
                            height={32}
                          />
                        )}
                        <span className="font-medium">{featuredBlog.author_name}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(featuredBlog.published_at)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{calculateReadTime(featuredBlog.excerpt, featuredBlog.reading_time)}</span>
                    </div>
                    {featuredBlog.view_count && (
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        <span>{featuredBlog.view_count.toLocaleString()} views</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blog Grid */}
        {regularBlogs.length > 0 && (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {regularBlogs.map((blog, index) => (
              <article 
                key={blog.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-[1.02] transition-all duration-300 hover:shadow-xl group animate-fade-in"
                style={{
                  animationDelay: `${index * 50}ms`
                }}
                onClick={() => handleBlogClick(blog)}
              >
                <div className="relative h-56 overflow-hidden">
                  <OptimizedBlogImage
                    src={blog.featured_image}
                    alt={blog.blog_name}
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    fill
                  />
                  {blog.category && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/95 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">
                        {blog.category}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {blog.blog_name}
                  </h3>
                  {blog.excerpt && (
                    <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                      {blog.excerpt}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {blog.author_image && (
                        <OptimizedBlogImage
                          src={blog.author_image}
                          alt={blog.author_name || 'Author'}
                          className="rounded-full"
                          width={40}
                          height={40}
                        />
                      )}
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{blog.author_name}</p>
                        <p className="text-xs text-gray-500">{formatDate(blog.published_at)}</p>
                      </div>
                    </div>
                    {blog.view_count && (
                      <div className="flex items-center gap-2 text-gray-500">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">{blog.view_count.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.tags.slice(0, 3).map((tag, index) => (
                        <span 
                          key={index}
                          className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                      {blog.tags.length > 3 && (
                        <span className="text-xs text-gray-400">+{blog.tags.length - 3} more</span>
                      )}
                    </div>
                  )}
                  
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold group-hover:gap-3 transition-all">
                        Read Full Story <ArrowRight className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {calculateReadTime(blog.excerpt, blog.reading_time)}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* No Results */}
        {filteredAndSortedBlogs.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No stories found</h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your search or browse different categories to discover amazing travel content.
              </p>
              <button 
                onClick={clearFilters}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Show All Stories
              </button>
            </div>
          </div>
        )}

        {/* Empty State - No Blogs */}
        {blogHeaders.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-6">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No blog posts yet</h3>
              <p className="text-gray-500 mb-6">
                We're working on amazing travel stories for you. Check back soon!
              </p>
            </div>
          </div>
        )}
      </div>

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

export default function BlogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading amazing travel stories...</p>
        </div>
      </div>
    }>
      <BlogPageContent />
    </Suspense>
  );
}