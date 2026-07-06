import { supabase } from './supabase';
import { Project } from '../types';

/**
 * Example utility file demonstrating how to transition from localStorage to Supabase.
 * 
 * To use this in App.tsx:
 * 1. Fetch projects on load:
 *    useEffect(() => {
 *      fetchProjects().then(data => if(data) setProjects(data));
 *    }, []);
 * 
 * 2. Save projects on change:
 *    // inside handleUpdateProject
 *    await saveProject(updatedProject);
 */

export async function fetchProjects(): Promise<Project[] | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*');

  if (error) {
    console.error('Error fetching from Supabase:', error);
    return null;
  }
  
  return data as Project[];
}

export async function saveProject(project: Project): Promise<boolean> {
  const { error } = await supabase
    .from('projects')
    .upsert(project, { onConflict: 'id' });

  if (error) {
    console.error('Error saving to Supabase:', error);
    return false;
  }

  return true;
}
