import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const client = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

console.log("Subscribing to realtime...");

client.channel('test-market-closed-stream')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'bullion_settings', filter: 'id=eq.1' }, payload => {
        console.log("REALTIME EVENT RECEIVED!", payload.new);
    })
    .subscribe((status) => {
        console.log("Subscription status:", status);
    });

// Keep process alive
setInterval(() => {}, 1000);
