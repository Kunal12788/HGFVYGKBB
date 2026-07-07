with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Change card background to white
text = text.replace('background: #fffbeb;', 'background: #ffffff;')

# Revert text classes
text = text.replace('text-amber-950/80', 'text-gray-500')
text = text.replace('text-amber-950', 'text-gray-900')
text = text.replace('bg-amber-950/10 text-gray-900', 'bg-gray-100 text-gray-900')

# Revert SVG colors back to primary blue
text = text.replace('stop-color="#d97706"', 'stop-color="#004ee7"')
text = text.replace('stroke="#d97706"', 'stroke="#004ee7"')

# Fix Gold button text (it might have been changed to text-gray-900 by the first replace)
# Gold is active, so it should be text-white
text = text.replace('<button id="tab-gold" class="px-6 py-2 rounded-full text-[14px] font-bold text-gray-900 relative z-10 transition-colors duration-300 w-32">Gold</button>', '<button id="tab-gold" class="px-6 py-2 rounded-full text-[14px] font-bold text-white relative z-10 transition-colors duration-300 w-32">Gold</button>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print('Done')
