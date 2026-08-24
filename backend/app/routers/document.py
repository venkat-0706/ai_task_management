from pathlib import Path
from uuid import uuid4
import shutil

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException,
    Depends
)

from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.activity_log import ActivityLog
from app.models.document import Document

from app.schemas.document import DocumentSearchRequest

from app.services.document_service import (
    extract_text,
    chunk_text
)

from app.services.vector_service import (
    create_embeddings,
    search_similar
)

from app.core.dependencies import get_current_user


router = APIRouter(
    prefix="/documents",
    tags=["Documents"]
)


# Upload directory
UPLOAD_DIR = Path("uploads/documents")

UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True
)


# ==========================================
# GET ALL DOCUMENTS
# ==========================================

@router.get("/")
def get_documents(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    documents = (
        db.query(Document)
        .order_by(Document.created_at.desc())
        .all()
    )

    return {
        "documents": [
            {
                "id": document.id,
                "filename": document.filename,
                "original_filename": document.original_filename,
                "file_path": document.file_path,
                "file_size": document.file_size,
                "uploaded_by": document.uploaded_by,
                "created_at": (
                    document.created_at.isoformat()
                    if document.created_at
                    else None
                )
            }
            for document in documents
        ]
    }


# ==========================================
# UPLOAD DOCUMENT
# ==========================================

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

    extension = Path(
        file.filename
    ).suffix.lower()

    # Only allow PDF and TXT
    if extension not in [".pdf", ".txt"]:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and TXT files are supported"
        )

    # Generate unique filename
    unique_filename = (
        f"{uuid4().hex}{extension}"
    )

    file_path = (
        UPLOAD_DIR /
        unique_filename
    )

    try:

        # Save file
        with open(
            file_path,
            "wb"
        ) as buffer:

            shutil.copyfileobj(
                file.file,
                buffer
            )

        # Extract text
        text = extract_text(
            str(file_path)
        )

        # Validate extracted text
        if not text.strip():

            file_path.unlink(
                missing_ok=True
            )

            raise HTTPException(
                status_code=400,
                detail=(
                    "Unable to extract text "
                    "from this document"
                )
            )

        # Split document into chunks
        chunks = chunk_text(text)

        if not chunks:

            file_path.unlink(
                missing_ok=True
            )

            raise HTTPException(
                status_code=400,
                detail=(
                    "No searchable content found "
                    "in document"
                )
            )

        # Metadata for vector database
        metadata = [
            {
                "filename": file.filename
            }
            for _ in chunks
        ]

        # Create embeddings
        create_embeddings(
            chunks,
            metadata
        )

        # Save document details in MySQL
        document = Document(
            filename=unique_filename,
            original_filename=file.filename,
            file_path=str(file_path),
            file_size=file_path.stat().st_size,
            uploaded_by=current_user.id
        )

        db.add(document)

        # Activity log
        activity = ActivityLog(
            user_id=current_user.id,
            action="DOCUMENT_UPLOAD",
            details=(
                f"Uploaded document: "
                f"{file.filename}"
            )
        )

        db.add(activity)

        db.commit()

        db.refresh(document)

        return {
            "message": (
                "Document uploaded and indexed successfully"
            ),
            "document": {
                "id": document.id,
                "filename": (
                    document.original_filename
                ),
                "file_size": (
                    document.file_size
                ),
                "created_at": (
                    document.created_at.isoformat()
                    if document.created_at
                    else None
                )
            },
            "chunks": len(chunks),
            "text_length": len(text)
        }

    except HTTPException:
        raise

    except Exception as error:

        db.rollback()

        # Delete file if something fails
        if file_path.exists():
            file_path.unlink()

        raise HTTPException(
            status_code=500,
            detail=(
                f"Failed to process document: "
                f"{str(error)}"
            )
        )

    finally:
        await file.close()


# ==========================================
# SEARCH DOCUMENTS
# ==========================================

@router.post("/search")
def search_documents(
    request: DocumentSearchRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    query = request.query.strip()

    if not query:
        raise HTTPException(
            status_code=400,
            detail="Search query cannot be empty"
        )

    results = search_similar(
        query=query,
        top_k=request.top_k
    )

    # Activity log
    activity = ActivityLog(
        user_id=current_user.id,
        action="DOCUMENT_SEARCH",
        details=(
            f"Searched documents: {query}"
        )
    )

    db.add(activity)

    db.commit()

    return {
        "query": query,
        "results": results,
        "total_results": len(results)
    }


# ==========================================
# VIEW DOCUMENT
# ==========================================

@router.get("/view/{document_id}")
def view_document(
    document_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    document = (
        db.query(Document)
        .filter(
            Document.id == document_id
        )
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    file_path = Path(
        document.file_path
    )

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Document file not found"
        )

    # Correct media type
    if file_path.suffix.lower() == ".pdf":
        media_type = "application/pdf"
    else:
        media_type = "text/plain"

    return FileResponse(
        path=str(file_path),
        filename=document.original_filename,
        media_type=media_type
    )


# ==========================================
# DOWNLOAD DOCUMENT
# ==========================================

@router.get("/download/{document_id}")
def download_document(
    document_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    document = (
        db.query(Document)
        .filter(
            Document.id == document_id
        )
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    file_path = Path(
        document.file_path
    )

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Document file not found"
        )

    return FileResponse(
        path=str(file_path),
        filename=document.original_filename,
        media_type="application/octet-stream",
        headers={
            "Content-Disposition": (
                f'attachment; '
                f'filename="{document.original_filename}"'
            )
        }
    )