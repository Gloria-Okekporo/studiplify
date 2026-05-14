'use server';

import { createServerSupabaseClient } from './supabase-server';

export async function runDiagnostics() {
  const supabase = createServerSupabaseClient();
  const results: any = {
    auth: null,
    profile: null,
    tables: {
      tasks: null,
      summaries: null,
      ai_summaries: null,
      quizzes: null
    },
    storage: {
      summaries_bucket: null
    }
  };

  try {
    // 1. Check Auth
    const { data: { session } } = await supabase.auth.getSession();
    results.auth = session ? `Logged in as ${session.user.email}` : 'Not logged in';
    if (!session) return results;

    // 2. Check Profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    results.profile = profile ? 'Exists' : (profileError ? `Error: ${profileError.message}` : 'Missing');

    // 3. Check Tables (count items and check columns)
    const checkTable = async (name: string) => {
      try {
        const { data: cols } = await supabase.rpc('get_table_columns', { table_name: name });
        const { count, error } = await supabase
          .from(name)
          .select('*', { count: 'exact', head: true });
        
        let status = error ? `Error: ${error.message}` : `Accessible (${count} items)`;
        if (cols) {
          status += ` | Cols: ${cols.map((c: any) => c.column_name).join(', ')}`;
        }
        return status;
      } catch (e: any) {
        return `Crash: ${e.message}`;
      }
    };

    results.tables.tasks = await checkTable('tasks');
    results.tables.summaries = await checkTable('summaries');
    results.tables.ai_summaries = await checkTable('ai_summaries');
    results.tables.quizzes = await checkTable('quizzes');

    // 4. Check Storage
    try {
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      if (bucketError) {
        results.storage.summaries_bucket = `Error: ${bucketError.message}`;
      } else {
        const bucket = buckets.find(b => b.name === 'summaries');
        results.storage.summaries_bucket = bucket ? `Exists (Public: ${bucket.public})` : 'Missing';
      }
    } catch (e: any) {
      results.storage.summaries_bucket = `Crash: ${e.message}`;
    }

    return results;
  } catch (globalError: any) {
    return { error: globalError.message };
  }
}
