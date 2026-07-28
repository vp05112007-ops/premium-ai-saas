import os
import re

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Public Navbar replacements
    content = re.sub(r'href="[^"]*auth/login\.html"', 'href="/templates/auth/login.html"', content)
    content = re.sub(r'href="[^"]*auth/register\.html"', 'href="/templates/auth/register.html"', content)
    content = re.sub(r'href="[^"]*public/pricing\.html"', 'href="/templates/public/pricing.html"', content)
    content = re.sub(r'href="[^"]*pricing\.html"', 'href="/templates/public/pricing.html"', content)

    # Dashboard Navbar replacements
    # Be careful not to replace active states if they are currently just filename.html
    # Let's standardize to /templates/...
    content = re.sub(r'href="[^"]*dashboard/index\.html"', 'href="/templates/dashboard/index.html"', content)
    content = re.sub(r'href="[^"]*dashboard/chat\.html"', 'href="/templates/dashboard/chat.html"', content)
    content = re.sub(r'href="[^"]*dashboard/image\.html"', 'href="/templates/dashboard/image.html"', content)
    content = re.sub(r'href="[^"]*dashboard/resume\.html"', 'href="/templates/dashboard/resume.html"', content)
    content = re.sub(r'href="[^"]*dashboard/code\.html"', 'href="/templates/dashboard/code.html"', content)
    content = re.sub(r'href="[^"]*dashboard/history\.html"', 'href="/templates/dashboard/history.html"', content)
    content = re.sub(r'href="[^"]*profile\.html"', 'href="/templates/profile.html"', content)
    content = re.sub(r'href="[^"]*settings\.html"', 'href="/templates/settings.html"', content)
    
    # Fix Landing Page link (Logo)
    content = re.sub(r'href="[^"]*index\.html"(?!.*dashboard)', 'href="/templates/index.html"', content)

    # For edge case pricing.html link in public
    content = content.replace('href="/templates//templates/public/pricing.html"', 'href="/templates/public/pricing.html"')
    
    with open(filepath, 'w') as f:
        f.write(content)

for root, dirs, files in os.walk('templates'):
    for file in files:
        if file.endswith('.html'):
            process_file(os.path.join(root, file))

print("Links updated.")
