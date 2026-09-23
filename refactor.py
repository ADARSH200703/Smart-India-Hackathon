import os
import re

css_path = 'frontend/css/variables.css'
with open(css_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Typography & Imports
content = re.sub(
    r'@import url.*?;',
    "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');",
    content
)
content = re.sub(r'--font-tech:.*?;', "--font-tech: var(--font-sans);", content)
content = re.sub(r'--font-display:.*?;', "--font-display: var(--font-sans);", content)

# 2. Colors & Overhaul
content = content.replace('#4CD7F6', '#3B82F6') # Cyan to Blue
content = content.replace('rgba(25, 28, 33, 0.85)', '#191C21') # Glass to solid
content = content.replace('rgba(17, 20, 25, 0.95)', '#111419')

# 3. Geometry
content = re.sub(r'--radius-lg:.*?;', '--radius-lg: 4px;', content)
content = re.sub(r'--radius-xl:.*?;', '--radius-xl: 4px;', content)
content = re.sub(r'--radius-full:.*?;', '--radius-full: 4px;', content)

# 4. Glows
content = re.sub(r'--status-.*?-glow:.*?;', '', content)
content = re.sub(r'--shadow-glow:.*?;', '--shadow-glow: none;', content)
content = re.sub(r'--glow-cyan:.*?;', '--glow-cyan: none;', content)
content = re.sub(r'text-shadow:.*?;', 'text-shadow: none;', content)
content = re.sub(r'box-shadow:.*rgba\(.*?0\.25\).*?;', 'box-shadow: none;', content) # aggressive glow removal

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("variables.css refactored.")

# Refactor components.css to remove ambient glows and animations
comp_path = 'frontend/css/components.css'
if os.path.exists(comp_path):
    with open(comp_path, 'r', encoding='utf-8') as f:
        comp = f.read()
    
    comp = re.sub(r'\.landing-ambient-glow[\s\S]*?\}', '', comp) # remove class entirely
    
    with open(comp_path, 'w', encoding='utf-8') as f:
        f.write(comp)
        
# Remove emojis and rewrite marketing language in views
def refactor_views():
    views_dir = 'frontend/js/views'
    if not os.path.exists(views_dir): return
    
    for file in os.listdir(views_dir):
        if not file.endswith('.js'): continue
        filepath = os.path.join(views_dir, file)
        
        with open(filepath, 'r', encoding='utf-8') as f:
            view = f.read()
            
        # Clean up text
        view = re.sub(r'🚀|🔥|⚡|🤖|⚠️|❌|✅|🟢|🔴|🟡', '', view)
        view = view.replace('Predict the Engine. <br><span class="highlight-cyan">Before It Fails.</span>', 'Engine Health Monitoring & Diagnostics')
        view = view.replace('An AI-powered Digital Twin for real-time health monitoring and predictive maintenance of aero-piston engines.', 'Real-time telemetry and health monitoring for aerospace engineering applications.')
        view = view.replace('AI Confidence: 98.7%', 'Confidence Score: 98.7%')
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(view)

refactor_views()
print("Views refactored.")
