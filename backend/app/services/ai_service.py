import re
from datetime import datetime, timedelta

from app.services.vector_service import search_similar


def extract_priority(prompt: str) -> str:
    text = prompt.lower()

    if re.search(r"\b(high|urgent|critical|important)\s+priority\b", text):
        return "high"

    if re.search(r"\b(low|minor)\s+priority\b", text):
        return "low"

    if re.search(r"\b(medium|normal)\s+priority\b", text):
        return "medium"

    if any(word in text for word in ["urgent", "critical", "asap"]):
        return "high"

    return "medium"


def extract_due_date(prompt: str):
    text = prompt.lower()

    today = datetime.now().date()

    if "tomorrow" in text:
        return str(today + timedelta(days=1))

    if "today" in text:
        return str(today)

    if "next week" in text:
        return str(today + timedelta(days=7))

    months = {
        "january": 1,
        "february": 2,
        "march": 3,
        "april": 4,
        "may": 5,
        "june": 6,
        "july": 7,
        "august": 8,
        "september": 9,
        "october": 10,
        "november": 11,
        "december": 12,
    }

    month_pattern = (
        r"\b(?:by|on|before)?\s*"
        r"(\d{1,2})(?:st|nd|rd|th)?\s+"
        r"(january|february|march|april|may|june|july|august|"
        r"september|october|november|december)\b"
    )

    match = re.search(month_pattern, text)

    if match:
        day = int(match.group(1))
        month_name = match.group(2)
        month = months[month_name]

        year = today.year

        try:
            result = datetime(year, month, day).date()

            if result < today:
                result = datetime(year + 1, month, day).date()

            return str(result)

        except ValueError:
            return None

    date_pattern = r"\b(\d{1,2})[/-](\d{1,2})(?:[/-](\d{4}))?\b"

    match = re.search(date_pattern, text)

    if match:
        day = int(match.group(1))
        month = int(match.group(2))

        year = (
            int(match.group(3))
            if match.group(3)
            else today.year
        )

        try:
            result = datetime(year, month, day).date()

            if not match.group(3) and result < today:
                result = datetime(year + 1, month, day).date()

            return str(result)

        except ValueError:
            return None

    return None


def clean_title(prompt: str) -> str:
    title = prompt.strip()

    patterns = [
        r"^create\s+(?:a\s+)?(?:high|medium|low)\s+priority\s+task\s+(?:to\s+)?",
        r"^create\s+(?:a\s+)?task\s+(?:to\s+)?",
        r"^create\s+(?:a\s+)?task\s+",
        r"^create\s+",
        r"^add\s+(?:a\s+)?task\s+(?:to\s+)?",
        r"^make\s+(?:a\s+)?task\s+(?:to\s+)?",
        r"^generate\s+(?:a\s+)?task\s+(?:to\s+)?",
    ]

    for pattern in patterns:
        title = re.sub(
            pattern,
            "",
            title,
            flags=re.IGNORECASE
        )

    title = re.sub(
        r"\b(?:by|before|on)\s+"
        r"\d{1,2}(?:st|nd|rd|th)?\s+"
        r"(?:january|february|march|april|may|june|july|"
        r"august|september|october|november|december)\b",
        "",
        title,
        flags=re.IGNORECASE
    )

    title = re.sub(
        r"\b(?:by|before|on)\s+"
        r"\d{1,2}[/-]\d{1,2}(?:[/-]\d{4})?\b",
        "",
        title,
        flags=re.IGNORECASE
    )

    title = re.sub(
        r"\b(?:high|medium|low)\s+priority\b",
        "",
        title,
        flags=re.IGNORECASE
    )

    title = re.sub(
        r"\s+",
        " ",
        title
    ).strip()

    if not title:
        title = "New Task"

    return title[0].upper() + title[1:]


def generate_task_from_prompt(prompt: str):
    results = search_similar(prompt, 3)

    context = ""

    if results:
        context = (
            results[0].get("content")
            or results[0].get("text")
            or ""
        )

    priority = extract_priority(prompt)

    due_date = extract_due_date(prompt)

    title = clean_title(prompt)

    if context:
        description = (
            f"Task generated from the AI prompt. "
            f"Relevant document context: {context}"
        )
    else:
        description = (
            f"Complete the following task: {title}."
        )

    return {
        "title": title,
        "description": description,
        "priority": priority,
        "due_date": due_date
    }