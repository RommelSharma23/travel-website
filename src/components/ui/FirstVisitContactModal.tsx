// components/ui/FirstVisitContactModal.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { X, MapPin, Calendar, Users, MessageCircle, Send, Plane } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const FirstVisitContactModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
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

  useEffect(() => {
    // Check if user has already seen the popup this session
    const hasSeenPopup = sessionStorage.getItem('travelPopupShown');
    
    if (!hasSeenPopup) {
      // Show popup after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(true);
        sessionStorage.setItem('travelPopupShown', 'true');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClose = () => {
    setIsVisible(false);
    // Reset form when closing
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
    setSubmitStatus('');
  };

  // Form validation function
  const validateForm = () => {
    if (!formData.name.trim()) {
      setSubmitStatus('error');
      return false;
    }
    if (!formData.email.trim()) {
      setSubmitStatus('error');
      return false;
    }
    // Enhanced email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus('error');
      return false;
    }
    // Indian phone number validation (optional field)
    if (formData.phone.trim()) {
      const phoneRegex = /^(\+91[\s-]?)?[6-9]\d{9}$/;
      if (!phoneRegex.test(formData.phone.replace(/\s|-/g, ''))) {
        setSubmitStatus('error');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    // Validate form
    if (!validateForm()) {
      setIsSubmitting(false);
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

      // Insert the inquiry - REMOVED 'source' field that doesn't exist in database
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
          // REMOVED: source: 'First Visit Popup' - field doesn't exist in database
        }])
        .select(); // Add select() to get back the inserted data

      console.log('Insert result:', { data, error }); // Debug log

      if (error) {
        console.error('Supabase error details:', error);
        throw new Error(`Failed to save inquiry: ${error.message}`);
      }

      // Success!
      setSubmitStatus('success');
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        handleClose();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="relative p-6 pb-4 bg-gradient-to-r from-blue-600 to-purple-600">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3 text-white">
            <div className="p-3 bg-white bg-opacity-20 rounded-full">
              <Plane className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Plan Your Dream Trip</h2>
              <p className="text-sm opacity-90">Get a personalized travel quote in 24 hours</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {submitStatus === 'success' && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">Thank you! {`We'll`} get back to you within 24 hours.</p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">Please check your information and try again.</p>
            </div>
          )}

          {/* Personal Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          {/* Travel Information */}
          <div className="border-t pt-4">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-blue-600" />
              Travel Preferences
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Destination</label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Bali, Paris, Japan"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Calendar className="w-4 h-4 mr-1 text-blue-600" />
                  Travel Dates
                </label>
                <input
                  type="date"
                  name="travel_dates"
                  value={formData.travel_dates}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Users className="w-4 h-4 mr-1 text-blue-600" />
                  Group Size
                </label>
                <select
                  name="group_size"
                  value={formData.group_size}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {[1,2,3,4,5,6,7,8].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget Range</label>
              <select
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Budget Range</option>
                <option value="under-50000">Under ₹50,000</option>
                <option value="50000-100000">₹50,000 - ₹1,00,000</option>
                <option value="100000-250000">₹1,00,000 - ₹2,50,000</option>
                <option value="250000-500000">₹2,50,000 - ₹5,00,000</option>
                <option value="over-500000">Over ₹5,00,000</option>
              </select>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <MessageCircle className="w-4 h-4 mr-1 text-blue-600" />
                Tell us about your dream trip
              </label>
              <textarea
                name="message"
                rows={3}
                value={formData.message}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="What type of experience are you looking for? Any special requirements or preferences?"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send My Inquiry</span>
                </>
              )}
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">
              No spam, just personalized travel recommendations
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FirstVisitContactModal;