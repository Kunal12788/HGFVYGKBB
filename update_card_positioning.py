import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add mt-3 to 24K and Silver price divs
# Current: <div class="flex items-baseline justify-center gap-2 mb-1 whitespace-nowrap">
text = text.replace('<div class="flex items-baseline justify-center gap-2 mb-1 whitespace-nowrap">',
                    '<div class="flex items-baseline justify-center gap-2 mb-1 whitespace-nowrap mt-3">')

# 2. Update smaller cards (22K, 20K, 18K, 14K, 9K)
# Current: flex justify-between items-center
# New: flex flex-col items-center justify-center text-center
text = re.sub(r'flex justify-between items-center(\s*transition-shadow)',
              r'flex flex-col items-center justify-center text-center\1', text)

# Current: flex flex-col justify-center h-full z-10
# New: flex flex-col items-center justify-center w-full z-10
text = text.replace('flex flex-col justify-center h-full z-10',
                    'flex flex-col items-center justify-center w-full z-10')

# Current: flex items-center gap-1 mb-0.5
# New: flex items-center justify-center gap-1 mb-0.5
text = text.replace('flex items-center gap-1 mb-0.5',
                    'flex items-center justify-center gap-1 mb-0.5')

# Current: <div class="whitespace-nowrap">
# New: <div class="whitespace-nowrap mt-2">
text = text.replace('<div class="whitespace-nowrap">',
                    '<div class="whitespace-nowrap mt-2">')

# Current: absolute right-0 bottom-0 w-3/5 h-full opacity-70 pointer-events-none
# New: absolute left-0 bottom-0 w-full h-1/2 opacity-70 pointer-events-none
text = text.replace('absolute right-0 bottom-0 w-3/5 h-full opacity-70 pointer-events-none',
                    'absolute left-0 bottom-0 w-full h-1/2 opacity-70 pointer-events-none')


with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print('Done')
