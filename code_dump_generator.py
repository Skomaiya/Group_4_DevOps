#!/usr/bin/env python3
"""
Project Code Dump Generator

Generates a clean, well-labeled dump file of all source code in a project.
"""

from pathlib import Path
from datetime import datetime
from typing import Set


CODE_EXTENSIONS: Set[str] = {
    '.py', '.js', '.jsx', '.ts', '.tsx', '.yml', '.yaml', '.json',
    '.tf', '.md', '.txt', '.sh', '.cfg', '.ini', '.toml',
    '.html', '.css', '.sql', '.env', '.example', '.j2'
}

SKIP_DIRS: Set[str] = {
    'node_modules', '__pycache__', '.git', 'venv', 'env',
    '.pytest_cache', '.vscode', 'dist', 'build', '.next',
    'coverage', '.terraform', 'migrations'
}

SKIP_FILES: Set[str] = {
    'package-lock.json', 'yarn.lock', '.DS_Store',
    'Thumbs.db', '.gitkeep'
}


def should_process_file(file_path: Path) -> bool:
    """
    Determine whether a file should be included in the dump.

    Args:
        file_path: Path object to evaluate.

    Returns:
        True if file should be included, False otherwise.
    """
    if file_path.name in SKIP_FILES:
        return False

    if any(skip in file_path.parts for skip in SKIP_DIRS):
        return False

    if file_path.suffix in CODE_EXTENSIONS:
        return True

    return file_path.suffix == '' and file_path.is_file()


def generate_separator(title: str, width: int = 80) -> str:
    """
    Generate a visual separator containing a centered title.

    Args:
        title: The text to embed inside the separator.
        width: Total width of the separator line.

    Returns:
        A formatted separator string.
    """
    if len(title) + 4 > width:
        return f"{'=' * width}\n{title}\n{'=' * width}"

    side_len = (width - len(title) - 2) // 2
    return f"{'=' * side_len} {title} {'=' * side_len}"


def get_file_info(file_path: Path, root_dir: Path) -> str:
    """
    Produce formatted metadata about a file.

    Args:
        file_path: The file to inspect.
        root_dir: Root project directory.

    Returns:
        A string containing file metadata for the dump.
    """
    relative = file_path.relative_to(root_dir)
    size = file_path.stat().st_size
    modified = datetime.fromtimestamp(file_path.stat().st_mtime)
    modified_str = modified.strftime('%Y-%m-%d %H:%M:%S')

    info_lines = [
        generate_separator(str(relative)),
        f"Full Path: {file_path}",
        f"Size: {size} bytes",
        f"Modified: {modified_str}",
        f"Extension: {file_path.suffix or 'None'}",
        "-" * 80
    ]
    return "\n".join(info_lines)


def read_file_content(file_path: Path) -> str:
    """
    Read file content safely, using multiple fallbacks for encoding errors.

    Args:
        file_path: File to read.

    Returns:
        File content as string. If unreadable, returns an error message.
    """
    try:
        return file_path.read_text(encoding='utf-8')
    except UnicodeDecodeError:
        try:
            return file_path.read_text(encoding='latin-1')
        except Exception as err:
            return f"[Error reading file as latin-1: {err}]"
    except Exception as err:
        return f"[Error reading file: {err}]"


def generate_dump(root_dir: str, output_file: str = "project_dump.txt") -> None:
    """
    Generate a complete dump of all project files into a single text file.

    Args:
        root_dir: Directory to scan recursively.
        output_file: Output dump filename.
    """
    root_path = Path(root_dir).resolve()

    if not root_path.exists():
        print(f"Error: Directory '{root_dir}' does not exist.")
        return

    files = sorted(
        f for f in root_path.rglob('*')
        if f.is_file() and should_process_file(f)
    )

    output_path = Path(output_file)

    with output_path.open('w', encoding='utf-8') as dump:
        header = [
            generate_separator("PROJECT CODE DUMP", 100),
            f"Project: {root_path.name}",
            f"Root Directory: {root_path}",
            f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            f"Total Files: {len(files)}",
            generate_separator("", 100),
            "\n\n"
        ]
        dump.write("\n".join(header))

        # Table of contents
        dump.write(generate_separator("TABLE OF CONTENTS", 100) + "\n\n")
        for idx, file_path in enumerate(files, start=1):
            rel_path = file_path.relative_to(root_path)
            dump.write(f"{idx:4d}. {rel_path}\n")
        dump.write("\n\n\n")

        # File contents
        dump.write(generate_separator("FILE CONTENTS", 100) + "\n\n")

        for idx, file_path in enumerate(files, start=1):
            print(f"Processing ({idx}/{len(files)}): "
                  f"{file_path.relative_to(root_path)}")

            dump.write("\n\n")
            dump.write(get_file_info(file_path, root_path))
            dump.write("\n\n")

            content = read_file_content(file_path)
            dump.write(content)
            dump.write("\n\n" + "=" * 80 + "\n")

        # Summary footer
        summary = [
            "\n\n\n",
            generate_separator("DUMP COMPLETE", 100),
            f"Total Files Processed: {len(files)}",
            f"Output File: {output_path.resolve()}",
            f"Completed: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            generate_separator("", 100)
        ]
        dump.write("\n".join(summary))

    print("\n✓ Dump generated successfully!")
    print(f"  Output: {output_path.resolve()}")
    print(f"  Files processed: {len(files)}")
    print(f"  Size: {output_path.stat().st_size / 1024:.2f} KB")


if __name__ == "__main__":
    import sys

    root_dir_arg = sys.argv[1] if len(sys.argv) > 1 else "."
    output_arg = sys.argv[2] if len(sys.argv) > 2 else "project_dump.txt"

    print(f"Generating code dump for: {Path(root_dir_arg).resolve()}")
    print(f"Output file: {output_arg}")
    print("-" * 80)

    generate_dump(root_dir_arg, output_arg)
