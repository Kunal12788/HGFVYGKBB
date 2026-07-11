import urllib.request
try:
    url = "https://hgvygkbb.vercel.app"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    response = urllib.request.urlopen(req)
    html = response.read().decode('utf-8')
    if "marketClosedOverlay" in html:
        print("SUCCESS: marketClosedOverlay found in Vercel live HTML!")
    else:
        print("FAIL: marketClosedOverlay NOT FOUND in Vercel live HTML!")
except Exception as e:
    print(f"Error: {e}")
