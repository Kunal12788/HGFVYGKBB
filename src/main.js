
import { createClient } from '@supabase/supabase-js';

// --- SUPABASE CONFIGURATION ---
const SUPABASE_URL = "https://zeaszjipthhqjwdrafgb.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplYXN6amlwdGhocWp3ZHJhZmdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyNjUxNzEsImV4cCI6MjA5ODg0MTE3MX0.15kuaNWTmvnVYm8P01tfNG4Mv9ZpoXiOfnVhyrlvpyE"; 

let supabaseClient = null;

// Price History Cache for Sparklines (max 10 points)
let priceHistory = {
  gold_995_100gms: [],
  silver_999_1kg: []
};

// Initialize Supabase Connection
function initSupabase() {
  try {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    startApp();
  } catch (err) {
    console.error("Failed to initialize Supabase client:", err);
  }
}

async function startApp() {
  await fetchLatestPrices();
  subscribeToRealtime();
}

async function fetchLatestPrices() {
  // Fetch Gold
  const { data: goldData, error: goldErr } = await supabaseClient
    .from('bullion_rates')
    .select('*')
    .eq('item', 'gold_995_100gms')
    .order('created_at', { ascending: false })
    .limit(10);
    
  if (!goldErr && goldData && goldData.length > 0) {
    priceHistory.gold_995_100gms = goldData.reverse();
    updateRateUI('gold_995_100gms', priceHistory.gold_995_100gms);
  }

  // Fetch Silver
  const { data: silverData, error: silverErr } = await supabaseClient
    .from('bullion_rates')
    .select('*')
    .eq('item', 'silver_999_1kg')
    .order('created_at', { ascending: false })
    .limit(10);
    
  if (!silverErr && silverData && silverData.length > 0) {
    priceHistory.silver_999_1kg = silverData.reverse();
    updateRateUI('silver_999_1kg', priceHistory.silver_999_1kg);
  }
}

function subscribeToRealtime() {
  supabaseClient
    .channel('public:bullion_rates')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bullion_rates' }, payload => {
      handleNewRate(payload.new);
    })
    .subscribe();
}

function handleNewRate(record) {
  const item = record.item;
  if (!priceHistory[item]) return;
  
  priceHistory[item].push(record);
  if (priceHistory[item].length > 10) {
    priceHistory[item].shift(); // Keep only 10 points
  }
  updateRateUI(item, priceHistory[item]);
}

function updateRateUI(item, history) {
  if (history.length === 0) return;
  const current = history[history.length - 1];
  
  // Format price
  const formattedPrice = formatPriceDecimal(current.price);
  
  // Elements
  let priceEl;
  if (item === 'gold_995_100gms') {
    priceEl = document.getElementById('gold-price');
  } else if (item === 'silver_999_1kg') {
    priceEl = document.getElementById('silver-price');
  }

  if (priceEl) {
    priceEl.textContent = '₹' + formattedPrice;
    
    // Update color based on price change
    priceEl.classList.remove('text-primary', 'text-green-500', 'text-red-500');
    
    if (history.length > 1) {
      const currentVal = parseFloat(current.price);
      const prevVal = parseFloat(history[history.length - 2].price);
      
      if (currentVal > prevVal) {
        priceEl.classList.add('text-green-500');
      } else if (currentVal < prevVal) {
        priceEl.classList.add('text-red-500');
      } else {
        priceEl.classList.add('text-primary');
      }
    } else {
      priceEl.classList.add('text-primary');
    }
  }
}

function formatPriceDecimal(value) {
  const num = parseFloat(value);
  if (isNaN(num)) return "0.00";
  return num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function drawSparkline(history, pathEl, fillEl) {
  if (!history || history.length === 0) return;

  // If only one point, draw flat line
  let dataPoints = history;
  if (dataPoints.length === 1) {
    dataPoints = [history[0], history[0]];
  }

  const prices = dataPoints.map(r => parseFloat(r.price));
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const range = maxPrice - minPrice || 1; 

  const width = 100;
  const height = 30; // Max height for line chart
  const startY = 30; // Y offset 

  let dPath = "";
  const stepX = width / (dataPoints.length - 1);

  dataPoints.forEach((point, i) => {
    const p = parseFloat(point.price);
    const normalized = (p - minPrice) / range;
    
    // Invert Y axis for SVG (0 is top)
    const x = (i * stepX).toFixed(1);
    const y = (startY - (normalized * height)).toFixed(1);

    if (i === 0) {
      dPath += `M${x} ${y} `;
    } else {
      // Create a smooth curve approximation (or simple line)
      dPath += `L${x} ${y} `; 
    }
  });

  // Smooth out line visually with simple L for now (to avoid complex bezier calculations on edge cases)
  
  if (pathEl) {
    pathEl.setAttribute("d", dPath);
    // Retrigger animation
    pathEl.style.animation = 'none';
    pathEl.offsetHeight; 
    pathEl.style.animation = 'drawLine 2.5s cubic-bezier(0.65, 0, 0.35, 1) forwards';
  }

  if (fillEl) {
    const dFill = `${dPath} L${width} 40 L0 40 Z`;
    fillEl.setAttribute("d", dFill);
  }
}

initSupabase();
