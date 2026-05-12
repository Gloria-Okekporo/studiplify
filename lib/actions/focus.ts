'use server';

import { createActionSupabaseClient } from '../supabase-server';
import { revalidatePath } from 'next/cache';

export async function startFocusSession(durationMinutes: number) {
  const supabase = createActionSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) throw new Error('Unauthorized');

  const { data, error } = await supabase
    .from('focus_sessions')
    .insert([{
      user_id: session.user.id,
      duration_minutes: durationMinutes,
      completed: false,
      started_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) throw error;
  return { success: true, data };
}

export async function completeFocusSession(sessionId: string, actualMinutes: number) {
  const supabase = createActionSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) throw new Error('Unauthorized');

  // 1. Mark session as completed
  const { error: sessionError } = await supabase
    .from('focus_sessions')
    .update({
      completed: true,
      ended_at: new Date().toISOString(),
      duration_minutes: actualMinutes
    })
    .eq('id', sessionId)
    .eq('user_id', session.user.id);

  if (sessionError) throw sessionError;

  // 2. Update Daily Analytics
  const today = new Date().toISOString().split('T')[0];
  
  // Try to find today's record
  const { data: existingAnalytics } = await supabase
    .from('productivity_analytics')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('date', today)
    .single();

  if (existingAnalytics) {
    await supabase
      .from('productivity_analytics')
      .update({
        study_time_minutes: (existingAnalytics.study_time_minutes || 0) + actualMinutes,
        focus_score: Math.min(100, (existingAnalytics.focus_score || 0) + 5) // Boost focus score
      })
      .eq('id', existingAnalytics.id);
  } else {
    await supabase
      .from('productivity_analytics')
      .insert([{
        user_id: session.user.id,
        date: today,
        study_time_minutes: actualMinutes,
        focus_score: 80
      }]);
  }

  revalidatePath('/dashboard');
  return { success: true };
}

export async function getFocusStats() {
  try {
    const supabase = createActionSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return { success: false, error: 'Unauthorized' };

    const { data: sessions } = await supabase
      .from('focus_sessions')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('completed', true);

    const { data: analytics } = await supabase
      .from('productivity_analytics')
      .select('*')
      .eq('user_id', session.user.id)
      .order('date', { ascending: false });

    const totalMinutes = sessions?.reduce((acc, s) => acc + s.duration_minutes, 0) || 0;
    
    // Simple streak calculation
    let streak = 0;
    if (analytics) {
      for (let i = 0; i < analytics.length; i++) {
        const day = new Date();
        day.setDate(day.getDate() - i);
        const dayStr = day.toISOString().split('T')[0];
        if (analytics.some(a => a.date === dayStr && a.study_time_minutes > 0)) {
          streak++;
        } else if (i > 0) break;
      }
    }

    return {
      success: true,
      data: {
        totalHours: Math.round(totalMinutes / 60 * 10) / 10,
        streak,
        weeklyConsistency: Math.min(100, (streak / 7) * 100)
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
