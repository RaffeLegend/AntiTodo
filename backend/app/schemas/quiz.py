from pydantic import BaseModel, Field
from typing import List, Dict, Any, Literal, Optional

DayType = Literal["work", "social", "recovery"]

class Option(BaseModel):
    id: str
    text: str
    score: Dict[str, int] = Field(default_factory=dict)

class Question(BaseModel):
    id: str
    title: str
    type: Literal["single"] = "single"
    options: List[Option]

class QuizResponse(BaseModel):
    questions: List[Question]
    version: str

class SubmitAnswer(BaseModel):
    question_id: str
    option_id: str

class EvaluateRequest(BaseModel):
    answers: List[SubmitAnswer]

class EvaluateResponse(BaseModel):
    day_type: DayType
    scores: Dict[str, int]
    do: List[str]
    dont: List[str]
    notes: List[str] = []
    debug: Optional[Dict[str, Any]] = None