'use server';

import { createActionSupabaseClient } from '../supabase-server';
import { revalidatePath } from 'next/cache';

export async function createNote(data: { title: string; content?: string }) {
  const supabase = createActionSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) throw new Error('Unauthorized');

  const { data: note, error } = await supabase
    .from('notes')
    .insert([
      {
        user_id: session.user.id,
        ...data,
      }
    ])
    .select()
    .single();

  if (error) throw error;
  
  revalidatePath('/dashboard/notes');
  return { success: true, data: note };
}

export async function getNotes() {
  const supabase = createActionSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) throw new Error('Unauthorized');

  const { data: notes, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return { success: true, data: notes };
}

export async function updateNote(id: string, data: { title?: string; content?: string }) {
  const supabase = createActionSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) throw new Error('Unauthorized');

  const { data: note, error } = await supabase
    .from('notes')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', session.user.id)
    .select()
    .single();

  if (error) throw error;
  
  revalidatePath('/dashboard/notes');
  return { success: true, data: note };
}

export async function deleteNote(id: string) {
  const supabase = createActionSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id)
    .eq('user_id', session.user.id);

  if (error) throw error;
  
  revalidatePath('/dashboard/notes');
  return { success: true };
}
