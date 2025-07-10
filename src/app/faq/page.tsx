// File: app/faq/page.tsx
"use client";

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, MapPin, CreditCard, FileText, Clock, Plane, Phone, Mail, Calendar } from 'lucide-react';

// Dynamic Configuration - Update these values as needed
const FAQ_CONFIG = {
  companyName: "GetAway Vibe",
  tagline: "Your Vibe Your Journey Your Getaway",
  
  // Contact Information
  contact: {
    phone: "+91 7877995497",
    email: "info@getawayvibe.com",
    supportEmail: "support@getawayvibe.com",
    website: "www.getawayvibe.com"
  },
  
  // Business Policies
  policies: {
    depositPercentage: 30,
    finalPaymentPercentage: 70,
    priceValidityHours: 6,
    voucherDeliveryHours: 24,
    minimumAge: 18
  }
};

const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const faqCategories = [
    { id: 'all', name: 'All Questions', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'booking', name: 'Booking & Payments', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'customization', name: 'Trip Customization', icon: <MapPin className="w-4 h-4" /> },
    { id: 'documentation', name: 'Documents & Visa', icon: <FileText className="w-4 h-4" /> },
    { id: 'pricing', name: 'Pricing & Policies', icon: <Clock className="w-4 h-4" /> },
    { id: 'travel', name: 'Travel Support', icon: <Plane className="w-4 h-4" /> }
  ];

  const faqs = [
    {
      id: 1,
      category: 'customization',
      question: 'Can I customize any itinerary according to my preferences?',
      answer: `Absolutely! At ${FAQ_CONFIG.companyName}, every itinerary is completely customizable to match your travel dreams. You have complete freedom to modify flights, accommodations, activities, and destinations. Simply reach out to us through our website or contact our travel experts directly. Our team will work closely with you to understand your preferences and create a personalized itinerary that reflects your unique travel style and interests.`
    },
    {
      id: 2,
      category: 'customization',
      question: 'How do I know if a travel package matches my interests?',
      answer: 'Our travel consultants take time to understand your preferences through detailed conversations about your travel style, interests, and expectations. We carefully curate recommendations based on your specific requirements, ensuring every suggestion aligns with what you\'re looking for. If you\'ve shared your preferences with us, you can trust that our recommendations have been thoughtfully selected to match your travel personality and create memorable experiences.'
    },
    {
      id: 3,
      category: 'documentation',
      question: 'What visa assistance do you provide?',
      answer: 'We understand that visa processes can seem overwhelming, but our experienced team is here to guide you every step of the way. Our visa assistance includes: detailed guidance on required documents, sharing proven application strategies, helping schedule appointments when needed, providing step-by-step support throughout the process, and offering expert advice based on destination requirements. While visa approval depends on the respective consulates, we ensure you\'re well-prepared for a successful application.'
    },
    {
      id: 4,
      category: 'pricing',
      question: 'Are the prices shown real-time? How long do they remain valid?',
      answer: `Yes, all prices displayed in your itinerary reflect current market rates and are updated in real-time. However, travel costs for flights, hotels, and activities can change based on availability and demand. Your quoted prices remain guaranteed for ${FAQ_CONFIG.policies.priceValidityHours} hours from the time of generation. After this period, simply request an updated quote to see the latest pricing. This ensures you always have access to current rates while giving you reasonable time to make your decision.`
    },
    {
      id: 5,
      category: 'booking',
      question: 'How do I confirm my booking and when will I receive my travel documents?',
      answer: `Ready to embark on your adventure? You can secure your entire trip by paying ${FAQ_CONFIG.policies.depositPercentage}% of the total cost as a booking deposit. All reservations are processed immediately in real-time. Within ${FAQ_CONFIG.policies.voucherDeliveryHours} hours of your booking confirmation, you'll be able to access and download your flight and hotel vouchers through your personal account on our website. Once you complete the remaining ${FAQ_CONFIG.policies.finalPaymentPercentage}% payment, you'll receive a comprehensive set of vouchers covering your entire vacation.`
    },
    {
      id: 6,
      category: 'documentation',
      question: 'Do I need to submit documents to start the booking process?',
      answer: 'No initial documents are required to confirm your travel bookings with us. However, please ensure you have your passport available for reference. It\'s crucial to enter traveler names exactly as they appear on your passport to avoid any travel complications. Please double-check all details you provide during booking. If your passport doesn\'t include a surname, don\'t worry - simply contact our destination specialists who will guide you through the process and ensure a smooth, worry-free booking experience.'
    },
    {
      id: 7,
      category: 'booking',
      question: 'What payment methods do you accept?',
      answer: 'We accept various convenient payment methods including bank transfers, UPI payments, credit cards, and debit cards. All transactions are processed securely through encrypted payment gateways. You can pay the initial deposit to confirm your booking, with the balance due according to our payment schedule. For international bookings, we also accept foreign currency payments where applicable.'
    },
    {
      id: 8,
      category: 'travel',
      question: 'What support do you provide during my trip?',
      answer: `We provide comprehensive travel support throughout your journey. Our services include 24/7 emergency assistance, local contact numbers for immediate help, support with any changes or issues during travel, assistance with rebooking if needed due to unforeseen circumstances, and guidance on local customs and recommendations. You can reach our emergency support at ${FAQ_CONFIG.contact.phone} or email us at ${FAQ_CONFIG.contact.supportEmail}.`
    },
    {
      id: 9,
      category: 'pricing',
      question: 'What happens if prices change after I receive my quote?',
      answer: `Your quoted prices are protected for ${FAQ_CONFIG.policies.priceValidityHours} hours, giving you time to make your decision without price fluctuations. If prices change after this period, we'll provide you with updated pricing that reflects current market rates. We always strive to offer competitive prices and will work with you to find the best available options within your budget.`
    },
    {
      id: 10,
      category: 'customization',
      question: 'Can I make changes to my itinerary after booking?',
      answer: 'Yes, we understand that travel plans can evolve. Changes to confirmed bookings are possible subject to availability and supplier policies. Modification fees may apply depending on the type of change and timing. Some changes might require cancellation and rebooking of certain services. We recommend reviewing our booking terms for detailed change policies and will always work to accommodate your needs wherever possible.'
    },
    {
      id: 11,
      category: 'travel',
      question: 'Do you provide travel insurance recommendations?',
      answer: 'We strongly recommend comprehensive travel insurance for all our travelers. While we can guide you on the types of coverage that would benefit your specific trip, you\'ll need to purchase insurance directly from providers. Essential coverage typically includes medical emergencies, trip cancellation, baggage protection, and evacuation coverage. For adventure activities or specific destinations, additional specialized coverage may be recommended.'
    },
    {
      id: 12,
      category: 'booking',
      question: 'How do I access my booking details and travel documents?',
      answer: `Once your booking is confirmed, you can access all your travel information through your personal account on our website. Your dashboard will contain flight details, hotel confirmations, activity vouchers, itinerary schedules, and important contact information. You can download, print, or save these documents for offline access during your travels.`
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <HelpCircle className="w-16 h-16" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-xl opacity-90">{FAQ_CONFIG.tagline}</p>
            <p className="mt-4 text-lg opacity-80">
              Find answers to common questions about our travel services
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search frequently asked questions..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {faqCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.icon}
                <span className="ml-2">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {filteredFAQs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No questions found</h3>
            <p className="text-gray-500">Try adjusting your search terms or browse all categories.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <div key={faq.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800 pr-4">
                      {faq.question}
                    </h3>
                    <div className="flex-shrink-0">
                      {openFAQ === faq.id ? (
                        <ChevronUp className="w-5 h-5 text-indigo-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </button>
                
                {openFAQ === faq.id && (
                  <div className="px-6 pb-6">
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Contact Section */}
        <div className="mt-12 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl shadow-lg text-white p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Still have questions?</h2>
            <p className="text-lg opacity-90">
              Our travel experts are here to help you plan your perfect getaway
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-white/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Call Us</h3>
              <p className="text-sm opacity-90">{FAQ_CONFIG.contact.phone}</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Email Us</h3>
              <p className="text-sm opacity-90">{FAQ_CONFIG.contact.supportEmail}</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Schedule a Call</h3>
              <p className="text-sm opacity-90">Book a consultation</p>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
              Get in Touch
            </button>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
            <HelpCircle className="w-5 h-5 mr-2" />
            Quick Tips for Your Journey
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div>
              <p className="mb-2">• Ensure passport validity of 6+ months</p>
              <p className="mb-2">• Purchase travel insurance for protection</p>
              <p>• Check visa requirements for your destination</p>
            </div>
            <div>
              <p className="mb-2">• Book early for better prices and availability</p>
              <p className="mb-2">• Keep copies of important documents</p>
              <p>• Inform your bank about travel plans</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;