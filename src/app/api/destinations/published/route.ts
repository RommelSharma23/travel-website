// app/api/destinations/published/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Fetch published destinations
    const { data: destinations, error } = await supabase
      .from('destinations')
      .select('id, name, slug, country')
      .eq('status', 'published')
      .order('name');

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch destinations' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      destinations: destinations || [],
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}