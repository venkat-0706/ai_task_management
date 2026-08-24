from datetime import datetime
from pydantic import BaseModel


class DocumentSearchRequest(BaseModel):
    query: str
    top_k: int = 10


class DocumentResponse(BaseModel):
    id: int
    filename: str
    original_filename: str
    file_size: int
    uploaded_by: int
    created_at: datetime

    class Config:
        from_attributes = True