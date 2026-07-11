const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://iffuewpvadmxhjdiuqhc.supabase.co';
const supabaseAnonKey = 'sb_publishable_OmEkl2KgTxzeKaTn-8XN3g_aCOEvqeI';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fetch() {
  const { data, error } = await supabase.from('projects').select('id, tasks').eq('id', 'proj-innovation-hub-sync');
  if (error) {
    console.error('Supabase fetch failed:', error);
  } else {
    console.log(data[0].tasks.length, "tasks found in the sync project");
  }
}
fetch();
