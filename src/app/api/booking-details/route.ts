// app/api/booking-details/route.ts
// Static route to handle booking lookups

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client with runtime environment variable checking
function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseClient();
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('id');
    const paymentId = searchParams.get('payment');

    console.log('Booking details requested:', { bookingId, paymentId });

    // Try both methods: bookingId and paymentId
    let booking = null;
    let error = null;

    if (bookingId) {
      // Try to find by booking ID - fix the relationship query
      const { data, error: bookingError } = await supabase
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
          destination_id,
          payment_id
        `)
        .eq('id', bookingId)
        .eq('booking_status', 'confirmed')
        .single();

      if (data && !bookingError) {
        // Get destination separately
        let destination = null;
        if (data.destination_id) {
          const { data: destData } = await supabase
            .from('destinations')
            .select('id, name, country')
            .eq('id', data.destination_id)
            .single();
          destination = destData;
        }

        // Get payment separately
        let payment = null;
        if (data.payment_id) {
          const { data: paymentData } = await supabase
            .from('payments')
            .select('id, razorpay_payment_id, payment_status')
            .eq('id', data.payment_id)
            .single();
          payment = paymentData;
        }

        // Combine the data
        booking = {
          ...data,
          destinations: destination ? [destination] : [],
          payments: payment ? [payment] : []
        };
      } else {
        error = bookingError;
      }
    }

    if (!booking && paymentId) {
      // Try to find by payment ID
      console.log('Trying to find by payment ID:', paymentId);
      
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .select('booking_id')
        .eq('razorpay_payment_id', paymentId)
        .eq('payment_status', 'captured')
        .single();

      if (payment && !paymentError) {
        // Now get the booking
        const { data, error: bookingError } = await supabase
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
            destination_id,
            payment_id
          `)
          .eq('id', payment.booking_id)
          .eq('booking_status', 'confirmed')
          .single();

        if (data && !bookingError) {
          // Get destination separately
          let destination = null;
          if (data.destination_id) {
            const { data: destData } = await supabase
              .from('destinations')
              .select('id, name, country')
              .eq('id', data.destination_id)
              .single();
            destination = destData;
          }

          // Get payment separately
          let paymentData = null;
          if (data.payment_id) {
            const { data: payData } = await supabase
              .from('payments')
              .select('id, razorpay_payment_id, payment_status')
              .eq('id', data.payment_id)
              .single();
            paymentData = payData;
          }

          // Combine the data
          booking = {
            ...data,
            destinations: destination ? [destination] : [],
            payments: paymentData ? [paymentData] : []
          };
        } else {
          error = bookingError;
        }
      } else {
        error = paymentError;
      }
    }

    if (!booking) {
      console.error('Booking not found:', { bookingId, paymentId, error });
      return NextResponse.json(
        { 
          success: false, 
          error: 'Booking not found',
          details: error?.message || 'No booking data found',
          searchParams: { bookingId, paymentId }
        },
        { status: 404 }
      );
    }

    // Process the booking data
    const payment = Array.isArray(booking.payments) && booking.payments.length > 0 
      ? booking.payments[0] 
      : null;

    const destination = Array.isArray(booking.destinations) && booking.destinations.length > 0
      ? booking.destinations[0]
      : null;

    // Format response with null safety
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
      payment_id: payment?.razorpay_payment_id || paymentId || 'Unknown',
      created_at: booking.created_at,
    };

    console.log('Returning booking details:', {
      booking_reference: bookingDetails.booking_reference,
      customer_name: bookingDetails.customer_name
    });

    return NextResponse.json({
      success: true,
      booking: bookingDetails,
    });

  } catch (error) {
    console.error('Booking details API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    let statusCode = 500;
    
    if (errorMessage.includes('Missing Supabase')) {
      statusCode = 500;
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: errorMessage
      },
      { status: statusCode }
    );
  }
}

// Handle other HTTP methods
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