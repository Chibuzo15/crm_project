import os
import sys

# Ensure output is in UTF-8
sys.stdout.reconfigure(encoding='utf-8')

def print_tree(startpath, exclude_dirs=None, prefix=""):
    if exclude_dirs is None:
        exclude_dirs = ["node_modules"]

    items = sorted(os.listdir(startpath))
    items = [item for item in items if item not in exclude_dirs]

    for i, item in enumerate(items):
        path = os.path.join(startpath, item)
        connector = "└── " if i == len(items) - 1 else "├── "
        print(prefix + connector + item)

        if os.path.isdir(path):
            extension = "    " if i == len(items) - 1 else "│   "
            print_tree(path, exclude_dirs, prefix + extension)

# Run the function from the current directory
print_tree(".")
