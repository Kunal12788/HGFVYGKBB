import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const client = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

client.channel('market-closed-stream')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'bullion_settings', filter: 'id=eq.1' }, payload => {
        console.log("REALTIME UPDATE DETECTED! New is_active value:", payload.new.is_active);
    })
    .subscribe((status) => {
        console.log("Listening to Admin Panel toggles... Status:", status);
    });

// Keep alive
setInterval(() => {}, 1000);
