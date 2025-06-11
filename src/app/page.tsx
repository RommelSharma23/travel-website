// src/app/page.tsx
import { HeroSection } from '@/components/sections/HeroSection';
import { FeaturedDestinations } from '@/components/sections/FeaturedDestinations';
import { TravelThemes } from '@/components/sections/TravelThemes';
import FirstVisitContactModal from '@/components/ui/FirstVisitContactModal';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedDestinations />
      <TravelThemes />
      <FirstVisitContactModal />
    </>
  );
}