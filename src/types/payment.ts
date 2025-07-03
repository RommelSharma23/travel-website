// types/payment.ts
// TypeScript types for the payment system

export interface PayNowFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  destinationId: number; // Changed from string to number
  amount: number;
  paymentType: PaymentType;
  notes?: string;
}

export interface PaymentRequest {
  formData: PayNowFormData;
  ipAddress?: string;
  userAgent?: string;
}

export interface PaymentOrderResponse {
  success: boolean;
  razorpay_order_id?: string;
  amount?: number;
  currency?: string;
  booking_id?: string;
  booking_reference?: string;
  error?: string;
}

export interface PaymentVerificationRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface PaymentVerificationResponse {
  success: boolean;
  bookingId?: string;
  bookingReference?: string;
  paymentId?: string;
  error?: string;
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

// Database types
export interface Booking {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  destination_id: string;
  booking_reference: string;
  total_amount: number;
  currency: string;
  booking_status: BookingStatus;
  payment_type: PaymentType;
  is_quick_payment: boolean;
  quick_payment_notes?: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  destinations?: Destination;
  payments?: Payment;
}

export interface Payment {
  id: string;
  razorpay_order_id: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  amount: number;
  currency: string;
  payment_status: PaymentStatus;
  customer_email: string;
  customer_phone?: string;
  booking_id: string;
  payment_method?: string;
  failure_reason?: string;
  payment_captured_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Destination {
  id: number; // Changed from string to number to match your schema
  name: string;
  slug: string;
  country: string;
  status: string;
}

export interface PaymentRateLimit {
  id: string;
  ip_address: string;
  email?: string;
  phone?: string;
  attempt_count: number;
  last_attempt: string;
  blocked_until?: string;
  created_at: string;
}

export interface AdminControl {
  id: string;
  feature_name: string;
  is_enabled: boolean;
  disabled_reason?: string;
  disabled_by?: string;
  updated_at: string;
}

export interface PaymentAuditLog {
  id: string;
  event_type: AuditEventType;
  ip_address?: string;
  user_agent?: string;
  customer_email?: string;
  customer_phone?: string;
  amount?: number;
  razorpay_order_id?: string;
  error_message?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

// Enum types
export type PaymentType = 
  | 'Booking Deposit'
  | 'Balance Payment' 
  | 'Full Package Payment'
  | 'Advance Payment'
  | 'Other';

export type PaymentStatus = 
  | 'created'
  | 'pending'
  | 'captured'
  | 'failed'
  | 'cancelled'
  | 'refunded';

export type BookingStatus = 
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'completed';

export type AuditEventType = 
  | 'payment_attempt'
  | 'payment_success'
  | 'payment_failure'
  | 'security_block'
  | 'rate_limit_hit'
  | 'invalid_signature'
  | 'amount_validation_failed';

// Form validation types
export interface FormErrors {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  destinationId?: string;
  amount?: string;
  paymentType?: string;
  general?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: FormErrors;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (bookingId: string, paymentId: string) => void;
  onError?: (error: string) => void;
}

// Component prop types
export interface PaymentFormProps {
  onSubmit: (data: PayNowFormData) => void;
  loading?: boolean;
  errors?: FormErrors;
  destinations: Destination[];
}

export interface DestinationSelectProps {
  destinations: Destination[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export interface AmountInputProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
  min?: number;
  max?: number;
}

// Security check result
export interface SecurityCheckResult {
  allowed: boolean;
  reason?: string;
  blockedUntil?: string;
  remainingAttempts?: number;
}

// Rate limiting context
export interface RateLimitContext {
  ipAddress: string;
  email?: string;
  phone?: string;
  userAgent?: string;
}

// Admin dashboard types
export interface PaymentStats {
  totalPayments: number;
  totalAmount: number;
  successRate: number;
  todayPayments: number;
  todayAmount: number;
  failedPayments: number;
}

export interface PaymentListItem {
  id: string;
  booking_reference: string;
  customer_name: string;
  customer_email: string;
  amount: number;
  payment_status: PaymentStatus;
  payment_type: PaymentType;
  created_at: string;
  destination_name?: string;
}

// Webhook types (for future use)
export interface RazorpayWebhookPayload {
  entity: string;
  account_id: string;
  event: string;
  contains: string[];
  payload: {
    payment: {
      entity: RazorpayPaymentEntity;
    };
    order: {
      entity: RazorpayOrderEntity;
    };
  };
  created_at: number;
}

export interface RazorpayPaymentEntity {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  status: string;
  order_id: string;
  method: string;
  captured: boolean;
  email: string;
  contact: string;
  created_at: number;
}

export interface RazorpayOrderEntity {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  status: string;
  created_at: number;
}