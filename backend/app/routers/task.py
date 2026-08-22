from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.task import Task
from app.models.user import User
from app.models.activity_log import ActivityLog
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse
from app.core.dependencies import get_current_user


router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"]
)


def create_activity(
    db: Session,
    user_id: int,
    action: str,
    details: str
):
    activity = ActivityLog(
        user_id=user_id,
        action=action,
        details=details
    )

    db.add(activity)


@router.get(
    "/",
    response_model=list[TaskResponse]
)
def get_tasks(
    status: str | None = None,
    priority: str | None = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    query = db.query(Task).filter(
        or_(
            Task.created_by == current_user.id,
            Task.assigned_to == current_user.id
        )
    )

    if status:
        query = query.filter(
            Task.status == status
        )

    if priority:
        query = query.filter(
            Task.priority == priority
        )

    return (
        query
        .order_by(Task.id.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.post(
    "/",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED
)
def create_task(
    task_data: TaskCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if task_data.assigned_to is not None:

        assigned_user = db.query(User).filter(
            User.id == task_data.assigned_to,
            User.is_active == True
        ).first()

        if assigned_user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Assigned user not found or inactive"
            )

    task = Task(
        title=task_data.title,
        description=task_data.description,
        priority=task_data.priority,
        due_date=task_data.due_date,
        assigned_to=task_data.assigned_to,
        created_by=current_user.id
    )

    db.add(task)
    db.flush()

    create_activity(
        db=db,
        user_id=current_user.id,
        action="TASK_CREATED",
        details=f"Task {task.id} created: {task.title}"
    )

    db.commit()
    db.refresh(task)

    return task


@router.get(
    "/{task_id}",
    response_model=TaskResponse
)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    task = db.query(Task).filter(
        Task.id == task_id,
        or_(
            Task.created_by == current_user.id,
            Task.assigned_to == current_user.id
        )
    ).first()

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return task


@router.put(
    "/{task_id}",
    response_model=TaskResponse
)
@router.patch(
    "/{task_id}",
    response_model=TaskResponse
)
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    task = db.query(Task).filter(
        Task.id == task_id,
        or_(
            Task.created_by == current_user.id,
            Task.assigned_to == current_user.id
        )
    ).first()

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    old_status = task.status

    if task_data.assigned_to is not None:

        assigned_user = db.query(User).filter(
            User.id == task_data.assigned_to,
            User.is_active == True
        ).first()

        if assigned_user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Assigned user not found or inactive"
            )

    if task_data.title is not None:
        task.title = task_data.title

    if task_data.description is not None:
        task.description = task_data.description

    if task_data.status is not None:
        task.status = task_data.status

    if task_data.priority is not None:
        task.priority = task_data.priority

    if task_data.due_date is not None:
        task.due_date = task_data.due_date

    if task_data.assigned_to is not None:
        task.assigned_to = task_data.assigned_to

    if (
        old_status != task.status
        and task.status == "completed"
    ):
        action = "TASK_COMPLETED"

    else:
        action = "TASK_UPDATED"

    create_activity(
        db=db,
        user_id=current_user.id,
        action=action,
        details=(
            f"Task {task.id} updated"
            f" | status: {old_status} -> {task.status}"
        )
    )

    db.commit()
    db.refresh(task)

    return task


@router.delete(
    "/{task_id}"
)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.created_by == current_user.id
    ).first()

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    task_title = task.title

    create_activity(
        db=db,
        user_id=current_user.id,
        action="TASK_DELETED",
        details=f"Task {task.id} deleted: {task_title}"
    )

    db.delete(task)
    db.commit()

    return {
        "message": "Task deleted successfully"
    }