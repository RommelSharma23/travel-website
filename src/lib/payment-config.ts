// lib/payment-config.ts
// Payment configuration and constants

export const PAYMENT_CONFIG = {
  // Amount limits (in rupees)
  MIN_AMOUNT: parseInt(process.env.PAYMENT_MIN_AMOUNT || '500'),
  MAX_AMOUNT: parseInt(process.env.PAYMENT_MAX_AMOUNT || '500000'),
  
  // Rate limiting
  RATE_LIMIT: {
    PER_IP: parseInt(process.env.PAYMENT_RATE_LIMIT_PER_IP || '10'),
    WINDOW_MINUTES: parseInt(process.env.PAYMENT_RATE_LIMIT_WINDOW_MINUTES || '60'),
    BLOCK_DURATION_MINUTES: parseInt(process.env.PAYMENT_RATE_LIMIT_BLOCK_DURATION_MINUTES || '30'),
  },
  
  // Security features
  SECURITY: {
    ENABLE_CAPTCHA: process.env.ENABLE_PAYMENT_CAPTCHA === 'true',
    ENABLE_OTP: process.env.ENABLE_OTP_VERIFICATION === 'true',
    ENABLE_EMAIL_VERIFICATION: process.env.ENABLE_EMAIL_VERIFICATION === 'true',
  },
  
  // Company details
  COMPANY: {
    NAME: process.env.NEXT_PUBLIC_COMPANY_NAME || 'Your Travel Company',
    EMAIL: process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'info@yourtravelcompany.com',
    PHONE: process.env.NEXT_PUBLIC_COMPANY_PHONE || '+91-9876543210',
  },
  
  // Razorpay configuration
  RAZORPAY: {
    KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    KEY_SECRET: process.env.RAZORPAY_KEY_SECRET!,
    WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET,
  },
} as const;

// Payment type options for the dropdown
export const PAYMENT_TYPES = [
  { value: 'Booking Deposit', label: 'Booking Deposit' },
  { value: 'Balance Payment', label: 'Balance Payment' },
  { value: 'Full Package Payment', label: 'Full Package Payment' },
  { value: 'Advance Payment', label: 'Advance Payment' },
  { value: 'Other', label: 'Other' },
] as const;

// Payment status mappings
export const PAYMENT_STATUS = {
  CREATED: 'created',
  PENDING: 'pending',
  CAPTURED: 'captured',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const;

// Booking status mappings
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
} as const;

// Validation rules
export const VALIDATION_RULES = {
  AMOUNT: {
    MIN: PAYMENT_CONFIG.MIN_AMOUNT,
    MAX: PAYMENT_CONFIG.MAX_AMOUNT,
    STEP: 1,
  },
  
  PHONE: {
    PATTERN: /^[+]?[1-9][\d\s\-\(\)]{8,15}$/,
    MESSAGE: 'Please enter a valid phone number',
  },
  
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MESSAGE: 'Please enter a valid email address',
  },
  
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
    PATTERN: /^[a-zA-Z\s.'-]+$/,
    MESSAGE: 'Name should only contain letters, spaces, dots, apostrophes, and hyphens',
  },
} as const;

// Error messages
export const ERROR_MESSAGES = {
  AMOUNT_TOO_LOW: `Minimum payment amount is ₹${PAYMENT_CONFIG.MIN_AMOUNT.toLocaleString()}`,
  AMOUNT_TOO_HIGH: `Maximum payment amount is ₹${PAYMENT_CONFIG.MAX_AMOUNT.toLocaleString()}`,
  INVALID_AMOUNT: 'Please enter a valid amount',
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_NAME: 'Please enter a valid name',
  RATE_LIMITED: 'Too many payment attempts. Please try again later.',
  PAYMENT_FAILED: 'Payment failed. Please try again.',
  FEATURE_DISABLED: 'Payment feature is temporarily unavailable.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  PAYMENT_INITIATED: 'Payment initiated successfully',
  PAYMENT_COMPLETED: 'Payment completed successfully',
  BOOKING_CREATED: 'Booking created successfully',
} as const;

// Utility function to format currency
export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  if (currency === 'INR') {
    return `₹${amount.toLocaleString('en-IN')}`;
  }
  return `${currency} ${amount.toLocaleString()}`;
};

// Utility function to validate amount
export const validateAmount = (amount: number): string | null => {
  if (!amount || isNaN(amount)) {
    return ERROR_MESSAGES.INVALID_AMOUNT;
  }
  
  if (amount < PAYMENT_CONFIG.MIN_AMOUNT) {
    return ERROR_MESSAGES.AMOUNT_TOO_LOW;
  }
  
  if (amount > PAYMENT_CONFIG.MAX_AMOUNT) {
    return ERROR_MESSAGES.AMOUNT_TOO_HIGH;
  }
  
  return null;
};

// Utility function to validate email
export const validateEmail = (email: string): string | null => {
  if (!email) {
    return ERROR_MESSAGES.REQUIRED_FIELD;
  }
  
  if (!VALIDATION_RULES.EMAIL.PATTERN.test(email)) {
    return ERROR_MESSAGES.INVALID_EMAIL;
  }
  
  return null;
};

// Utility function to validate phone
export const validatePhone = (phone: string): string | null => {
  if (!phone) {
    return ERROR_MESSAGES.REQUIRED_FIELD;
  }
  
  if (!VALIDATION_RULES.PHONE.PATTERN.test(phone)) {
    return ERROR_MESSAGES.INVALID_PHONE;
  }
  
  return null;
};

// Utility function to validate name
export const validateName = (name: string): string | null => {
  if (!name) {
    return ERROR_MESSAGES.REQUIRED_FIELD;
  }
  
  if (name.length < VALIDATION_RULES.NAME.MIN_LENGTH) {
    return `Name must be at least ${VALIDATION_RULES.NAME.MIN_LENGTH} characters`;
  }
  
  if (name.length > VALIDATION_RULES.NAME.MAX_LENGTH) {
    return `Name must be less than ${VALIDATION_RULES.NAME.MAX_LENGTH} characters`;
  }
  
  if (!VALIDATION_RULES.NAME.PATTERN.test(name)) {
    return ERROR_MESSAGES.INVALID_NAME;
  }
  
  return null;
};