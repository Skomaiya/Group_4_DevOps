import os

# Output file name
OUTPUT_FILE = "project_dump.txt"

# Directories or files to skip (you can adjust this)
EXCLUDE_DIRS = {
    "__pycache__", ".git", ".idea", ".vscode", "venv", "env",
}
EXCLUDE_FILES = {OUTPUT_FILE, "generate_dump.py"}

def should_exclude(path):
    parts = path.split(os.sep)
    return any(p in EXCLUDE_DIRS for p in parts) or os.path.basename(path) in EXCLUDE_FILES

def generate_dump(root_dir="."):
    with open(OUTPUT_FILE, "w", encoding="utf-8") as out:
        for root, dirs, files in os.walk(root_dir):
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]  # modify in place
            for file in files:
                if should_exclude(os.path.join(root, file)):
                    continue
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        content = f.read()
                except Exception as e:
                    content = f"⚠️ [Error reading file: {e}]"

                rel_path = os.path.relpath(file_path, root_dir)
                out.write(f"\n{'='*80}\n")
                out.write(f"# FILE: {rel_path}\n")
                out.write(f"{'='*80}\n\n")
                out.write(content)
                out.write("\n\n")

    print(f"✅ Dump file generated: {OUTPUT_FILE}")

if __name__ == "__main__":
    generate_dump(".")
