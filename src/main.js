import { createClient } from '@supabase/supabase-js';

// --- SUPABASE CONFIGURATION ---
const SUPABASE_URL = "https://zeaszjipthhqjwdrafgb.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplYXN6amlwdGhocWp3ZHJhZmdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyNjUxNzEsImV4cCI6MjA5ODg0MTE3MX0.15kuaNWTmvnVYm8P01tfNG4Mv9ZpoXiOfnVhyrlvpyE"; 

let supabaseClient = null;

// Track all our monitored items
const monitoredItems = [
    'gold_995_100gms',
    'gold_22k',
    'gold_20k',
    'gold_18k',
    'gold_14k',
    'gold_9k',
    'silver_999_1kg'
];

// Price History Cache for Sparklines (max 10 points per item)
let priceHistory = {};
monitoredItems.forEach(item => priceHistory[item] = []);

// DOM ID Map for quick lookups
const domMap = {
    'gold_995_100gms': { price: 'gold-price', path: 'gold-sparkline-path', fill: 'gold-sparkline-fill' },
    'gold_22k': { price: 'gold-22k-price', path: 'gold-22k-sparkline-path', fill: 'gold-22k-sparkline-fill' },
    'gold_20k': { price: 'gold-20k-price', path: 'gold-20k-sparkline-path', fill: 'gold-20k-sparkline-fill' },
    'gold_18k': { price: 'gold-18k-price', path: 'gold-18k-sparkline-path', fill: 'gold-18k-sparkline-fill' },
    'gold_14k': { price: 'gold-14k-price', path: 'gold-14k-sparkline-path', fill: 'gold-14k-sparkline-fill' },
    'gold_9k':  { price: 'gold-9k-price', path: 'gold-9k-sparkline-path', fill: 'gold-9k-sparkline-fill' },
    'silver_999_1kg':  { price: 'silver-price', path: 'silver-sparkline-path', fill: 'silver-sparkline-fill' }
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
  // Fetch latest 10 rows for all items simultaneously for performance
  const promises = monitoredItems.map(item => {
      return supabaseClient
        .from('bullion_rates')
        .select('*')
        .eq('item', item)
        .order('created_at', { ascending: false })
        .limit(10);
  });

  const results = await Promise.all(promises);

  results.forEach((res, index) => {
      const item = monitoredItems[index];
      if (!res.error && res.data && res.data.length > 0) {
          priceHistory[item] = res.data.reverse();
          updateRateUI(item, priceHistory[item]);
      }
  });
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
  if (!priceHistory[item]) return; // ignore unmonitored items
  
  priceHistory[item].push(record);
  if (priceHistory[item].length > 10) {
    priceHistory[item].shift(); // Keep only max 10 points
  }
  updateRateUI(item, priceHistory[item]);
}

function updateRateUI(item, history) {
  if (history.length === 0) return;
  const current = history[history.length - 1];
  
  const formattedPrice = formatPriceDecimal(current.price);
  
  const map = domMap[item];
  if (!map) return;

  const priceEl = document.getElementById(map.price);
  const pathEl = document.getElementById(map.path);
  const fillEl = document.getElementById(map.fill);

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

  // Draw sparkline
  if (pathEl && fillEl) {
    drawSparkline(history, pathEl, fillEl);
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
      dPath += `L${x} ${y} `; 
    }
  });

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
