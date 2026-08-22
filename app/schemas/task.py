from datetime import datetime
from typing import Optional, Literal

from pydantic import BaseModel


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    priority: Literal["low", "medium", "high"] = "medium"
    due_date: Optional[datetime] = None
    assigned_to: Optional[int] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[Literal["pending", "in_progress", "completed"]] = None
    priority: Optional[Literal["low", "medium", "high"]] = None
    due_date: Optional[datetime] = None
    assigned_to: Optional[int] = None


class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: str
    priority: str
    due_date: Optional[datetime]
    assigned_to: Optional[int]
    created_by: int

    class Config:
        from_attributes = True