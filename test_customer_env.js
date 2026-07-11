import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

console.log("URL:", url);
console.log("KEY exists:", !!key);

const supabase = createClient(url, key);

async function test() {
  const { data, error } = await supabase
    .from('bullion_settings')
    .select('is_active')
    .eq('id', 1)
    .single();

  if (error) {
    console.error("Error fetching settings:", error);
  } else {
    console.log("Settings fetched successfully:", data);
  }
}

test();
