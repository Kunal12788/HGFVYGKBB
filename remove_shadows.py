import sys
import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Remove box-shadow from .glass-card and .glass-card:hover
text = re.sub(r'box-shadow:[\s\S]*?;', 'box-shadow: none !important;', text)

# 2. Remove hover:shadow-lg from HTML classes
text = text.replace('hover:shadow-lg', '')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print('Done')
