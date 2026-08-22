from pathlib import Path
from pypdf import PdfReader


def extract_text(file_path: str) -> str:
    extension = Path(file_path).suffix.lower()

    if extension == ".pdf":
        reader = PdfReader(file_path)

        text = ""

        for page in reader.pages:
            text += page.extract_text() or ""

        return text

    if extension == ".txt":
        with open(file_path, "r", encoding="utf-8") as file:
            return file.read()

    raise ValueError("Only PDF and TXT files are supported")


def chunk_text(text: str, chunk_size: int = 500) -> list[str]:
    words = text.split()

    return [
        " ".join(words[i:i + chunk_size])
        for i in range(0, len(words), chunk_size)
    ]