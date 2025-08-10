// components/payments/PayNowButton.tsx
'use client';

import { useState } from 'react';
import { CreditCard } from 'lucide-react';
import PaymentModal from './PaymentModal';
import { usePayNowFeature } from '../../hooks/usePayNowFeature';

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
  const { isEnabled, isLoading } = usePayNowFeature();

  // COMPLETELY HIDE the button when disabled
  if (!isEnabled && !isLoading) {
    return null; // Button is completely hidden - returns nothing
  }

  const handleSuccess = (bookingId: string, paymentId: string) => {
    setIsModalOpen(false);
    onSuccess?.(bookingId, paymentId);
    
    if (!onSuccess) {
      window.location.href = `/payment-success?booking=${bookingId}&payment=${paymentId}`;
    }
  };

  const handleError = (error: string) => {
    onError?.(error);
    
    if (!onError) {
      alert(`Payment failed: ${error}`);
    }
  };

  const handleClick = () => {
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

  // Show loading state while checking feature status
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

  // Only render the button if enabled
  return (
    <>
      <button
        onClick={handleClick}
        className={`
          inline-flex items-center justify-center
          font-medium rounded-md transition-colors
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${className}
        `}
        title="Make a quick payment"
      >
        <CreditCard className="w-4 h-4 mr-2" />
        Pay Now
      </button>

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </>
  );
}