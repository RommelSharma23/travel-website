// src/lib/test-connection.ts
import { supabase } from './supabase';

export async function testConnection() {
  console.log('Testing Supabase connection...');
  console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('Key length:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length);
  
  try {
    const { data, error } = await supabase
      .from('destinations')
      .select('count')
      .limit(1);
      
    console.log('Connection test result:', { data, error });
    return { success: !error, data, error };
  } catch (err) {
    console.error('Connection test failed:', err);
    return { success: false, error: err };
  }
}