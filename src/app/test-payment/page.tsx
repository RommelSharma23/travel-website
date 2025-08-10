// app/test-payment/page.tsx
// Optional test page to verify PayNow functionality

'use client';

import PayNowButton from '../../components/payments/PayNowButton';

export default function TestPaymentPage() {
  const handleSuccess = (bookingId: string, paymentId: string) => {
    console.log('Payment successful!', { bookingId, paymentId });
    // Will redirect to success page
  };

  const handleError = (error: string) => {
    console.error('Payment failed:', error);
    // Will show alert
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Testing</h1>
            <p className="text-gray-600">Test the PayNow functionality with different button variants</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="space-y-8">
              
              {/* Primary Button */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Primary Button</h3>
                <PayNowButton
                  variant="primary"
                  size="md"
                  onSuccess={handleSuccess}
                  onError={handleError}
                />
              </div>

              {/* Secondary Button */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Secondary Button</h3>
                <PayNowButton
                  variant="secondary"
                  size="md"
                  onSuccess={handleSuccess}
                  onError={handleError}
                />
              </div>

              {/* Different Sizes */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Different Sizes</h3>
                <div className="flex flex-wrap gap-4">
                  <PayNowButton
                    variant="primary"
                    size="sm"
                    onSuccess={handleSuccess}
                    onError={handleError}
                  />
                  <PayNowButton
                    variant="primary"
                    size="md"
                    onSuccess={handleSuccess}
                    onError={handleError}
                  />
                  <PayNowButton
                    variant="primary"
                    size="lg"
                    onSuccess={handleSuccess}
                    onError={handleError}
                  />
                </div>
              </div>

              {/* Test Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Testing Instructions</h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <p><strong>1.</strong> Click any "Pay Now" button to open the payment modal</p>
                  <p><strong>2.</strong> Fill in all required fields with test data</p>
                  <p><strong>3.</strong> Use test amount between ₹500 - ₹5,00,000</p>
                  <p><strong>4.</strong> Click "Pay" to open Razorpay test interface</p>
                  <p><strong>5.</strong> Use Razorpay test cards for payment</p>
                  <p><strong>6.</strong> Verify success page shows correct details</p>
                </div>
              </div>

              {/* Test Cards Info */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-3">Razorpay Test Cards</h3>
                <div className="space-y-2 text-sm text-green-800">
                  <p><strong>Success Card:</strong> 4111 1111 1111 1111</p>
                  <p><strong>CVV:</strong> Any 3 digits</p>
                  <p><strong>Expiry:</strong> Any future date</p>
                  <p><strong>Name:</strong> Any name</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}