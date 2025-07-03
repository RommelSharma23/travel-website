// components/payments/PaymentModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { X, CreditCard, Shield, AlertCircle } from 'lucide-react';
import { PAYMENT_CONFIG, PAYMENT_TYPES, validateAmount, validateEmail, validatePhone, validateName, formatCurrency } from '@/lib/payment-config';
import type { PayNowFormData, Destination, FormErrors, PaymentType } from '@/types/payment';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (bookingId: string, paymentId: string) => void;
  onError?: (error: string) => void;
}

// Declare Razorpay types directly in the component file
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: any) => void;
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

// Load Razorpay script
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function PaymentModal({ isOpen, onClose, onSuccess, onError }: PaymentModalProps) {
  const [formData, setFormData] = useState<PayNowFormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    destinationId: 0, // Changed from empty string to 0
    amount: PAYMENT_CONFIG.MIN_AMOUNT,
    paymentType: 'Booking Deposit',
    notes: '',
  });

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Load destinations and Razorpay script
  useEffect(() => {
    if (isOpen) {
      loadDestinations();
      loadRazorpayScript().then(setScriptLoaded);
    }
  }, [isOpen]);

  const loadDestinations = async () => {
    try {
      const response = await fetch('/api/destinations/published');
      const data = await response.json();
      if (data.success) {
        setDestinations(data.destinations);
      }
    } catch (error) {
      console.error('Failed to load destinations:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate name
    const nameError = validateName(formData.customerName);
    if (nameError) newErrors.customerName = nameError;

    // Validate email
    const emailError = validateEmail(formData.customerEmail);
    if (emailError) newErrors.customerEmail = emailError;

    // Validate phone
    const phoneError = validatePhone(formData.customerPhone);
    if (phoneError) newErrors.customerPhone = phoneError;

    // Validate destination
    if (!formData.destinationId || formData.destinationId === 0) {
      newErrors.destinationId = 'Please select a destination';
    }

    // Validate amount
    const amountError = validateAmount(formData.amount);
    if (amountError) newErrors.amount = amountError;

    // Validate payment type
    if (!formData.paymentType) {
      newErrors.paymentType = 'Please select a payment type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!scriptLoaded) {
      onError?.('Payment system is loading. Please try again.');
      return;
    }

    setLoading(true);

    try {
      // Create order
      const orderResponse = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        console.error('Order creation failed:', orderData);
        throw new Error(orderData.error || orderData.details || 'Failed to create order');
      }

      // Initialize Razorpay payment
      const options: RazorpayOptions = {
        key: PAYMENT_CONFIG.RAZORPAY.KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: PAYMENT_CONFIG.COMPANY.NAME,
        description: `${formData.paymentType} - ${destinations.find(d => d.id === formData.destinationId)?.name || 'Travel Package'}`,
        order_id: orderData.razorpay_order_id,
        handler: async function (response: any) {
          try {
            console.log('Razorpay response received:', {
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              has_signature: !!response.razorpay_signature
            });

            // Verify payment
            const verifyResponse = await fetch('/api/payments/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            console.log('Verify API response status:', verifyResponse.status);
            
            const verifyData = await verifyResponse.json();
            console.log('Verify API response data:', verifyData);

            if (verifyData.success) {
              console.log('Payment verification successful:', verifyData);
              
              // Check if we have the required data for redirect
              const bookingId = verifyData.bookingId || verifyData.booking_id;
              const paymentId = response.razorpay_payment_id;
              
              console.log('Redirecting with:', { bookingId, paymentId });
              
              if (!bookingId) {
                console.error('Missing booking ID in verify response:', verifyData);
                throw new Error('Booking ID not received from verification');
              }
              
              onSuccess?.(bookingId, paymentId);
              onClose();
              resetForm();
            } else {
              throw new Error(verifyData.error || verifyData.details || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            onError?.('Payment verification failed. Please contact support.');
          }
          setLoading(false);
        },
        prefill: {
          name: formData.customerName,
          email: formData.customerEmail,
          contact: formData.customerPhone,
        },
        theme: {
          color: '#3B82F6',
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Payment error:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      
      // Show more detailed error to user
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      onError?.(errorMessage);
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      destinationId: 0, // Changed from empty string to 0
      amount: PAYMENT_CONFIG.MIN_AMOUNT,
      paymentType: 'Booking Deposit',
      notes: '',
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleInputChange = (field: keyof PayNowFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Pay Now</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Customer Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => handleInputChange('customerName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.customerName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your full name"
              disabled={loading}
            />
            {errors.customerName && (
              <p className="mt-1 text-sm text-red-600">{errors.customerName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.customerEmail}
              onChange={(e) => handleInputChange('customerEmail', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.customerEmail ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="your@email.com"
              disabled={loading}
            />
            {errors.customerEmail && (
              <p className="mt-1 text-sm text-red-600">{errors.customerEmail}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.customerPhone}
              onChange={(e) => handleInputChange('customerPhone', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.customerPhone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="+91-9876543210"
              disabled={loading}
            />
            {errors.customerPhone && (
              <p className="mt-1 text-sm text-red-600">{errors.customerPhone}</p>
            )}
          </div>

          {/* Destination */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destination *
            </label>
            <select
              value={formData.destinationId}
              onChange={(e) => handleInputChange('destinationId', parseInt(e.target.value) || 0)}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.destinationId ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            >
              <option value={0}>Select a destination</option>
              {destinations.map((destination) => (
                <option key={destination.id} value={destination.id}>
                  {destination.name}, {destination.country}
                </option>
              ))}
            </select>
            {errors.destinationId && (
              <p className="mt-1 text-sm text-red-600">{errors.destinationId}</p>
            )}
          </div>

          {/* Payment Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Type *
            </label>
            <select
              value={formData.paymentType}
              onChange={(e) => handleInputChange('paymentType', e.target.value as PaymentType)}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.paymentType ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            >
              {PAYMENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.paymentType && (
              <p className="mt-1 text-sm text-red-600">{errors.paymentType}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">₹</span>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', parseInt(e.target.value) || 0)}
                min={PAYMENT_CONFIG.MIN_AMOUNT}
                max={PAYMENT_CONFIG.MAX_AMOUNT}
                step="1"
                className={`w-full pl-8 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.amount ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="5000"
                disabled={loading}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Min: {formatCurrency(PAYMENT_CONFIG.MIN_AMOUNT)} | Max: {formatCurrency(PAYMENT_CONFIG.MAX_AMOUNT)}
            </p>
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Any special requirements or notes..."
              disabled={loading}
            />
          </div>

          {/* Security Note */}
          <div className="flex items-start space-x-2 p-3 bg-blue-50 rounded-md">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Secure Payment</p>
              <p>Your payment is secured by Razorpay with 256-bit SSL encryption.</p>
            </div>
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="flex items-start space-x-2 p-3 bg-red-50 rounded-md">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-800">{errors.general}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !scriptLoaded}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                Pay {formatCurrency(formData.amount)}
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 text-center">
            By proceeding, you agree to our terms and conditions.
          </p>
        </form>
      </div>
    </div>
  );
}