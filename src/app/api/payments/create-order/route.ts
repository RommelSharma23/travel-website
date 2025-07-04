// app/api/payments/create-order/route.ts
// Updated to use service role client only (bypasses RLS)

import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';
import { PAYMENT_CONFIG, validateAmount, validateEmail, validatePhone, validateName } from '@/lib/payment-config';
import type { PayNowFormData } from '@/types/payment';

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: PAYMENT_CONFIG.RAZORPAY.KEY_ID,
  key_secret: PAYMENT_CONFIG.RAZORPAY.KEY_SECRET,
});

// Use service role client for ALL operations (bypasses RLS)
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

// Log payment attempt
async function logPaymentAttempt(
  eventType: string,
  ipAddress: string,
  userAgent: string,
  formData: PayNowFormData,
  errorMessage?: string | null,
  razorpayOrderId?: string
) {
  try {
    await supabase
      .from('payment_audit_log')
      .insert({
        event_type: eventType,
        ip_address: ipAddress,
        user_agent: userAgent,
        customer_email: formData.customerEmail,
        customer_phone: formData.customerPhone,
        amount: formData.amount,
        razorpay_order_id: razorpayOrderId,
        error_message: errorMessage || undefined,
        metadata: {
          destination_id: formData.destinationId,
          payment_type: formData.paymentType,
        },
      });
  } catch (error) {
    console.error('Failed to log payment attempt:', error);
  }
}

export async function POST(request: NextRequest) {
  let ipAddress = '';
  let userAgent = '';
  let formData: PayNowFormData | null = null;

  try {
    // Extract client information
    ipAddress = request.headers.get('x-forwarded-for') || 
                request.headers.get('x-real-ip') || 
                'unknown';
    userAgent = request.headers.get('user-agent') || 'unknown';

    // Parse request body
    const body = await request.json();
    formData = body as PayNowFormData;

    console.log('Received payment request:', {
      customerName: formData.customerName,
      destinationId: formData.destinationId,
      amount: formData.amount,
      paymentType: formData.paymentType
    });

    // Validate required fields
    if (!formData || !formData.customerName || !formData.customerEmail || !formData.customerPhone || !formData.destinationId || !formData.amount || !formData.paymentType) {
      await logPaymentAttempt('payment_attempt', ipAddress, userAgent, formData || {} as PayNowFormData, 'Missing required fields');
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate form data
    const nameError = validateName(formData.customerName);
    const emailError = validateEmail(formData.customerEmail);
    const phoneError = validatePhone(formData.customerPhone);
    const amountError = validateAmount(formData.amount);

    if (nameError || emailError || phoneError || amountError) {
      const errorMessage = [nameError, emailError, phoneError, amountError].filter(Boolean).join(', ');
      await logPaymentAttempt('payment_attempt', ipAddress, userAgent, formData, `Validation failed: ${errorMessage}`);
      return NextResponse.json(
        { success: false, error: 'Invalid form data: ' + errorMessage },
        { status: 400 }
      );
    }

    // Check if destination exists
    console.log('Checking destination ID:', formData.destinationId);
    
    const { data: destination, error: destError } = await supabase
      .from('destinations')
      .select('id, name, country, status')
      .eq('id', formData.destinationId)
      .single();

    console.log('Destination query result:', { destination, destError });

    if (destError || !destination) {
      console.error('Destination not found:', { 
        destinationId: formData.destinationId, 
        error: destError 
      });
      
      await logPaymentAttempt('payment_attempt', ipAddress, userAgent, formData, `Invalid destination ID: ${formData.destinationId}`);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid destination selected',
          details: `Destination ID ${formData.destinationId} not found`
        },
        { status: 400 }
      );
    }

    // Generate unique booking reference
    const generateBookingReference = () => {
      const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      return `PAY${date}${random}`;
    };

    let bookingReference = generateBookingReference();
    
    // Ensure uniqueness
    let attempts = 0;
    while (attempts < 5) {
      const { data: existing } = await supabase
        .from('bookings')
        .select('id')
        .eq('booking_reference', bookingReference)
        .single();
      
      if (!existing) break;
      
      bookingReference = generateBookingReference();
      attempts++;
    }

    // Create Razorpay order
    console.log('Creating Razorpay order...');
    const orderOptions = {
      amount: Math.round(formData.amount * 100), // Convert to paise
      currency: 'INR',
      receipt: bookingReference,
      notes: {
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        destination: destination.name,
        payment_type: formData.paymentType,
      },
    };

    const razorpayOrder = await razorpay.orders.create(orderOptions);
    console.log('Razorpay order created:', razorpayOrder.id);

    // Create booking record (using service role - bypasses RLS)
    const bookingData = {
      customer_name: formData.customerName,
      customer_email: formData.customerEmail,
      customer_phone: formData.customerPhone,
      destination_id: formData.destinationId,
      booking_reference: bookingReference,
      total_amount: formData.amount,
      currency: 'INR',
      booking_status: 'pending' as const,
      payment_type: formData.paymentType,
      is_quick_payment: true,
      source: 'pay_now_modal',
      ...(formData.notes && formData.notes.trim() !== '' ? { quick_payment_notes: formData.notes } : {}),
    };

    console.log('Creating booking with service role client:', bookingData);

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select()
      .single();

    console.log('Booking creation result:', { booking, bookingError });

    if (bookingError) {
      console.error('Booking creation error details:', {
        error: bookingError,
        code: bookingError.code,
        message: bookingError.message,
        details: bookingError.details,
        hint: bookingError.hint,
        data: bookingData
      });
      
      await logPaymentAttempt('payment_attempt', ipAddress, userAgent, formData, `Failed to create booking: ${bookingError.message}`, razorpayOrder.id);
      
      return NextResponse.json(
        { 
          success: false, 
          error: `Failed to create booking record: ${bookingError.message}`,
          details: bookingError.details,
          code: bookingError.code,
          hint: bookingError.hint
        },
        { status: 500 }
      );
    }

    // Create payment record
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        razorpay_order_id: razorpayOrder.id,
        amount: formData.amount,
        currency: 'INR',
        customer_email: formData.customerEmail,
        customer_phone: formData.customerPhone,
        booking_id: booking.id,
        payment_status: 'created',
      });

    if (paymentError) {
      console.error('Payment record creation error:', paymentError);
      await logPaymentAttempt('payment_attempt', ipAddress, userAgent, formData, `Failed to create payment record: ${paymentError.message}`, razorpayOrder.id);
      return NextResponse.json(
        { 
          success: false, 
          error: `Failed to create payment record: ${paymentError.message}`,
          details: paymentError.details
        },
        { status: 500 }
      );
    }

    // Log successful attempt
    await logPaymentAttempt('payment_attempt', ipAddress, userAgent, formData, undefined, razorpayOrder.id);

    console.log('Order creation successful:', {
      razorpay_order_id: razorpayOrder.id,
      booking_id: booking.id,
      booking_reference: bookingReference
    });

    return NextResponse.json({
      success: true,
      razorpay_order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      booking_id: booking.id,
      booking_reference: bookingReference,
    });

  } catch (error) {
    console.error('Create order error:', error);
    
    if (formData) {
      await logPaymentAttempt('payment_attempt', ipAddress, userAgent, formData, error instanceof Error ? error.message : 'Unknown error');
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}