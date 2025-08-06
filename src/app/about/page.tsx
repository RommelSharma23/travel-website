// src/app/about/page.tsx
import { Users, Award, Globe, Heart } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  const stats = [
    { icon: Users, value: '5,000+', label: 'Happy Travelers' },
    { icon: Globe, value: '50+', label: 'Destinations' },
    { icon: Award, value: '15+', label: 'Years Experience' },
    { icon: Heart, value: '98%', label: 'Customer Satisfaction' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container-width section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">About Get Away Vibe</h1>
            <p className="text-xl leading-relaxed">
              We&apos;re passionate about creating extraordinary travel experiences that connect you 
              with the world&apos;s most beautiful destinations and authentic cultures.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="container-width section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 mb-4">
                Founded in 2020, Get Away Vibe was born from a simple belief: travel should be 
                transformative, not just transactional. We started as a small team of passionate 
                travelers who wanted to share the world&apos;s hidden gems with fellow adventurers.
              </p>
              <p className="text-lg text-gray-600 mb-4">
                Today, we&apos;ve grown into a trusted travel company that has helped thousands of 
                travelers discover their perfect destinations. From luxury escapes to budget 
                adventures, we curate experiences that create lasting memories.
              </p>
              <p className="text-lg text-gray-600">
                Every trip we plan is crafted with care, attention to detail, and deep respect 
                for local cultures and environments.
              </p>
            </div>
            <div className="relative">
              <Image 
                src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop"
                alt="Beautiful landscape showcasing natural travel destinations"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
                priority
                quality={85}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50">
        <div className="container-width section-padding">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => {
              const IconComponent = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="container-width section-padding">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Authentic Experiences</h3>
              <p className="text-gray-600">
                We believe in genuine connections with local cultures and authentic travel experiences.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Quality & Excellence</h3>
              <p className="text-gray-600">
                Every detail matters. We maintain the highest standards in all our travel packages.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sustainable Travel</h3>
              <p className="text-gray-600">
                We&apos;re committed to responsible tourism that benefits local communities and environments.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}