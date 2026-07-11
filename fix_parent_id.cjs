const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://iffuewpvadmxhjdiuqhc.supabase.co';
const supabaseAnonKey = 'sb_publishable_OmEkl2KgTxzeKaTn-8XN3g_aCOEvqeI';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fix() {
  const projectDataStr = fs.readFileSync('parsed_project.json', 'utf8');
  const projectData = JSON.parse(projectDataStr);
  
  projectData.parentId = "proj-1783768650000";
  
  const { error } = await supabase.from('projects').upsert([projectData], { onConflict: 'id' });
  if (error) {
    console.error('Supabase upload failed:', error);
  } else {
    console.log('Successfully updated parentId in Supabase');
  }
}
fix();
