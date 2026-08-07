from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(
    prefix="/assistant",
    tags=["Assistant"],
)


class ChatRequest(BaseModel):
    question: str


@router.post("/chat")
def chat(request: ChatRequest):

    question = request.question.lower()

    if "missing" in question:
        answer = "Your dataset contains missing values. Check the Data Quality section."

    elif "duplicate" in question:
        answer = "Duplicate row information is available in the Data Quality report."

    elif "model" in question:
        answer = "The best AutoML model is shown in the AutoML Results section."

    elif "prediction" in question:
        answer = "Prediction results can be viewed in Prediction Studio."

    elif "summary" in question:
        answer = "Dataset summary is available in AI Insights."

    else:
        answer = (
            "I can answer questions about your dataset, "
            "AutoML, predictions and AI reports."
        )

    return {
        "answer": answer
    }