// File Location: src/app/blog/[slug]/page.tsx
// Individual Blog Post Page Component for Travel Website (App Router)

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { Calendar, Clock, /*User, ArrowRight, Search, Filter,*/ Eye, ChevronLeft,/* Tag, */Share2, /*Heart*/ } from 'lucide-react';

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
  author_bio?: string;
  published_at: string;
  updated_at?: string;
  view_count?: number;
  is_featured: boolean;
  meta_title?: string;
  meta_description?: string;
  keywords?: string[];
}

// Separate interface for related blogs (without is_featured requirement)
interface RelatedBlog {
  id: number;
  blog_name: string;
  slug: string;
  excerpt?: string;
  featured_image?: string;
  category?: string;
  author_name?: string;
  author_image?: string;
  published_at: string;
  view_count?: number;
}

interface BlogContent {
  id: number;
  blog_header_id: number;
  blog_text: string;
  gallery?: any;
}

const BlogPostPage = () => {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;
  
  const [blog, setBlog] = useState<BlogHeader | null>(null);
  const [blogContent, setBlogContent] = useState<BlogContent | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<RelatedBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchBlogPost();
    }
  }, [slug]);

  const fetchBlogPost = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch blog header by slug
      const { data: headerData, error: headerError } = await supabase
        .from('blog_headers')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'Published')
        .single();

      if (headerError) {
        if (headerError.code === 'PGRST116') {
          throw new Error('Blog post not found');
        }
        throw headerError;
      }

      // Fetch blog content
      const { data: contentData, error: contentError } = await supabase
        .from('blog_content')
        .select('*')
        .eq('blog_header_id', headerData.id)
        .single();

      if (contentError) {
        console.warn('Content not found for blog:', contentError);
      }

      // Fetch related blogs (same category, excluding current blog)
      const { data: relatedData, error: relatedError } = await supabase
        .from('blog_headers')
        .select('id, blog_name, slug, excerpt, featured_image, category, author_name, author_image, published_at, view_count')
        .eq('category', headerData.category)
        .neq('id', headerData.id)
        .eq('status', 'Published')
        .limit(3);

      if (relatedError) {
        console.warn('Related blogs fetch error:', relatedError);
      }

      // Update view count
      await supabase
        .from('blog_headers')
        .update({ view_count: (headerData.view_count || 0) + 1 })
        .eq('id', headerData.id);

      setBlog(headerData);
      setBlogContent(contentData);
      setRelatedBlogs(relatedData || []);
      
    } catch (error: any) {
      console.error('Error fetching blog post:', error);
      setError(error.message || 'Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateReadTime = (content?: string) => {
    if (!content) return '5 min read';
    const wordCount = content.split(' ').length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200)); // 200 words per minute
    return `${readTime} min read`;
  };

  const renderContent = (content: string) => {
    if (!content) return null;

    const paragraphs = content.split('\n\n');
    
    return paragraphs.map((paragraph, index) => {
      if (paragraph.startsWith('## ')) {
        return (
          <h2 key={index} className="text-3xl font-bold text-gray-900 mt-12 mb-6 scroll-mt-24" id={`heading-${index}`}>
            {paragraph.replace('## ', '')}
          </h2>
        );
      } else if (paragraph.startsWith('### ')) {
        return (
          <h3 key={index} className="text-2xl font-semibold text-gray-800 mt-10 mb-4 scroll-mt-24" id={`subheading-${index}`}>
            {paragraph.replace('### ', '')}
          </h3>
        );
      } else if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
        return (
          <p key={index} className="font-bold text-gray-900 mt-8 mb-4 text-lg">
            {paragraph.replace(/\*\*/g, '')}
          </p>
        );
      } else if (paragraph.includes('- ')) {
        const listItems = paragraph.split('\n').filter(item => item.startsWith('- '));
        return (
          <ul key={index} className="list-disc list-inside space-y-3 mt-6 mb-8 pl-4">
            {listItems.map((item, itemIndex) => (
              <li key={itemIndex} className="text-gray-700 text-lg leading-relaxed">
                {item.replace('- ', '')}
              </li>
            ))}
          </ul>
        );
      } else if (paragraph.trim()) {
        return (
          <p key={index} className="text-gray-700 leading-relaxed mb-6 text-lg">
            {paragraph}
          </p>
        );
      }
      return null;
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.blog_name,
          text: blog?.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share failed:', error);
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading travel story...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-6">🧭</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Story Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error || "The travel story you're looking for doesn't exist or has been moved."}
          </p>
          <Link 
            href="/blog"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/blog"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to Travel Stories
            </Link>
            
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[500px] lg:h-[600px]">
        {blog.featured_image && (
          <Image 
            src={blog.featured_image} 
            alt={blog.blog_name}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-10 left-0 right-0">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <span className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-6">
              {blog.category}
            </span>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">{blog.blog_name}</h1>
            {blog.sub_heading && (
              <p className="text-xl lg:text-2xl text-gray-200 mb-8 max-w-4xl">{blog.sub_heading}</p>
            )}
            
            <div className="flex flex-wrap items-center gap-8 text-sm">
              <div className="flex items-center gap-4">
                {blog.author_image && (
                  <Image 
                    src={blog.author_image} 
                    alt={blog.author_name || 'Author'}
                    width={48}
                    height={48}
                    className="rounded-full border-2 border-white"
                  />
                )}
                <div>
                  <p className="font-bold text-lg">{blog.author_name}</p>
                  <p className="text-gray-300">Travel Writer</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span className="text-lg">{formatDate(blog.published_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span className="text-lg">{calculateReadTime(blogContent?.blog_text)}</span>
              </div>
              {blog.view_count && (
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  <span className="text-lg">{blog.view_count.toLocaleString()} views</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white rounded-2xl shadow-xl p-8 lg:p-16">
          <div className="prose prose-xl max-w-none">
            {blogContent?.blog_text ? (
              renderContent(blogContent.blog_text)
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Content is being loaded...</p>
              </div>
            )}
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Topics covered:</h4>
              <div className="flex flex-wrap gap-3">
                {blog.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Share */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-gray-900 font-semibold">Share this story:</span>
                <button 
                  onClick={handleShare}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
              
              <div className="flex items-center gap-2 text-gray-500">
                <Eye className="w-5 h-5" />
                <span>{blog.view_count ? blog.view_count.toLocaleString() : 0} views</span>
              </div>
            </div>
          </div>
        </article>

        {/* Author Bio */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
          <div className="flex items-start gap-6">
            {blog.author_image && (
              <Image 
                src={blog.author_image} 
                alt={blog.author_name || 'Author'}
                width={80}
                height={80}
                className="rounded-full"
              />
            )}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">About {blog.author_name}</h3>
              <p className="text-gray-600 leading-relaxed">
                {blog.author_bio || 
                  "Passionate travel writer with years of experience exploring destinations around the world, specializing in adventure travel, cultural immersion, and sustainable tourism practices."
                }
              </p>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedBlogs.length > 0 && (
          <div className="mt-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-8">More Travel Stories</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedBlogs.map((relatedBlog) => (
                <Link 
                  key={relatedBlog.id} 
                  href={`/blog/${relatedBlog.slug}`}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
                >
                  <div className="relative h-40 overflow-hidden">
                    {relatedBlog.featured_image && (
                      <Image 
                        src={relatedBlog.featured_image} 
                        alt={relatedBlog.blog_name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                      {relatedBlog.category}
                    </span>
                    <h4 className="font-bold text-gray-900 mt-2 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {relatedBlog.blog_name}
                    </h4>
                    {relatedBlog.excerpt && (
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4">{relatedBlog.excerpt}</p>
                    )}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{relatedBlog.author_name}</span>
                      <span>{formatDate(relatedBlog.published_at)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mt-16 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Get More Travel Stories</h3>
          <p className="mb-6 text-blue-100">
            Subscribe to our newsletter for the latest travel tips, destination guides, and inspiring stories delivered to your inbox.
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
            <p className="text-xs text-blue-200 mt-3">
              No spam, unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;