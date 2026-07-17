import { createClient } from '@supabase/supabase-js';
import './native-bridge.js';

/*============================================================
   CONFIG — fill these in to go live. Leave SUPABASE_URL blank
   to keep running in demo mode with simulated data.
   ============================================================

   Expected row shape from your Supabase table — one row per tick,
   identified by product_key so it maps straight to a card:
     { product_key: 'gold-24k-995-1kg', price: number, created_at: timestamptz }

   The 9 product_key values this page listens for are exactly the
   card ids below (minus the "card-" prefix). If your OCR pipeline
   uses different keys, edit PRODUCT_KEY_MAP to translate them.
   ============================================================ */
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const TABLE_NAME         = "bullion_rates";

const PRODUCT_KEY_MAP = {
  'gold_995_100gms': 'gold-24k-100g',
  'silver_999_1kg': 'silver-999-1kg'
};

let settingsState = {
  use_gold_override: false,
  override_gold: 0,
  use_silver_override: false,
  override_silver: 0
};

let isMarketOpen = true;

const derivedGoldItems = [
    { id: 'gold-22k-10g', multiplier: 0.955 },
    { id: 'gold-20k-10g', multiplier: 0.87 },
    { id: 'gold-18k-10g', multiplier: 0.795 },
    { id: 'gold-14k-10g', multiplier: 0.625 },
    { id: 'gold-9k-10g', multiplier: 0.42 }
];

function calculateBaseNumber(price24k) {
    const rawBase = (parseFloat(price24k) * 100 / 103 / 99.50) * 100;
    return Math.round(rawBase); 
}

function calculateDerivedPrice(baseNumber, multiplier) {
    const raw = baseNumber * multiplier;
    return Math.round(raw); 
}

/* ---------- Card catalog — order matches what you asked for ---------- */
const CARDS = [
  { id:'gold-24k-995-1kg', size:'big',   metal:'gold',   name:'GOLD 1 KG 995',    hideSub:true, unitBeside:'(/10g)',  base: 7320000, jitter:0.0009, mark:'24' },
  { id:'gold-24k-100g',    size:'big',   metal:'gold',   name:'GOLD 100GMS 995', hideSub:true, unitBeside:'(/10 g)', base: 734500,  jitter:0.0011, mark:'24' },
  { id:'gold-22k-10g',     size:'small', metal:'gold',   name:'Gold 22K', sub:'/10 GM', unitBeside:'(/10 g)', base: 67350, jitter:0.0013, mark:'22' },
  { id:'gold-20k-10g',     size:'small', metal:'gold',   name:'Gold 20K', sub:'/10 GM', unitBeside:'(/10 g)', base: 61210, jitter:0.0013, mark:'20' },
  { id:'gold-18k-10g',     size:'small', metal:'gold',   name:'Gold 18K', sub:'/10 GM', unitBeside:'(/10 g)', base: 55130, jitter:0.0013, mark:'18' },
  { id:'gold-14k-10g',     size:'small', metal:'gold',   name:'Gold 14K', sub:'/10 GM', unitBeside:'(/10 g)', base: 42850, jitter:0.0013, mark:'14' },
  { id:'gold-9k-10g',      size:'small', metal:'gold',   name:'Gold 9K',  sub:'/10 GM', unitBeside:'(/10 g)', base: 27540, jitter:0.0013, mark:'9' },
  { id:'silver-999-1kg',   size:'big',   metal:'silver', name:'SILVER 1 KG 999', hideSub:true, unitBeside:'(/1 kg)', base: 92300,  jitter:0.0016, mark:'999' },
  { id:'silver-999-3kg',   size:'big',   metal:'silver', name:'SILVER 3 KG 999', hideSub:true, unitBeside:'(/1 kg)', base: 276500, jitter:0.0016, mark:'999' },
];

// karat-accurate tint — purer gold reads brighter/richer, lower karat
// (more alloy) reads paler and rosier, same idea real hallmark charts use
const KARAT_COLOR = {
  'gold-24k-995-1kg': ['#f6d989','#c9992e'],
  'gold-24k-100g':    ['#f6d989','#c9992e'],
  'gold-22k-10g':     ['#eecd80','#bb8f31'],
  'gold-20k-10g':     ['#e4c589','#aa8639'],
  'gold-18k-10g':     ['#d9bd90','#977f4c'],
  'gold-14k-10g':     ['#cdb392','#8b7856'],
  'gold-9k-10g':      ['#c3a68f','#7d6452'],
  'silver-999-1kg':   ['#f2f4f6','#9aa2ab'],
  'silver-999-3kg':   ['#f2f4f6','#9aa2ab'],
};

let isInitialLoading = false;
const state = {};
CARDS.forEach(c => state[c.id] = { history: [], shown: c.base, lastTs: null, base: c.base, jitter: c.jitter, animFrame: null });

const els = {
  marketDot: document.getElementById('marketDot'),
  marketText: document.getElementById('marketText'),
  feedDot: document.getElementById('feedDot'),
  feedText: document.getElementById('feedText'),
  clock: document.getElementById('clock'),
  tickerTrack: document.getElementById('tickerTrack'),
};

function buildTicker(){
  if (!els.tickerTrack) return;
  els.tickerTrack.innerHTML = '';
  // Build first set
  CARDS.forEach(cfg => {
    const el = document.createElement('div');
    el.className = 'tick-item';
    el.id = 'tick-' + cfg.id;
    el.innerHTML = `<span class="tick-sep">◆</span><b>${cfg.name.toUpperCase()}</b> <span class="price-val">—</span> <span class="chg">—</span>`;
    els.tickerTrack.appendChild(el);
  });
  // Build duplicate set for seamless infinite scroll
  CARDS.forEach(cfg => {
    const el = document.createElement('div');
    el.className = 'tick-item';
    el.id = 'tick-dup-' + cfg.id;
    el.innerHTML = `<span class="tick-sep">◆</span><b>${cfg.name.toUpperCase()}</b> <span class="price-val">—</span> <span class="chg">—</span>`;
    els.tickerTrack.appendChild(el);
  });
}
buildTicker();

function fmtINR(n){ return Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 }); }
function timeAgo(ts){
  const s = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (s < 5) return 'just now';
  if (s < 60) return s + 's ago';
  const m = Math.floor(s/60);
  if (m < 60) return m + 'm ago';
  return Math.floor(m/60) + 'h ago';
}

/* ---------- Build card DOM once ---------- */
function buildCard(cfg){
  const root = document.getElementById('card-' + cfg.id);
  const [c1, c2] = KARAT_COLOR[cfg.id] || ['#e9c774','#a8792f'];
  root.style.setProperty('--c1', c1);
  root.style.setProperty('--c2', c2);

  const readyBadge = cfg.ready ? `<span class="badge-ready">READY</span>` : '';

  const unitSpan = cfg.unitBeside ? `<span class="price-unit">${cfg.unitBeside}</span>` : '';

  if (cfg.size === 'big'){
    root.innerHTML = `
      <div class="card-content">
        <div class="card-top">
          <div>
            <p class="card-name"><span class="swatch"></span><span class="name-text">${cfg.name}</span></p>
            ${cfg.hideSub ? '' : `<p class="card-sub">${cfg.sub}${readyBadge}</p>`}
          </div>
        </div>
        <div class="card-divider"></div>
        <div class="price-row">
          <div class="price" id="price-${cfg.id}"><span class="currency">₹</span>—</div>
          ${unitSpan}
          <div class="delta up" id="delta-${cfg.id}">+0.00%</div>
        </div>
        <svg class="spark" id="spark-${cfg.id}" viewBox="0 0 300 46" width="100%" height="46" preserveAspectRatio="none"></svg>
        <div class="sub-row">
          <div class="updated"><span class="dot"></span><span id="updated-${cfg.id}">—</span></div>
        </div>
      </div>`;
  } else {
    root.innerHTML = `
      <div class="card-content">
        <p class="card-name"><span class="swatch"></span><span class="name-text">${cfg.name}</span></p>
        ${cfg.hideSub ? '' : `<p class="card-sub">${cfg.sub}</p>`}
        <div class="price-row">
          <div class="price" id="price-${cfg.id}"><span class="currency">₹</span>—</div>
          ${unitSpan}
        </div>
        <div class="sub-row">
          <div class="delta up" id="delta-${cfg.id}">+0.00%</div>
          <div class="updated"><span class="dot"></span><span id="updated-${cfg.id}">—</span></div>
        </div>
      </div>`;
  }
}
CARDS.forEach(buildCard);

function animateNumber(el, from, to, stateObj, duration=500){
  if (stateObj.animFrame) cancelAnimationFrame(stateObj.animFrame);
  const start = performance.now();
  const ease = t => 1 - Math.pow(1 - t, 3);
  function frame(now){
    const t = Math.min(1, (now - start) / duration);
    const val = from + (to - from) * ease(t);
    el.innerHTML = `<span class="currency">₹</span>${fmtINR(Math.round(val))}`;
    if (t < 1) {
      stateObj.animFrame = requestAnimationFrame(frame);
    } else {
      stateObj.animFrame = null;
    }
  }
  stateObj.animFrame = requestAnimationFrame(frame);
}
function drawSpark(svg, values, color){
  if (!svg || values.length < 2) { if(svg) svg.innerHTML=''; return; }
  const w = 300, h = 46, pad = 3;
  const min = Math.min(...values), max = Math.max(...values);
  const range = (max - min) || 1;
  const step = (w - pad*2) / (values.length - 1);
  const pts = values.map((v,i) => [pad + i*step, h - pad - ((v - min) / range) * (h - pad*2)]);
  const line = pts.map((p,i) => (i===0?'M':'L') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  const area = line + ` L${pts[pts.length-1][0].toFixed(1)},${h} L${pts[0][0].toFixed(1)},${h} Z`;
  const gid = 'g' + Math.random().toString(36).slice(2,8);
  svg.innerHTML = `
    <defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${color}" stop-opacity="0.32"/>
      <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
    </linearGradient></defs>
    <path d="${area}" fill="url(#${gid})" stroke="none"/>
    <path d="${line}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;
}
function flashSheen(id){
  const root = document.getElementById('card-' + id);
  root.classList.remove('sheen');
  void root.offsetWidth;
  root.classList.add('sheen');
}
function updateTicker(cfg, price, change){
  const cls = change > 0 ? 'up' : (change < 0 ? 'down' : 'neutral');
  const arrow = change > 0 ? '▲' : (change < 0 ? '▼' : '');
  const changeText = `${arrow} ${Math.abs(change).toFixed(2)}%`;
  const priceText = `₹${fmtINR(price)}`;

  const ids = ['tick-' + cfg.id, 'tick-dup-' + cfg.id];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      const priceValEl = el.querySelector('.price-val');
      if (priceValEl) priceValEl.textContent = priceText;
      const chgEl = el.querySelector('.chg');
      if (chgEl) {
        chgEl.className = 'chg ' + cls;
        chgEl.textContent = changeText;
      }
    }
  });
}

function updateCard(cfg){
  const s = state[cfg.id];
  const hist = s.history;
  if (!hist.length) return;
  const last = hist[hist.length - 1];
  const prev = hist.length > 1 ? hist[hist.length - 2] : last;

  const first = hist[0];
  const change = first ? ((last - first) / first) * 100 : 0;

  const priceEl = document.getElementById('price-' + cfg.id);
  if (isInitialLoading) {
    priceEl.innerHTML = `<span class="currency">₹</span>${fmtINR(last)}`;
    s.shown = last;
    if (s.animFrame) {
      cancelAnimationFrame(s.animFrame);
      s.animFrame = null;
    }
  } else {
    animateNumber(priceEl, s.shown, last, s);
    s.shown = last;
  }

  if (isInitialLoading) {
    priceEl.classList.remove('up', 'down');
    priceEl.classList.add('neutral');
  } else if (last !== prev) {
    priceEl.classList.remove('up', 'down', 'neutral');
    void priceEl.offsetWidth; // Force reflow to restart animation
    if (last > prev) priceEl.classList.add('up');
    else if (last < prev) priceEl.classList.add('down');
  }

  const deltaEl = document.getElementById('delta-' + cfg.id);
  deltaEl.textContent = (change > 0 ? '+' : '') + change.toFixed(2) + '%';
  deltaEl.classList.remove('up', 'down', 'neutral');
  if (change > 0) deltaEl.classList.add('up');
  else if (change < 0) deltaEl.classList.add('down');
  else deltaEl.classList.add('neutral');

  document.getElementById('updated-' + cfg.id).textContent = 'updated ' + timeAgo(s.lastTs || Date.now());

  if (cfg.size === 'big'){
    const color = cfg.metal === 'gold' ? '#e3b64f' : '#c7cdd3';
    drawSpark(document.getElementById('spark-' + cfg.id), hist.slice(-24), color);
  }
  if (!isInitialLoading) {
    flashSheen(cfg.id);
  }
  updateTicker(cfg, last, change);
}

function handleRow(row){
  if (!row || isNaN(Number(row.price)) || Number(row.price) <= 0) return;
  const dbItem = row.item || row.product_key;
  
  let price = Number(row.price);
  
  // Apply random visual jitter if manual overrides are active
  if (dbItem === 'gold_995_100gms' && settingsState.use_gold_override) {
      const randomOffset = Math.floor(Math.random() * 26) - 5;
      price = price + randomOffset;
  }
  
  if (dbItem === 'silver_999_1kg' && settingsState.use_silver_override) {
      const randomOffset = Math.floor(Math.random() * 26) - 5;
      price = price + randomOffset;
  }

  const key = PRODUCT_KEY_MAP[dbItem] || dbItem;
  const s = state[key];
  const cfg = CARDS.find(c => c.id === key);
  
  if (!s || !cfg) {
      // If we don't have a state for it natively, maybe it's the raw item waiting to be derived
      if (dbItem === 'gold_995_100gms' || dbItem === 'silver_999_1kg') {
          // Proceed to logic magic below
      } else {
          return;
      }
  } else {
      s.history.push(price);
      s.lastTs = row.created_at ? new Date(row.created_at).getTime() : Date.now();
      updateCard(cfg);
  }

  // Derived Logic Magic
  if (dbItem === 'gold_995_100gms') {
      const baseNumber = calculateBaseNumber(price);
      
      // Calculate 1 KG 24K (which is 100gms price - 50)
      const kgPrice = price - 50;
      handleRow({ item: 'gold-24k-995-1kg', price: kgPrice, created_at: row.created_at });
      
      // Calculate the derived Karats (which are per 10g, so we divide by 10)
      derivedGoldItems.forEach(derived => {
          const finalPrice = calculateDerivedPrice(baseNumber, derived.multiplier) / 10;
          handleRow({ item: derived.id, price: finalPrice, created_at: row.created_at });
      });
  }

  if (dbItem === 'silver_999_1kg') {
      const derivedId = 'silver-999-3kg';
      handleRow({ item: derivedId, price: price - 200, created_at: row.created_at });
  }
}

let globalSupabase = null;

function setMarketActiveState(isActive, reason = 'default') {
  isMarketOpen = isActive;
  const overlay = document.getElementById('marketClosedOverlay');
  if (overlay) {
    if (isActive) {
      overlay.classList.add('hidden');
      document.body.classList.remove('no-scroll');
    } else {
      overlay.classList.remove('hidden');
      document.body.classList.add('no-scroll');
      
      const iconEl = document.getElementById('marketClosedIcon');
      const titleEl = document.getElementById('marketClosedTitle');
      const descEl = document.getElementById('marketClosedDesc');
      
      if (titleEl && descEl && iconEl) {
        if (reason === 'good_night') {
          iconEl.innerHTML = `<span style="font-size: 48px; line-height: 1;">🌙</span>`;
          iconEl.style.background = 'transparent';
          iconEl.style.border = 'none';
          titleEl.textContent = 'Good Night!';
          descEl.textContent = "The day's trading has ended , rest well and we'll resume streaming fresh live rates tomorrow morning. Have a pleasant night!";
        } else {
          iconEl.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`;
          iconEl.style.background = 'rgba(255, 255, 255, 0.03)';
          iconEl.style.border = '1px solid rgba(255, 255, 255, 0.1)';
          titleEl.textContent = 'Market Closed';
          descEl.textContent = 'Live rate streaming is currently paused. Please check back later.';
        }
      }
    }
  }
}

/* ---------- Live mode ---------- */
async function goLive(){
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  globalSupabase = client;
  
  // Listen for the native bridge event when the app opens
  window.addEventListener('medianAppOpened', async (e) => {
    if (e.detail && e.detail.playerId) {
      console.log("[Supabase] Logging app open for user:", e.detail.playerId);
      const { error } = await client
        .from('app_opens')
        .insert([{ 
            player_id: e.detail.playerId, 
            greeting_type: e.detail.greeting || 'Welcome' 
        }]);
      if (error) {
        console.error("[Supabase] Failed to log app open:", error);
      }
    }
  });

  els.feedDot.className = 'status-dot';
  els.feedText.textContent = 'Loading…';

  // Fetch initial market active state, reason, and override settings
  const { data: settings } = await client
    .from('bullion_settings')
    .select('is_active, market_closed_reason, use_gold_override, override_gold, use_silver_override, override_silver')
    .eq('id', 1)
    .single();
    
  if (settings) {
    setMarketActiveState(settings.is_active, settings.market_closed_reason);
    settingsState.use_gold_override = !!settings.use_gold_override;
    settingsState.override_gold = Number(settings.override_gold || 0);
    settingsState.use_silver_override = !!settings.use_silver_override;
    settingsState.override_silver = Number(settings.override_silver || 0);
  }

  const { data, error } = await client
    .from(TABLE_NAME).select('*').order('created_at', { ascending: false }).limit(400);
    
  if (error) throw error;
  if (!data || data.length === 0) throw new Error("Empty database response");

  isInitialLoading = true;
  data.reverse().forEach(handleRow);
  isInitialLoading = false;

  els.feedDot.className = 'status-dot live';
  els.feedText.textContent = 'Live';

  // Listen to rates
  client.channel('bullion-rates-stream')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: TABLE_NAME }, payload => {
        if (payload && payload.new) {
            const dbItem = payload.new.item || payload.new.product_key;
            if (dbItem === 'gold_995_100gms' && settingsState.use_gold_override) return;
            if (dbItem === 'silver_999_1kg' && settingsState.use_silver_override) return;
            handleRow(payload.new);
        }
    })
    .subscribe();

  // Listen to Market Closed toggle, reason, and override setting updates
  client.channel('market-closed-stream')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'bullion_settings', filter: 'id=eq.1' }, payload => {
        if (payload && payload.new) {
            setMarketActiveState(payload.new.is_active, payload.new.market_closed_reason);
            settingsState.use_gold_override = !!payload.new.use_gold_override;
            settingsState.override_gold = Number(payload.new.override_gold || 0);
            settingsState.use_silver_override = !!payload.new.use_silver_override;
            settingsState.override_silver = Number(payload.new.override_silver || 0);
        }
    })
    .subscribe();

  // Run a client-side interval every 3 seconds to apply visual price fluctuations (jitter) if overrides are active
  setInterval(() => {
    if (!isMarketOpen) return;
    if (settingsState.use_gold_override && settingsState.override_gold > 0) {
      handleRow({ product_key: 'gold_995_100gms', price: settingsState.override_gold, created_at: new Date().toISOString() });
    }
    if (settingsState.use_silver_override && settingsState.override_silver > 0) {
      handleRow({ product_key: 'silver_999_1kg', price: settingsState.override_silver, created_at: new Date().toISOString() });
    }
  }, 3000);
}

/* ---------- Demo mode ---------- */
function goDemo(){
  els.feedDot.className = 'status-dot demo';
  els.feedText.textContent = 'Demo';

  const live = {};
  CARDS.forEach(c => live[c.id] = c.base);

  function tick(){
    CARDS.forEach(c => {
      const s = state[c.id];
      live[c.id] = Math.max(1, live[c.id] * (1 + (Math.random() - 0.49) * s.jitter));
      handleRow({ product_key: c.id, price: Math.round(live[c.id]), created_at: new Date().toISOString() });
    });
  }
  tick();
  setInterval(tick, 3200);
}

function updateMarketStatus(){
  const hourIST = Number(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata', hour: 'numeric', hour12: false }));
  const open = hourIST >= 9 && hourIST < 23.5;
  els.marketDot.className = 'status-dot ' + (open ? 'open' : 'closed');
  els.marketText.textContent = 'Market ' + (open ? 'open' : 'closed');
}
function tickClock(){
  const now = new Date();
  els.clock.textContent = now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) + ' IST';
  updateMarketStatus();
}
tickClock();
setInterval(tickClock, 1000 * 30);

if (SUPABASE_URL && SUPABASE_ANON_KEY){
  goLive().catch(err => { console.error('Supabase connection failed, falling back to demo:', err); goDemo(); });
} else {
  goDemo();
}

/* ---------- Splash screen: trust / loyalty / security background ---------- */
const TRUST_ICONS = [
  // shield-check — security
  '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/></svg>',
  // handshake — loyalty
  '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12l4-4 4 2 3-3 4 4-3 3-3-1-3 3z"/><path d="M13 13l3 3M16 10l4 4-3 3"/></svg>',
  // padlock — security
  '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>',
  // laurel/medal — trust
  '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M9 12.5L7 21l5-2.5L17 21l-2-8.5"/></svg>',
  // check-badge — trust
  '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 14.3l-4.8 2.6.9-5.4L4.2 7.7l5.4-.8z"/><path d="M9.5 8.5l1.7 1.7 3.3-3.3"/></svg>',
  // key — security / access
  '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="15" r="4"/><path d="M10 12l9-9M16 6l2.5-2.5M18.5 8.5L21 6"/></svg>',
];
(function buildSplashIcons(){
  const grid = document.getElementById('splashIcons');
  if (!grid) return;
  const rows = 7, cols = 6;
  let html = '';
  for (let i = 0; i < rows * cols; i++){
    html += `<div>${TRUST_ICONS[i % TRUST_ICONS.length]}</div>`;
  }
  grid.innerHTML = html;
})();

function dismissSplash(){
  const splash = document.getElementById('splash');
  if (splash) splash.classList.add('hide');
}
window.addEventListener('load', () => { setTimeout(dismissSplash, 2000); });
document.getElementById('splash')?.addEventListener('click', dismissSplash);

/* ---------- Bottom nav / screen switching ---------- */
const SCREEN_IDS = ['markets', 'calculator', 'profile', 'services'];

function updateNavIndicator(name) {
  const btn = document.querySelector(`.nav-item[data-nav="${name}"]`);
  const indicator = document.getElementById('navIndicator');
  const navContainer = document.getElementById('bottomNav');
  if (btn && indicator && navContainer) {
    const btnRect = btn.getBoundingClientRect();
    const navRect = navContainer.getBoundingClientRect();
    const leftPos = btnRect.left - navRect.left;
    indicator.style.width = `${btn.offsetWidth}px`;
    indicator.style.transform = `translateX(${leftPos}px)`;
  }
}

function showScreen(name){
  if (!SCREEN_IDS.includes(name)) return; // unregistered tabs (e.g. intelligence) have no screen yet
  SCREEN_IDS.forEach(id => {
    document.getElementById('screen-' + id)?.classList.toggle('active', id === name);
  });
  document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.nav === name));
  
  updateNavIndicator(name);
  
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  
  if (name === 'services') {
    loadServices();
  }
}

// Ensure the indicator is placed correctly on load and resize
window.addEventListener('load', () => {
  setTimeout(() => updateNavIndicator('markets'), 50);
});
window.addEventListener('resize', () => {
  const activeTab = document.querySelector('.nav-item.active');
  if (activeTab) updateNavIndicator(activeTab.dataset.nav);
});

async function loadServices() {
  const container = document.getElementById('servicesContainer');
  if (!container) return;
  
  if (!globalSupabase) {
    container.innerHTML = `<div style="text-align:center; padding:40px 20px; color:var(--muted); font-family:'IBM Plex Mono', monospace; font-size:12px;">Database connection not established.</div>`;
    return;
  }

  try {
    const { data, error } = await globalSupabase
      .from('services_directory')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    if (!data || data.length === 0) {
      container.innerHTML = `<div style="text-align:center; padding:40px 20px; color:var(--muted); font-family:'IBM Plex Mono', monospace; font-size:12px;">No services currently available.</div>`;
      return;
    }

    let html = '';
    data.forEach(service => {
      // Remove any non-numeric characters for the href tel/wa links
      const cleanNum = service.mobile_number.replace(/\D/g, '');
      
      html += `
        <div class="service-card">
          <div class="service-header">
            <h3 class="service-name">${service.name}</h3>
            <span class="service-type">${service.work_type}</span>
          </div>
          <div class="service-details">
            <span>📍 ${service.address}</span>
            <span>📞 ${service.mobile_number}</span>
          </div>
          <div class="service-actions">
            <a href="tel:+${cleanNum}" class="service-btn call">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              Call
            </a>
            <a href="https://wa.me/${cleanNum}" target="_blank" class="service-btn whatsapp">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
              WhatsApp
            </a>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;
  } catch (err) {
    console.error("Error loading services:", err);
    container.innerHTML = `<div style="text-align:center; padding:40px 20px; color:var(--down); font-family:'IBM Plex Mono', monospace; font-size:12px;">Failed to load services.</div>`;
  }
}

document.getElementById('bottomNav')?.addEventListener('click', (e) => {
  const btn = e.target.closest('.nav-item');
  if (!btn) return;
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  showScreen(btn.dataset.nav);
});

document.querySelectorAll('.back-btn[data-nav]').forEach(btn => {
  btn.addEventListener('click', () => showScreen(btn.dataset.nav));
});

/* ---------- Calculator screen: mode switch (Basic / GST-Weight) ---------- */
document.getElementById('calcModeToggle')?.addEventListener('click', (e) => {
  const btn = e.target.closest('.metal-btn');
  if (!btn) return;
  const mode = btn.dataset.mode;
  document.querySelectorAll('#calcModeToggle .metal-btn').forEach(b => b.classList.toggle('active', b === btn));
  document.getElementById('calcModeBasic').style.display = mode === 'basic' ? 'block' : 'none';
  document.getElementById('calcModeGst').style.display   = mode === 'gst'   ? 'block' : 'none';
});

/* ---------- Basic calculator ---------- */
(function(){
  const exprEl = document.getElementById('basicExpr');
  const resultEl = document.getElementById('basicResult');
  const OPS = { '+':'+', '-':'−', '*':'×', '/':'÷' };

  let acc = null;        // running total
  let pendingOp = null;  // '+', '-', '*', '/'
  let current = '0';     // string being typed
  let overwrite = true;  // next digit replaces current display

  function formatNum(n){
    if (!isFinite(n)) return 'Error';
    // trim to avoid long float noise, keep up to 8 decimal places
    const rounded = Math.round(n * 1e8) / 1e8;
    return rounded.toString();
  }

  function render(){
    resultEl.textContent = current;
    exprEl.textContent = acc !== null && pendingOp
      ? `${formatNum(acc)} ${OPS[pendingOp]}`
      : '\u00A0';
  }

  function inputDigit(d){
    if (overwrite){ current = d === '.' ? '0.' : d; overwrite = false; return; }
    if (d === '.' && current.includes('.')) return;
    if (current === '0' && d !== '.') { current = d; return; }
    current += d;
  }

  function compute(a, op, b){
    switch(op){
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b === 0 ? NaN : a / b;
      default: return b;
    }
  }

  function chooseOp(op){
    const val = parseFloat(current);
    if (acc === null){
      acc = val;
    } else if (!overwrite){
      acc = compute(acc, pendingOp, val);
    }
    pendingOp = op;
    overwrite = true;
    current = formatNum(acc);
  }

  function equals(){
    if (pendingOp === null) return;
    const val = parseFloat(current);
    acc = compute(acc, pendingOp, val);
    current = formatNum(acc);
    pendingOp = null;
    overwrite = true;
  }

  function clearAll(){
    acc = null; pendingOp = null; current = '0'; overwrite = true;
  }

  function backspace(){
    if (overwrite) return;
    current = current.length > 1 ? current.slice(0, -1) : '0';
    if (current === '' || current === '-') current = '0';
  }

  function percent(){
    const val = parseFloat(current);
    current = formatNum(val / 100);
    overwrite = false;
  }

  document.getElementById('basicKeys')?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-key]');
    if (!btn) return;
    const key = btn.dataset.key;
    if (key === 'clear') clearAll();
    else if (key === 'back') backspace();
    else if (key === '%') percent();
    else if (key === '=') equals();
    else if (['+','-','*','/'].includes(key)) chooseOp(key);
    else inputDigit(key);
    render();
  });

  render();
})();

/* ---------- GST / Weight calculator ---------- */
let gstMode = 'add';        // 'add' or 'deduct'
let gstDirection = 'forward'; // 'forward' (rate->value) or 'reverse' (value->rate)

const GST_NOTES = {
  forward: 'Enter the price per 10g, add or deduct GST, then enter the weight to get the total price. For reference only, not a purchase quote.',
  reverse: 'Enter the weight and total value, choose add or deduct GST, to back-calculate the price per 10g. For reference only, not a purchase quote.'
};

function runGstForward(){
  const price10g = Math.max(0, Number(document.getElementById('gstPrice10g').value) || 0);
  const gstPercent = Math.max(0, Number(document.getElementById('gstPercent').value) || 0);
  const weight = Math.max(0, Number(document.getElementById('gstWeight').value) || 0);

  const gstAmount10g = price10g * gstPercent / 100;
  const adjusted10g = gstMode === 'add' ? price10g + gstAmount10g : price10g - gstAmount10g;
  const ratePerGram = adjusted10g / 10;
  const total = ratePerGram * weight;

  document.getElementById('gstRateText').textContent =
    '₹' + fmtINR(Math.round(adjusted10g)) + ' /10g (₹' + fmtINR(Math.round(ratePerGram)) + ' /gram)';
  document.getElementById('gstResult').textContent = '₹' + fmtINR(Math.round(total));
}

function runGstReverse(){
  const weight = Math.max(0, Number(document.getElementById('gstWeightRev').value) || 0);
  const total = Math.max(0, Number(document.getElementById('gstTotalRev').value) || 0);
  const gstPercent = Math.max(0, Number(document.getElementById('gstPercent').value) || 0);

  const billedRateEl = document.getElementById('gstBilledRateText');
  const resultEl = document.getElementById('gstRevResult');

  if (weight === 0){
    billedRateEl.textContent = '—';
    resultEl.textContent = '₹0';
    return;
  }

  // rate implied by what was actually billed (total / weight), scaled to per-10g
  const billedRatePerTen = (total / weight) * 10;

  // reverse the same add/deduct GST math the forward mode uses
  const factor = gstMode === 'add' ? (1 + gstPercent / 100) : (1 - gstPercent / 100);
  const basePricePerTen = factor !== 0 ? billedRatePerTen / factor : 0;
  const basePricePerGram = basePricePerTen / 10;

  billedRateEl.textContent =
    '₹' + fmtINR(Math.round(billedRatePerTen)) + ' /10g (₹' + fmtINR(Math.round(billedRatePerTen / 10)) + ' /gram)';
  resultEl.textContent =
    '₹' + fmtINR(Math.round(basePricePerTen)) + ' /10g (₹' + fmtINR(Math.round(basePricePerGram)) + ' /gram)';
}

function runGstCalc(){
  if (gstDirection === 'forward') runGstForward();
  else runGstReverse();
}

document.getElementById('gstDirToggle')?.addEventListener('click', (e) => {
  const btn = e.target.closest('.metal-btn');
  if (!btn) return;
  gstDirection = btn.dataset.dir;
  document.querySelectorAll('#gstDirToggle .metal-btn').forEach(b => b.classList.toggle('active', b === btn));
  document.getElementById('gstForwardFields').style.display = gstDirection === 'forward' ? 'block' : 'none';
  document.getElementById('gstReverseFields').style.display = gstDirection === 'reverse' ? 'block' : 'none';
  document.getElementById('gstNote').textContent = GST_NOTES[gstDirection];
  runGstCalc();
});

document.getElementById('gstModeToggle')?.addEventListener('click', (e) => {
  const btn = e.target.closest('.metal-btn');
  if (!btn) return;
  gstMode = btn.dataset.gst;
  document.querySelectorAll('#gstModeToggle .metal-btn').forEach(b => b.classList.toggle('active', b === btn));
  runGstCalc();
});
['gstPrice10g','gstPercent','gstWeight'].forEach(id => {
  document.getElementById(id)?.addEventListener('input', runGstCalc);
});
['gstWeightRev','gstTotalRev'].forEach(id => {
  document.getElementById(id)?.addEventListener('input', runGstCalc);
});
runGstCalc();

// =========================================================
// START APP: Check for credentials and connect
// =========================================================
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  goLive().catch(err => { 
      console.error('Supabase connection failed, falling back to demo:', err); 
      goDemo(); 
  });
} else {
  console.warn("No Supabase credentials found. Falling back to Demo mode.");
  goDemo();
}