// lib/payment-config.ts
export const PAYMENT_CONFIG = {
  RAZORPAY: {
    KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    KEY_SECRET: process.env.RAZORPAY_KEY_SECRET!,
  },
  COMPANY: {
    NAME: "GetAway Vibe",
    SUPPORT_EMAIL: "support@getawayvibe.com",
    SUPPORT_PHONE: "+91 7877995497",
  },
  CURRENCY: "INR",
  MIN_AMOUNT: parseInt(process.env.PAYMENT_MIN_AMOUNT!) || 500,
  MAX_AMOUNT: parseInt(process.env.PAYMENT_MAX_AMOUNT!) || 500000,
};

// Add environment validation
export const validateEnvironment = () => {
  if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
    throw new Error('Razorpay Key ID is not configured');
  }
  
  if (!process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay Key Secret is not configured');
  }
  
  // Ensure we're using live keys in production
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID.startsWith('rzp_live_')) {
      console.error('Current Key ID:', process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);
      throw new Error('Production environment must use live Razorpay keys');
    }
    if (!process.env.RAZORPAY_KEY_SECRET.startsWith('rzp_live_')) {
      throw new Error('Production environment must use live Razorpay secret');
    }
  }
  
  console.log(`Payment Config Loaded - Environment: ${process.env.NODE_ENV}, Key Type: ${process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.startsWith('rzp_live_') ? 'LIVE' : 'TEST'}`);
};

// Keep existing validation functions
export const validateAmount = (amount: number): string | null => {
  if (!amount || amount < PAYMENT_CONFIG.MIN_AMOUNT) {
    return `Minimum amount is ₹${PAYMENT_CONFIG.MIN_AMOUNT}`;
  }
  if (amount > PAYMENT_CONFIG.MAX_AMOUNT) {
    return `Maximum amount is ₹${PAYMENT_CONFIG.MAX_AMOUNT}`;
  }
  return null;
};

export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return null;
};

export const validatePhone = (phone: string): string | null => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  if (!phone) return 'Phone number is required';
  if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
    return 'Please enter a valid phone number';
  }
  return null;
};

export const validateName = (name: string): string | null => {
  if (!name || name.trim().length < 2) {
    return 'Name must be at least 2 characters long';
  }
  return null;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const PAYMENT_TYPES = [
  { value: 'Booking Deposit', label: 'Booking Deposit' },
  { value: 'Full Payment', label: 'Full Payment' },
  { value: 'Partial Payment', label: 'Partial Payment' },
  { value: 'Additional Services', label: 'Additional Services' },
] as const;

export type PaymentType = typeof PAYMENT_TYPES[number]['value'];