// components/layout/Header.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { BRAND_ASSETS, COMPANY_INFO, NAVIGATION } from '@/lib/constants';
import PayNowButton from '@/components/payments/PayNowButton';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handlePaymentSuccess = (bookingId: string, paymentId: string) => {
    // Redirect to success page
    window.location.href = `/payment-success?booking=${bookingId}&payment=${paymentId}`;
  };

  const handlePaymentError = (error: string) => {
    // Show error notification
    alert(`Payment failed: ${error}`);
    // You can replace this with a proper toast notification later
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between border-b border-indigo-500 py-6 lg:border-none">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="relative h-16 w-16 flex-shrink-0 sm:h-20 sm:w-20">
                <Image
                  src={BRAND_ASSETS.logo()}
                  alt={`${COMPANY_INFO.NAME} Logo`}
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 640px) 64px, 80px"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="ml-10 hidden space-x-8 lg:block">
            {NAVIGATION.MAIN.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-base font-medium text-gray-900 hover:text-indigo-600 transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="ml-10 hidden lg:flex items-center space-x-3">
            {/* Pay Now Button */}
            <PayNowButton 
              variant="secondary"
              size="md"
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              className="border-green-600 text-green-600 hover:bg-green-50"
            />
            
            {/* Plan Your Trip Button */}
            <Link
              href="/contact"
              className="inline-block bg-indigo-600 py-2 px-4 border border-transparent rounded-md text-base font-medium text-white hover:bg-indigo-700 transition-colors duration-200"
            >
              Plan Your Trip
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {NAVIGATION.MAIN.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block py-2 px-3 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-indigo-600 rounded-md transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              {/* Mobile CTA Buttons */}
              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200 mt-4">
                <PayNowButton 
                  variant="secondary"
                  size="md"
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  className="w-full justify-center border-green-600 text-green-600 hover:bg-green-50"
                />
                
                <Link
                  href="/contact"
                  className="block bg-indigo-600 py-2 px-3 border border-transparent rounded-md text-base font-medium text-white hover:bg-indigo-700 transition-colors duration-200 text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Plan Your Trip
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}