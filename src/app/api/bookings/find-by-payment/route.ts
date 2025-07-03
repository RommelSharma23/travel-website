// app/api/bookings/find-by-payment/route.ts
// Fallback API to find booking by payment ID

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('paymentId');

    console.log('Finding booking by payment ID:', paymentId);

    if (!paymentId) {
      return NextResponse.json(
        { success: false, error: 'Missing payment ID' },
        { status: 400 }
      );
    }

    // Find payment record first
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('booking_id, razorpay_payment_id, payment_status')
      .eq('razorpay_payment_id', paymentId)
      .single();

    if (paymentError || !payment) {
      console.error('Payment not found:', paymentError);
      return NextResponse.json(
        { success: false, error: 'Payment not found' },
        { status: 404 }
      );
    }

    console.log('Found payment, booking ID:', payment.booking_id);

    // Only return confirmed bookings for security
    if (payment.payment_status !== 'captured') {
      return NextResponse.json(
        { success: false, error: 'Payment not confirmed' },
        { status: 400 }
      );
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
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Only return confirmed bookings
    if (booking.booking_status !== 'confirmed') {
      return NextResponse.json(
        { success: false, error: 'Booking not confirmed' },
        { status: 400 }
      );
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
      booking_reference: booking.booking_reference,
      customer_name: booking.customer_name,
      customer_email: booking.customer_email,
      customer_phone: booking.customer_phone,
      total_amount: booking.total_amount,
      currency: booking.currency,
      payment_type: booking.payment_type,
      quick_payment_notes: booking.quick_payment_notes,
      destination_name: destination?.name || 'Unknown',
      destination_country: destination?.country || 'Unknown',
      payment_id: paymentRecord?.razorpay_payment_id || paymentId,
      created_at: booking.created_at,
    };

    console.log('Returning booking details for payment:', paymentId);

    return NextResponse.json({
      success: true,
      booking: bookingDetails,
      foundBy: 'payment_id'
    });

  } catch (error) {
    console.error('Find booking by payment error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Also handle POST requests for consistency
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

    // Redirect to GET request with query parameter
    const url = new URL(request.url);
    url.searchParams.set('paymentId', paymentId);
    
    return GET(new NextRequest(url.toString()));

  } catch (error) {
    console.error('POST find booking by payment error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Invalid request body',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 400 }
    );
  }
}