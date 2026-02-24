import os
import re

def clean_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    new_lines = []
    skip = False
    for line in lines:
        # Match common footers like ## 联系信息, ## 报告和联系, ## 联系方式, ## 报告人, ## 发现/者
        if re.match(r'^#+\s+(联系信息|报告和联系|联系方式|报告人|发现者|发现与报告|联系|REPORT & CONTACT)', line.strip(), re.IGNORECASE):
            skip = True
        
        if not skip:
            new_lines.append(line)
        
        # Some files might have content after the footer if I'm not careful,
        # but usually it's at the end. In this project, it seems it's always at the end.
    
    if skip:
        # Clean trailing empty lines
        while new_lines and not new_lines[-1].strip():
            new_lines.pop()
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        return True
    return False

root_dir = 'docs'
exclude_dirs = {'scripts', '.git'}

count = 0
for root, dirs, files in os.walk(root_dir):
    dirs[:] = [d for d in dirs if d not in exclude_dirs]
    for file in files:
        if file.endswith('.md') and file != 'README.md':
            if clean_file(os.path.join(root, file)):
                count += 1

print(f"Cleaned {count} files.")
