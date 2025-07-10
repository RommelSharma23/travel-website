// src/app/contact/page.tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Mail, Phone, MapPin, Clock, Star, ExternalLink, ThumbsUp } from 'lucide-react';

const GOOGLE_REVIEW_URL = 'https://search.google.com/local/writereview?placeid=ChIJY61e6rrr5o0RIhZeFBx_muY';

// Contact Success with Review CTA Component
const ContactSuccessReviewCTA = () => {
  const handleReviewClick = () => {
    window.open(GOOGLE_REVIEW_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="text-center py-8">
      <div className="bg-green-100 text-green-800 p-6 rounded-lg mb-6">
        <ThumbsUp className="w-8 h-8 mx-auto mb-3 text-green-600" />
        <h3 className="font-semibold mb-2 text-lg">Thank you for your inquiry!</h3>
        <p className="mb-4">We'll get back to you within 24 hours with a personalized quote.</p>
        
        {/* Review CTA */}
        <div className="mt-6 pt-4 border-t border-green-200">
          <p className="text-sm mb-4">
            🌟 <strong>Love our service?</strong> Help other travelers discover us by sharing your experience!
          </p>
          <button
            onClick={handleReviewClick}
            className="inline-flex items-center px-4 py-2 bg-white text-green-700 border border-green-300 rounded-lg hover:bg-green-50 transition-colors duration-200 font-medium"
          >
            <Star className="w-4 h-4 mr-2" />
            Leave a Google Review
            <ExternalLink className="w-3 h-3 ml-2" />
          </button>
        </div>
      </div>
      
      <button 
        onClick={() => window.location.reload()}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
      >
        Send Another Message
      </button>
    </div>
  );
};

// Mini Reviews Display Component
const MiniReviewsDisplay = () => {
  const miniReviews = [
    { name: "Ashwarya K.", rating: 5, text: "Amazing service! Perfect trip planning." },
    { name: "Akshay A.", rating: 5, text: "Outstanding execution. Highly recommended!" },
    { name: "Mudit G.", rating: 5, text: "Best travel agency in Jaipur!" }
  ];

  const handleReviewClick = () => {
    window.open(GOOGLE_REVIEW_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-blue-50 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Recent Reviews</h3>
        <div className="flex items-center">
          <div className="flex">
            {[1,2,3,4,5].map(star => (
              <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">5.0 (50+ reviews)</span>
        </div>
      </div>
      
      <div className="space-y-3 mb-4">
        {miniReviews.map((review, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {review.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-sm">{review.name}</span>
                <div className="flex">
                  {[1,2,3,4,5].map(star => (
                    <Star key={star} className="w-3 h-3 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-1">"{review.text}"</p>
            </div>
          </div>
        ))}
      </div>
      
      <button
        onClick={handleReviewClick}
        className="w-full justify-center inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
      >
        <Star className="w-4 h-4 mr-2" />
        Leave Google Review
        <ExternalLink className="w-3 h-3 ml-2" />
      </button>
    </div>
  );
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    destination: '',
    travel_dates: '',
    group_size: 1,
    budget: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Form validation function
  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    // Enhanced email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    // Indian phone number validation (optional field)
    if (formData.phone.trim()) {
      const phoneRegex = /^(\+91[\s-]?)?[6-9]\d{9}$/;
      if (!phoneRegex.test(formData.phone.replace(/\s|-/g, ''))) {
        setError('Please enter a valid Indian phone number (10 digits starting with 6-9)');
        return false;
      }
    }
    return true;
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      destination: '',
      travel_dates: '',
      group_size: 1,
      budget: '',
      message: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate form
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      console.log('Submitting form data:', formData); // Debug log

      // Test Supabase connection first
      const { data: testData, error: testError } = await supabase
        .from('inquiries')
        .select('count', { count: 'exact', head: true });

      console.log('Supabase test result:', { testData, testError }); // Debug log

      if (testError) {
        throw new Error(`Database connection failed: ${testError.message}`);
      }

      // Insert the inquiry
      const { data, error } = await supabase
        .from('inquiries')
        .insert([{
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || null,
          destination: formData.destination.trim() || null,
          travel_dates: formData.travel_dates.trim() || null,
          group_size: parseInt(formData.group_size.toString()),
          budget: formData.budget || null,
          message: formData.message.trim() || null,
          status: 'new'
        }])
        .select(); // Add select() to get back the inserted data

      console.log('Insert result:', { data, error }); // Debug log

      if (error) {
        throw new Error(`Failed to save inquiry: ${error.message}`);
      }

      // Success!
      setSuccess(true);
      resetForm();
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);

    } catch (error: any) {
      console.error('Submission error:', error);
      setError(error.message || 'Failed to send inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container-width section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Plan Your Perfect Trip</h1>
            <p className="text-xl">
              Ready to start your adventure? Get in touch and let's create your dream vacation together.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-width section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Get In Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-600 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email Us</h3>
                    <a 
                      href="mailto:info@getawayvibe.com"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      info@getawayvibe.com
                    </a>
                    <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-600 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Call Us</h3>
                    <a 
                      href="tel:+917877995497"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      +91 7877995497
                    </a>
                    <p className="text-sm text-gray-500">Mon-Sat, 9AM-7PM IST</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-600 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Visit Us</h3>
                    <p className="text-gray-600">Jaipur, Rajasthan<br />India</p>
                    <p className="text-sm text-gray-500">By appointment only</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-600 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Business Hours</h3>
                    <p className="text-gray-600">Monday - Saturday: 9:00 AM - 7:00 PM IST</p>
                    <p className="text-gray-600">Sunday: Closed</p>
                    <p className="text-sm text-gray-500 mt-1">Emergency support available 24/7</p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Why Choose GetAway Vibe?</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Personalized travel planning</li>
                  <li>• 24/7 emergency support during travel</li>
                  <li>• Competitive pricing with no hidden costs</li>
                  <li>• Local expertise and authentic experiences</li>
                  <li>• Hassle-free booking and documentation</li>
                </ul>
              </div>

              {/* Add Mini Reviews Display */}
              <div className="mt-8">
                <MiniReviewsDisplay />
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              {success ? (
                <ContactSuccessReviewCTA />
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
                  
                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                      {error}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Destination
                      </label>
                      <input
                        type="text"
                        name="destination"
                        value={formData.destination}
                        onChange={handleChange}
                        placeholder="e.g., Bali, Paris, Japan"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Travel Dates
                      </label>
                      <input
                        type="date"
                        name="travel_dates"
                        value={formData.travel_dates}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]} // Today's date as minimum
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Group Size
                      </label>
                      <select
                        name="group_size"
                        value={formData.group_size}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {[1,2,3,4,5,6,7,8].map(num => (
                          <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Range
                    </label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Budget Range</option>
                      <option value="under-50000">Under ₹50,000</option>
                      <option value="50000-100000">₹50,000 - ₹1,00,000</option>
                      <option value="100000-250000">₹1,00,000 - ₹2,50,000</option>
                      <option value="250000-500000">₹2,50,000 - ₹5,00,000</option>
                      <option value="over-500000">Over ₹5,00,000</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tell us about your dream trip
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="What type of experience are you looking for? Any special requirements or preferences?"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <button
                    type="submit"
                    className={`w-full text-lg py-3 px-6 rounded-lg font-semibold transition-colors duration-200 ${
                      loading 
                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                        : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'
                    }`}
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send My Inquiry'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}