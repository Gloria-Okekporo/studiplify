'use server';

import { createActionSupabaseClient } from '../supabase-server';
import { revalidatePath } from 'next/cache';

export async function getProductivityAnalytics(date?: string) {
  const supabase = createActionSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) throw new Error('Unauthorized');

  let query = supabase
    .from('productivity_analytics')
    .select('*')
    .eq('user_id', session.user.id);
    
  if (date) {
    query = query.eq('date', date);
  } else {
    query = query.order('date', { ascending: false }).limit(30);
  }

  const { data: analytics, error } = await query;

  if (error) throw error;
  return { success: true, data: analytics };
}

export async function updateDailyAnalytics(data: { tasks_completed?: number; study_time_minutes?: number; focus_score?: number }) {
  const supabase = createActionSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) throw new Error('Unauthorized');

  const today = new Date().toISOString().split('T')[0];

  // Try to update existing record for today
  const { data: existingRecord } = await supabase
    .from('productivity_analytics')
    .select('id')
    .eq('user_id', session.user.id)
    .eq('date', today)
    .single();

  let result;

  if (existingRecord) {
    const { data: updatedRecord, error } = await supabase
      .from('productivity_analytics')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingRecord.id)
      .select()
      .single();

    if (error) throw error;
    result = updatedRecord;
  } else {
    const { data: newRecord, error } = await supabase
      .from('productivity_analytics')
      .insert([
        {
          user_id: session.user.id,
          date: today,
          ...data,
        }
      ])
      .select()
      .single();

    if (error) throw error;
    result = newRecord;
  }
  
  revalidatePath('/dashboard/analytics');
  return { success: true, data: result };
}
