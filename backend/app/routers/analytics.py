from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.task import Task
from app.models.activity_log import ActivityLog
from app.core.dependencies import get_current_user


router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get("/")
def get_analytics(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    total_tasks = db.query(Task).filter(
        (Task.created_by == current_user.id) |
        (Task.assigned_to == current_user.id)
    ).count()

    completed_tasks = db.query(Task).filter(
        (Task.created_by == current_user.id) |
        (Task.assigned_to == current_user.id),
        Task.status == "completed"
    ).count()

    in_progress_tasks = db.query(Task).filter(
        (Task.created_by == current_user.id) |
        (Task.assigned_to == current_user.id),
        Task.status == "in_progress"
    ).count()

    pending_tasks = db.query(Task).filter(
        (Task.created_by == current_user.id) |
        (Task.assigned_to == current_user.id),
        Task.status == "pending"
    ).count()

    search_counts = (
        db.query(
            ActivityLog.details,
            func.count(ActivityLog.id).label("count")
        )
        .filter(
            ActivityLog.user_id == current_user.id,
            ActivityLog.action == "DOCUMENT_SEARCH"
        )
        .group_by(ActivityLog.details)
        .order_by(func.count(ActivityLog.id).desc())
        .limit(5)
        .all()
    )

    most_searched_queries = []

    for details, count in search_counts:
        query = details.replace("Searched documents: ", "")

        most_searched_queries.append({
            "query": query,
            "count": count
        })

    return {
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "in_progress_tasks": in_progress_tasks,
        "pending_tasks": pending_tasks,
        "most_searched_queries": most_searched_queries
    }