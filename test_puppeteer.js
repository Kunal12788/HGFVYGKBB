import puppeteer from 'puppeteer';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  // Expose a function to log console messages from the browser
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  
  console.log("Navigating to Customer App preview...");
  await page.goto('http://localhost:5007', { waitUntil: 'networkidle0' });
  
  console.log("Initial load complete. Checking if overlay is hidden...");
  let isHidden = await page.evaluate(() => {
    return document.getElementById('marketClosedOverlay').classList.contains('hidden');
  });
  console.log("Is overlay hidden initially?", isHidden);
  
  console.log("Setting DB to FALSE (Market Closed)...");
  await supabase.from('bullion_settings').update({ is_active: false }).eq('id', 1);
  
  // Wait 2 seconds for realtime
  await new Promise(r => setTimeout(r, 2000));
  
  isHidden = await page.evaluate(() => {
    return document.getElementById('marketClosedOverlay').classList.contains('hidden');
  });
  console.log("Is overlay hidden after setting FALSE?", isHidden);
  
  console.log("Setting DB to TRUE (Market Open)...");
  await supabase.from('bullion_settings').update({ is_active: true }).eq('id', 1);
  
  // Wait 2 seconds for realtime
  await new Promise(r => setTimeout(r, 2000));
  
  isHidden = await page.evaluate(() => {
    return document.getElementById('marketClosedOverlay').classList.contains('hidden');
  });
  console.log("Is overlay hidden after setting TRUE?", isHidden);
  
  await browser.close();
  console.log("Test complete.");
}
run();
