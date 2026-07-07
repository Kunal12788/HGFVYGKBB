with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Change card background to amber-50 (lightest golden)
text = text.replace('background: #fff7ed;', 'background: #fffbeb;')

# Change orange tailwind classes to amber
text = text.replace('text-orange-950', 'text-amber-950')
text = text.replace('bg-orange-950/10', 'bg-amber-950/10')

# Change SVG colors from orange-600 (#ea580c) to amber-600 (#d97706)
text = text.replace('stop-color="#ea580c"', 'stop-color="#d97706"')
text = text.replace('stroke="#ea580c"', 'stroke="#d97706"')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print('Done')
