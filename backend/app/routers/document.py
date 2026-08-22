from pathlib import Path

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.activity_log import ActivityLog
from app.services.document_service import extract_text, chunk_text
from app.services.vector_service import create_embeddings, search_similar
from app.schemas.document import DocumentSearchRequest
from app.core.dependencies import get_current_user


router = APIRouter(
    prefix="/documents",
    tags=["Documents"]
)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="File name is required"
        )

    extension = Path(file.filename).suffix.lower()

    if extension not in [".pdf", ".txt"]:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and TXT files are supported"
        )

    file_path = UPLOAD_DIR / file.filename

    contents = await file.read()

    with open(file_path, "wb") as output:
        output.write(contents)

    try:
        text = extract_text(str(file_path))
        chunks = chunk_text(text)

        create_embeddings(chunks)

        activity = ActivityLog(
            user_id=current_user.id,
            action="DOCUMENT_UPLOAD",
            details=f"Uploaded document: {file.filename}"
        )

        db.add(activity)
        db.commit()

        return {
            "message": "Document uploaded successfully",
            "filename": file.filename,
            "chunks": len(chunks),
            "text_length": len(text)
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process document: {str(e)}"
        )


@router.post("/search")
def search_documents(
    request: DocumentSearchRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    results = search_similar(
        request.query,
        request.top_k
    )

    activity = ActivityLog(
        user_id=current_user.id,
        action="DOCUMENT_SEARCH",
        details=f"Searched documents: {request.query}"
    )

    db.add(activity)
    db.commit()

    return {
        "query": request.query,
        "results": results
    }