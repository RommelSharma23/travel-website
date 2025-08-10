// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Your Travel Company - International Tours & Travel Packages | Jaipur',
  description: 'Discover amazing international destinations with our curated travel packages. Luxury tours, adventure trips, family vacations & more. Based in Jaipur, Rajasthan.',
  keywords: ['international tours', 'travel packages', 'Jaipur travel agency', 'luxury travel', 'adventure tours', 'family vacations'],
  authors: [{ name: 'Your Travel Company' }],
  creator: 'Your Travel Company',
  publisher: 'Your Travel Company',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://yourdomain.com'), // Replace with your actual domain
  openGraph: {
    title: 'Your Travel Company - International Tours & Travel Packages',
    description: 'Discover amazing international destinations with our curated travel packages. Based in Jaipur, Rajasthan.',
    url: 'https://yourdomain.com', // Replace with your actual domain
    siteName: 'Your Travel Company',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your Travel Company - International Tours & Travel Packages',
    description: 'Discover amazing international destinations with our curated travel packages. Based in Jaipur, Rajasthan.',
    site: '@yourtravelcompany', // Replace with your Twitter handle
    creator: '@yourtravelcompany', // Replace with your Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Add your Google Search Console verification code
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}