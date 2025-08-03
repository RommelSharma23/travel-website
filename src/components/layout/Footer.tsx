// components/layout/Footer.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { BRAND_ASSETS, COMPANY_INFO, NAVIGATION } from '@/lib/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Company Info */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative h-12 w-12 flex-shrink-0">
                <Image
                  src={BRAND_ASSETS.logo()}
                  alt={`${COMPANY_INFO.NAME} Logo`}
                  fill
                  className="object-contain"
                  sizes="48px"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white">
                  {COMPANY_INFO.NAME}
                </span>
                <span className="text-sm text-gray-400">
                  {COMPANY_INFO.TAGLINE}
                </span>
              </div>
            </Link>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <MapPin className="h-5 w-5 text-indigo-400" />
                <span className="text-sm">{COMPANY_INFO.LOCATION}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone className="h-5 w-5 text-indigo-400" />
                <span className="text-sm">{COMPANY_INFO.PHONE}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail className="h-5 w-5 text-indigo-400" />
                <span className="text-sm">{COMPANY_INFO.EMAIL}</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex space-x-6">
              <a 
                href={COMPANY_INFO.SOCIAL.FACEBOOK} 
                className="text-gray-400 hover:text-gray-300 transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a 
                href={COMPANY_INFO.SOCIAL.INSTAGRAM} 
                className="text-gray-400 hover:text-gray-300 transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              <a 
                href={COMPANY_INFO.SOCIAL.TWITTER} 
                className="text-gray-400 hover:text-gray-300 transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a 
                href={COMPANY_INFO.SOCIAL.YOUTUBE} 
                className="text-gray-400 hover:text-gray-300 transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">YouTube</span>
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              {/* Quick Links */}
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Quick Links</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {NAVIGATION.FOOTER.QUICK_LINKS.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-sm leading-6 text-gray-300 hover:text-white transition-colors duration-200">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Travel Themes */}
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">Travel Themes</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {NAVIGATION.THEMES.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-sm leading-6 text-gray-300 hover:text-white transition-colors duration-200">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="md:grid md:grid-cols-2 md:gap-8">
              {/* Resources */}
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Resources</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {NAVIGATION.FOOTER.RESOURCES.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-sm leading-6 text-gray-300 hover:text-white transition-colors duration-200">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">Support</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {NAVIGATION.FOOTER.SUPPORT.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-sm leading-6 text-gray-300 hover:text-white transition-colors duration-200">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 border-t border-gray-700 pt-8">
          <div className="flex flex-col items-center space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
            <div>
              <h3 className="text-sm font-semibold leading-6 text-white">
                Subscribe to our newsletter
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-300">
                Get the latest travel inspiration and exclusive deals delivered to your inbox.
              </p>
            </div>
            <form className="mt-6 sm:flex sm:max-w-md">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email-address"
                type="email"
                required
                placeholder="Enter your email"
                autoComplete="email"
                className="w-full min-w-0 appearance-none rounded-md border-0 bg-white/5 px-3 py-1.5 text-base text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:w-64 sm:text-sm sm:leading-6 xl:w-full"
              />
              <div className="mt-4 sm:ml-4 sm:mt-0 sm:flex-shrink-0">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors duration-200"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 border-t border-gray-700 pt-8 md:flex md:items-center md:justify-between">
          <div className="flex flex-col space-y-2 md:order-2">
            <p className="text-xs leading-5 text-gray-400">
              {COMPANY_INFO.LICENSES}
            </p>
            <p className="text-xs leading-5 text-gray-400">
              GST No: {COMPANY_INFO.GST}
            </p>
          </div>
          <p className="mt-8 text-xs leading-5 text-gray-400 md:order-1 md:mt-0">
            &copy; {currentYear} {COMPANY_INFO.NAME}, Jaipur. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}