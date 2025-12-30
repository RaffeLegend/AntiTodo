from fastapi import APIRouter
from app.schemas.quiz import QuizResponse, EvaluateRequest, EvaluateResponse
from app.services.rules_engine import load_all, evaluate

router = APIRouter()

@router.get("/quiz", response_model=QuizResponse)
def get_quiz():
    data = load_all().questions
    return data

@router.post("/evaluate", response_model=EvaluateResponse)
def post_evaluate(req: EvaluateRequest):
    result = evaluate([a.model_dump() for a in req.answers])
    return result