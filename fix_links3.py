import os

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Fix the mapping errors from pass 2
    content = content.replace('href="/templates/dashboard/image.html"', 'href="/templates/dashboard/image-generator.html"')
    content = content.replace('href="/templates/dashboard/resume.html"', 'href="/templates/dashboard/resume-builder.html"')
    content = content.replace('href="/templates/dashboard/code.html"', 'href="/templates/dashboard/code-assistant.html"')

    with open(filepath, 'w') as f:
        f.write(content)

for root, dirs, files in os.walk('templates'):
    for file in files:
        if file.endswith('.html'):
            fix_file(os.path.join(root, file))

print("Pass 3 complete.")

