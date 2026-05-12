
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function listTables() {
  const { data, error } = await supabase.rpc('get_tables'); // This might not work if RPC isn't there
  if (error) {
    // Fallback: try to select from common tables
    const tables = ['profiles', 'users', 'summaries', 'study_plans'];
    for (const t of tables) {
      const { error: e } = await supabase.from(t).select('count', { count: 'exact', head: true });
      if (e) {
        console.log(`Table ${t} check: FAILED (${e.message})`);
      } else {
        console.log(`Table ${t} check: SUCCESS`);
      }
    }
  } else {
    console.log('Tables:', data);
  }
}

listTables();
