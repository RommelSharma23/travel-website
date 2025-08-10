// app/api/test-booking/route.ts
// Temporary API to test booking creation

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function POST(request: NextRequest) {
  try {
    console.log('Testing booking creation...');

    // First, get a valid destination
    const { data: destinations, error: destError } = await supabase
      .from('destinations')
      .select('id, name, country, status')
      .eq('status', 'published')
      .limit(1);

    console.log('Available destinations:', destinations);

    if (!destinations || destinations.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No published destinations found',
        step: 'destination_check'
      });
    }

    const destination = destinations[0];

    // Generate test booking reference
    const bookingReference = `TEST${Date.now()}`;

    // Test booking data
    const bookingData = {
      customer_name: 'Test Customer',
      customer_email: 'test@example.com',
      customer_phone: '+91-9876543210',
      destination_id: destination.id,
      booking_reference: bookingReference,
      total_amount: 5000,
      currency: 'INR',
      booking_status: 'pending',
      payment_type: 'Booking Deposit',
      is_quick_payment: true,
      source: 'test_api',
    };

    console.log('Attempting to create booking with data:', bookingData);

    // Try to create booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select()
      .single();

    console.log('Booking creation result:', { booking, bookingError });

    if (bookingError) {
      return NextResponse.json({
        success: false,
        error: 'Booking creation failed',
        details: {
          message: bookingError.message,
          code: bookingError.code,
          hint: bookingError.hint,
          details: bookingError.details
        },
        bookingData,
        step: 'booking_creation'
      });
    }

    return NextResponse.json({
      success: true,
      booking,
      destination,
      message: 'Booking created successfully'
    });

  } catch (error) {
    console.error('Test booking error:', error);
    return NextResponse.json({
      success: false,
      error: 'API error',
      details: error instanceof Error ? error.message : 'Unknown error',
      step: 'api_error'
    });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Test booking API - use POST to test booking creation'
  });
}