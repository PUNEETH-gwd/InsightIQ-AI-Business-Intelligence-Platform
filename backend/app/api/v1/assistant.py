from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.services.assistant_service import AssistantService
from app.database import get_db

router = APIRouter(
    prefix="/assistant",
    tags=["Assistant"],
)


class ChatRequest(BaseModel):
    question: str
    dataset_id: str

    
@router.post("/chat")
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
):
    assistant_service = AssistantService(db)

    answer = assistant_service.chat(
        request.question,
        request.dataset_id,
    )

    return answer