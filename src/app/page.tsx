// src/app/page.tsx
<<<<<<< HEAD
'use client';

import { useState } from 'react';
import { OptimizedHeroSection } from '@/components/sections/OptimizedHeroSection';
import { FeaturedList } from '@/components/sections/FeaturedList';
import { GetawayEurope } from '@/components/sections/GetawayEurope';
import { UniqueTravel } from '@/components/sections/UniqueTravel';
import { MyIndia } from '@/components/sections/MyIndia';
//import { TravelThemes } from '@/components/sections/TravelThemes';
import GoogleReviewsSection from '@/components/GoogleReviews/GoogleReviewsSection';
import ContactModal from '@/components/ui/ContactModal';
import FirstVisitContactModal from '@/components/ui/FirstVisitContactModal';

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

=======
import { HeroSection } from '@/components/sections/HeroSection';
import { FeaturedDestinations } from '@/components/sections/FeaturedDestinations';
import { TravelThemes } from '@/components/sections/TravelThemes';
import GoogleReviewsSection from '@/components/GoogleReviews/GoogleReviewsSection';
import FirstVisitContactModal from '@/components/ui/FirstVisitContactModal';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedDestinations />
      <TravelThemes />
      <GoogleReviewsSection />
      <FirstVisitContactModal />
    </>
  );
}
>>>>>>> da6460111d7c831013e362b170fc9db4654884e1
