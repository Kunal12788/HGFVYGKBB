import shutil
import os

src_img = r"c:\Users\HP\Downloads\bullion-rate-agent_1\bullion-rate-agent\round-gold-bar-icon-with-shadow-vector.jpg"
dst_img = r"c:\Users\HP\Downloads\bullion-rate-agent_1\bullion-rate-agent\customer-frontend\public\gold-bar-icon.jpg"

if os.path.exists(src_img):
    shutil.copy(src_img, dst_img)
    print("Image copied.")
else:
    print("Source image not found.")

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

old_icon = '''<svg width="72" height="72" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 40 L20 24 L44 24 L52 40 L52 48 L12 48 Z" fill="#FDE68A"/>
          <path d="M12 40 L52 40 L52 48 L12 48 Z" fill="#F59E0B"/>
          <path d="M20 24 L44 24 L52 40 L12 40 Z" fill="#FBBF24"/>
          <text x="32" y="34" font-family="sans-serif" font-size="8" font-weight="900" fill="#B45309" text-anchor="middle">999.9</text>
          <text x="32" y="46" font-family="sans-serif" font-size="5" font-weight="900" fill="#78350F" text-anchor="middle">FINE GOLD</text>
        </svg>'''

new_icon = '<img src="/gold-bar-icon.jpg" alt="Gold Bar" class="w-[80px] h-[80px] object-contain mix-blend-multiply scale-110 drop-shadow-sm">'

if old_icon in text:
    text = text.replace(old_icon, new_icon)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(text)
    print("HTML updated.")
else:
    print("Old icon not found in HTML.")
