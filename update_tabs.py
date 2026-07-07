import sys

new_header = """<header class="fixed top-0 w-full z-50 md:w-[calc(100%-280px)] md:left-[280px] bg-white shadow-sm border-b border-outline-variant/20">
<div class="flex items-center justify-center px-container-margin h-20 w-full max-w-7xl mx-auto relative">
<h1 class="font-display-xl text-[24px] md:text-[32px] text-primary tracking-tight font-black uppercase drop-shadow-sm">SSR BULLION</h1>
</div>
</header>"""

new_main = """<main class="pt-28 px-container-margin max-w-7xl mx-auto pb-6">

<!-- Category Toggle -->
<div class="flex justify-center mb-6">
  <div class="flex items-center bg-surface-container rounded-full p-1 shadow-sm border border-outline-variant/20 relative">
    <div id="tab-indicator" class="absolute w-1/2 h-[calc(100%-8px)] top-1 left-1 bg-primary rounded-full shadow-sm transition-all duration-300"></div>
    <button id="tab-gold" class="px-8 py-2 rounded-full text-[14px] font-bold text-white relative z-10 transition-colors duration-300 w-32">Gold</button>
    <button id="tab-silver" class="px-8 py-2 rounded-full text-[14px] font-medium text-on-surface relative z-10 transition-colors duration-300 w-32">Silver</button>
  </div>
</div>

<div id="gold-section" class="space-y-4 w-full transition-opacity duration-300 opacity-100">
<!-- Hero Card (24K) -->
<div class="animate-fade-in-up glass-card p-5 relative overflow-hidden" style="animation-delay: 0.1s;">
<div class="absolute top-0 right-0 p-5 opacity-10 pointer-events-none"><span class="material-symbols-outlined text-[100px] text-primary">diamond</span></div>
<div class="relative z-10 flex flex-col items-center text-center justify-center">
<div>
<div class="flex items-center justify-center gap-2 mb-2"><span class="px-2 py-0.5 rounded bg-primary-container text-on-primary-container font-label-caps text-[10px]">99.99%</span><h3 class="font-headline-md text-[20px] text-on-surface">24K Fine Gold</h3></div>
<div class="flex items-baseline justify-center gap-2 mb-2 whitespace-nowrap"><span id="gold-price" class="font-price price-shadow text-[40px] md:text-[52px] text-primary font-black">₹--,---.--</span><span class="font-body-lg text-body-lg text-on-surface-variant font-medium">/10g</span></div>
<div class="flex items-center justify-center gap-2"><span class="trend-up flex items-center px-2 py-1 rounded-full font-label-caps text-[10px] gap-1 transition-colors duration-300"><span class="material-symbols-outlined text-[12px]">trending_up</span>Live Update</span></div>
</div>
</div>
<div class="h-12 w-full mt-3"><svg class="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40"><defs><linearGradient id="primary-gradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#004ee7" stop-opacity="0.2"/><stop offset="100%" stop-color="#004ee7" stop-opacity="0"/></linearGradient><filter id="glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2" result="blur" /><feComposite in="SourceGraphic" in2="blur" operator="over" /></filter></defs><path class="chart-fill" d="" fill="url(#primary-gradient)" id="gold-sparkline-fill" stroke="none"></path><path class="chart-path" d="" fill="none" id="gold-sparkline-path" stroke="#004ee7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" filter="url(#glow)"></path></svg></div>
</div>

<!-- Secondary Purities: Premium Dashboard Grid -->
<!-- Grid 1 (22K and 20K) -->
<div class="grid grid-cols-2 gap-3 md:gap-4">
    <!-- 22K Widget -->
    <div class="animate-fade-in-up glass-card p-3 relative overflow-hidden flex justify-between items-center h-[88px] hover:shadow-lg transition-shadow" style="animation-delay: 0.2s;">
        <div class="flex flex-col justify-center h-full z-10">
            <div class="flex items-center gap-1.5 mb-1">
                <h3 class="font-display-xl text-[16px] md:text-[20px] font-bold text-on-surface">22K Gold</h3>
                <span class="font-label-caps text-[9px] text-on-surface-variant px-1 py-0.5 rounded bg-surface-container-highest">91.6%</span>
            </div>
            <div class="whitespace-nowrap">
                <span id="gold-22k-price" class="font-price price-shadow text-[20px] md:text-[26px] text-primary font-black">₹--,---.--</span>
            </div>
        </div>
        <div class="absolute right-0 bottom-0 w-3/5 h-full opacity-70 pointer-events-none">
            <svg class="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40"><path class="chart-fill" d="" fill="url(#primary-gradient)" id="gold-22k-sparkline-fill" stroke="none"></path><path class="chart-path" d="" fill="none" id="gold-22k-sparkline-path" stroke="#004ee7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" filter="url(#glow)"></path></svg>
        </div>
    </div>

    <!-- 20K Widget -->
    <div class="animate-fade-in-up glass-card p-3 relative overflow-hidden flex justify-between items-center h-[88px] hover:shadow-lg transition-shadow" style="animation-delay: 0.3s;">
        <div class="flex flex-col justify-center h-full z-10">
            <div class="flex items-center gap-1.5 mb-1">
                <h3 class="font-display-xl text-[16px] md:text-[20px] font-bold text-on-surface">20K Gold</h3>
                <span class="font-label-caps text-[9px] text-on-surface-variant px-1 py-0.5 rounded bg-surface-container-highest">83.3%</span>
            </div>
            <div class="whitespace-nowrap">
                <span id="gold-20k-price" class="font-price price-shadow text-[20px] md:text-[26px] text-primary font-black">₹--,---.--</span>
            </div>
        </div>
        <div class="absolute right-0 bottom-0 w-3/5 h-full opacity-70 pointer-events-none">
            <svg class="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40"><path class="chart-fill" d="" fill="url(#primary-gradient)" id="gold-20k-sparkline-fill" stroke="none"></path><path class="chart-path" d="" fill="none" id="gold-20k-sparkline-path" stroke="#004ee7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" filter="url(#glow)"></path></svg>
        </div>
    </div>
</div>

<!-- Grid 2 (18K and 14K) -->
<div class="grid grid-cols-2 gap-3 md:gap-4">
    <!-- 18K Widget -->
    <div class="animate-fade-in-up glass-card p-3 relative overflow-hidden flex justify-between items-center h-[88px] hover:shadow-lg transition-shadow" style="animation-delay: 0.4s;">
        <div class="flex flex-col justify-center h-full z-10">
            <div class="flex items-center gap-1.5 mb-1">
                <h3 class="font-display-xl text-[16px] md:text-[20px] font-bold text-on-surface">18K Gold</h3>
                <span class="font-label-caps text-[9px] text-on-surface-variant px-1 py-0.5 rounded bg-surface-container-highest">75.0%</span>
            </div>
            <div class="whitespace-nowrap">
                <span id="gold-18k-price" class="font-price price-shadow text-[20px] md:text-[26px] text-primary font-black">₹--,---.--</span>
            </div>
        </div>
        <div class="absolute right-0 bottom-0 w-3/5 h-full opacity-70 pointer-events-none">
            <svg class="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40"><path class="chart-fill" d="" fill="url(#primary-gradient)" id="gold-18k-sparkline-fill" stroke="none"></path><path class="chart-path" d="" fill="none" id="gold-18k-sparkline-path" stroke="#004ee7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" filter="url(#glow)"></path></svg>
        </div>
    </div>

    <!-- 14K Widget -->
    <div class="animate-fade-in-up glass-card p-3 relative overflow-hidden flex justify-between items-center h-[88px] hover:shadow-lg transition-shadow" style="animation-delay: 0.5s;">
        <div class="flex flex-col justify-center h-full z-10">
            <div class="flex items-center gap-1.5 mb-1">
                <h3 class="font-display-xl text-[16px] md:text-[20px] font-bold text-on-surface">14K Gold</h3>
                <span class="font-label-caps text-[9px] text-on-surface-variant px-1 py-0.5 rounded bg-surface-container-highest">58.3%</span>
            </div>
            <div class="whitespace-nowrap">
                <span id="gold-14k-price" class="font-price price-shadow text-[20px] md:text-[26px] text-primary font-black">₹--,---.--</span>
            </div>
        </div>
        <div class="absolute right-0 bottom-0 w-3/5 h-full opacity-70 pointer-events-none">
            <svg class="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40"><path class="chart-fill" d="" fill="url(#primary-gradient)" id="gold-14k-sparkline-fill" stroke="none"></path><path class="chart-path" d="" fill="none" id="gold-14k-sparkline-path" stroke="#004ee7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" filter="url(#glow)"></path></svg>
        </div>
    </div>
</div>

<!-- Centered Narrow (9K) - Compact Strip -->
<div class="flex justify-center">
    <div class="w-full md:w-[90%] max-w-2xl">
        <div class="animate-fade-in-up glass-card p-3 relative overflow-hidden flex items-center justify-between hover:shadow-lg transition-shadow h-[88px]" style="animation-delay: 0.6s;">
            <div class="z-10 flex flex-col justify-center">
                <div class="flex items-center gap-1.5 mb-1">
                    <h3 class="font-display-xl text-[16px] md:text-[20px] font-bold text-on-surface">9K Gold</h3>
                    <span class="font-label-caps text-[9px] text-on-surface-variant px-1 py-0.5 rounded bg-surface-container-highest">37.5%</span>
                </div>
                <div class="whitespace-nowrap">
                    <span id="gold-9k-price" class="font-price price-shadow text-[20px] md:text-[26px] text-primary font-black">₹--,---.--</span>
                </div>
            </div>
            
            <div class="absolute right-0 bottom-0 w-3/5 h-full opacity-60 pointer-events-none">
                <svg class="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40"><path class="chart-fill" d="" fill="url(#primary-gradient)" id="gold-9k-sparkline-fill" stroke="none"></path><path class="chart-path" d="" fill="none" id="gold-9k-sparkline-path" stroke="#004ee7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" filter="url(#glow)"></path></svg>
            </div>
        </div>
    </div>
</div>
</div>

<div id="silver-section" class="space-y-4 w-full transition-opacity duration-300 hidden opacity-0">
<!-- Silver Card -->
<div class="animate-fade-in-up glass-card p-5 relative overflow-hidden" style="animation-delay: 0.1s;">
<div class="absolute top-0 right-0 p-5 opacity-10 pointer-events-none"><span class="material-symbols-outlined text-[100px] text-slate-400">diamond</span></div>
<div class="relative z-10 flex flex-col items-center text-center justify-center">
<div>
<div class="flex items-center justify-center gap-2 mb-2"><span class="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-label-caps text-[10px]">99.9%</span><h3 class="font-headline-md text-[20px] text-on-surface">999 Fine Silver</h3></div>
<div class="flex items-baseline justify-center gap-2 mb-2 whitespace-nowrap"><span id="silver-price" class="font-price price-shadow text-[40px] md:text-[52px] text-slate-700 font-black">₹--,---.--</span><span class="font-body-lg text-body-lg text-on-surface-variant font-medium">/1kg</span></div>
<div class="flex items-center justify-center gap-2"><span class="trend-up flex items-center px-2 py-1 rounded-full font-label-caps text-[10px] gap-1 transition-colors duration-300"><span class="material-symbols-outlined text-[12px]">trending_up</span>Live Update</span></div>
</div>
</div>
<div class="h-12 w-full mt-3"><svg class="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40"><defs><linearGradient id="silver-gradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#94a3b8" stop-opacity="0.3"/><stop offset="100%" stop-color="#94a3b8" stop-opacity="0"/></linearGradient><filter id="glow-silver" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2" result="blur" /><feComposite in="SourceGraphic" in2="blur" operator="over" /></filter></defs><path class="chart-fill" d="" fill="url(#silver-gradient)" id="silver-sparkline-fill" stroke="none"></path><path class="chart-path" d="" fill="none" id="silver-sparkline-path" stroke="#64748b" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" filter="url(#glow-silver)"></path></svg></div>
</div>
</div>

</main>"""

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace Header
header_start = text.find('<header class="fixed top-0 w-full z-50 md:w-[calc(100%-280px)] md:left-[280px] bg-white shadow-sm border-b border-outline-variant/20">')
header_end = text.find('</header>', header_start) + len('</header>')
text = text[:header_start] + new_header + text[header_end:]

# Replace Main
main_start = text.find('<main class="pt-28')
main_end = text.find('</main>', main_start) + len('</main>')
text = text[:main_start] + new_main + text[main_end:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
