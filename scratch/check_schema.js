
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkSchema() {
  const { data, error } = await supabase
    .from('study_plans')
    .select('*')
    .limit(1);
  
  if (error) {
    console.error('Error fetching study_plans:', error);
  } else {
    console.log('Columns in study_plans:', Object.keys(data[0] || {}));
  }
}

checkSchema();
