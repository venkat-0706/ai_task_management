from pydantic import BaseModel


class AITaskRequest(BaseModel):
    prompt: str


class AITaskResponse(BaseModel):
    title: str
    description: str | None = None
    priority: str
    due_date: str | None = None