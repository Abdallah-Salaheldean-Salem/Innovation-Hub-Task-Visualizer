import { supabase, isSupabaseConfigured } from './supabase';
import { Project } from '../types';

export async function fetchProjects(): Promise<Project[] | null> {
  if (!isSupabaseConfigured) return null;
  
  const { data, error } = await supabase
    .from('projects')
    .select('*');

  if (error) {
    console.warn('Supabase fetch failed. Have you created the "projects" table? See supabase-schema.sql', error);
    return null;
  }
  
  return data as Project[];
}

export async function saveProject(project: Project): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  const { error } = await supabase
    .from('projects')
    .upsert(project, { onConflict: 'id' });

  if (error) {
    console.warn('Supabase save failed. Have you created the "projects" table? See supabase-schema.sql', error);
    return false;
  }

  return true;
}

export async function saveProjectsBulk(projects: Project[]): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  const { error } = await supabase
    .from('projects')
    .upsert(projects, { onConflict: 'id' });

  if (error) {
    console.warn('Supabase bulk save failed. Have you created the "projects" table? See supabase-schema.sql', error);
    return false;
  }

  return true;
}
