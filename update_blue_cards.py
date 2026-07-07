import sys
import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Change card background to blue (#004ee7)
text = text.replace('background: #eff4fb;', 'background: #004ee7;')

# 2. Change price colors from text-primary (which is blue) to text-white
text = text.replace('text-primary font-black', 'text-white font-black')
text = text.replace('text-slate-700 font-black', 'text-white font-black') # For silver price

# 3. Change title colors from text-on-surface to text-white
text = text.replace('text-on-surface', 'text-white')

# 4. Change subtext/labels from text-on-surface-variant to text-white/80
text = text.replace('text-on-surface-variant', 'text-white/80')

# 5. Change purity badge backgrounds to a semi-transparent white for contrast on blue
text = text.replace('bg-primary-container text-on-primary-container', 'bg-white/20 text-white')
text = text.replace('bg-surface-container-highest text-white/80', 'bg-white/20 text-white') # Note: text-on-surface-variant was already replaced above

# 6. Change SVG graphs from blue to white
# Gradient stops
text = text.replace('stop-color="#004ee7"', 'stop-color="#ffffff"')
text = text.replace('stop-color="#94a3b8"', 'stop-color="#ffffff"')
# SVG stroke lines
text = text.replace('stroke="#004ee7"', 'stroke="#ffffff"')
text = text.replace('stroke="#64748b"', 'stroke="#ffffff"')

# 7. Make sure the toggle button text doesn't become invisible.
# The toggle button inactive state text "Silver" was text-on-surface (now text-white).
# If the tab container is bg-surface-container (light blue), white text might be hard to read.
# Let's explicitly fix the inactive tab text color if needed, but wait, the toggle container is `#eff4fb`, so white text is invisible there.
# Let's revert the tab-silver button text back to gray.
text = text.replace('<button id="tab-silver" class="px-6 py-2 rounded-full text-[14px] font-medium text-white relative z-10 transition-colors duration-300 w-32">Silver</button>', '<button id="tab-silver" class="px-6 py-2 rounded-full text-[14px] font-medium text-gray-700 relative z-10 transition-colors duration-300 w-32">Silver</button>')

# 8. Fix the body tag which had text-on-surface -> text-white
text = text.replace('<body class="bg-white text-white', '<body class="bg-white text-gray-900')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print('Done')
