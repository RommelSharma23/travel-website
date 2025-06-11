// File Location: src/app/blog/page.tsx
// Blog List Page Component for Travel Website (App Router)

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { Calendar, Clock, User, ArrowRight, Search, Filter, Eye, Tag } from 'lucide-react';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
}

const BlogListPage = () => {
  const router = useRouter();
  const [blogHeaders, setBlogHeaders] = useState<BlogHeader[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<BlogHeader[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>(["All"]);

  useEffect(() => {
    fetchBlogHeaders();
  }, []);

  useEffect(() => {
    filterBlogs();
  }, [selectedCategory, searchTerm, blogHeaders]);

  const fetchBlogHeaders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all published blog headers
      const { data, error } = await supabase
        .from('blog_headers')
        .select('*')
        .eq('status', 'Published')
        .order('published_at', { ascending: false });

      if (error) throw error;

      setBlogHeaders(data || []);
      
      // Extract unique categories
      const uniqueCategories = ["All", ...new Set(data?.map(blog => blog.category).filter(Boolean))];
      setCategories(uniqueCategories);
      
    } catch (error: any) {
      console.error('Error fetching blogs:', error);
      setError('Failed to load blog posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filterBlogs = () => {
    let filtered = blogHeaders;

    if (selectedCategory !== "All") {
      filtered = filtered.filter(blog => blog.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(blog => 
        blog.blog_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        blog.author_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBlogs(filtered);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateReadTime = (excerpt?: string) => {
    // Estimate 200 words per minute reading speed
    const wordCount = excerpt ? excerpt.split(' ').length : 0;
    const readTime = Math.max(1, Math.ceil(wordCount / 50)); // Rough estimate
    return `${readTime} min read`;
  };

  const handleBlogClick = (blog: BlogHeader) => {
    router.push(`/blog/${blog.slug}`);
  };

  const featuredBlog = filteredBlogs.find(blog => blog.is_featured);
  const regularBlogs = filteredBlogs.filter(blog => !blog.is_featured);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading amazing travel stories...</p>
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
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="flex flex-col lg:flex-row gap-6 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search travel stories, destinations, tips..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-lg"
            />
          </div>
          <div className="flex gap-3 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Blog */}
        {featuredBlog && (
          <div className="mb-16">
            <div 
              className="bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer transform hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl"
              onClick={() => handleBlogClick(featuredBlog)}
            >
              <div className="relative h-96 lg:h-[500px]">
                {featuredBlog.featured_image && (
                  <Image 
                    src={featuredBlog.featured_image} 
                    alt={featuredBlog.blog_name}
                    fill
                    className="object-cover"
                    priority
                  />
                )}
                <div className="absolute top-6 left-6">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    ✨ Featured Story
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <span className="inline-block bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                    {featuredBlog.category}
                  </span>
                  <h2 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">{featuredBlog.blog_name}</h2>
                  {featuredBlog.sub_heading && (
                    <p className="text-xl text-gray-200 mb-6 max-w-3xl">{featuredBlog.sub_heading}</p>
                  )}
                  
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-3">
                      {featuredBlog.author_image && (
                        <Image 
                          src={featuredBlog.author_image} 
                          alt={featuredBlog.author_name || 'Author'}
                          width={32}
                          height={32}
                          className="rounded-full border-2 border-white"
                        />
                      )}
                      <span className="font-medium">{featuredBlog.author_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(featuredBlog.published_at)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{calculateReadTime(featuredBlog.excerpt)}</span>
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
            {regularBlogs.map((blog) => (
              <article 
                key={blog.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-[1.02] transition-all duration-300 hover:shadow-xl group"
                onClick={() => handleBlogClick(blog)}
              >
                <div className="relative h-56 overflow-hidden">
                  {blog.featured_image && (
                    <Image 
                      src={blog.featured_image} 
                      alt={blog.blog_name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/95 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">
                      {blog.category}
                    </span>
                  </div>
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
                        <Image 
                          src={blog.author_image} 
                          alt={blog.author_name || 'Author'}
                          width={40}
                          height={40}
                          className="rounded-full"
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
                        <span className="text-sm">{blog.view_count}</span>
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
                    </div>
                  )}
                  
                  <div className="pt-4 border-t border-gray-100">
                    <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold group-hover:gap-3 transition-all">
                      Read Full Story <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* No Results */}
        {filteredBlogs.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No stories found</h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your search or browse different categories to discover amazing travel content.
              </p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
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
    </div>
  );
};

export default BlogListPage;