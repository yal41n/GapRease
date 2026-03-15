from pathlib import Path


def load_file_text(file_path: str) -> str:
    path = Path(file_path)
    suffix = path.suffix.lower()

    if suffix in {".txt", ".md", ".json", ".csv"}:
        return path.read_text(encoding="utf-8", errors="ignore")

    return f"Uploaded file {path.name} parsed in mock mode. Extend loaders.py for {suffix} support."
