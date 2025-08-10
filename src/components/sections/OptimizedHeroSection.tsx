// src/components/sections/OptimizedHeroSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';

const heroImages = [
  {
    url: 'https://images.unsplash.com/photo-1539650116574-75c0c6d0f4c3?w=1920&h=1080&fit=crop&auto=format',
    destination: 'Marrakech, Morocco',
    testimonial: 'The most magical experience of our lives! Every detail was perfect.',
    author: 'Sarah & Mike Johnson'
  },
  {
    url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1920&h=1080&fit=crop&auto=format',
    destination: 'Santorini, Greece',
    testimonial: 'Breathtaking views and unforgettable sunsets. Absolutely stunning!',
    author: 'Emma Rodriguez'
  },
  {
    url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1920&h=1080&fit=crop&auto=format',
    destination: 'Kyoto, Japan',
    testimonial: 'A perfect blend of culture and tranquility. Highly recommended!',
    author: 'David Chen'
  }
];

interface OptimizedHeroSectionProps {
  onOpenContactForm?: () => void;
}

export const OptimizedHeroSection = ({ onOpenContactForm }: OptimizedHeroSectionProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Parallax scroll effects
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.8]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Preload images and set loaded to true faster
  useEffect(() => {
    const imagePromises = heroImages.map((image) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = image.url;
      });
    });

    Promise.all(imagePromises)
      .then(() => {
        setImagesLoaded(true);
      })
      .catch(() => {
        // Even if some images fail, show the hero
        setImagesLoaded(true);
      });

    // Fallback: show hero after 2 seconds regardless
    const fallbackTimer = setTimeout(() => {
      setImagesLoaded(true);
    }, 2000);

    return () => clearTimeout(fallbackTimer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);

  const handleGetQuote = () => {
    if (onOpenContactForm) {
      onOpenContactForm();
    }
  };

  // Show loading skeleton for only 2 seconds max
  if (!imagesLoaded) {
    return (
      <div className="relative h-screen w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 animate-pulse" />
        {/* Enhanced gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-6 z-10">
            <div className="h-16 bg-white/30 rounded-lg w-96 mx-auto animate-pulse" />
            <div className="h-8 bg-white/25 rounded w-80 mx-auto animate-pulse" />
            <div className="h-6 bg-white/20 rounded w-72 mx-auto animate-pulse" />
            <div className="flex space-x-4 justify-center">
              <div className="h-12 bg-white/20 rounded-lg w-32 animate-pulse" />
              <div className="h-12 bg-white/15 rounded-lg w-32 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.section 
      className="hero-section relative h-screen overflow-hidden"
      style={{ y, opacity }}
    >
      {/* Background Images */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <motion.div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            initial={{ scale: 1.1 }}
            animate={{ scale: index === currentSlide ? 1 : 1.1 }}
            transition={{ duration: 0.8 }}
          >
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${image.url})`,
              }}
            />
          </motion.div>
        ))}
        {/* Enhanced gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
      </div>

      {/* Content with better text readability */}
      <div className="relative z-10 container-width section-padding text-center text-white h-full flex items-center">
        <div className="max-w-4xl mx-auto">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover Your Next
            <span className="block text-gradient bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Adventure
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-8 text-gray-100 max-w-2xl mx-auto drop-shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Explore breathtaking destinations and create unforgettable memories with our curated travel experiences
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {/* Explore Destinations Button - Links to /destinations */}
            <Link href="/destinations">
              <Button className="text-lg px-8 py-4 shadow-xl">
                Explore Destinations
              </Button>
            </Link>
            
            {/* Get Quote Button - Opens contact form */}
            <Button 
              variant="secondary" 
              className="text-lg px-8 py-4 shadow-xl"
              onClick={handleGetQuote}
            >
              Get Quote
            </Button>
          </motion.div>

          {/* Enhanced Testimonial with better readability */}
          <motion.div 
            className="bg-white/15 backdrop-blur-md rounded-lg p-6 max-w-2xl mx-auto border border-white/20 shadow-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="flex justify-center mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-lg mb-3 italic font-medium text-white drop-shadow-md">
              "{heroImages[currentSlide].testimonial}"
            </p>
            <p className="text-sm text-gray-200 drop-shadow-sm">
              - {heroImages[currentSlide].author} • {heroImages[currentSlide].destination}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all shadow-lg"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all shadow-lg"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all shadow-lg ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </motion.section>
  );
};