'use server';

import { createActionSupabaseClient, createServerSupabaseClient } from '../supabase-server';
import { revalidatePath } from 'next/cache';

export async function createTask(title: string, priority: string = 'Medium', dueDate?: string) {
  try {
    const supabase = createActionSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return { success: false, error: 'Unauthorized' };

    // Ensure profile exists (safety check for FK constraint)
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', session.user.id)
      .single();

    if (!profile) {
      await supabase.from('profiles').insert([{
        id: session.user.id,
        email: session.user.email,
        full_name: session.user.user_metadata?.full_name || 'Student User'
      }]);
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        user_id: session.user.id,
        title,
        priority,
        due_date: dueDate || null,
        completed: false,
        status: 'pending'
      }])
      .select();

    if (error) {
      console.error('Supabase Error:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/dashboard');
    return { success: true, data: data?.[0] };
  } catch (error: any) {
    console.error('Action Error:', error);
    return { success: false, error: error.message };
  }
}

export async function toggleTask(taskId: string, completed: boolean) {
  const supabase = createActionSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('tasks')
    .update({ completed, updated_at: new Date().toISOString() })
    .eq('id', taskId)
    .eq('user_id', session.user.id);

  if (error) throw error;

  // Update Daily Analytics if completed
  if (completed) {
    const today = new Date().toISOString().split('T')[0];
    const { data: existingAnalytics } = await supabase
      .from('productivity_analytics')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('date', today)
      .single();

    if (existingAnalytics) {
      await supabase
        .from('productivity_analytics')
        .update({ tasks_completed: (existingAnalytics.tasks_completed || 0) + 1 })
        .eq('id', existingAnalytics.id);
    } else {
      await supabase
        .from('productivity_analytics')
        .insert([{
          user_id: session.user.id,
          date: today,
          tasks_completed: 1,
          study_time_minutes: 0,
          focus_score: 50
        }]);
    }
  }

  revalidatePath('/dashboard/tasks');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function deleteTask(taskId: string) {
  const supabase = createActionSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)
    .eq('user_id', session.user.id);

  if (error) throw error;
  revalidatePath('/dashboard/tasks');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function getTasks() {
  const supabase = createServerSupabaseClient();
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { success: false, error: 'Unauthorized' };

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
