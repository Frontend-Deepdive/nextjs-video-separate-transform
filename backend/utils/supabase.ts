import { createClient } from '@supabase/supabase-js';

export const getSupabase = () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('❌ SUPABASE_URL or SUPABASE_SERVICE_KEY is missing');
  }

  return createClient(supabaseUrl, supabaseKey);
};

export const insertVideoMetadata = async (data: { filename: string; url: string }) => {
  const supabase = getSupabase();
  const { error } = await supabase.from('videos').insert(data);
  if (error) throw error;
};
