import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://iffuewpvadmxhjdiuqhc.supabase.co';
const supabaseAnonKey = 'sb_publishable_OmEkl2KgTxzeKaTn-8XN3g_aCOEvqeI';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const projectDataStr = fs.readFileSync('parsed_project.json', 'utf8');
const projectData = JSON.parse(projectDataStr);

async function push() {
  const { error } = await supabase.from('projects').upsert([projectData], { onConflict: 'id' });
  if (error) {
    console.error('Supabase upload failed:', error);
  } else {
    console.log('Successfully uploaded project to Supabase');
  }
}
push();
