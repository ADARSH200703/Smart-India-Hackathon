import re
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

ids = re.findall(r'id="([^"]+)"', content)
print("IDs:", ids)
