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
    'gold_995_100gms': { price: 'gold-price' },
    'gold_22k': { price: 'gold-22k-price' },
    'gold_20k': { price: 'gold-20k-price' },
    'gold_18k': { price: 'gold-18k-price' },
    'gold_14k': { price: 'gold-14k-price' },
    'gold_9k':  { price: 'gold-9k-price' },
    'silver_999_1kg':  { price: 'silver-price' }
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
  if (priceEl) {
    priceEl.textContent = '₹' + formattedPrice;
    
    // Dynamic text color for 24K Gold card
    if (item === 'gold_995_100gms' && history.length > 1) {
        const currentVal = parseFloat(current.price);
        const prevVal = parseFloat(history[history.length - 2].price);
        
        priceEl.classList.remove('text-brand-blue', 'text-green-500', 'text-red-500', 'text-[#2563eb]', 'text-[#16a34a]', 'text-[#dc2626]');
        
        if (currentVal > prevVal) {
            priceEl.classList.add('text-green-500');
        } else if (currentVal < prevVal) {
            priceEl.classList.add('text-red-500');
        } else {
            priceEl.classList.add('text-brand-blue');
        }
    }
  }
  
  if (['gold_22k', 'gold_20k', 'gold_18k', 'gold_14k', 'gold_9k'].includes(item)) {
    updateJaggedGraph(item, history);
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

const graphState = {};

function updateJaggedGraph(item, history) {
  let dataPoints = history;
  if (!dataPoints || dataPoints.length === 0) {
      dataPoints = [{price: 100}, {price: 100}];
  } else if (dataPoints.length === 1) {
      dataPoints = [history[0], history[0]];
  } else {
      // Use up to the last 15 data points for a detailed sparkline
      dataPoints = history.slice(-15);
  }

  const map = domMap[item];
  if (!map) return;
  
  const pathEl = document.getElementById(`${item.replace('_', '-')}-sparkline-path`);
  const fillEl = document.getElementById(`${item.replace('_', '-')}-sparkline-fill`);
  const dotEl = document.getElementById(`${item.replace('_', '-')}-sparkline-dot`);
  if (!pathEl || !fillEl || !dotEl) return;

  const prices = dataPoints.map(r => parseFloat(r.price));
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const range = maxPrice - minPrice || 1; 
  const isStagnant = (maxPrice === minPrice);

  const points = dataPoints.map((point, i) => {
    const p = parseFloat(point.price);
    let normalized = (p - minPrice) / range;
    if (isStagnant) normalized = 0.5;
    
    // x goes from 0 to 100
    const x = i * (100 / (dataPoints.length - 1));
    // y goes from 90 (bottom) to 40 (top) to keep it in the bottom half of viewBox 100 100
    const y = 90 - (normalized * 50);
    return { x, y };
  });

  let trendColor = '#eab308'; // Default Gold
  let trendGradient = 'url(#gradient-flat)';
  let trendOffset = 0; // Default vertical shift
  
  if (history.length > 1) {
      const currentVal = parseFloat(history[history.length - 1].price);
      const prevVal = parseFloat(history[history.length - 2].price);
      if (currentVal > prevVal) {
          trendColor = '#22c55e'; // Green
          trendGradient = 'url(#gradient-up)';
          trendOffset = -15; // Shift higher up the card
      } else if (currentVal < prevVal) {
          trendColor = '#ef4444'; // Red
          trendGradient = 'url(#gradient-down)';
          trendOffset = 15; // Shift lower down the card
      }
  }

  // Save math to state for the continuous animation loop to consume
  graphState[item] = { points, trendColor, trendGradient, trendOffset };
}

// Continuous Subtle Animation Loop
let waveTime = 0;
function animateJaggedGraphs() {
    waveTime += 0.03; 
    
    ['gold_22k', 'gold_20k', 'gold_18k', 'gold_14k', 'gold_9k'].forEach(item => {
        const state = graphState[item];
        if (!state) return;
        
        const pathEl = document.getElementById(`${item.replace('_', '-')}-sparkline-path`);
        const fillEl = document.getElementById(`${item.replace('_', '-')}-sparkline-fill`);
        const dotEl = document.getElementById(`${item.replace('_', '-')}-sparkline-dot`);
        if (!pathEl || !fillEl || !dotEl) return;
        
        // Continuous breathing effect applied to Y coordinates
        const breathe = Math.sin(waveTime) * 1.5; 
        
        const currentPoints = state.points.map(p => ({
            x: p.x,
            y: p.y + state.trendOffset + breathe 
        }));
        
        let dPath = `M ${currentPoints[0].x.toFixed(1)} ${currentPoints[0].y.toFixed(1)}`;
        for (let i = 1; i < currentPoints.length; i++) {
            dPath += ` L ${currentPoints[i].x.toFixed(1)} ${currentPoints[i].y.toFixed(1)}`;
        }
        
        // Fill path extended safely to bottom of 100px viewBox
        const fillPath = `${dPath} L 100 100 L 0 100 Z`;
        
        pathEl.setAttribute('d', dPath);
        pathEl.setAttribute('stroke', state.trendColor);
        pathEl.style.filter = `drop-shadow(0px 1px 3px ${state.trendColor})`;

        fillEl.setAttribute('d', fillPath);
        fillEl.setAttribute('fill', state.trendGradient);

        const lastPoint = currentPoints[currentPoints.length - 1];
        dotEl.setAttribute('cx', lastPoint.x.toFixed(1));
        dotEl.setAttribute('cy', lastPoint.y.toFixed(1));
        dotEl.setAttribute('fill', state.trendColor);
        dotEl.style.filter = `drop-shadow(0px 1px 4px ${state.trendColor})`;
    });
    
    requestAnimationFrame(animateJaggedGraphs);
}

// UI Interaction Logic
document.addEventListener('DOMContentLoaded', () => {
  // Handle Splash Sequence
  const splashOverlay = document.getElementById('splash-overlay');
  const splashGreeting = document.getElementById('splash-greeting');

  if (splashOverlay) {
      // Set dynamic greeting with two-line layout
      const hour = new Date().getHours();
      let greeting = 'Good Evening';
      if (hour < 12) greeting = 'Good Morning';
      else if (hour < 17) greeting = 'Good Afternoon';
      splashGreeting.innerHTML = `${greeting}<br/><span class="text-4xl sm:text-5xl lg:text-6xl text-brand-blue/90 font-premium tracking-widest drop-shadow-sm mt-2 block">SSR Bullion</span>`;

      // Sequence Timers (Aligning with 7-second CSS Keyframes)
      // The CSS animations automatically fade the elements out by 5.95s (85% of 7s).
      // We start fading the master background at 5.8s to blend smoothly into the app.
      setTimeout(() => {
          splashOverlay.classList.remove('opacity-100');
          splashOverlay.classList.add('opacity-0', 'pointer-events-none');
      }, 5800);

      // Remove the DOM overlay entirely at 7.0s
      setTimeout(() => {
          splashOverlay.remove();
      }, 7000);
  }

  fetchInitialRates();
  requestAnimationFrame(animateJaggedGraphs);
    const tabGold = document.getElementById('tab-gold');
    const tabSilver = document.getElementById('tab-silver');
    const tabIndicator = document.getElementById('tab-indicator');
    const goldSection = document.getElementById('gold-section');
    const silverSection = document.getElementById('silver-section');
    
    // Bottom Navigation Elements
    const navMarkets = document.getElementById('nav-markets');
    const navBank = document.getElementById('nav-bank');
    const navIntelligence = document.getElementById('nav-intelligence');
    const navSecure = document.getElementById('nav-secure');
    
    const screenMarkets = document.getElementById('screen-markets');
    const screenBank = document.getElementById('screen-bank');
    const screenIntelligence = document.getElementById('screen-intelligence');
    const screenSecure = document.getElementById('screen-secure');
    
    // Bottom Nav Routing Logic
    const navButtons = [navMarkets, navBank, navIntelligence, navSecure];
    const navScreens = [screenMarkets, screenBank, screenIntelligence, screenSecure];

    function switchNavScreen(activeButton, activeScreen) {
        // Reset all buttons to inactive state
        navButtons.forEach(btn => {
            if(!btn) return;
            btn.classList.remove('text-brand-blue');
            btn.classList.add('text-slate-800');
            // Remove bold from the text span
            const textSpan = btn.querySelector('span:nth-child(2)');
            if(textSpan) {
                textSpan.classList.remove('font-bold');
                textSpan.classList.add('font-semibold');
            }
        });

        // Set active button state
        if(activeButton) {
            activeButton.classList.remove('text-slate-800');
            activeButton.classList.add('text-brand-blue');
            const textSpan = activeButton.querySelector('span:nth-child(2)');
            if(textSpan) {
                textSpan.classList.remove('font-semibold');
                textSpan.classList.add('font-bold');
            }
        }

        // Hide all screens
        navScreens.forEach(screen => {
            if(screen) screen.classList.add('hidden');
        });

        // Show active screen
        if(activeScreen) {
            activeScreen.classList.remove('hidden');
        }
    }

    if(navMarkets) navMarkets.addEventListener('click', () => switchNavScreen(navMarkets, screenMarkets));
    if(navBank) navBank.addEventListener('click', () => switchNavScreen(navBank, screenBank));
    if(navIntelligence) navIntelligence.addEventListener('click', () => switchNavScreen(navIntelligence, screenIntelligence));
    if(navSecure) navSecure.addEventListener('click', () => switchNavScreen(navSecure, screenSecure));

    // Top Toggle Logic (Gold / Silver)
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
