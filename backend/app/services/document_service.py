from pathlib import Path
from pypdf import PdfReader


def extract_text(file_path: str) -> str:
    extension = Path(file_path).suffix.lower()

    if extension == ".pdf":
        reader = PdfReader(file_path)

        text = ""

        for page in reader.pages:
            page_text = page.extract_text() or ""
            text += page_text + "\n"

        return text.strip()

    if extension == ".txt":
        with open(
            file_path,
            "r",
            encoding="utf-8"
        ) as file:
            return file.read().strip()

    raise ValueError(
        "Only PDF and TXT files are supported"
    )


def chunk_text(
    text: str,
    chunk_size: int = 300
) -> list[str]:

    if not text:
        return []

    words = text.split()

    chunks = []

    for i in range(
        0,
        len(words),
        chunk_size
    ):
        chunk = " ".join(
            words[i:i + chunk_size]
        )

        if chunk.strip():
            chunks.append(chunk)

    return chunks