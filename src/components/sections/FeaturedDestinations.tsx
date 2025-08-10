// src/components/sections/FeaturedDestinations.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Destination } from '@/types';
import { MapPin, Clock, Users } from 'lucide-react';

export const FeaturedDestinations = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedDestinations();
  }, []);

  const fetchFeaturedDestinations = async () => {
    try {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('featured', true)
        .limit(4);

      if (error) throw error;
      setDestinations(data || []);
    } catch (error) {
      console.error('Error fetching destinations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container-width section-padding">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Destinations</h2>
            <p className="text-xl text-gray-600">Loading amazing destinations...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-width section-padding">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Destinations</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of breathtaking destinations around the world
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination, index) => (
            <div
              key={destination.id}
              className={`card-hover bg-white rounded-xl overflow-hidden shadow-lg animate-slide-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-48">
                <img
                  src={destination.heroImage}
                  alt={destination.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="flex items-center space-x-1 mb-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{destination.country}</span>
                  </div>
                  <h3 className="text-xl font-bold">{destination.name}</h3>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {destination.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>7-14 days</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>Small groups</span>
                  </div>
                </div>
                
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};