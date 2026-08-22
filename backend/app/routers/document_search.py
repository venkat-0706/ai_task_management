from fastapi import APIRouter
from app.schemas.document import DocumentSearchRequest
from app.services.vector_service import search_similar


router = APIRouter(prefix="/documents", tags=["Documents"])


@router.post("/search")
def search_documents(request: DocumentSearchRequest):
    results = search_similar(
        request.query,
        request.top_k
    )

    return {
        "query": request.query,
        "results": results
    }