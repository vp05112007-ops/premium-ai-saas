import os
import re

LINK_MAP = {
    'index.html': '/templates/index.html',
    '../index.html': '/templates/index.html',
    '../../index.html': '/templates/index.html',
    
    'auth/login.html': '/templates/auth/login.html',
    '../auth/login.html': '/templates/auth/login.html',
    '../../auth/login.html': '/templates/auth/login.html',
    
    'auth/register.html': '/templates/auth/register.html',
    '../auth/register.html': '/templates/auth/register.html',
    '../../auth/register.html': '/templates/auth/register.html',

    'dashboard/index.html': '/templates/dashboard/index.html',
    '../dashboard/index.html': '/templates/dashboard/index.html',
    
    'chat.html': '/templates/dashboard/chat.html',
    'dashboard/chat.html': '/templates/dashboard/chat.html',
    '../dashboard/chat.html': '/templates/dashboard/chat.html',

    'image-generator.html': '/templates/dashboard/image.html',
    'image.html': '/templates/dashboard/image.html',
    
    'resume-builder.html': '/templates/dashboard/resume.html',
    'resume.html': '/templates/dashboard/resume.html',
    
    'code-assistant.html': '/templates/dashboard/code.html',
    'code.html': '/templates/dashboard/code.html',

    'history.html': '/templates/dashboard/history.html',
    
    'profile.html': '/templates/profile.html',
    '../profile.html': '/templates/profile.html',
    '../../profile.html': '/templates/profile.html',
    
    'settings.html': '/templates/settings.html',
    '../settings.html': '/templates/settings.html',
    '../../settings.html': '/templates/settings.html',
    
    'pricing.html': '/templates/public/pricing.html',
    'public/pricing.html': '/templates/public/pricing.html',
    '../public/pricing.html': '/templates/public/pricing.html',
    '../../public/pricing.html': '/templates/public/pricing.html'
}

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Find all href="..."
    def replacer(match):
        href = match.group(1)
        # ignore fragment hashes
        if href.startswith('#') or href.startswith('http') or href == '':
            return match.group(0)
            
        # extract base path and hash
        parts = href.split('#', 1)
        base = parts[0]
        hash_part = '#' + parts[1] if len(parts) > 1 else ''

        # replace base if it's in our map
        if base in LINK_MAP:
            new_href = LINK_MAP[base] + hash_part
            return f'href="{new_href}"'
            
        return match.group(0)

    new_content = re.sub(r'href="([^"]+)"', replacer, content)
    
    # Also fix the dashboard/index.html link that the previous script accidentally mapped to /templates/index.html because it matched "index.html"
    if 'dashboard' in filepath:
        new_content = new_content.replace('href="/templates/index.html" class="nav-item', 'href="/templates/dashboard/index.html" class="nav-item')

    with open(filepath, 'w') as f:
        f.write(new_content)

for root, dirs, files in os.walk('templates'):
    for file in files:
        if file.endswith('.html'):
            fix_file(os.path.join(root, file))

print("Pass 2 complete.")
