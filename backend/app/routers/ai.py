from fastapi import APIRouter, Depends

from app.schemas.ai import AITaskRequest, AITaskResponse
from app.services.ai_service import generate_task_from_prompt
from app.core.dependencies import get_current_user


router = APIRouter(
    prefix="/ai",
    tags=["AI"]
)


@router.post(
    "/generate-task",
    response_model=AITaskResponse
)
def generate_task(
    task_data: AITaskRequest,
    current_user=Depends(get_current_user)
):
    result = generate_task_from_prompt(task_data.prompt)

    return result