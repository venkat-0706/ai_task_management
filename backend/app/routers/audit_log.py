from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.activity_log import ActivityLog
from app.core.dependencies import get_current_admin


router = APIRouter(
    prefix="/audit-logs",
    tags=["Audit Logs"]
)


@router.get("/")
def get_audit_logs(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_admin)
):
    logs = (
        db.query(ActivityLog)
        .order_by(ActivityLog.created_at.desc())
        .all()
    )

    return [
        {
            "id": log.id,
            "user_id": log.user_id,
            "action": log.action,
            "details": log.details,
            "created_at": log.created_at
        }
        for log in logs
    ]