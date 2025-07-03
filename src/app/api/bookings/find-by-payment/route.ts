// app/api/bookings/find-by-payment/route.ts
// Fallback API to find booking by payment ID

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Environment variables validation
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function findBookingByPaymentId(paymentId: string) {
  console.log('Finding booking by payment ID:', paymentId);

  // Find payment record first
  const { data: payment, error: paymentError } = await supabase
    .from('payments')
    .select('booking_id, razorpay_payment_id, payment_status')
    .eq('razorpay_payment_id', paymentId)
    .single();

  if (paymentError || !payment) {
    console.error('Payment not found:', paymentError);
    throw new Error('Payment not found');
  }

  console.log('Found payment, booking ID:', payment.booking_id);

  // Only return confirmed bookings for security
  if (payment.payment_status !== 'captured') {
    throw new Error('Payment not confirmed');
  }

  // Now get the booking details
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .select(`
      id,
      booking_reference,
      customer_name,
      customer_email,
      customer_phone,
      total_amount,
      currency,
      payment_type,
      quick_payment_notes,
      booking_status,
      created_at,
      destinations(
        id,
        name,
        country
      ),
      payments(
        id,
        razorpay_payment_id,
        payment_status,
        payment_captured_at
      )
    `)
    .eq('id', payment.booking_id)
    .single();

  if (bookingError || !booking) {
    console.error('Booking not found:', bookingError);
    throw new Error('Booking not found');
  }

  // Only return confirmed bookings
  if (booking.booking_status !== 'confirmed') {
    throw new Error('Booking not confirmed');
  }

  // Process the data same as booking details API
  const paymentRecord = Array.isArray(booking.payments) && booking.payments.length > 0 
    ? booking.payments[0] 
    : null;

  const destination = Array.isArray(booking.destinations) && booking.destinations.length > 0
    ? booking.destinations[0]
    : null;

  // Format the response
  const bookingDetails = {
    id: booking.id,
    booking_reference: booking.booking_reference || 'N/A',
    customer_name: booking.customer_name || 'Unknown',
    customer_email: booking.customer_email || 'N/A',
    customer_phone: booking.customer_phone || 'N/A',
    total_amount: booking.total_amount || 0,
    currency: booking.currency || 'INR',
    payment_type: booking.payment_type || 'unknown',
    quick_payment_notes: booking.quick_payment_notes || '',
    destination_name: destination?.name || 'Unknown',
    destination_country: destination?.country || 'Unknown',
    payment_id: paymentRecord?.razorpay_payment_id || paymentId,
    created_at: booking.created_at,
  };

  console.log('Returning booking details for payment:', paymentId);

  return bookingDetails;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('paymentId');

    if (!paymentId) {
      return NextResponse.json(
        { success: false, error: 'Missing payment ID' },
        { status: 400 }
      );
    }

    const bookingDetails = await findBookingByPaymentId(paymentId);

    return NextResponse.json({
      success: true,
      booking: bookingDetails,
      foundBy: 'payment_id'
    });

  } catch (error) {
    console.error('Find booking by payment error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Return appropriate status code based on error message
    let statusCode = 500;
    if (errorMessage.includes('not found')) {
      statusCode = 404;
    } else if (errorMessage.includes('not confirmed')) {
      statusCode = 400;
    }

    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: errorMessage
      },
      { status: statusCode }
    );
  }
}

// Handle POST requests for consistency
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const paymentId = body.paymentId || body.razorpay_payment_id;

    if (!paymentId) {
      return NextResponse.json(
        { success: false, error: 'Missing payment ID in request body' },
        { status: 400 }
      );
    }

    // Use the same logic as GET instead of recursive call
    const bookingDetails = await findBookingByPaymentId(paymentId);

    return NextResponse.json({
      success: true,
      booking: bookingDetails,
      foundBy: 'payment_id'
    });

  } catch (error) {
    console.error('POST find booking by payment error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Return appropriate status code based on error message
    let statusCode = 500;
    if (errorMessage.includes('not found')) {
      statusCode = 404;
    } else if (errorMessage.includes('not confirmed')) {
      statusCode = 400;
    } else if (errorMessage.includes('Invalid request body')) {
      statusCode = 400;
    }

    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: errorMessage
      },
      { status: statusCode }
    );
  }
}

// Handle other HTTP methods
export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed. Use GET or POST request.' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed. Use GET or POST request.' },
    { status: 405 }
  );
}