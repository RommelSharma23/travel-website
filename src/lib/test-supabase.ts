// src/lib/test-supabase.ts
import { supabase } from './supabase'

export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .limit(3)
    
    if (error) {
      console.error('Supabase connection error:', error)
      return false
    }
    
    console.log('Supabase connected successfully! Sample data:', data)
    return true
  } catch (err) {
    console.error('Connection failed:', err)
    return false
  }
}