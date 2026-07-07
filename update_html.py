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

<!-- Secondary Purities: Premium Dashboard Grid -->
<!-- Grid 1 (22K and 20K) -->
<div class="grid grid-cols-2 gap-4 md:gap-6">
    <!-- 22K Widget -->
    <div class="animate-fade-in-up glass-card p-4 relative overflow-hidden flex justify-between items-center h-[120px] hover:shadow-lg transition-shadow" style="animation-delay: 0.2s;">
        <!-- Text Content -->
        <div class="flex flex-col justify-between h-full z-10">
            <div class="flex items-center gap-2 mb-2">
                <h3 class="font-display-xl text-[18px] md:text-[22px] font-bold text-on-surface">22K Gold</h3>
                <span class="font-label-caps text-[10px] text-on-surface-variant px-1.5 py-0.5 rounded bg-surface-container-highest">91.6%</span>
            </div>
            <div class="whitespace-nowrap">
                <span id="gold-22k-price" class="font-price price-shadow text-[24px] md:text-[32px] text-primary font-black">₹--,---.--</span>
            </div>
        </div>
        <!-- Right aligned Sparkline -->
        <div class="absolute right-0 bottom-0 w-3/5 h-full opacity-70 pointer-events-none">
            <svg class="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40"><path class="chart-fill" d="" fill="url(#primary-gradient)" id="gold-22k-sparkline-fill" stroke="none"></path><path class="chart-path" d="" fill="none" id="gold-22k-sparkline-path" stroke="#004ee7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"></path></svg>
        </div>
    </div>

    <!-- 20K Widget -->
    <div class="animate-fade-in-up glass-card p-4 relative overflow-hidden flex justify-between items-center h-[120px] hover:shadow-lg transition-shadow" style="animation-delay: 0.3s;">
        <!-- Text Content -->
        <div class="flex flex-col justify-between h-full z-10">
            <div class="flex items-center gap-2 mb-2">
                <h3 class="font-display-xl text-[18px] md:text-[22px] font-bold text-on-surface">20K Gold</h3>
                <span class="font-label-caps text-[10px] text-on-surface-variant px-1.5 py-0.5 rounded bg-surface-container-highest">83.3%</span>
            </div>
            <div class="whitespace-nowrap">
                <span id="gold-20k-price" class="font-price price-shadow text-[24px] md:text-[32px] text-primary font-black">₹--,---.--</span>
            </div>
        </div>
        <!-- Right aligned Sparkline -->
        <div class="absolute right-0 bottom-0 w-3/5 h-full opacity-70 pointer-events-none">
            <svg class="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40"><path class="chart-fill" d="" fill="url(#primary-gradient)" id="gold-20k-sparkline-fill" stroke="none"></path><path class="chart-path" d="" fill="none" id="gold-20k-sparkline-path" stroke="#004ee7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"></path></svg>
        </div>
    </div>
</div>

<!-- Grid 2 (18K and 14K) -->
<div class="grid grid-cols-2 gap-4 md:gap-6">
    <!-- 18K Widget -->
    <div class="animate-fade-in-up glass-card p-4 relative overflow-hidden flex justify-between items-center h-[120px] hover:shadow-lg transition-shadow" style="animation-delay: 0.4s;">
        <!-- Text Content -->
        <div class="flex flex-col justify-between h-full z-10">
            <div class="flex items-center gap-2 mb-2">
                <h3 class="font-display-xl text-[18px] md:text-[22px] font-bold text-on-surface">18K Gold</h3>
                <span class="font-label-caps text-[10px] text-on-surface-variant px-1.5 py-0.5 rounded bg-surface-container-highest">75.0%</span>
            </div>
            <div class="whitespace-nowrap">
                <span id="gold-18k-price" class="font-price price-shadow text-[24px] md:text-[32px] text-primary font-black">₹--,---.--</span>
            </div>
        </div>
        <!-- Right aligned Sparkline -->
        <div class="absolute right-0 bottom-0 w-3/5 h-full opacity-70 pointer-events-none">
            <svg class="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40"><path class="chart-fill" d="" fill="url(#primary-gradient)" id="gold-18k-sparkline-fill" stroke="none"></path><path class="chart-path" d="" fill="none" id="gold-18k-sparkline-path" stroke="#004ee7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"></path></svg>
        </div>
    </div>

    <!-- 14K Widget -->
    <div class="animate-fade-in-up glass-card p-4 relative overflow-hidden flex justify-between items-center h-[120px] hover:shadow-lg transition-shadow" style="animation-delay: 0.5s;">
        <!-- Text Content -->
        <div class="flex flex-col justify-between h-full z-10">
            <div class="flex items-center gap-2 mb-2">
                <h3 class="font-display-xl text-[18px] md:text-[22px] font-bold text-on-surface">14K Gold</h3>
                <span class="font-label-caps text-[10px] text-on-surface-variant px-1.5 py-0.5 rounded bg-surface-container-highest">58.3%</span>
            </div>
            <div class="whitespace-nowrap">
                <span id="gold-14k-price" class="font-price price-shadow text-[24px] md:text-[32px] text-primary font-black">₹--,---.--</span>
            </div>
        </div>
        <!-- Right aligned Sparkline -->
        <div class="absolute right-0 bottom-0 w-3/5 h-full opacity-70 pointer-events-none">
            <svg class="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40"><path class="chart-fill" d="" fill="url(#primary-gradient)" id="gold-14k-sparkline-fill" stroke="none"></path><path class="chart-path" d="" fill="none" id="gold-14k-sparkline-path" stroke="#004ee7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"></path></svg>
        </div>
    </div>
</div>

<!-- Centered Narrow (9K) - Ultra Premium Horizontal Strip -->
<div class="flex justify-center">
    <div class="w-[90%] max-w-2xl">
        <div class="animate-fade-in-up glass-card p-5 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between hover:shadow-lg transition-shadow" style="animation-delay: 0.6s;">
            <!-- Left: Title -->
            <div class="z-10 flex items-center gap-3 mb-2 md:mb-0">
                <div class="hidden md:flex w-10 h-10 rounded-full bg-surface-container items-center justify-center">
                    <span class="material-symbols-outlined text-primary text-[20px]">diamond</span>
                </div>
                <div>
                    <h3 class="font-display-xl text-[20px] font-bold text-on-surface">9K Gold</h3>
                    <span class="font-label-caps text-[11px] text-on-surface-variant px-1.5 py-0.5 rounded bg-surface-container-highest">37.5%</span>
                </div>
            </div>
            
            <!-- Middle: Sparkline -->
            <div class="absolute left-0 bottom-0 w-full h-1/2 opacity-60 pointer-events-none md:left-[30%] md:w-[40%] md:h-full md:bottom-0">
                <svg class="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40"><path class="chart-fill" d="" fill="url(#primary-gradient)" id="gold-9k-sparkline-fill" stroke="none"></path><path class="chart-path" d="" fill="none" id="gold-9k-sparkline-path" stroke="#004ee7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"></path></svg>
            </div>

            <!-- Right: Price -->
            <div class="z-10 text-left md:text-right">
                <span id="gold-9k-price" class="font-price price-shadow text-[28px] md:text-[36px] text-primary font-black">₹--,---.--</span>
            </div>
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
