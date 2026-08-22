from pydantic import BaseModel


class DocumentSearchRequest(BaseModel):
    query: str
    top_k: int = 3