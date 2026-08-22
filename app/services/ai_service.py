def generate_task_from_prompt(prompt: str):
    return {
        "title": prompt,
        "description": "Task generated from AI prompt",
        "priority": "medium",
        "due_date": None
    }