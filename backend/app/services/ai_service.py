from app.services.vector_service import search_similar


def generate_task_from_prompt(prompt: str):
    results = search_similar(prompt, 3)

    context = ""

    if results:
        context = results[0]["content"]

    return {
        "title": prompt,
        "description": (
            f"Task generated from the uploaded document context: {context}"
            if context
            else "Task generated from AI prompt"
        ),
        "priority": "medium",
        "due_date": None
    }