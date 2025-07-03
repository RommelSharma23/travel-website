// app/api/payments/verify-payment/route.ts
// Simple working version

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    console.log('=== Verify Payment API Called ===');
    
    // Create Supabase client with service role
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

    // Parse request body
    const body = await request.json();
    console.log('Request data:', {
      order_id: body.razorpay_order_id,
      payment_id: body.razorpay_payment_id,
      has_signature: !!body.razorpay_signature
    });

    // Validate required fields
    if (!body.razorpay_order_id || !body.razorpay_payment_id || !body.razorpay_signature) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }

    // Verify Razorpay signature
    const sign = body.razorpay_order_id + '|' + body.razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(sign.toString())
      .digest('hex');

    if (body.razorpay_signature !== expectedSign) {
      console.error('Invalid signature');
      return NextResponse.json({
        success: false,
        error: 'Invalid payment signature'
      }, { status: 400 });
    }

    console.log('✅ Signature verified');

    // Find payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('razorpay_order_id', body.razorpay_order_id)
      .single();

    if (paymentError || !payment) {
      console.error('Payment not found:', paymentError);
      return NextResponse.json({
        success: false,
        error: 'Payment record not found'
      }, { status: 404 });
    }

    console.log('✅ Payment record found:', payment.id);

    // Check if already processed
    if (payment.payment_status === 'captured') {
      console.log('Payment already captured');
      return NextResponse.json({
        success: true,
        bookingId: payment.booking_id,
        paymentId: body.razorpay_payment_id,
        message: 'Payment already processed'
      });
    }

    // Update payment status
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        razorpay_payment_id: body.razorpay_payment_id,
        razorpay_signature: body.razorpay_signature,
        payment_status: 'captured',
        payment_captured_at: new Date().toISOString(),
      })
      .eq('id', payment.id);

    if (updateError) {
      console.error('Failed to update payment:', updateError);
      return NextResponse.json({
        success: false,
        error: 'Failed to update payment'
      }, { status: 500 });
    }

    console.log('✅ Payment updated');

    // Update booking status
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .update({
        booking_status: 'confirmed',
        payment_id: payment.id,
      })
      .eq('id', payment.booking_id)
      .select('id, booking_reference')
      .single();

    if (bookingError || !booking) {
      console.error('Failed to update booking:', bookingError);
      return NextResponse.json({
        success: false,
        error: 'Failed to update booking'
      }, { status: 500 });
    }

    console.log('✅ Booking confirmed:', booking.id);

    // Return success response
    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      bookingReference: booking.booking_reference,
      paymentId: body.razorpay_payment_id,
      message: 'Payment verified successfully'
    });

  } catch (error) {
    console.error('Verify payment error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Verify payment API - use POST method'
  });
}