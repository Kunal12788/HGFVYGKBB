import sys
import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Define the new 24K card HTML
new_24k_card = '''<!-- Hero Card (24K) -->
<div class="animate-fade-in-up glass-card p-6 relative overflow-hidden min-h-[160px]" style="animation-delay: 0.1s;">
    <!-- Absolute positioned big gold bar icon on the right -->
    <div class="absolute right-4 top-1/2 -translate-y-1/2 opacity-90 pointer-events-none drop-shadow-lg">
        <svg width="72" height="72" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 40 L20 24 L44 24 L52 40 L52 48 L12 48 Z" fill="#FDE68A"/>
          <path d="M12 40 L52 40 L52 48 L12 48 Z" fill="#F59E0B"/>
          <path d="M20 24 L44 24 L52 40 L12 40 Z" fill="#FBBF24"/>
          <text x="32" y="34" font-family="sans-serif" font-size="8" font-weight="900" fill="#B45309" text-anchor="middle">999.9</text>
          <text x="32" y="46" font-family="sans-serif" font-size="5" font-weight="900" fill="#78350F" text-anchor="middle">FINE GOLD</text>
        </svg>
    </div>
    
    <div class="relative z-10 flex flex-col items-center justify-between h-full min-h-[120px] w-full text-center">
        <div class="flex items-center justify-center gap-2 w-full mt-2 pl-4">
            <span class="px-2 py-0.5 rounded bg-gray-100 text-gray-900 font-label-caps text-[10px] shadow-sm">99.99%</span>
            <h3 class="font-headline-md text-[18px] text-gray-900 font-black tracking-tight">24K Fine Gold</h3>
        </div>
        <div class="flex items-baseline justify-center gap-2 whitespace-nowrap mt-auto pb-1 pl-4">
            <span id="gold-price" class="font-price price-shadow text-[36px] md:text-[44px] text-gray-900 font-black">₹--,---.--</span>
            <span class="font-body-sm text-[12px] text-gray-500 font-medium">/10g</span>
        </div>
    </div>
</div>'''

# Extract the old 24K card to replace
start_comment = '<!-- Hero Card (24K) -->'
end_comment = '<!-- Secondary Purities: Premium Dashboard Grid -->'

start_idx = text.find(start_comment)
end_idx = text.find(end_comment)

if start_idx != -1 and end_idx != -1:
    old_section = text[start_idx:end_idx]
    text = text.replace(old_section, new_24k_card + '\n\n')
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Done")
else:
    print("Could not find the 24K card section.")
