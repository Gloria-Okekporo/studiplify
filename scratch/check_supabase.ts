
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDB() {
  console.log('Testing Supabase connection...');
  
  // 1. Check if we can reach the summaries table
  const { data, error } = await supabase
    .from('summaries')
    .select('count', { count: 'exact', head: true });
    
  if (error) {
    console.error('Error selecting from summaries:', error);
  } else {
    console.log('Successfully reached summaries table. Total rows:', data);
  }

  // 2. Check storage buckets
  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
  if (bucketError) {
    console.error('Error listing buckets:', bucketError);
  } else {
    console.log('Available buckets:', buckets.map(b => b.name));
  }
}

testDB();
