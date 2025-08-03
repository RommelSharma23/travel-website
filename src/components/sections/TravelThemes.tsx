// src/components/sections/TravelThemes.tsx
import { Crown, Mountain, Heart, Users, Globe, DollarSign } from 'lucide-react';

const themes = [
  {
    icon: Crown,
    title: 'Luxury Travel',
    description: 'Indulge in premium experiences with 5-star accommodations and exclusive access',
    color: 'bg-purple-500',
    packages: '12+ packages'
  },
  {
    icon: Mountain,
    title: 'Adventure Tours',
    description: 'Thrilling experiences for adrenaline seekers and outdoor enthusiasts',
    color: 'bg-green-500',
    packages: '18+ packages'
  },
  {
    icon: Heart,
    title: 'Romantic Getaways',
    description: 'Perfect destinations for couples seeking intimate and memorable experiences',
    color: 'bg-red-500',
    packages: '8+ packages'
  },
  {
    icon: Users,
    title: 'Family Vacations',
    description: 'Fun-filled adventures designed for families with children of all ages',
    color: 'bg-blue-500',
    packages: '15+ packages'
  },
  {
    icon: Globe,
    title: 'Cultural Experiences',
    description: 'Immerse yourself in local traditions, history, and authentic experiences',
    color: 'bg-orange-500',
    packages: '20+ packages'
  },
  {
    icon: DollarSign,
    title: 'Budget Travel',
    description: 'Amazing destinations without breaking the bank - quality meets affordability',
    color: 'bg-gray-500',
    packages: '25+ packages'
  }
];

export const TravelThemes = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container-width section-padding">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Travel Style</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From luxury escapes to budget adventures, find the perfect travel experience that matches your style
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {themes.map((theme, index) => {
            const IconComponent = theme.icon;
            return (
              <div
                key={theme.title}
                className={`card-hover bg-white border border-gray-200 rounded-xl p-6 text-center animate-slide-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`${theme.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">{theme.title}</h3>
                <p className="text-gray-600 mb-4">{theme.description}</p>
                
                <div className="text-sm text-gray-500 mb-4">{theme.packages}</div>
                
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-lg transition-colors">
                  Explore Packages
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};