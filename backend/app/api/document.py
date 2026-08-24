from pathlib import Path

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

from app.services.document_service import (
    extract_text,
    chunk_text
)

from app.services.vector_service import (
    create_embeddings,
    search_similar
)

from app.schemas.document import (
    DocumentSearchRequest
)

from app.core.dependencies import (
    get_current_user
)


router = APIRouter(
    prefix="/documents",
    tags=["Documents"]
)


UPLOAD_DIR = Path("uploads")

UPLOAD_DIR.mkdir(
    exist_ok=True
)


@router.get("/")
def get_documents(
    current_user=Depends(
        get_current_user
    )
):

    documents = []

    for file_path in UPLOAD_DIR.iterdir():

        if file_path.is_file():

            documents.append({
                "filename": file_path.name,

                "size": file_path.stat().st_size,

                "extension": file_path.suffix.lower()
            })

    return documents


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),

    current_user=Depends(
        get_current_user
    ),

    db: Session = Depends(
        get_db
    )
):

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="File name is required"
        )

    filename = Path(
        file.filename
    ).name

    extension = Path(
        filename
    ).suffix.lower()

    if extension not in [
        ".pdf",
        ".txt"
    ]:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and TXT files are supported"
        )

    file_path = UPLOAD_DIR / filename

    contents = await file.read()

    with open(
        file_path,
        "wb"
    ) as output:

        output.write(
            contents
        )

    try:

        text = extract_text(
            str(file_path)
        )

        if not text.strip():
            raise HTTPException(
                status_code=400,
                detail="Unable to extract text from this document"
            )

        chunks = chunk_text(
            text
        )

        if not chunks:
            raise HTTPException(
                status_code=400,
                detail="No searchable content found in document"
            )

        create_embeddings(
            chunks=chunks,
            filename=filename
        )

        activity = ActivityLog(
            user_id=current_user.id,

            action="DOCUMENT_UPLOAD",

            details=f"Uploaded document: {filename}"
        )

        db.add(
            activity
        )

        db.commit()

        return {
            "message": "Document uploaded successfully",

            "filename": filename,

            "chunks": len(chunks),

            "text_length": len(text)
        }

    except HTTPException:
        raise

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to process document: {str(error)}"
        )


@router.get("/view/{filename}")
def view_document(
    filename: str,

    current_user=Depends(
        get_current_user
    )
):

    safe_filename = Path(
        filename
    ).name

    file_path = (
        UPLOAD_DIR /
        safe_filename
    )

    if not file_path.exists():

        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    if file_path.suffix.lower() == ".pdf":

        media_type = (
            "application/pdf"
        )

    else:

        media_type = (
            "text/plain"
        )

    return FileResponse(
        path=str(file_path),

        media_type=media_type,

        filename=safe_filename,

        content_disposition_type="inline"
    )


@router.get("/download/{filename}")
def download_document(
    filename: str,

    current_user=Depends(
        get_current_user
    )
):

    safe_filename = Path(
        filename
    ).name

    file_path = (
        UPLOAD_DIR /
        safe_filename
    )

    if not file_path.exists():

        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    return FileResponse(
        path=str(file_path),

        media_type="application/octet-stream",

        filename=safe_filename
    )


@router.post("/search")
def search_documents(
    request: DocumentSearchRequest,

    current_user=Depends(
        get_current_user
    ),

    db: Session = Depends(
        get_db
    )
):

    results = search_similar(
        query=request.query,

        top_k=request.top_k
    )

    activity = ActivityLog(
        user_id=current_user.id,

        action="DOCUMENT_SEARCH",

        details=f"Searched documents: {request.query}"
    )

    db.add(
        activity
    )

    db.commit()

    return {
        "query": request.query,

        "results": results
    }