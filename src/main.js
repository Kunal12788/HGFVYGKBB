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

// Derived Items configuration
const derivedGoldItems = [
    { id: 'gold_22k', multiplier: 0.955 },
    { id: 'gold_20k', multiplier: 0.87 },
    { id: 'gold_18k', multiplier: 0.795 },
    { id: 'gold_14k', multiplier: 0.625 },
    { id: 'gold_9k', multiplier: 0.42 }
];

function calculateBaseNumber(price24k) {
    const rawBase = (parseFloat(price24k) * 100 / 103 / 99.50) * 100;
    const withoutDecimals = Math.trunc(rawBase);
    return Math.round(withoutDecimals / 100) * 100; // Round to nearest 100 based on tens digit
}

function calculateDerivedPrice(baseNumber, multiplier) {
    const raw = baseNumber * multiplier;
    const withoutDecimals = Math.trunc(raw);
    return Math.round(withoutDecimals / 100) * 100; // Round to nearest 100 based on tens digit
}

async function fetchLatestPrices() {
  // Only fetch the base prices from the database
  const dbItems = ['gold_995_100gms', 'silver_999_1kg'];
  const promises = dbItems.map(item => {
      return supabaseClient
        .from('bullion_rates')
        .select('*')
        .eq('item', item)
        .order('created_at', { ascending: false })
        .limit(10);
  });

  const results = await Promise.all(promises);

  results.forEach((res, index) => {
      const item = dbItems[index];
      if (!res.error && res.data && res.data.length > 0) {
          const fetchedHistory = res.data.reverse();
          priceHistory[item] = fetchedHistory;
          updateRateUI(item, priceHistory[item]);
          
          // If it's the 24K gold, instantly generate all derived histories!
          if (item === 'gold_995_100gms') {
              derivedGoldItems.forEach(derived => {
                  // Generate synthetic history rows
                  priceHistory[derived.id] = fetchedHistory.map(row => {
                      const baseNumber = calculateBaseNumber(row.price);
                      const finalPrice = calculateDerivedPrice(baseNumber, derived.multiplier);
                      return { ...row, item: derived.id, price: finalPrice }; 
                  });
                  updateRateUI(derived.id, priceHistory[derived.id]);
              });
          }
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
  
  if (item === 'gold_995_100gms') {
      // Update 24k
      priceHistory[item].push(record);
      if (priceHistory[item].length > 10) priceHistory[item].shift();
      updateRateUI(item, priceHistory[item]);
      
      // Instantly generate and update all derived purities
      const baseNumber = calculateBaseNumber(record.price);
      derivedGoldItems.forEach(derived => {
          const finalPrice = calculateDerivedPrice(baseNumber, derived.multiplier);
          const syntheticRecord = { ...record, item: derived.id, price: finalPrice };
          
          priceHistory[derived.id].push(syntheticRecord);
          if (priceHistory[derived.id].length > 10) priceHistory[derived.id].shift();
          updateRateUI(derived.id, priceHistory[derived.id]);
      });
      
  } else if (item === 'silver_999_1kg') {
      priceHistory[item].push(record);
      if (priceHistory[item].length > 10) priceHistory[item].shift();
      updateRateUI(item, priceHistory[item]);
  }
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

  let trendColor = '#2563eb';
  let trendGradient = 'url(#sparkline-gradient-blue)';
  let colorClass = 'text-primary';

  if (history.length > 1) {
    const currentVal = parseFloat(current.price);
    const prevVal = parseFloat(history[history.length - 2].price);
    
    if (currentVal > prevVal) {
      colorClass = 'text-green-500';
      trendColor = '#16a34a';
      trendGradient = 'url(#sparkline-gradient-green)';
    } else if (currentVal < prevVal) {
      colorClass = 'text-red-500';
      trendColor = '#dc2626';
      trendGradient = 'url(#sparkline-gradient-red)';
    }
  }

  if (priceEl) {
    priceEl.textContent = '₹' + formattedPrice;
    priceEl.classList.remove('text-primary', 'text-green-500', 'text-red-500');
    priceEl.classList.add(colorClass);
  }

  // Generate the static spline and set colors
  if (pathEl && fillEl) {
    pathEl.setAttribute("stroke", trendColor);
    fillEl.setAttribute("fill", trendGradient);
    
    // Generate accurate spline paths based on data
    const dPath = generateSplinePath(history);
    pathEl.setAttribute("d", dPath);
    fillEl.setAttribute("d", `${dPath} L100 40 L0 40 Z`);
    
    // Trigger Recharts-style draw animation
    pathEl.style.animation = 'none';
    fillEl.style.animation = 'none';
    pathEl.offsetHeight; // trigger reflow
    pathEl.style.animation = 'drawLine 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards';
    fillEl.style.animation = 'fillFadeIn 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards';
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

function generateSplinePath(history) {
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
  const startY = 32; // Y offset 

  const points = dataPoints.map((point, i) => {
    const p = parseFloat(point.price);
    let normalized = (p - minPrice) / range;
    
    if (maxPrice === minPrice) {
      normalized = 0.5; // Perfectly centered if entirely stagnant
    }
    
    const x = i * (width / (dataPoints.length - 1));
    const y = startY - (normalized * height);
    return { x, y };
  });

  let dPath = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  
  // Create bezier curve control points for smooth fluid lines (Spline)
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    
    // 0.4 provides a beautiful, modern smooth curve without sharp zig-zags
    const cp1x = p0.x + (p1.x - p0.x) * 0.4;
    const cp1y = p0.y;
    const cp2x = p0.x + (p1.x - p0.x) * 0.6;
    const cp2y = p1.y;

    dPath += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
  }
  
  return dPath;
}

// UI Interaction Logic
document.addEventListener('DOMContentLoaded', () => {
    const tabGold = document.getElementById('tab-gold');
    const tabSilver = document.getElementById('tab-silver');
    const tabIndicator = document.getElementById('tab-indicator');
    const goldSection = document.getElementById('gold-section');
    const silverSection = document.getElementById('silver-section');

    if(tabGold && tabSilver && goldSection && silverSection && tabIndicator) {
        tabGold.addEventListener('click', () => {
            tabIndicator.style.transform = 'translateX(0)';
            
            tabGold.classList.add('text-white');
            tabGold.classList.remove('text-slate-500');
            
            tabSilver.classList.remove('text-white');
            tabSilver.classList.add('text-slate-500');

            silverSection.classList.replace('opacity-100', 'opacity-0');
            silverSection.classList.replace('translate-x-0', 'translate-x-4');
            
            setTimeout(() => {
                silverSection.classList.add('hidden');
                goldSection.classList.remove('hidden');
                
                // Trigger reflow for animation
                void goldSection.offsetWidth;
                
                goldSection.classList.replace('opacity-0', 'opacity-100');
                goldSection.classList.replace('-translate-x-4', 'translate-x-0');
                goldSection.classList.replace('translate-x-4', 'translate-x-0'); // Just in case
            }, 300);
        });

        tabSilver.addEventListener('click', () => {
            tabIndicator.style.transform = 'translateX(100%)';
            
            tabSilver.classList.add('text-white');
            tabSilver.classList.remove('text-slate-500');
            
            tabGold.classList.remove('text-white');
            tabGold.classList.add('text-slate-500');

            goldSection.classList.replace('opacity-100', 'opacity-0');
            goldSection.classList.replace('translate-x-0', '-translate-x-4');
            
            setTimeout(() => {
                goldSection.classList.add('hidden');
                silverSection.classList.remove('hidden');
                
                // Trigger reflow for animation
                void silverSection.offsetWidth;
                
                silverSection.classList.replace('opacity-0', 'opacity-100');
                silverSection.classList.replace('translate-x-4', 'translate-x-0');
                silverSection.classList.replace('-translate-x-4', 'translate-x-0'); // Just in case
            }, 300);
        });
    }
});

initSupabase();
