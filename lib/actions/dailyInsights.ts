'use server';

import { createActionSupabaseClient } from '../supabase-server';

export interface DailyInsight {
  id: string;
  title: string;
  insight: string;
  created_at: string;
}

export async function getLatestDailyInsight() {
  const supabase = createActionSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) throw new Error('Unauthorized');

  try {
    const { data, error } = await supabase
      .from('daily_ai_insights')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is 'no rows returned'
      throw error;
    }

    // If no insight exists, we could trigger the generation logic here, 
    // but for now we'll just return null so the UI can show a loading/empty state.
    return { success: true, data: data || null };
  } catch (error: any) {
    console.error('Fetch Insight Error:', error);
    return { success: false, error: error.message };
  }
}
