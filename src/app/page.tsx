// src/app/page.tsx

'use client';

import { useState } from 'react';
import { OptimizedHeroSection } from '../components/sections/OptimizedHeroSection';
import { FeaturedList } from '../components/sections/FeaturedList';
import { GetawayEurope } from '../components/sections/GetawayEurope';
import { UniqueTravel } from '../components/sections/UniqueTravel';
import { MyIndia } from '../components/sections/MyIndia';
import GoogleReviewsSection from '../components/GoogleReviews/GoogleReviewsSection';
import ContactModal from '../components/ui/ContactModal';
import FirstVisitContactModal from '../components/ui/FirstVisitContactModal';

export default function HomePage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState('');

  const handleOpenContactForm = (destinationName: string) => {
    setSelectedDestination(destinationName);
    setIsContactModalOpen(true);
  };

  const handleCloseContactForm = () => {
    setIsContactModalOpen(false);
    setSelectedDestination('');
  };

  return (
    <>
      {/* 1. Optimized Hero Section with faster image loading & parallax */}
      <OptimizedHeroSection />
      
      {/* 2. Featured List - Vietnam, Bali, Thailand, Dubai */}
      <FeaturedList onOpenContactForm={handleOpenContactForm} />
      
      {/* 3. Getaway Europe - Italy, Greece, Switzerland, Spain */}
      <GetawayEurope onOpenContactForm={handleOpenContactForm} />
      
      {/* 4. Unique Travel - Australia, Singapore, Japan, South Africa */}
      <UniqueTravel onOpenContactForm={handleOpenContactForm} />
      
      {/* 5. My India - Rishikesh, Goa, Ladakh, Himachal */}
      <MyIndia onOpenContactForm={handleOpenContactForm} />
      
      {/* 6. Existing sections continue */}
      
      <GoogleReviewsSection />
      
      {/* Contact Modal - Controlled by all "Get Quote" buttons */}
      <ContactModal 
        isVisible={isContactModalOpen}
        onClose={handleCloseContactForm}
        prefilledDestination={selectedDestination}
      />
      
      {/* Keep your existing first visit modal */}
      <FirstVisitContactModal />
    </>
  );
}



