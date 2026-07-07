import sys

html_content = """<main class="pt-36 px-container-margin max-w-7xl mx-auto space-y-xl">
<!-- Hero Card (24K) -->
<div class="animate-fade-in-up glass-card p-lg relative overflow-hidden" style="animation-delay: 0.1s;">
<div class="absolute top-0 right-0 p-lg opacity-10 pointer-events-none"><span class="material-symbols-outlined text-[120px] text-primary">diamond</span></div>
<div class="relative z-10 flex flex-col items-center text-center justify-center py-sm">
<div>
<div class="flex items-center justify-center gap-sm mb-sm"><span class="px-sm py-xs rounded bg-primary-container text-on-primary-container font-label-caps text-[10px]">99.99%</span><h3 class="font-headline-md text-headline-md text-on-surface">24K Fine Gold</h3></div>
<div class="flex items-baseline justify-center gap-sm mb-sm whitespace-nowrap"><span id="gold-price" class="font-price price-shadow text-[44px] md:text-[60px] text-primary font-black">₹--,---.--</span><span class="font-body-lg text-body-lg text-on-surface-variant font-medium">/10g</span></div>
<div class="flex items-center justify-center gap-sm"><span class="trend-up flex items-center px-sm py-xs rounded-full font-label-caps text-[12px] gap-xs transition-colors duration-300"><span class="material-symbols-outlined text-[14px]">trending_up</span>Live Update</span></div>
</div>
</div>
<div class="h-16 w-full mt-4"><svg class="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40"><defs><linearGradient id="primary-gradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#004ee7" stop-opacity="0.2"/><stop offset="100%" stop-color="#004ee7" stop-opacity="0"/></linearGradient></defs><path class="chart-fill" d="" fill="url(#primary-gradient)" id="gold-sparkline-fill" stroke="none"></path><path class="chart-path" d="" fill="none" id="gold-sparkline-path" stroke="#004ee7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"></path></svg></div>
</div>

<!-- Grid 1 (22K and 20K) -->
<div class="grid grid-cols-2 gap-md md:gap-xl">
<div class="animate-fade-in-up glass-card p-md relative overflow-hidden" style="animation-delay: 0.2s;">
<div class="relative z-10 flex flex-col items-center text-center justify-center"><div class="flex items-center justify-center gap-sm mb-sm"><span class="px-sm py-xs rounded bg-surface-container-highest text-on-surface-variant font-label-caps text-[10px]">91.6%</span><h3 class="font-headline-md text-[20px] text-on-surface">22K Gold</h3></div><div class="flex items-baseline justify-center gap-sm mb-sm whitespace-nowrap"><span id="gold-22k-price" class="font-price price-shadow text-[28px] md:text-[40px] text-primary font-black">₹--,---.--</span><span class="text-xs text-on-surface-variant font-medium">/10g</span></div></div>
<div class="h-12 w-full mt-2"><svg class="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40"><path class="chart-fill" d="" fill="url(#primary-gradient)" id="gold-22k-sparkline-fill" stroke="none"></path><path class="chart-path" d="" fill="none" id="gold-22k-sparkline-path" stroke="#004ee7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"></path></svg></div>
</div>

<div class="animate-fade-in-up glass-card p-md relative overflow-hidden" style="animation-delay: 0.3s;">
<div class="relative z-10 flex flex-col items-center text-center justify-center"><div class="flex items-center justify-center gap-sm mb-sm"><span class="px-sm py-xs rounded bg-surface-container-highest text-on-surface-variant font-label-caps text-[10px]">83.3%</span><h3 class="font-headline-md text-[20px] text-on-surface">20K Gold</h3></div><div class="flex items-baseline justify-center gap-sm mb-sm whitespace-nowrap"><span id="gold-20k-price" class="font-price price-shadow text-[28px] md:text-[40px] text-primary font-black">₹--,---.--</span><span class="text-xs text-on-surface-variant font-medium">/10g</span></div></div>
<div class="h-12 w-full mt-2"><svg class="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40"><path class="chart-fill" d="" fill="url(#primary-gradient)" id="gold-20k-sparkline-fill" stroke="none"></path><path class="chart-path" d="" fill="none" id="gold-20k-sparkline-path" stroke="#004ee7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"></path></svg></div>
</div>
</div>

<!-- Grid 2 (18K and 14K) -->
<div class="grid grid-cols-2 gap-md md:gap-xl">
<div class="animate-fade-in-up glass-card p-md relative overflow-hidden" style="animation-delay: 0.4s;">
<div class="relative z-10 flex flex-col items-center text-center justify-center"><div class="flex items-center justify-center gap-sm mb-sm"><span class="px-sm py-xs rounded bg-surface-container-highest text-on-surface-variant font-label-caps text-[10px]">75.0%</span><h3 class="font-headline-md text-[20px] text-on-surface">18K Gold</h3></div><div class="flex items-baseline justify-center gap-sm mb-sm whitespace-nowrap"><span id="gold-18k-price" class="font-price price-shadow text-[28px] md:text-[40px] text-primary font-black">₹--,---.--</span><span class="text-xs text-on-surface-variant font-medium">/10g</span></div></div>
<div class="h-12 w-full mt-2"><svg class="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40"><path class="chart-fill" d="" fill="url(#primary-gradient)" id="gold-18k-sparkline-fill" stroke="none"></path><path class="chart-path" d="" fill="none" id="gold-18k-sparkline-path" stroke="#004ee7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"></path></svg></div>
</div>

<div class="animate-fade-in-up glass-card p-md relative overflow-hidden" style="animation-delay: 0.5s;">
<div class="relative z-10 flex flex-col items-center text-center justify-center"><div class="flex items-center justify-center gap-sm mb-sm"><span class="px-sm py-xs rounded bg-surface-container-highest text-on-surface-variant font-label-caps text-[10px]">58.3%</span><h3 class="font-headline-md text-[20px] text-on-surface">14K Gold</h3></div><div class="flex items-baseline justify-center gap-sm mb-sm whitespace-nowrap"><span id="gold-14k-price" class="font-price price-shadow text-[28px] md:text-[40px] text-primary font-black">₹--,---.--</span><span class="text-xs text-on-surface-variant font-medium\">/10g</span></div></div>
<div class="h-12 w-full mt-2"><svg class="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40"><path class="chart-fill" d="" fill="url(#primary-gradient)" id="gold-14k-sparkline-fill" stroke="none"></path><path class="chart-path" d="" fill="none" id="gold-14k-sparkline-path" stroke="#004ee7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"></path></svg></div>
</div>
</div>

<!-- Centered Narrow (9K) -->
<div class="flex justify-center">
<div class="w-[85%] max-w-xl">
<div class="animate-fade-in-up glass-card p-md relative overflow-hidden" style="animation-delay: 0.6s;">
<div class="relative z-10 flex flex-col items-center text-center justify-center"><div class="flex items-center justify-center gap-sm mb-sm"><span class="px-sm py-xs rounded bg-surface-container-highest text-on-surface-variant font-label-caps text-[10px]">37.5%</span><h3 class="font-headline-md text-[20px] text-on-surface">9K Gold</h3></div><div class="flex items-baseline justify-center gap-sm mb-sm whitespace-nowrap"><span id="gold-9k-price" class="font-price price-shadow text-[28px] md:text-[40px] text-primary font-black">₹--,---.--</span><span class="text-xs text-on-surface-variant font-medium">/10g</span></div></div>
<div class="h-12 w-full mt-2"><svg class="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40"><path class="chart-fill" d="" fill="url(#primary-gradient)" id="gold-9k-sparkline-fill" stroke="none"></path><path class="chart-path" d="" fill="none" id="gold-9k-sparkline-path" stroke="#004ee7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"></path></svg></div>
</div>
</div>
</div>

<!-- Silver Card -->
<div class="animate-fade-in-up glass-card p-lg relative overflow-hidden" style="animation-delay: 0.7s;">
<div class="absolute top-0 right-0 p-lg opacity-10 pointer-events-none"><span class="material-symbols-outlined text-[120px] text-primary">diamond</span></div>
<div class="relative z-10 flex flex-col items-center text-center justify-center py-sm">
<div>
<div class="flex items-center justify-center gap-sm mb-sm"><span class="px-sm py-xs rounded bg-surface-container-highest text-on-surface-variant font-label-caps text-[10px]">99.9%</span><h3 class="font-headline-md text-headline-md text-on-surface">999 Fine Silver</h3></div>
<div class="flex items-baseline justify-center gap-sm mb-sm whitespace-nowrap"><span id="silver-price" class="font-price price-shadow text-[44px] md:text-[60px] text-primary font-black">₹--,---.--</span><span class="font-body-lg text-body-lg text-on-surface-variant font-medium">/1kg</span></div>
<div class="flex items-center justify-center gap-sm"><span class="trend-up flex items-center px-sm py-xs rounded-full font-label-caps text-[12px] gap-xs transition-colors duration-300"><span class="material-symbols-outlined text-[14px]">trending_up</span>Live Update</span></div>
</div>
</div>
<div class="h-16 w-full mt-4"><svg class="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40"><path class="chart-fill" d="" fill="url(#primary-gradient)" id="silver-sparkline-fill" stroke="none"></path><path class="chart-path" d="" fill="none" id="silver-sparkline-path" stroke="#004ee7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"></path></svg></div>
</div>
</main>"""

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

start_idx = text.find('<main class="pt-36')
end_idx = text.find('</main>') + len('</main>')

new_text = text[:start_idx] + html_content + text[end_idx:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_text)

print('Done')
