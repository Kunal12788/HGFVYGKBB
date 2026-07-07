import sys

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Change CSS background
text = text.replace('background: #3b82f6;', 'background: #fed7aa;')

# Split at main
main_start = text.find('<main')
main_end = text.find('</main>')

main_block = text[main_start:main_end]

# 2. Change text colors
main_block = main_block.replace('text-white', 'text-orange-950')
main_block = main_block.replace('text-white-variant', 'text-orange-950/80')
main_block = main_block.replace('bg-white/20 text-orange-950', 'bg-orange-950/10 text-orange-950')

# 3. Change SVG colors
main_block = main_block.replace('stop-color="#ffffff"', 'stop-color="#ea580c"')
main_block = main_block.replace('stroke="#ffffff"', 'stroke="#ea580c"')

# Fix tab button
main_block = main_block.replace('<button id="tab-gold" class="px-6 py-2 rounded-full text-[14px] font-bold text-orange-950 relative z-10 transition-colors duration-300 w-32">Gold</button>', '<button id="tab-gold" class="px-6 py-2 rounded-full text-[14px] font-bold text-white relative z-10 transition-colors duration-300 w-32">Gold</button>')

text = text[:main_start] + main_block + text[main_end:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print('Done')
