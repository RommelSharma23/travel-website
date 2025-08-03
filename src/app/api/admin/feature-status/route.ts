// app/api/admin/feature-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const feature = searchParams.get('feature');

    if (!feature) {
      return NextResponse.json(
        { success: false, error: 'Feature name is required' },
        { status: 400 }
      );
    }

    // Check if the feature is enabled
    const { data: adminControl, error } = await supabase
      .from('admin_controls')
      .select('is_enabled, disabled_reason')
      .eq('feature_name', feature)
      .single();

    if (error) {
      console.error('Feature status check error:', error);
      // Default to enabled if we can't check status
      return NextResponse.json({
        success: true,
        isEnabled: true,
        disabledReason: null,
      });
    }

    return NextResponse.json({
      success: true,
      isEnabled: adminControl?.is_enabled || false,
      disabledReason: adminControl?.disabled_reason || null,
    });

  } catch (error) {
    console.error('Feature status API error:', error);
    // Default to enabled on error (graceful degradation)
    return NextResponse.json({
      success: true,
      isEnabled: true,
      disabledReason: null,
    });
  }
}