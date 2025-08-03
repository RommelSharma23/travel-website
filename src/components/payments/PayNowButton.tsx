// components/payments/PayNowButton.tsx
'use client';

import { useState } from 'react';
import { CreditCard, AlertCircle } from 'lucide-react';
import PaymentModal from './PaymentModal';
import { usePayNowFeature } from '@/hooks/usePayNowFeature';

interface PayNowButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  onSuccess?: (bookingId: string, paymentId: string) => void;
  onError?: (error: string) => void;
}

export default function PayNowButton({ 
  className = '',
  variant = 'primary',
  size = 'md',
  onSuccess,
  onError 
}: PayNowButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isEnabled, isLoading, disabledReason } = usePayNowFeature();

  const handleSuccess = (bookingId: string, paymentId: string) => {
    setIsModalOpen(false);
    onSuccess?.(bookingId, paymentId);
    
    // Default success behavior - redirect to success page
    if (!onSuccess) {
      window.location.href = `/payment-success?booking=${bookingId}&payment=${paymentId}`;
    }
  };

  const handleError = (error: string) => {
    onError?.(error);
    
    // Default error behavior - show alert
    if (!onError) {
      alert(`Payment failed: ${error}`);
    }
  };

  const handleClick = () => {
    if (!isEnabled) {
      const message = disabledReason || 'Payment feature is temporarily unavailable. Please try again later.';
      handleError(message);
      return;
    }
    
    setIsModalOpen(true);
  };

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  // Variant classes
  const variantClasses = {
    primary: 'bg-green-600 hover:bg-green-700 text-white',
    secondary: 'bg-white hover:bg-gray-50 text-green-600 border border-green-600',
  };

  // Disabled styles
  const disabledClasses = !isEnabled 
    ? 'opacity-50 cursor-not-allowed bg-gray-400 text-gray-200 border-gray-400' 
    : '';

  // Loading state
  if (isLoading) {
    return (
      <button
        disabled
        className={`
          inline-flex items-center justify-center
          font-medium rounded-md transition-colors
          opacity-50 cursor-not-allowed
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${className}
        `}
      >
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
        Loading...
      </button>
    );
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={!isEnabled}
        className={`
          inline-flex items-center justify-center
          font-medium rounded-md transition-colors
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${sizeClasses[size]}
          ${disabledClasses || variantClasses[variant]}
          ${className}
        `}
        title={!isEnabled ? (disabledReason || 'Payment feature is temporarily unavailable') : 'Make a quick payment'}
      >
        {!isEnabled ? (
          <>
            <AlertCircle className="w-4 h-4 mr-2" />
            Pay Now (Unavailable)
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            Pay Now
          </>
        )}
      </button>

      {isEnabled && (
        <PaymentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      )}
    </>
  );
}