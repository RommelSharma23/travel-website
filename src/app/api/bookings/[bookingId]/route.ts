// app/api/bookings/[bookingId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Environment variables validation
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
}

// Use service role client for reading booking details
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

export async function GET(
  request: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const { bookingId } = params;
    
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('payment');

    console.log('Fetching booking details:', { bookingId, paymentId });

    // Validate parameters
    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: 'Missing booking ID' },
        { status: 400 }
      );
    }

    // Check if bookingId looks like a UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(bookingId)) {
      console.error('Invalid booking ID format:', bookingId);
      return NextResponse.json(
        { success: false, error: 'Invalid booking ID format' },
        { status: 400 }
      );
    }

    // Fetch booking with related data
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
      .eq('id', bookingId)
      .single();

    console.log('Booking query result:', { 
      found: !!booking, 
      error: bookingError?.message,
      booking_status: booking?.booking_status 
    });

    if (bookingError || !booking) {
      console.error('Booking not found:', { bookingId, error: bookingError });
      return NextResponse.json(
        { 
          success: false, 
          error: 'Booking not found',
          details: bookingError?.message || 'No booking data returned',
          bookingId 
        },
        { status: 404 }
      );
    }

    // Get the payment record (payments is an array, get the first one)
    const payment = Array.isArray(booking.payments) && booking.payments.length > 0 
      ? booking.payments[0] 
      : null;

    // Get the destination record (destinations is an array, get the first one)
    const destination = Array.isArray(booking.destinations) && booking.destinations.length > 0
      ? booking.destinations[0]
      : null;

    console.log('Extracted records:', {
      payment: payment ? { id: payment.id, razorpay_payment_id: payment.razorpay_payment_id } : null,
      destination: destination ? { id: destination.id, name: destination.name } : null
    });

    // If payment ID is provided, verify it matches
    if (paymentId && payment?.razorpay_payment_id !== paymentId) {
      console.error('Payment ID mismatch:', {
        expected: paymentId,
        actual: payment?.razorpay_payment_id
      });
      return NextResponse.json(
        { 
          success: false, 
          error: 'Payment ID does not match booking',
          expected: paymentId,
          actual: payment?.razorpay_payment_id || 'No payment found'
        },
        { status: 400 }
      );
    }

    // Only return confirmed bookings for security
    if (booking.booking_status !== 'confirmed') {
      console.error('Booking not confirmed:', {
        bookingId,
        status: booking.booking_status
      });
      return NextResponse.json(
        { 
          success: false, 
          error: 'Booking not confirmed',
          status: booking.booking_status,
          bookingId
        },
        { status: 400 }
      );
    }

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
      payment_id: payment?.razorpay_payment_id || 'Unknown',
      created_at: booking.created_at,
    };

    console.log('Returning booking details:', {
      booking_reference: bookingDetails.booking_reference,
      customer_name: bookingDetails.customer_name,
      amount: bookingDetails.total_amount
    });

    return NextResponse.json({
      success: true,
      booking: bookingDetails,
    });

  } catch (error) {
    console.error('Fetch booking error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error',
        bookingId: params?.bookingId || 'unknown'
      },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods with proper typing
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed. Use GET request.' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed. Use GET request.' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed. Use GET request.' },
    { status: 405 }
  );
}