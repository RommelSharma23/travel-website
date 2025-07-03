// app/payment-success/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Download, Mail, Phone, Home, FileText, Clock, Users, MapPin } from 'lucide-react';
import Link from 'next/link';

interface BookingDetails {
  id: string;
  booking_reference: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_amount: number;
  currency: string;
  payment_type: string;
  destination_name: string;
  destination_country: string;
  payment_id: string;
  created_at: string;
  quick_payment_notes?: string;
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('booking');
  const paymentId = searchParams.get('payment');
  
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Success page params:', { bookingId, paymentId });
    
    if (bookingId || paymentId) {
      fetchBookingDetails();
    } else {
      setError('Invalid booking or payment reference');
      setLoading(false);
    }
  }, [bookingId, paymentId]);

  const fetchBookingDetails = async () => {
    try {
      // Use static route instead of dynamic route
      const params = new URLSearchParams();
      if (bookingId) params.set('id', bookingId);
      if (paymentId) params.set('payment', paymentId);
      
      console.log('Fetching booking with URL:', `/api/booking-details?${params.toString()}`);
      
      const response = await fetch(`/api/booking-details?${params.toString()}`);
      const data = await response.json();
      
      console.log('Booking fetch response:', data);
      
      if (data.success) {
        setBooking(data.booking);
      } else {
        setError(data.error || 'Failed to fetch booking details');
      }
    } catch (error) {
      console.error('Fetch booking error:', error);
      setError('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-2 text-sm text-gray-500 mb-6">
            <p>Booking ID: {bookingId || 'Not provided'}</p>
            <p>Payment ID: {paymentId || 'Not provided'}</p>
          </div>
          <Link 
            href="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  if (!booking) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-green-600 mb-2">Payment Successful!</h1>
            <p className="text-lg text-gray-600">Your payment has been processed successfully.</p>
            <p className="text-sm text-gray-500 mt-2">
              Booking Reference: <span className="font-mono font-semibold">{booking.booking_reference}</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FileText className="w-4 h-4 mr-2" />
              Print Receipt
            </button>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>

          {/* Booking Details Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
            {/* Header */}
            <div className="bg-green-600 text-white p-6">
              <h2 className="text-2xl font-bold mb-2">Payment Confirmation</h2>
              <p className="opacity-90">Thank you for your payment. Here are your booking details:</p>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Booking Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Booking Information
                  </h3>
                  
                  <div>
                    <span className="block text-sm font-medium text-gray-500">Booking Reference</span>
                    <span className="text-lg font-mono font-semibold text-gray-900">{booking.booking_reference}</span>
                  </div>
                  
                  <div>
                    <span className="block text-sm font-medium text-gray-500">Payment ID</span>
                    <span className="text-sm font-mono text-gray-700 break-all">{booking.payment_id}</span>
                  </div>
                  
                  <div>
                    <span className="block text-sm font-medium text-gray-500">Destination</span>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-lg text-gray-900">{booking.destination_name}, {booking.destination_country}</span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="block text-sm font-medium text-gray-500">Payment Type</span>
                    <span className="text-lg text-gray-900">{booking.payment_type}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Payment Details
                  </h3>
                  
                  <div>
                    <span className="block text-sm font-medium text-gray-500">Amount Paid</span>
                    <span className="text-2xl font-bold text-green-600">
                      ₹{booking.total_amount.toLocaleString()}
                    </span>
                  </div>
                  
                  <div>
                    <span className="block text-sm font-medium text-gray-500">Payment Date</span>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-lg text-gray-900">
                        {new Date(booking.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="block text-sm font-medium text-gray-500">Status</span>
                    <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                      ✓ Payment Confirmed
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="border-t border-gray-200 pt-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="block text-sm font-medium text-gray-500">Name</span>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-lg text-gray-900">{booking.customer_name}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{booking.customer_email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{booking.customer_phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Notes (if any) */}
              {booking.quick_payment_notes && (
                <div className="border-t border-gray-200 pt-6 mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Notes</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{booking.quick_payment_notes}</p>
                  </div>
                </div>
              )}

              {/* Next Steps */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">What Happens Next?</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-semibold text-blue-600">1</span>
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">Email Confirmation</p>
                      <p className="text-gray-600 text-sm">A detailed confirmation email has been sent to {booking.customer_email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-semibold text-blue-600">2</span>
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">Team Contact</p>
                      <p className="text-gray-600 text-sm">Our travel experts will contact you within 24 hours to discuss your itinerary</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-semibold text-blue-600">3</span>
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">Booking Finalization</p>
                      <p className="text-gray-600 text-sm">We'll finalize your travel arrangements and send you the complete itinerary</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-semibold text-blue-600">4</span>
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">Travel Documentation</p>
                      <p className="text-gray-600 text-sm">You will receive detailed travel documentation closer to your departure date</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center">
                <Phone className="w-8 h-8 text-blue-600 mb-2" />
                <p className="text-sm font-medium text-gray-900">Call Us</p>
                <p className="text-sm text-gray-600">+91-9876543210</p>
              </div>
              <div className="flex flex-col items-center">
                <Mail className="w-8 h-8 text-blue-600 mb-2" />
                <p className="text-sm font-medium text-gray-900">Email Us</p>
                <p className="text-sm text-gray-600">info@yourtravelcompany.com</p>
              </div>
              <div className="flex flex-col items-center">
                <Clock className="w-8 h-8 text-blue-600 mb-2" />
                <p className="text-sm font-medium text-gray-900">Support Hours</p>
                <p className="text-sm text-gray-600">9 AM - 8 PM (Mon-Sun)</p>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Important Notes</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Please save this page or take a screenshot for your records
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Your booking reference number is required for all future communications
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Cancellation and refund policies will be shared in your detailed itinerary
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                For any changes to your booking, please contact us at least 48 hours in advance
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Keep your booking reference safe - it's your unique identifier for this transaction
              </li>
            </ul>
          </div>

          {/* Security & Trust */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-green-900 mb-3">Payment Security</h3>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-green-900 font-medium">Secure Transaction Completed</p>
                <p className="text-green-800 text-sm">Your payment was processed securely through Razorpay with 256-bit SSL encryption</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-gray-500 text-sm">
            <p>Thank you for choosing us for your travel needs!</p>
            <p className="mt-2">© 2025 Your Travel Company. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}