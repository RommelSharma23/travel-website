// lib/constants.ts

// Brand asset paths in your public Supabase storage
export const BRAND_ASSET_PATHS = {
  // Main logo (currently uploaded)
  MAIN_LOGO: 'logo-branding/logo_color.png',
  
  // Future assets (not uploaded yet)
  // LOGO_WHITE: 'logo-branding/logo-white.png',
  // FAVICON: 'logo-branding/favicon.ico',
  // OG_IMAGE: 'social-media/og-image.png',
  // EMAIL_LOGO: 'email/email-header-logo.png',
} as const;

// Base URL for public Supabase storage
const STORAGE_BASE_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/getaway-vibe`;

/**
 * Generate direct public URL for assets
 */
function getPublicUrl(path: string): string {
  return `${STORAGE_BASE_URL}/${path}`;
}

/**
 * Brand assets with direct public URLs
 */
export const BRAND_ASSETS = {
  // Main logo (currently available)
  logo: () => getPublicUrl(BRAND_ASSET_PATHS.MAIN_LOGO),
  
  // Future assets (commented out until uploaded)
  // logoWhite: () => getPublicUrl(BRAND_ASSET_PATHS.LOGO_WHITE),
  // favicon: () => getPublicUrl(BRAND_ASSET_PATHS.FAVICON),
  // ogImage: () => getPublicUrl(BRAND_ASSET_PATHS.OG_IMAGE),
  // emailLogo: () => getPublicUrl(BRAND_ASSET_PATHS.EMAIL_LOGO),
} as const;

/**
 * Company information constants
 */
export const COMPANY_INFO = {
  NAME: 'GetAway Vibe',
  TAGLINE: 'Your Vibe Your Journey Your Getaway',
  LOCATION: 'Jaipur, Rajasthan, India',
  PHONE: '+91 7877995497', // Update with your actual number
  EMAIL: 'info@getawayvibe.com', // Update with your actual email
  GST: 'XXXXXXXXXXXXXXX', // Update with your actual GST number
  
  // Business details
  LICENSES: 'Licensed Travel Agency | IATA Certified',
  
  // Social media (update with your actual handles)
  SOCIAL: {
    FACEBOOK: 'https://facebook.com/getawayvibe',
    INSTAGRAM: 'https://instagram.com/getawayvibe',
    TWITTER: 'https://twitter.com/getawayvibe',
    YOUTUBE: 'https://youtube.com/getawayvibe',
  }
} as const;

/**
 * Website navigation constants
 */
export const NAVIGATION = {
  MAIN: [
    { name: 'Home', href: '/' },
    { name: 'Destinations', href: '/destinations' },
    { name: 'Themes', href: '/themes' },
    { name: 'Blog', href: '/blog' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ],
  
  THEMES: [
    { name: 'Luxury Travel', href: '/themes#luxury' },
    { name: 'Adventure Tours', href: '/themes#adventure' },
    { name: 'Family Vacations', href: '/themes#family' },
    { name: 'Cultural Experiences', href: '/themes#cultural' },
    { name: 'Romantic Getaways', href: '/themes#romantic' },
    { name: 'Budget Travel', href: '/themes#budget' },
  ],
  
  FOOTER: {
    QUICK_LINKS: [
      { name: 'Home', href: '/' },
      { name: 'Destinations', href: '/destinations' },
      { name: 'Travel Themes', href: '/themes' },
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
    ],
    
    RESOURCES: [
      { name: 'Travel Blog', href: '/blog' },
      { name: 'Travel Guides', href: '/travel-guide' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Testimonials', href: '/testimonials' },
      { name: 'Photo Gallery', href: '/gallery' },
    ],
    
    SUPPORT: [
      { name: 'Get Quote', href: '/contact' },
      { name: 'Booking Terms', href: '/booking-terms' },
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Terms of Service', href: '/terms-of-service' },
      { name: 'Cancellation Policy', href: '/cancellation-policy' },
    ],
  }
} as const;

/**
 * SEO and metadata constants
 */
export const SEO_DEFAULTS = {
  TITLE: 'GetAway Vibe - International Tours & Travel Packages | Jaipur',
  DESCRIPTION: 'Discover amazing international destinations with our curated travel packages. Luxury tours, adventure trips, family vacations & more. Based in Jaipur, Rajasthan.',
  KEYWORDS: ['international tours', 'travel packages', 'Jaipur travel agency', 'luxury travel', 'adventure tours', 'family vacations'],
  
  // Open Graph defaults
  OG: {
    SITE_NAME: 'GetAway Vibe',
    TYPE: 'website',
    LOCALE: 'en_IN',
  },
  
  // Twitter defaults
  TWITTER: {
    CARD: 'summary_large_image',
    SITE: '@getawayvibe', // Update with your Twitter handle
  }
} as const;

/**
 * Utility function to clear the URL cache (not needed for public URLs)
 */
export function clearAssetCache(): void {
  console.log('No cache to clear for public URLs');
}

/**
 * Utility function to preload critical assets
 */
export function preloadCriticalAssets(): void {
  // For public URLs, we can preload by creating image elements
  const logo = new Image();
  logo.src = BRAND_ASSETS.logo();
  console.log('Logo preloaded:', logo.src);
}