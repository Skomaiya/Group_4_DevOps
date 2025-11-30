#!/usr/bin/env python3
"""
Project Code Dump Generator
Generates a clean, well-labeled dump file of all source code in the project.
"""

from pathlib import Path
from datetime import datetime
import sys

# File extensions to include
CODE_EXTENSIONS = {
    ".py",
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".yml",
    ".yaml",
    ".json",
    ".tf",
    ".md",
    ".txt",
    ".sh",
    ".cfg",
    ".ini",
    ".toml",
    ".html",
    ".css",
    ".sql",
    ".env",
    ".example",
    ".j2",
}

# Directories to skip
SKIP_DIRS = {
    "node_modules",
    "__pycache__",
    ".git",
    "venv",
    "env",
    ".pytest_cache",
    ".vscode",
    "dist",
    "build",
    ".next",
    "coverage",
    ".terraform",
    "migrations",
}

# Files to skip
SKIP_FILES = {"package-lock.json", "yarn.lock", ".DS_Store", "Thumbs.db", ".gitkeep"}


def should_process_file(file_path: Path) -> bool:
    """Determine if a file should be included in the dump."""
    if file_path.name in SKIP_FILES:
        return False

    if any(skip_dir in file_path.parts for skip_dir in SKIP_DIRS):
        return False

    return (file_path.suffix in CODE_EXTENSIONS or (file_path.suffix == "" and file_path.is_file()))


def generate_separator(title: str, width: int = 80) -> str:
    """Generate a visual separator with title."""
    if len(title) + 4 > width:
        return f"{'=' * width}\n{title}\n{'=' * width}"

    side_len = (width - len(title) - 2) // 2
    return f"{'=' * side_len} {title} {'=' * side_len}"


def get_file_info(file_path: Path, root_dir: Path) -> str:
    """Generate file information header."""
    relative_path = file_path.relative_to(root_dir)
    size = file_path.stat().st_size
    modified = datetime.fromtimestamp(file_path.stat().st_mtime)

    info = [
        generate_separator(str(relative_path)),
        f"Full Path: {file_path}",
        f"Size: {size} bytes",
        f"Modified: {modified.strftime('%Y-%m-%d %H:%M:%S')}",
        f"Extension: {file_path.suffix or 'None'}",
        "-" * 80,
    ]
    return "\n".join(info)


def read_file_content(file_path: Path) -> str:
    """Read file content with fallback for binary files."""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()
    except UnicodeDecodeError:
        try:
            with open(file_path, "r", encoding="latin-1") as f:
                return f.read()
        except Exception as e:
            return f"[Error reading file: {e}]"
    except Exception as e:
        return f"[Error reading file: {e}]"


def generate_dump(root_dir: str, output_file: str = "project_dump.txt"):
    """Generate the complete project dump."""
    root_path = Path(root_dir).resolve()

    if not root_path.exists():
        print(f"Error: Directory '{root_dir}' does not exist!")
        return

    # Collect all files
    all_files = [
        file_path
        for file_path in root_path.rglob("*")
        if file_path.is_file() and should_process_file(file_path)
    ]

    all_files.sort()

    output_path = Path(output_file)
    with open(output_path, "w", encoding="utf-8") as dump:
        # Write header
        header = [
            generate_separator("PROJECT CODE DUMP", 100),
            f"Project: {root_path.name}",
            f"Root Directory: {root_path}",
            f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            f"Total Files: {len(all_files)}",
            generate_separator("", 100),
            "\n" * 2,
        ]
        dump.write("\n".join(header))

        # Table of contents
        dump.write(generate_separator("TABLE OF CONTENTS", 100) + "\n\n")
        for idx, file_path in enumerate(all_files, 1):
            relative_path = file_path.relative_to(root_path)
            dump.write(f"{idx:4d}. {relative_path}\n")
        dump.write("\n" * 3)

        # File contents
        dump.write(generate_separator("FILE CONTENTS", 100) + "\n\n")

        for idx, file_path in enumerate(all_files, 1):
            rel_path = file_path.relative_to(root_path)
            print(f"Processing ({idx}/{len(all_files)}): {rel_path}")

            dump.write("\n" * 2)
            dump.write(get_file_info(file_path, root_path))
            dump.write("\n\n")

            content = read_file_content(file_path)
            dump.write(content)

            dump.write("\n\n" + "=" * 80 + "\n")

        # Summary footer
        dump.write("\n" * 3)
        summary = [
            generate_separator("DUMP COMPLETE", 100),
            f"Total Files Processed: {len(all_files)}",
            f"Output File: {output_path.resolve()}",
            f"Completed: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            generate_separator("", 100),
        ]
        dump.write("\n".join(summary))

    print(f"Generating code dump for: {Path(root_dir).resolve()}")
    print(f"\n✓ Dump generated successfully!")
    print(f"  Output: {output_path.resolve()}")
    print(f"  Files processed: {len(all_files)}")
    print(f"  Size: {output_path.stat().st_size / 1024:.2f} KB")


if __name__ == "__main__":
    root_dir = sys.argv[1] if len(sys.argv) > 1 else "."
    output_file = sys.argv[2] if len(sys.argv) > 2 else "project_dump.txt"

    print(f"Generating code dump for: {Path(root_dir).resolve()}")
    print(f"Output file: {output_file}")
    print("-" * 80)

    generate_dump(root_dir, output_file)
