// src/types/index.ts
export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  heroImage: string;
  gallery: string[];
  featured: boolean;
  createdAt?: string;
}

export interface TourPackage {
  id: string;
  title: string;
  destinationId: string;
  destination: string;
  duration: number;
  price: number;
  theme: 'luxury' | 'adventure' | 'family' | 'romantic' | 'cultural' | 'budget';
  highlights: string[];
  description: string;
  createdAt?: string;
}

export interface Inquiry {
  id?: string;
  name: string;
  email: string;
  phone: string;
  destination: string;
  travelDates: string;
  groupSize: number;
  budget: string;
  message: string;
  status?: string;
  createdAt?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  destination: string;
  image?: string;
}