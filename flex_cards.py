import sys

html_content = """<main class="pt-24 px-container-margin max-w-7xl mx-auto pb-24 flex flex-col min-h-screen">

<!-- Category Toggle -->
<div class="flex justify-center mb-4">
  <div class="flex items-center bg-surface-container rounded-full p-1 shadow-sm border border-outline-variant/20 relative">
    <div id="tab-indicator" class="absolute w-1/2 h-[calc(100%-8px)] top-1 left-1 bg-primary rounded-full shadow-sm transition-all duration-300"></div>
    <button id="tab-gold" class="px-6 py-2 rounded-full text-[14px] font-bold text-white relative z-10 transition-colors duration-300 w-32">Gold</button>
    <button id="tab-silver" class="px-6 py-2 rounded-full text-[14px] font-medium text-on-surface relative z-10 transition-colors duration-300 w-32">Silver</button>
  </div>
</div>

<div id="gold-section" class="flex flex-col flex-1 w-full transition-opacity duration-300 opacity-100 gap-3">
<!-- Hero Card (24K) -->
<div class="animate-fade-in-up glass-card p-4 relative overflow-hidden" style="animation-delay: 0.1s;">
<div class="relative z-10 flex flex-col items-center text-center justify-center">
<div>
<div class="flex items-center justify-center gap-2 mb-1"><span class="px-2 py-0.5 rounded bg-primary-container text-on-primary-container font-label-caps text-[10px]">99.99%</span><h3 class="font-headline-md text-[18px] text-on-surface">24K Fine Gold</h3></div>
<div class="flex items-baseline justify-center gap-2 mb-1 whitespace-nowrap"><span id="gold-price" class="font-price price-shadow text-[36px] md:text-[44px] text-primary font-black">₹--,---.--</span><span class="font-body-sm text-[12px] text-on-surface-variant font-medium">/10g</span></div>
<div class="flex items-center justify-center gap-2"><span class="trend-up flex items-center px-2 py-1 rounded-full font-label-caps text-[10px] gap-1 transition-colors duration-300"><span class="material-symbols-outlined text-[10px]">trending_up</span>Live Update</span></div>
</div>
</div>
<div class="h-10 w-full mt-2"><svg class="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40"><defs><linearGradient id="primary-gradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#004ee7" stop-opacity="0.2"/><stop offset="100%" stop-color="#004ee7" stop-opacity="0"/></linearGradient><filter id="glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2" result="blur" /><feComposite in="SourceGraphic" in2="blur" operator="over" /></filter></defs><path class="chart-fill" d="" fill="url(#primary-gradient)" id="gold-sparkline-fill" stroke="none"></path><path class="chart-path" d="" fill="none" id="gold-sparkline-path" stroke="#004ee7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" filter="url(#glow)"></path></svg></div>
</div>

<!-- Secondary Purities: Premium Dashboard Grid -->
<!-- Grid 1 (22K and 20K) -->
<div class="grid grid-cols-2 gap-3 md:gap-4 flex-1">
    <!-- 22K Widget -->
    <div class="animate-fade-in-up glass-card !rounded-xl p-3 relative overflow-hidden flex justify-between items-center hover:shadow-lg transition-shadow" style="animation-delay: 0.2s;">
        <div class="flex flex-col justify-center h-full z-10">
            <div class="flex items-center gap-1 mb-0.5">
                <h3 class="font-display-xl text-[14px] md:text-[18px] font-bold text-on-surface">22K Gold</h3>
                <span class="font-label-caps text-[8px] text-on-surface-variant px-1 py-0.5 rounded bg-surface-container-highest">91.6%</span>
            </div>
            <div class="whitespace-nowrap">
                <span id="gold-22k-price" class="font-price price-shadow text-[18px] md:text-[22px] text-primary font-black">₹--,---.--</span>
            </div>
        </div>
        <div class="absolute right-0 bottom-0 w-3/5 h-full opacity-70 pointer-events-none">
            <svg class="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40"><path class="chart-fill" d="" fill="url(#primary-gradient)" id="gold-22k-sparkline-fill" stroke="none"></path><path class="chart-path" d="" fill="none" id="gold-22k-sparkline-path" stroke="#004ee7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" filter="url(#glow)"></path></svg>
        </div>
    </div>

    <!-- 20K Widget -->
    <div class="animate-fade-in-up glass-card !rounded-xl p-3 relative overflow-hidden flex justify-between items-center hover:shadow-lg transition-shadow" style="animation-delay: 0.3s;">
        <div class="flex flex-col justify-center h-full z-10">
            <div class="flex items-center gap-1 mb-0.5">
                <h3 class="font-display-xl text-[14px] md:text-[18px] font-bold text-on-surface">20K Gold</h3>
                <span class="font-label-caps text-[8px] text-on-surface-variant px-1 py-0.5 rounded bg-surface-container-highest">83.3%</span>
            </div>
            <div class="whitespace-nowrap">
                <span id="gold-20k-price" class="font-price price-shadow text-[18px] md:text-[22px] text-primary font-black">₹--,---.--</span>
            </div>
        </div>
        <div class="absolute right-0 bottom-0 w-3/5 h-full opacity-70 pointer-events-none">
            <svg class="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40"><path class="chart-fill" d="" fill="url(#primary-gradient)" id="gold-20k-sparkline-fill" stroke="none"></path><path class="chart-path" d="" fill="none" id="gold-20k-sparkline-path" stroke="#004ee7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" filter="url(#glow)"></path></svg>
        </div>
    </div>
</div>

<!-- Grid 2 (18K and 14K) -->
<div class="grid grid-cols-2 gap-3 md:gap-4 flex-1">
    <!-- 18K Widget -->
    <div class="animate-fade-in-up glass-card !rounded-xl p-3 relative overflow-hidden flex justify-between items-center hover:shadow-lg transition-shadow" style="animation-delay: 0.4s;">
        <div class="flex flex-col justify-center h-full z-10">
            <div class="flex items-center gap-1 mb-0.5">
                <h3 class="font-display-xl text-[14px] md:text-[18px] font-bold text-on-surface">18K Gold</h3>
                <span class="font-label-caps text-[8px] text-on-surface-variant px-1 py-0.5 rounded bg-surface-container-highest">75.0%</span>
            </div>
            <div class="whitespace-nowrap">
                <span id="gold-18k-price" class="font-price price-shadow text-[18px] md:text-[22px] text-primary font-black">₹--,---.--</span>
            </div>
        </div>
        <div class="absolute right-0 bottom-0 w-3/5 h-full opacity-70 pointer-events-none">
            <svg class="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40"><path class="chart-fill" d="" fill="url(#primary-gradient)" id="gold-18k-sparkline-fill" stroke="none"></path><path class="chart-path" d="" fill="none" id="gold-18k-sparkline-path" stroke="#004ee7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" filter="url(#glow)"></path></svg>
        </div>
    </div>

    <!-- 14K Widget -->
    <div class="animate-fade-in-up glass-card !rounded-xl p-3 relative overflow-hidden flex justify-between items-center hover:shadow-lg transition-shadow" style="animation-delay: 0.5s;">
        <div class="flex flex-col justify-center h-full z-10">
            <div class="flex items-center gap-1 mb-0.5">
                <h3 class="font-display-xl text-[14px] md:text-[18px] font-bold text-on-surface">14K Gold</h3>
                <span class="font-label-caps text-[8px] text-on-surface-variant px-1 py-0.5 rounded bg-surface-container-highest">58.3%</span>
            </div>
            <div class="whitespace-nowrap">
                <span id="gold-14k-price" class="font-price price-shadow text-[18px] md:text-[22px] text-primary font-black">₹--,---.--</span>
            </div>
        </div>
        <div class="absolute right-0 bottom-0 w-3/5 h-full opacity-70 pointer-events-none">
            <svg class="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40"><path class="chart-fill" d="" fill="url(#primary-gradient)" id="gold-14k-sparkline-fill" stroke="none"></path><path class="chart-path" d="" fill="none" id="gold-14k-sparkline-path" stroke="#004ee7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" filter="url(#glow)"></path></svg>
        </div>
    </div>
</div>

<!-- Centered Narrow (9K) - Compact Strip -->
<div class="flex justify-center flex-1">
    <div class="w-full md:w-[90%] max-w-2xl h-full">
        <div class="animate-fade-in-up glass-card !rounded-xl p-3 relative overflow-hidden flex items-center justify-between hover:shadow-lg transition-shadow h-full" style="animation-delay: 0.6s;">
            <div class="z-10 flex flex-col justify-center">
                <div class="flex items-center gap-1 mb-0.5">
                    <h3 class="font-display-xl text-[14px] md:text-[18px] font-bold text-on-surface">9K Gold</h3>
                    <span class="font-label-caps text-[8px] text-on-surface-variant px-1 py-0.5 rounded bg-surface-container-highest">37.5%</span>
                </div>
                <div class="whitespace-nowrap">
                    <span id="gold-9k-price" class="font-price price-shadow text-[18px] md:text-[22px] text-primary font-black">₹--,---.--</span>
                </div>
            </div>
            
            <div class="absolute right-0 bottom-0 w-3/5 h-full opacity-60 pointer-events-none">
                <svg class="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40"><path class="chart-fill" d="" fill="url(#primary-gradient)" id="gold-9k-sparkline-fill" stroke="none"></path><path class="chart-path" d="" fill="none" id="gold-9k-sparkline-path" stroke="#004ee7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" filter="url(#glow)"></path></svg>
            </div>
        </div>
    </div>
</div>
</div>

<div id="silver-section" class="flex flex-col flex-1 w-full transition-opacity duration-300 hidden opacity-0 gap-3">
<!-- Silver Card -->
<div class="animate-fade-in-up glass-card p-4 relative overflow-hidden" style="animation-delay: 0.1s;">
<div class="relative z-10 flex flex-col items-center text-center justify-center">
<div>
<div class="flex items-center justify-center gap-2 mb-1"><span class="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-label-caps text-[10px]">99.9%</span><h3 class="font-headline-md text-[18px] text-on-surface">999 Fine Silver</h3></div>
<div class="flex items-baseline justify-center gap-2 mb-1 whitespace-nowrap"><span id="silver-price" class="font-price price-shadow text-[36px] md:text-[44px] text-slate-700 font-black">₹--,---.--</span><span class="font-body-sm text-[12px] text-on-surface-variant font-medium">/1kg</span></div>
<div class="flex items-center justify-center gap-2"><span class="trend-up flex items-center px-2 py-1 rounded-full font-label-caps text-[10px] gap-1 transition-colors duration-300"><span class="material-symbols-outlined text-[10px]">trending_up</span>Live Update</span></div>
</div>
</div>
<div class="h-10 w-full mt-2"><svg class="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40"><defs><linearGradient id="silver-gradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#94a3b8" stop-opacity="0.3"/><stop offset="100%" stop-color="#94a3b8" stop-opacity="0"/></linearGradient><filter id="glow-silver" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2" result="blur" /><feComposite in="SourceGraphic" in2="blur" operator="over" /></filter></defs><path class="chart-fill" d="" fill="url(#silver-gradient)" id="silver-sparkline-fill" stroke="none"></path><path class="chart-path" d="" fill="none" id="silver-sparkline-path" stroke="#64748b" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" filter="url(#glow-silver)"></path></svg></div>
</div>
</div>

</main>"""

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

main_start = text.find('<main class="pt-24')
main_end = text.find('</main>', main_start) + len('</main>')

new_text = text[:main_start] + html_content + text[main_end:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_text)

print('Done')
