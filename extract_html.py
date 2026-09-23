import os

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

views_ids = ['view-dashboard', 'view-pipeline', 'view-threed', 'view-ai-lab', 'view-mission', 'view-realtime', 'view-history', 'view-hardware']

extracted = {}

for vid in views_ids:
    search_str = f'id="{vid}"'
    idx = content.find(search_str)
    if idx == -1:
        print(f"Not found: {vid}")
        continue
    
    # find the preceding < to get the tag name
    start_tag_idx = content.rfind('<', 0, idx)
    end_tag_idx = content.find('>', idx)
    tag_name = content[start_tag_idx+1:end_tag_idx].split()[0]
    
    # Simple nested parser
    open_count = 0
    end_idx = -1
    i = start_tag_idx
    
    while i < len(content):
        if content.startswith(f'<{tag_name}', i):
            open_count += 1
            i += len(f'<{tag_name}')
        elif content.startswith(f'</{tag_name}>', i):
            open_count -= 1
            if open_count == 0:
                end_idx = i + len(f'</{tag_name}>')
                break
            i += len(f'</{tag_name}>')
        else:
            i += 1
            
    if end_idx != -1:
        html = content[start_tag_idx:end_idx]
        extracted[vid] = html
        content = content[:start_tag_idx] + f"<!-- INJECTED_{vid} -->" + content[end_idx:]
    else:
        print("Failed to find end for", vid)

os.makedirs('frontend/js/views', exist_ok=True)

imports = []
for vid, html in extracted.items():
    js_name = vid.replace('view-', '').replace('-', '_') + 'Html'
    filename = f'frontend/js/views/{vid.replace("view-", "")}-html.js'
    safe_html = html.replace('`', '\\`').replace('${', '\\${')
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(f"export const {js_name} = `\n{safe_html}\n`;\n")
    imports.append(js_name)

# Update index.html
content = content.replace('./src/index.css', './css/variables.css">\n  <link rel="stylesheet" href="./css/layout.css">\n  <link rel="stylesheet" href="./css/components.css">\n  <link rel="stylesheet" href="./css/navigation.css">\n  <link rel="stylesheet" href="./css/dashboard.css">\n  <link rel="stylesheet" href="./css/telemetry.css">\n  <link rel="stylesheet" href="./css/charts.css">\n  <link rel="stylesheet" href="./css/digital-twin.css">\n  <link rel="stylesheet" href="./css/responsive.css')
content = content.replace('./src/js/main.js', './js/app.js')
content = content.replace('./src/assets', './assets')

with open('frontend/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print(imports)
